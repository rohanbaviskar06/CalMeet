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
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        bio: true,
        timezone: true,
        plan: true,
        hideWatermark: true,
        createdAt: true,
      },
    });

    if (!fullUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [totalEventTypes, totalBookings, totalWebhooks, totalApiKeys] = await Promise.all([
      prisma.eventType.count({ where: { userId: user.id } }),
      prisma.booking.count({ where: { eventType: { userId: user.id } } }),
      (prisma as any).webhook.count({ where: { userId: user.id } }),
      (prisma as any).apiKey.count({ where: { userId: user.id } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        id: fullUser.id,
        name: fullUser.name,
        email: fullUser.email,
        username: fullUser.username,
        bio: fullUser.bio,
        timezone: fullUser.timezone,
        plan: fullUser.plan,
        hideWatermark: fullUser.hideWatermark,
        stats: {
          totalEventTypes,
          totalBookings,
          totalWebhooks,
          totalApiKeys,
        },
        createdAt: fullUser.createdAt.toISOString(),
      },
    });
  } catch (err: any) {
    console.error("API GET /v1/me error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", message: err.message },
      { status: 500 }
    );
  }
}
