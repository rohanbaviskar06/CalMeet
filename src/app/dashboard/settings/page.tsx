import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/dashboard/settings-client";

export const metadata = {
  title: "Settings | CalMeet",
  description: "Manage your account settings, integrations, and preferences",
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  let user = null;
  let webhooks: any[] = [];
  let apiKeys: any[] = [];

  try {
    const userId = (session.user as any).id;
    const [fetchedUser, rawWebhooks, rawApiKeys] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
      }),
      (prisma as any).webhook.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
      (prisma as any).apiKey.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    user = fetchedUser;

    if (rawWebhooks && Array.isArray(rawWebhooks)) {
      webhooks = rawWebhooks.map((w: any) => ({
        id: w.id,
        url: w.url,
        secret: w.secret,
        events: JSON.parse(w.events || "[]"),
        active: w.isActive,
        createdAt: w.createdAt.toISOString(),
      }));
    }

    if (rawApiKeys && Array.isArray(rawApiKeys)) {
      apiKeys = rawApiKeys.map((k: any) => ({
        id: k.id,
        name: k.name,
        key: k.key,
        lastUsed: k.lastUsed ? k.lastUsed.toISOString() : null,
        createdAt: k.createdAt.toISOString(),
      }));
    }
  } catch (error) {
    console.error("Settings page user fetch notice:", error);
  }

  if (!user) {
    user = {
      id: session.user.id,
      name: session.user.name || "User",
      email: session.user.email,
      username: session.user.email?.split("@")[0] || "user",
      image: session.user.image,
      plan: session.user.plan || "FREE",
      bio: "",
    } as any;
  }

  return (
    <SettingsForm
      user={user}
      initialWebhooks={webhooks}
      initialApiKeys={apiKeys}
    />
  );
}
