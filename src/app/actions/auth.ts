"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function signup(data: any) {
  const { name, email, password } = data;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        username: email.split("@")[0] + Math.floor(Math.random() * 1000),
      },
    });

    return { success: true, userId: user.id };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "Failed to create account. Is the database running?" };
  }
}
