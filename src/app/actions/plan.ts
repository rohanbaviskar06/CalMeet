"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type PlanType = "FREE" | "PRO" | "ORGANIZATION" | "ENTERPRISE";

export async function setUserPlan(plan: PlanType) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { plan },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/workflows");
  revalidatePath("/dashboard/routing");
  revalidatePath("/dashboard/analytics");
  revalidatePath("/dashboard/team");
  return { success: true, plan };
}

export async function upgradeToPro() {
  return setUserPlan("PRO");
}

export async function upgradeToOrganization() {
  return setUserPlan("ORGANIZATION");
}

export async function upgradeToEnterprise() {
  return setUserPlan("ENTERPRISE");
}

export async function downgradeToFree() {
  return setUserPlan("FREE");
}

