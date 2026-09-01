import { NextResponse } from "next/server";
import { dispatchUpcomingReminders } from "@/app/actions/reminders";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
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
