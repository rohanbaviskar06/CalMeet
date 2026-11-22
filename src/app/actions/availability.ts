"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export interface AvailabilityScheduleItem {
  id: string;
  name: string;
  isDefault: boolean;
  days: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
  }[];
}

export interface DateOverrideItem {
  id: string;
  date: string;
  isUnavailable: boolean;
  startTime?: string;
  endTime?: string;
}

export async function updateAvailability(
  availabilityData: { dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }[],
  timezone: string,
  overrides?: DateOverrideItem[],
  schedules?: AvailabilityScheduleItem[],
  activeScheduleId?: string
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const userId = (session.user as any).id;

  // Update user timezone using Prisma ORM
  await prisma.user.update({
    where: { id: userId },
    data: { timezone },
  });

  // Delete existing availability for the user
  await prisma.availability.deleteMany({
    where: { userId },
  });

  // Create new availability records for active days
  const activeDays = availabilityData.filter((d) => d.isActive);

  if (activeDays.length > 0) {
    await prisma.availability.createMany({
      data: activeDays.map((d) => ({
        userId,
        dayOfWeek: d.dayOfWeek,
        startTime: d.startTime,
        endTime: d.endTime,
      })),
    });
  }

  // Persist additional schedules and date overrides in Integration table
  if (overrides !== undefined || schedules !== undefined || activeScheduleId !== undefined) {
    const existingConfig = await prisma.integration.findFirst({
      where: { userId, type: "availability_config" },
    });

    const prevCredentials = existingConfig?.credentials && typeof existingConfig.credentials === "object"
      ? (existingConfig.credentials as any)
      : {};

    const updatedConfig = {
      schedules: schedules !== undefined ? schedules : (prevCredentials.schedules || []),
      activeScheduleId: activeScheduleId !== undefined ? activeScheduleId : (prevCredentials.activeScheduleId || "default"),
      overrides: overrides !== undefined ? overrides : (prevCredentials.overrides || []),
    };

    if (existingConfig) {
      await prisma.integration.update({
        where: { id: existingConfig.id },
        data: { credentials: updatedConfig },
      });
    } else {
      await prisma.integration.create({
        data: {
          userId,
          type: "availability_config",
          credentials: updatedConfig,
        },
      });
    }
  }

  revalidatePath("/dashboard/availability");
  return { success: true };
}

export async function getAvailabilityConfig() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  const record = await prisma.integration.findFirst({
    where: { userId, type: "availability_config" },
  });

  if (!record || !record.credentials || typeof record.credentials !== "object") {
    return {
      schedules: [],
      activeScheduleId: "default",
      overrides: [],
    };
  }

  const creds = record.credentials as any;
  return {
    schedules: (creds.schedules || []) as AvailabilityScheduleItem[],
    activeScheduleId: (creds.activeScheduleId || "default") as string,
    overrides: (creds.overrides || []) as DateOverrideItem[],
  };
}
