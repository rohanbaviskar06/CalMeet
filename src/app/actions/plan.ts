"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { isUserAdmin } from "@/app/actions/admin";
import crypto from "crypto";

export type PlanType = "FREE" | "PRO" | "ORGANIZATION" | "ENTERPRISE";

export async function setUserPlan(plan: PlanType) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Self-service downgrades are allowed
  if (plan === "FREE") {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { plan: "FREE" },
    });
    revalidatePaths();
    return { success: true, plan: "FREE" };
  }

  // Admins can change plans without payment
  if (isUserAdmin(session.user.email)) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { plan },
    });
    revalidatePaths();
    return { success: true, plan };
  }

  // Non-admins must go through verified payment flow
  throw new Error("Paid plan upgrades require verified payment. Please complete checkout.");
}

export async function verifyAndUpgradePlan(data: {
  plan: PlanType;
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    throw new Error("Payment gateway configuration missing on server.");
  }

  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${data.orderId}|${data.paymentId}`)
    .digest("hex");

  if (expectedSignature !== data.signature) {
    throw new Error("Payment signature verification failed. Upgrade denied.");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { plan: data.plan },
  });

  revalidatePaths();
  return { success: true, plan: data.plan };
}

export async function downgradeToFree() {
  return setUserPlan("FREE");
}

function revalidatePaths() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/workflows");
  revalidatePath("/dashboard/routing");
  revalidatePath("/dashboard/analytics");
  revalidatePath("/dashboard/team");
}
