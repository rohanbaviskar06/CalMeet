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
  try {
    user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
    });
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

  return <SettingsForm user={user} />;
}
