import { prisma } from "@/lib/prisma";

export interface PlatformMetrics {
  totalUsers: number;
  totalBookings: number;
  signupToFirstBookingRate: number; // percentage (0 - 100)
  successfulBookingRate: number; // percentage (0 - 100)
  cancellationRate: number; // percentage (0 - 100)
  hostRetentionRate30d: number; // percentage (0 - 100)
  activeHosts30d: number;
  failedPaymentsCount: number;
  failedPaymentsAmountINR: number;
  confirmedBookingsCount: number;
  cancelledBookingsCount: number;
}

export async function calculatePlatformMetrics(): Promise<PlatformMetrics> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalUsers,
    totalBookings,
    confirmedBookings,
    cancelledBookings,
    failedPayments,
    usersWithBookings,
    activeHosts30d,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.booking.count({ where: { status: "CANCELLED" } }),
    prisma.booking.findMany({
      where: { paymentStatus: "FAILED" },
      include: { eventType: { select: { price: true } } },
    }),
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
              some: { startTime: { gte: thirtyDaysAgo } },
            },
          },
        },
      },
    }),
  ]);

  const signupToFirstBookingRate =
    totalUsers > 0 ? Math.round((usersWithBookings / totalUsers) * 100) : 0;

  const successfulBookingRate =
    totalBookings > 0 ? Math.round((confirmedBookings / totalBookings) * 100) : 0;

  const cancellationRate =
    totalBookings > 0 ? Math.round((cancelledBookings / totalBookings) * 100) : 0;

  const hostRetentionRate30d =
    totalUsers > 0 ? Math.round((activeHosts30d / totalUsers) * 100) : 0;

  const failedPaymentsAmountINR = failedPayments.reduce(
    (acc, b) => acc + (b.eventType?.price || 0),
    0
  );

  return {
    totalUsers,
    totalBookings,
    signupToFirstBookingRate,
    successfulBookingRate,
    cancellationRate,
    hostRetentionRate30d,
    activeHosts30d,
    failedPaymentsCount: failedPayments.length,
    failedPaymentsAmountINR,
    confirmedBookingsCount: confirmedBookings,
    cancelledBookingsCount: cancelledBookings,
  };
}
