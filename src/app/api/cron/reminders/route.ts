import { NextResponse } from "next/server";
import { dispatchUpcomingReminders } from "@/app/actions/reminders";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Secure cron endpoint against unauthorized external triggering
    if (cronSecret) {
      const isAuthorized =
        authHeader === `Bearer ${cronSecret}` ||
        request.headers.get("x-cron-secret") === cronSecret;

      if (!isAuthorized) {
        return NextResponse.json(
          { error: "Unauthorized: Invalid or missing CRON_SECRET" },
          { status: 401 }
        );
      }
    }

    const url = new URL(request.url);
    const windowHours = parseInt(url.searchParams.get("hours") || "24", 10);

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
