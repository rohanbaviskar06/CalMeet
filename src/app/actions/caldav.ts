"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { verifyCalDAVCredentials } from "@/lib/caldav";

export async function connectICloudCalendar(formData: {
  appleId: string;
  appPassword: string;
  serverUrl?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: "Unauthorized. Please sign in." };
  }

  const userId = (session.user as any).id;
  const { appleId, appPassword, serverUrl } = formData;

  if (!appleId || !appPassword) {
    return { error: "Apple ID email and App-Specific Password are required." };
  }

  // Verify credentials against CalDAV server
  const verification = await verifyCalDAVCredentials({
    username: appleId.trim(),
    password: appPassword.trim(),
    serverUrl: serverUrl || "https://caldav.icloud.com",
  });

  if (!verification.success) {
    return { error: verification.error || "Authentication failed. Please verify your App-Specific Password." };
  }

  try {
    // Upsert integration record
    const existing = await prisma.integration.findFirst({
      where: {
        userId,
        type: "icloud",
      },
    });

    const credentialsPayload = {
      username: appleId.trim(),
      password: appPassword.trim(),
      serverUrl: serverUrl || "https://caldav.icloud.com",
      calendarsFound: verification.calendarCount,
      connectedAt: new Date().toISOString(),
    };

    if (existing) {
      await prisma.integration.update({
        where: { id: existing.id },
        data: {
          credentials: credentialsPayload,
        },
      });
    } else {
      await prisma.integration.create({
        data: {
          userId,
          type: "icloud",
          credentials: credentialsPayload,
        },
      });
    }

    revalidatePath("/dashboard/integrations");
    revalidatePath("/onboarding/personal/calendar");

    return {
      success: true,
      message: `Successfully connected Apple iCloud Calendar (${verification.calendarCount} calendar${verification.calendarCount === 1 ? "" : "s"} found).`,
    };
  } catch (dbError: any) {
    console.error("connectICloudCalendar database error:", dbError);
    return { error: "Failed to save iCloud credentials to database." };
  }
}

export async function disconnectICloudCalendar() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const userId = (session.user as any).id;

  try {
    await prisma.integration.deleteMany({
      where: {
        userId,
        type: "icloud",
      },
    });

    revalidatePath("/dashboard/integrations");
    return { success: true };
  } catch (error) {
    console.error("disconnectICloudCalendar error:", error);
    return { error: "Failed to disconnect iCloud calendar." };
  }
}
