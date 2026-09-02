"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export async function getWebhooks() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: "Unauthorized", webhooks: [] };
  }
  const userId = (session.user as any).id;

  try {
    const webhooks = await (prisma as any).webhook.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      webhooks: webhooks.map((w: any) => ({
        id: w.id,
        url: w.url,
        secret: w.secret,
        events: JSON.parse(w.events || "[]"),
        active: w.isActive,
        createdAt: w.createdAt.toISOString(),
      })),
    };
  } catch (err: any) {
    console.error("Error fetching webhooks:", err);
    return { error: err.message || "Failed to fetch webhooks", webhooks: [] };
  }
}

export async function createWebhook(data: { url: string; events?: string[] }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: "Unauthorized" };
  }
  const userId = (session.user as any).id;

  const url = data.url?.trim();
  if (!url) {
    return { error: "Webhook URL is required" };
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { error: "Webhook URL must start with http:// or https://" };
    }
  } catch {
    return { error: "Invalid URL format" };
  }

  // Check plan permissions
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });

  if (user?.plan === "FREE") {
    return { error: "Webhooks require a Pro, Teams, or Enterprise plan." };
  }

  try {
    const secret = "whsec_" + crypto.randomBytes(24).toString("hex");
    const events = data.events && data.events.length > 0
      ? data.events
      : ["booking.created", "booking.canceled"];

    const webhook = await (prisma as any).webhook.create({
      data: {
        userId,
        url,
        secret,
        events: JSON.stringify(events),
        isActive: true,
      },
    });

    revalidatePath("/dashboard/settings");
    return {
      success: true,
      webhook: {
        id: webhook.id,
        url: webhook.url,
        secret: webhook.secret,
        events: JSON.parse(webhook.events),
        active: webhook.isActive,
        createdAt: webhook.createdAt.toISOString(),
      },
    };
  } catch (err: any) {
    console.error("Error creating webhook:", err);
    return { error: err.message || "Failed to create webhook" };
  }
}

export async function deleteWebhook(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: "Unauthorized" };
  }
  const userId = (session.user as any).id;

  try {
    await (prisma as any).webhook.deleteMany({
      where: {
        id,
        userId,
      },
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (err: any) {
    console.error("Error deleting webhook:", err);
    return { error: err.message || "Failed to delete webhook" };
  }
}

export async function toggleWebhook(id: string, isActive: boolean) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: "Unauthorized" };
  }
  const userId = (session.user as any).id;

  try {
    await (prisma as any).webhook.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        isActive,
      },
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (err: any) {
    console.error("Error toggling webhook:", err);
    return { error: err.message || "Failed to update webhook" };
  }
}

export async function getApiKeys() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: "Unauthorized", apiKeys: [] };
  }
  const userId = (session.user as any).id;

  try {
    const keys = await (prisma as any).apiKey.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      apiKeys: keys.map((k: any) => ({
        id: k.id,
        name: k.name,
        key: k.key,
        lastUsed: k.lastUsed ? k.lastUsed.toISOString() : null,
        createdAt: k.createdAt.toISOString(),
      })),
    };
  } catch (err: any) {
    console.error("Error fetching API keys:", err);
    return { error: err.message || "Failed to fetch API keys", apiKeys: [] };
  }
}

export async function createApiKey(name: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: "Unauthorized" };
  }
  const userId = (session.user as any).id;

  const keyName = name.trim() || "Secret API Key";
  const secureKey = "cal_live_" + crypto.randomBytes(16).toString("hex");

  try {
    const newKey = await (prisma as any).apiKey.create({
      data: {
        userId,
        name: keyName,
        key: secureKey,
      },
    });

    revalidatePath("/dashboard/settings");
    return {
      success: true,
      apiKey: {
        id: newKey.id,
        name: newKey.name,
        key: newKey.key,
        lastUsed: null,
        createdAt: newKey.createdAt.toISOString(),
      },
    };
  } catch (err: any) {
    console.error("Error creating API key:", err);
    return { error: err.message || "Failed to generate API key" };
  }
}

export async function deleteApiKey(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: "Unauthorized" };
  }
  const userId = (session.user as any).id;

  try {
    await (prisma as any).apiKey.deleteMany({
      where: {
        id,
        userId,
      },
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (err: any) {
    console.error("Error deleting API key:", err);
    return { error: err.message || "Failed to delete API key" };
  }
}
