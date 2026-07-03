"use server";

import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { sendWelcomeEmail } from "@/lib/resend";

export async function signup(data: any) {
  const { name, email, password } = data;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    console.log("Starting Supabase signup for email:", email);
    
    // 1. Sign up the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });

    if (authError) {
      console.error("Supabase signup failed:", authError.message);
      return { error: authError.message };
    }

    if (!authData.user) {
      return { error: "Failed to register user in Supabase." };
    }

    console.log("Supabase signup successful. Syncing to Prisma.");

    // 2. Check if user already exists in local database and delete to avoid ID mismatch
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("User already exists in local database. Deleting old record to align with Supabase ID.");
      await prisma.user.delete({
        where: { email },
      });
    }

    // 3. Create the user in the local Prisma database
    const user = await prisma.user.create({
      data: {
        id: authData.user.id, // Align the local ID with Supabase User ID!
        name,
        email,
        username: email.split("@")[0] + Math.floor(Math.random() * 1000),
      },
    });

    console.log("Prisma sync successful for user ID:", user.id);
    
    // Send welcome email asynchronously
    sendWelcomeEmail(email, name).catch(err => console.error("Welcome email async error:", err));

    return { success: true, userId: user.id };
  } catch (error: any) {
    console.error("Signup error details:", error);
    return { error: `Failed to create account: ${error.message || "Unknown error"}` };
  }
}

export async function sendPasswordResetLink(email: string) {
  if (!email) {
    return { error: "Email is required" };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password`,
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Password reset link error:", error);
    return { error: error.message || "An unexpected error occurred" };
  }
}

