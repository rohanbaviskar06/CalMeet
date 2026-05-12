"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateAvailability(
  availabilityData: { dayOfWeek: number, startTime: string, endTime: string, isActive: boolean }[],
  timezone: string
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Update user timezone using raw SQL to bypass client sync issues
  await prisma.$executeRaw`UPDATE User SET timezone = ${timezone} WHERE id = ${(session.user as any).id}`;

  // Delete existing availability for the user
  await prisma.availability.deleteMany({
    where: { userId: (session.user as any).id }
  });

  // Create new availability records for active days
  const activeDays = availabilityData.filter(d => d.isActive);
  
  if (activeDays.length > 0) {
    await prisma.availability.createMany({
      data: activeDays.map(d => ({
        userId: (session.user as any).id,
        dayOfWeek: d.dayOfWeek,
        startTime: d.startTime,
        endTime: d.endTime,
      }))
    });
  }

  revalidatePath("/dashboard/availability");
  return { success: true };
}
