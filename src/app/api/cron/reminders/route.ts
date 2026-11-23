import { NextResponse } from "next/server";
import { dispatchUpcomingReminders } from "@/app/actions/reminders";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Enforce CRON_SECRET unconditionally to safeguard against arbitrary public execution
    if (!cronSecret) {
      return NextResponse.json(
        { error: "Server configuration error: CRON_SECRET is not configured." },
        { status: 500 }
      );
    }

    const isAuthorized =
      authHeader === `Bearer ${cronSecret}` ||
      request.headers.get("x-cron-secret") === cronSecret;

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing CRON_SECRET." },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const rawHours = parseInt(url.searchParams.get("hours") || "24", 10);
    // Bounded dispatch window: strictly between 1 and 72 hours
    const windowHours = isNaN(rawHours) ? 24 : Math.min(Math.max(rawHours, 1), 72);

    const result = await dispatchUpcomingReminders(windowHours);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to trigger reminders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
