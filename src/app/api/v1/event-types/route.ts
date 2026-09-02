import { NextRequest, NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const authResult = await authenticateApiKey(req);
  if ("errorResponse" in authResult) {
    return authResult.errorResponse;
  }
  const { user } = authResult;

  try {
    const eventTypes = await prisma.eventType.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        duration: true,
        isActive: true,
        videoCallProvider: true,
        requiresPayment: true,
        price: true,
        currency: true,
        views: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { bookings: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: eventTypes.map((et) => ({
        id: et.id,
        title: et.title,
        slug: et.slug,
        description: et.description,
        duration: et.duration,
        isActive: et.isActive,
        videoCallProvider: et.videoCallProvider,
        requiresPayment: et.requiresPayment,
        price: et.price,
        currency: et.currency,
        views: et.views,
        totalBookings: et._count.bookings,
        bookingUrl: `${process.env.NEXTAUTH_URL || "https://cal-meet.vercel.app"}/${user.username || "user"}/${et.slug}`,
        createdAt: et.createdAt.toISOString(),
      })),
    });
  } catch (err: any) {
    console.error("API GET /v1/event-types error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", message: err.message },
      { status: 500 }
    );
  }
}
