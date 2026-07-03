"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function connectSlack(webhookUrl: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  if (!webhookUrl || !webhookUrl.startsWith("https://hooks.slack.com/")) {
    return { error: "Please enter a valid Slack Incoming Webhook URL." };
  }

  // Delete any existing slack integration first
  await prisma.integration.deleteMany({
    where: {
      userId,
      type: "slack"
    }
  });

  await prisma.integration.create({
    data: {
      userId,
      type: "slack",
      credentials: JSON.stringify({ webhookUrl }),
    }
  });

  revalidatePath("/dashboard/integrations");
  return { success: true };
}

export async function disconnectSlack() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  await prisma.integration.deleteMany({
    where: {
      userId,
      type: "slack"
    }
  });

  revalidatePath("/dashboard/integrations");
  return { success: true };
}

export async function connectZapier(webhookUrl: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  if (!webhookUrl || !webhookUrl.startsWith("https://hooks.zapier.com/")) {
    return { error: "Please enter a valid Zapier Webhook URL (starts with https://hooks.zapier.com/)." };
  }

  await prisma.integration.deleteMany({ where: { userId, type: "zapier" } });

  await prisma.integration.create({
    data: {
      userId,
      type: "zapier",
      credentials: JSON.stringify({ webhookUrl }),
    },
  });

  revalidatePath("/dashboard/integrations");
  return { success: true };
}

export async function disconnectZapier() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  await prisma.integration.deleteMany({ where: { userId, type: "zapier" } });

  revalidatePath("/dashboard/integrations");
  return { success: true };
}

export async function disconnectAccount(provider: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  await prisma.account.deleteMany({
    where: {
      userId,
      provider,
    },
  });

  revalidatePath("/dashboard/integrations");
  return { success: true };
}

export async function connectRazorpay(keyId: string, keySecret: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  if (!keyId.trim() || !keySecret.trim()) {
    return { error: "Key ID and Key Secret are required." };
  }

  // Delete any existing razorpay integration
  await prisma.integration.deleteMany({
    where: {
      userId,
      type: "razorpay"
    }
  });

  await prisma.integration.create({
    data: {
      userId,
      type: "razorpay",
      credentials: JSON.stringify({ keyId, keySecret }),
    }
  });

  revalidatePath("/dashboard/integrations");
  return { success: true };
}

export async function disconnectRazorpay() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  await prisma.integration.deleteMany({
    where: {
      userId,
      type: "razorpay"
    }
  });

  revalidatePath("/dashboard/integrations");
  return { success: true };
}

