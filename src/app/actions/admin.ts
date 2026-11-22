"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isUserAdmin } from "@/lib/admin";
import { getRecentIncidents } from "@/lib/monitoring";

export { isUserAdmin };

/**
 * Enforces admin authorization. Throws if session is missing or user is not an admin.
 */
export async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Unauthorized: Authentication required");
  }

  if (!isUserAdmin(session.user.email)) {
    throw new Error("Forbidden: Admin privileges required");
  }

  return session.user;
}

export async function checkAdminStatus(): Promise<{ isAdmin: boolean; email?: string | null }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { isAdmin: false };
  }
  return {
    isAdmin: isUserAdmin(session.user.email),
    email: session.user.email,
  };
}

export async function getAdminStats() {
  await verifyAdmin();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalUsers,
    totalBookings,
    totalEventTypes,
    recentUsers,
    confirmedBookingsCount,
    cancelledBookingsCount,
    paidBookings,
    failedPaymentsCount,
    freeUsersCount,
    proUsersCount,
    orgUsersCount,
    enterpriseUsersCount,
    usersWithBookingsCount,
    activeHosts30dCount,
  ] = await Promise.all([
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
      },
    }),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.booking.count({ where: { status: "CANCELLED" } }),
    prisma.booking.findMany({
      where: { paymentStatus: "PAID" },
      select: {
        id: true,
        eventType: {
          select: { price: true, currency: true },
        },
      },
    }),
    prisma.booking.count({ where: { paymentStatus: "FAILED" } }),
    prisma.user.count({ where: { plan: "FREE" } }),
    prisma.user.count({ where: { plan: "PRO" } }),
    prisma.user.count({ where: { plan: "ORGANIZATION" } }),
    prisma.user.count({ where: { plan: "ENTERPRISE" } }),
    prisma.user.count({
      where: {
        eventTypes: {
          some: {
            bookings: { some: {} },
          },
        },
      },
    }),
    prisma.user.count({
      where: {
        eventTypes: {
          some: {
            bookings: {
              some: {
                startTime: { gte: thirtyDaysAgo },
              },
            },
          },
        },
      },
    }),
  ]);

  const totalViews = await prisma.eventType.aggregate({
    _sum: {
      views: true,
    },
  });

  // Calculate gross booking revenue
  let totalRevenueINR = 0;
  let totalRevenueUSD = 0;
  for (const b of paidBookings) {
    const price = b.eventType?.price || 0;
    const currency = (b.eventType?.currency || "INR").toUpperCase();
    if (currency === "USD") {
      totalRevenueUSD += price;
    } else {
      totalRevenueINR += price;
    }
  }

  // Key performance ratios
  const bookingSuccessRate =
    totalBookings > 0 ? Math.round((confirmedBookingsCount / totalBookings) * 100) : 0;
  const cancellationRate =
    totalBookings > 0 ? Math.round((cancelledBookingsCount / totalBookings) * 100) : 0;
  const signupToFirstBookingRate =
    totalUsers > 0 ? Math.round((usersWithBookingsCount / totalUsers) * 100) : 0;
  const hostRetentionRate30d =
    totalUsers > 0 ? Math.round((activeHosts30dCount / totalUsers) * 100) : 0;

  return {
    totalUsers,
    totalBookings,
    totalEventTypes,
    totalViews: totalViews._sum.views || 0,
    metrics: {
      bookingSuccessRate,
      cancellationRate,
      signupToFirstBookingRate,
      hostRetentionRate30d,
      activeHosts30d: activeHosts30dCount,
      confirmedBookings: confirmedBookingsCount,
      cancelledBookings: cancelledBookingsCount,
      paidBookingsCount: paidBookings.length,
      failedPaymentsCount,
      totalRevenueINR,
      totalRevenueUSD,
    },
    planDistribution: {
      FREE: freeUsersCount,
      PRO: proUsersCount,
      ORGANIZATION: orgUsersCount,
      ENTERPRISE: enterpriseUsersCount,
    },
    recentIncidents: getRecentIncidents(10),
    recentUsers: recentUsers.map((u) => ({
      ...u,
      joined: u.createdAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: "Active",
    })),
  };
}

export async function updateUserPlan(userId: string, plan: string) {
  await verifyAdmin();

  const validPlans = ["FREE", "PRO", "ORGANIZATION", "ENTERPRISE"];
  if (!validPlans.includes(plan)) {
    throw new Error("Invalid plan specified");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { plan },
  });

  return { success: true, user: updatedUser };
}

export async function deleteUser(userId: string) {
  const adminUser = await verifyAdmin();

  if ((adminUser as { id?: string }).id === userId) {
    throw new Error("Cannot delete your own admin account");
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  return { success: true };
}

export async function toggleUserWatermark(userId: string, hideWatermark: boolean) {
  await verifyAdmin();

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { hideWatermark },
  });

  return { success: true, user: updatedUser };
}

export async function revokeUserSessions(userId: string) {
  await verifyAdmin();

  await prisma.session.deleteMany({
    where: { userId },
  });

  return { success: true };
}
