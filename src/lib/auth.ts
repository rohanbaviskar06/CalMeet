import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import ZoomProvider from "next-auth/providers/zoom";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
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
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events",
          access_type: "offline",
          prompt: "consent",
        },
      },
      allowDangerousEmailAccountLinking: true,
    }),
    ZoomProvider({
      clientId: process.env.ZOOM_CLIENT_ID!,
      clientSecret: process.env.ZOOM_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email user:read meeting:write",
        },
      },
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.password) {
          throw new Error("No user found with this email");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
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
