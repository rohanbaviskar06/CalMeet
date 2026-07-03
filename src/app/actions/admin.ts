"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getAdminStats() {
  const session = await getServerSession(authOptions);
  
  // Basic security check (should be more robust in production)
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const [totalUsers, totalBookings, totalEventTypes, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.booking.count(),
    prisma.eventType.count(),
    prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        hideWatermark: true,
        createdAt: true,
      }
    })
  ]);

  // Calculate revenue (mock logic if not in schema, or aggregate if payment data exists)
  // For now, let's just use a placeholder or sum some views if that's what user considers data
  const totalViews = await prisma.eventType.aggregate({
    _sum: {
      views: true
    }
  });

  return {
    totalUsers,
    totalBookings,
    totalEventTypes,
    totalViews: totalViews._sum.views || 0,
    recentUsers: recentUsers.map(u => ({
      ...u,
      joined: u.createdAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
      status: "Active" // Mock status since we don't have it in schema
    }))
  };
}

export async function updateUserPlan(userId: string, plan: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.email !== "rbgaming116@gmail.com") {
    throw new Error("Unauthorized");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { plan }
  });

  return { success: true, user: updatedUser };
}

export async function deleteUser(userId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.email !== "rbgaming116@gmail.com") {
    throw new Error("Unauthorized");
  }

  await prisma.user.delete({
    where: { id: userId }
  });

  return { success: true };
}

export async function toggleUserWatermark(userId: string, hideWatermark: boolean) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.email !== "rbgaming116@gmail.com") {
    throw new Error("Unauthorized");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { hideWatermark }
  });

  return { success: true, user: updatedUser };
}

