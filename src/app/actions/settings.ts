"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: { name: string, username: string, bio: string }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const userId = (session.user as any).id;

  // Check if username is already taken by another user
  const existingUser = await prisma.user.findFirst({
    where: {
      username: data.username,
      NOT: { id: userId }
    }
  });

  if (existingUser) {
    return { error: "Username is already taken" };
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      username: data.username,
      bio: data.bio,
    }
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}
