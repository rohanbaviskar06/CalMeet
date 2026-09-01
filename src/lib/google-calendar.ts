import { getGoogleCalendarClient } from "./google";
import { prisma } from "./prisma";

export async function createGoogleMeetEvent(userId: string, eventData: {
  summary: string;
  description: string;
  startTime: Date;
  endTime: Date;
  guestEmail: string;
}) {
  try {
    // 1. Get the user's Google account from the database
    const account = await prisma.account.findFirst({
      where: {
        userId,
        provider: "google",
      },
    });

    if (!account || !account.access_token) {
      console.log("No Google account found for user", userId);
      return null;
    }

    const calendar = await getGoogleCalendarClient(
      account.access_token,
      account.refresh_token ?? undefined,
      account.id
    );

    // 2. Create the event with conferenceData for Google Meet
    const event = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: {
        summary: eventData.summary,
        description: eventData.description,
        start: {
          dateTime: eventData.startTime.toISOString(),
        },
        end: {
          dateTime: eventData.endTime.toISOString(),
        },
        attendees: [{ email: eventData.guestEmail }],
        conferenceData: {
          createRequest: {
            requestId: `calmeet-${Date.now()}`,
            conferenceSolutionKey: {
              type: "hangoutsMeet",
            },
          },
        },
      },
    });

    return {
      eventId: event.data.id,
      meetLink: event.data.hangoutLink,
    };
  } catch (error) {
    console.error("Error creating Google Meet event:", error);
    return null;
  }
}
