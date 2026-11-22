import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import ZoomProvider from "next-auth/providers/zoom";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { supabase } from "./supabase";
import { sendWelcomeEmail } from "./resend";


declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      plan?: string | null;
    }
  }
}


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly",
          access_type: "offline",
          prompt: "consent",
        },
      },
      allowDangerousEmailAccountLinking: false,
    }),
    ZoomProvider({
      clientId: process.env.ZOOM_CLIENT_ID || "",
      clientSecret: process.env.ZOOM_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "user:read:user meeting:write:meeting",
        },
      },
      allowDangerousEmailAccountLinking: false,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      allowDangerousEmailAccountLinking: false,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const email = credentials.email.toLowerCase().trim();
        console.log("Authorize attempt for email:", email);

        // Check local database for user with password hash first
        const localUser = await prisma.user.findUnique({
          where: { email },
        });

        if (localUser?.password) {
          const isMatch = await bcrypt.compare(credentials.password, localUser.password);
          if (isMatch) {
            return {
              id: localUser.id,
              email: localUser.email,
              name: localUser.name,
              image: localUser.image,
            };
          }
        }

        try {
          // Fall back to Supabase Auth verification
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password: credentials.password,
          });

          if (authError || !authData.user) {
            const errMsg = authError?.message || "Invalid email or password";
            console.log("Supabase authentication failed:", errMsg);
            
            if (errMsg.toLowerCase().includes("email not confirmed")) {
              throw new Error("Email not confirmed. Please check your inbox for the confirmation link, or go to your Supabase dashboard (Authentication > Providers > Email) and disable 'Confirm email'.");
            }
            throw new Error(errMsg);
          }

          console.log("Supabase authentication successful for user:", authData.user.id);

          // Fetch or create local user record in Prisma
          let user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            console.log("User authenticated via Supabase but missing in local DB. Syncing profile.");
            user = await prisma.user.create({
              data: {
                id: authData.user.id,
                email: authData.user.email,
                name: authData.user.user_metadata?.full_name || email.split("@")[0],
                username: email.split("@")[0] + Math.floor(Math.random() * 1000),
              },
            });
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error: any) {
          console.error("Authorize error:", error.message || error);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      console.log("Session callback - Token:", token?.id);
      if (token && session.user) {
        session.user.id = token.id as string;
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { plan: true }
          });
          session.user.plan = dbUser?.plan || "FREE";
        } catch (e) {
          session.user.plan = "FREE";
        }
      }
      console.log("Session user ID set to:", session.user?.id, "Plan:", session.user?.plan);
      return session;
    },
    jwt: async ({ token, user }) => {
      console.log("JWT callback - User ID:", user?.id);
      if (user) {
        token.id = user.id;
        token.plan = (user as any).plan || "FREE";
      }
      return token;
    },
  },
  events: {
    createUser: async ({ user }) => {
      if (user.email) {
        sendWelcomeEmail(user.email, user.name || "there").catch(err => 
          console.error("NextAuth OAuth welcome email async error:", err)
        );
      }
    },
  },
  logger: {
    error(code, metadata) {
      console.error("NextAuth Error:", code, metadata);
    },
    warn(code) {
      console.warn("NextAuth Warning:", code);
    },
    debug(code, metadata) {
      console.log("NextAuth Debug:", code, metadata);
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
};
