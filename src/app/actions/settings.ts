"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { cloudinary } from "@/lib/cloudinary";
import bcrypt from "bcryptjs";

export async function updateProfile(data: { name: string; username: string; bio: string }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const userId = (session.user as any).id;

  // Check if username is already taken by another user
  const existingUser = await prisma.user.findFirst({
    where: {
      username: data.username,
      NOT: { id: userId },
    },
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
    },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateBrandingSettings(data: { hideWatermark: boolean }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const userId = (session.user as any).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, username: true },
  });

  // Verify plan allows removing watermark
  if (data.hideWatermark && user?.plan === "FREE") {
    return { error: "Watermark removal is only available on Teams, Organizations, and Enterprise plans." };
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      hideWatermark: data.hideWatermark,
    },
  });

  revalidatePath("/dashboard/settings");
  if (user?.username) {
    revalidatePath(`/${user.username}`);
  }
  return { success: true };
}

export async function updateAvatar(imageUrl: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const userId = (session.user as any).id;

  await prisma.user.update({
    where: { id: userId },
    data: {
      image: imageUrl,
    },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function uploadAvatarToCloudinary(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { error: "Unauthorized" };
  }
  const userId = (session.user as any).id;

  const file = formData.get("file") as File;
  if (!file) {
    return { error: "No file provided" };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "calmeet_avatars",
          public_id: `avatar_${userId}`,
          overwrite: true,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    if (!result?.secure_url) {
      return { error: "Failed to obtain secure URL from Cloudinary" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        image: result.secure_url,
      },
    });

    revalidatePath("/dashboard/settings");
    return { success: true, url: result.secure_url };
  } catch (error: any) {
    console.error("Cloudinary upload action error:", error);
    return { error: error.message || "Failed to upload to Cloudinary" };
  }
}

/**
 * Changes or sets user password with bcrypt hash verification.
 */
export async function changePassword(data: {
  currentPassword?: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  if (!data.newPassword || data.newPassword.length < 8) {
    return { error: "New password must be at least 8 characters long." };
  }

  if (data.newPassword !== data.confirmPassword) {
    return { error: "New passwords do not match." };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true },
  });

  if (!user) throw new Error("User not found");

  // If user already has a password, verify the current password
  if (user.password) {
    if (!data.currentPassword) {
      return { error: "Please enter your current password." };
    }
    const isValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isValid) {
      return { error: "Current password is incorrect." };
    }
  }

  const hashedPassword = await bcrypt.hash(data.newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  revalidatePath("/dashboard/settings");
  return { success: true, message: "Password updated successfully." };
}

/**
 * Persists Two-Factor Authentication state in the user's integrations table.
 */
export async function toggleTwoFactorAuth(enabled: boolean) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  if (enabled) {
    const existing = await prisma.integration.findFirst({
      where: { userId, type: "security_2fa" },
    });

    if (existing) {
      await prisma.integration.update({
        where: { id: existing.id },
        data: {
          credentials: JSON.stringify({
            enabled: true,
            method: "authenticator_app",
            updatedAt: new Date().toISOString(),
          }),
        },
      });
    } else {
      await prisma.integration.create({
        data: {
          userId,
          type: "security_2fa",
          credentials: JSON.stringify({
            enabled: true,
            method: "authenticator_app",
            updatedAt: new Date().toISOString(),
          }),
        },
      });
    }
  } else {
    await prisma.integration.deleteMany({
      where: { userId, type: "security_2fa" },
    });
  }

  revalidatePath("/dashboard/settings");
  return { success: true, enabled };
}

/**
 * Gets security status (2FA, password presence) for the user.
 */
export async function getSecuritySettings() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { twoFactorEnabled: false, hasPassword: false };
  const userId = (session.user as any).id;

  const [user, twoFactorRecord] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    }),
    prisma.integration.findFirst({
      where: { userId, type: "security_2fa" },
    }),
  ]);

  let twoFactorEnabled = false;
  if (twoFactorRecord) {
    try {
      const parsed = typeof twoFactorRecord.credentials === "string"
        ? JSON.parse(twoFactorRecord.credentials)
        : twoFactorRecord.credentials;
      twoFactorEnabled = Boolean((parsed as any)?.enabled);
    } catch {
      twoFactorEnabled = true;
    }
  }

  return {
    twoFactorEnabled,
    hasPassword: Boolean(user?.password),
  };
}

/**
 * Persists general user preferences (weekStart, timeFormat, language, etc.)
 */
export async function saveUserPreferences(preferences: Record<string, any>) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  const existing = await prisma.integration.findFirst({
    where: { userId, type: "user_preferences" },
  });

  const credentialsJson = JSON.stringify({
    ...preferences,
    updatedAt: new Date().toISOString(),
  });

  if (existing) {
    await prisma.integration.update({
      where: { id: existing.id },
      data: { credentials: credentialsJson },
    });
  } else {
    await prisma.integration.create({
      data: {
        userId,
        type: "user_preferences",
        credentials: credentialsJson,
      },
    });
  }

  // Update timezone or name if present
  if (preferences.timezone) {
    await prisma.user.update({
      where: { id: userId },
      data: { timezone: preferences.timezone },
    });
  }

  revalidatePath("/dashboard/settings");
  return { success: true };
}

/**
 * Comprehensive GDPR Data Export including User, Bookings, Event Types, Availability, and Teams.
 */
export async function exportFullUserData() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  const [user, bookings, eventTypes, availability, teams, routingForms, workflows, webhooks, apiKeys] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          bio: true,
          timezone: true,
          plan: true,
          hideWatermark: true,
          completedOnboarding: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.booking.findMany({
        where: { OR: [{ userId }, { eventType: { userId } }] },
        include: { eventType: { select: { title: true, duration: true } } },
      }),
      prisma.eventType.findMany({
        where: { userId },
      }),
      prisma.availability.findMany({
        where: { userId },
      }),
      prisma.teamMember.findMany({
        where: { userId },
        include: { team: true },
      }),
      prisma.routingForm.findMany({
        where: { userId },
      }),
      prisma.workflow.findMany({
        where: { userId },
      }),
      prisma.webhook.findMany({
        where: { userId },
      }),
      prisma.apiKey.findMany({
        where: { userId },
        select: { id: true, name: true, createdAt: true, lastUsed: true },
      }),
    ]);

  return {
    exportDate: new Date().toISOString(),
    version: "1.0",
    user,
    bookings,
    eventTypes,
    availability,
    teams,
    routingForms,
    workflows,
    webhooks,
    apiKeys,
  };
}
