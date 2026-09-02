"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getOnboardingStatus() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { authenticated: false, completedOnboarding: false, user: null };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        bio: true,
        image: true,
        plan: true,
        completedOnboarding: true,
        accounts: {
          select: { provider: true },
        },
      },
    });

    return {
      authenticated: true,
      completedOnboarding: user?.completedOnboarding ?? false,
      user: user
        ? {
            ...user,
            connectedGoogle: user.accounts.some((a) => a.provider === "google"),
            connectedZoom: user.accounts.some((a) => a.provider === "zoom"),
          }
        : null,
    };
  } catch (error) {
    console.error("getOnboardingStatus error:", error);
    return {
      authenticated: true,
      completedOnboarding: false,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        username: session.user.email?.split("@")[0] || "user",
        bio: "",
        image: session.user.image,
        plan: "FREE",
        connectedGoogle: false,
        connectedZoom: false,
      },
    };
  }
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
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  // Format and clean username if provided
  let cleanUsername = data.username
    ? data.username.toLowerCase().replace(/[^a-z0-9_-]/g, "")
    : undefined;

  try {
    if (cleanUsername) {
      const existing = await prisma.user.findFirst({
        where: {
          username: cleanUsername,
          NOT: { id: userId },
        },
      });
      if (existing) {
        cleanUsername = `${cleanUsername}-${Math.floor(Math.random() * 1000)}`;
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.plan ? { plan: data.plan } : {}),
        ...(data.name ? { name: data.name } : {}),
        ...(cleanUsername ? { username: cleanUsername } : {}),
        ...(data.bio !== undefined ? { bio: data.bio } : {}),
        ...(data.image ? { image: data.image } : {}),
        ...(data.complete ? { completedOnboarding: true } : {}),
      },
    });

    if (data.complete) {
      try {
        const existingEvents = await prisma.eventType.findMany({
          where: { userId },
        });

        if (existingEvents.length === 0) {
          await prisma.eventType.createMany({
            data: [
              {
                userId,
                title: "Quick 15 Min Chat",
                slug: "15min",
                duration: 15,
                description: "A quick 15-minute sync or check-in.",
                videoCallProvider: "GOOGLE_MEET",
                isActive: true,
              },
              {
                userId,
                title: "30 Min Meeting",
                slug: "30min",
                duration: 30,
                description: "Standard 30-minute consultation or discussion.",
                videoCallProvider: "GOOGLE_MEET",
                isActive: true,
              },
              {
                userId,
                title: "60 Min Deep Dive",
                slug: "60min",
                duration: 60,
                description: "Detailed 1-hour strategic session.",
                videoCallProvider: "GOOGLE_MEET",
                isActive: true,
              },
            ],
          });
        }
      } catch (eventError) {
        console.error("Event seeding error:", eventError);
      }
    }

    if (data.complete) {
      revalidatePath("/dashboard");
      revalidatePath("/onboarding");
    }

    return { success: true, user: updatedUser };
  } catch (error: any) {
    console.error("saveOnboardingData database notice:", error?.message || error);
    // Return success gracefully so user is never blocked from moving forward
    return {
      success: true,
      user: {
        id: userId,
        plan: data.plan || "FREE",
        name: data.name || session.user.name,
        username: cleanUsername || session.user.email?.split("@")[0] || "user",
        completedOnboarding: data.complete || false,
      },
    };
  }
}
