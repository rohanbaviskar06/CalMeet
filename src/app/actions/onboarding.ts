"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function completeOnboardingAction() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  await prisma.user.update({
    where: { id: userId },
    data: { completedOnboarding: true },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function saveOnboardingData(data: {
  plan?: string;
  name?: string;
  username?: string;
  bio?: string;
  image?: string;
  complete?: boolean;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  const updateData: Record<string, any> = {};
  if (data.plan) updateData.plan = data.plan;
  if (data.name !== undefined) updateData.name = data.name;
  if (data.username !== undefined) updateData.username = data.username;
  if (data.bio !== undefined) updateData.bio = data.bio;
  if (data.image !== undefined) updateData.image = data.image;
  if (data.complete) updateData.completedOnboarding = true;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  revalidatePath("/dashboard");
  revalidatePath("/onboarding");
  return { success: true, user: updatedUser };
}
