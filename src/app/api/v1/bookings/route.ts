import { NextRequest, NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { createBooking } from "@/app/actions/bookings";

export async function GET(req: NextRequest) {
  const authResult = await authenticateApiKey(req);
  if ("errorResponse" in authResult) {
    return authResult.errorResponse;
  }
  const { user } = authResult;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const eventTypeId = searchParams.get("eventTypeId") || undefined;
  const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: user.id,
        ...(status ? { status } : {}),
        ...(eventTypeId ? { eventTypeId } : {}),
      },
      take: limit,
      orderBy: { startTime: "desc" },
      include: {
        eventType: {
          select: {
            id: true,
            title: true,
            slug: true,
            duration: true,
            videoCallProvider: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      count: bookings.length,
      data: bookings.map((b) => ({
        id: b.id,
        guestName: b.guestName,
        guestEmail: b.guestEmail,
        startTime: b.startTime.toISOString(),
        endTime: b.endTime.toISOString(),
        status: b.status,
        meetLink: b.meetLink,
        notes: b.notes,
        paymentStatus: b.paymentStatus,
        eventType: b.eventType,
        createdAt: b.createdAt.toISOString(),
      })),
    });
  } catch (err: any) {
    console.error("API GET /v1/bookings error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", message: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const authResult = await authenticateApiKey(req);
  if ("errorResponse" in authResult) {
    return authResult.errorResponse;
  }
  const { user } = authResult;

  try {
    const body = await req.json();
    const { eventTypeId, guestName, guestEmail, startTime, endTime, notes } = body;

    if (!eventTypeId || !guestName || !guestEmail || !startTime || !endTime) {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Missing required fields: eventTypeId, guestName, guestEmail, startTime, endTime",
        },
        { status: 400 }
      );
    }

    // Verify event type belongs to the user
    const eventType = await prisma.eventType.findFirst({
      where: { id: eventTypeId, userId: user.id },
    });

    if (!eventType) {
      return NextResponse.json(
        { error: "Not Found", message: "Event type not found or does not belong to this account." },
        { status: 404 }
      );
    }

    const result = await createBooking({
      eventTypeId,
      guestName,
      guestEmail,
      startTime,
      endTime,
      notes,
    });

    if (result.error) {
      return NextResponse.json(
        { error: "Booking Creation Failed", message: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.booking,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("API POST /v1/bookings error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", message: err.message },
      { status: 500 }
    );
  }
}
