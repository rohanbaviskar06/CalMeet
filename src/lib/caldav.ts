import { createDAVClient, DAVClient } from "tsdav";

export interface CalDAVCredentials {
  serverUrl?: string;
  username: string;
  password: string;
}

/**
 * Creates and initializes a CalDAV client for Apple iCloud or custom CalDAV server
 */
export async function getCalDAVClient(credentials: CalDAVCredentials): Promise<DAVClient> {
  const client = await createDAVClient({
    serverUrl: credentials.serverUrl || "https://caldav.icloud.com",
    credentials: {
      username: credentials.username,
      password: credentials.password,
    },
    authMethod: "Basic",
    defaultAccountType: "caldav",
  });

  return client;
}

/**
 * Validates connection by attempting to discover calendars
 */
export async function verifyCalDAVCredentials(credentials: CalDAVCredentials): Promise<{
  success: boolean;
  calendarCount: number;
  error?: string;
}> {
  try {
    const client = await getCalDAVClient(credentials);
    const calendars = await client.fetchCalendars();
    return {
      success: true,
      calendarCount: calendars.length,
    };
  } catch (error: any) {
    console.error("CalDAV verification error:", error?.message || error);
    return {
      success: false,
      calendarCount: 0,
      error: error?.message || "Failed to authenticate with Apple iCloud CalDAV server. Please verify your Apple ID and App-Specific Password.",
    };
  }
}

/**
 * Fetches calendar events within a specified date window for availability conflict checks
 */
export async function fetchCalDAVEvents(
  credentials: CalDAVCredentials,
  timeMin: Date,
  timeMax: Date
) {
  try {
    const client = await getCalDAVClient(credentials);
    const calendars = await client.fetchCalendars();
    if (!calendars.length) return [];

    const events = await client.fetchCalendarObjects({
      calendar: calendars[0],
      timeRange: {
        start: timeMin.toISOString(),
        end: timeMax.toISOString(),
      },
    });

    return events;
  } catch (error) {
    console.error("fetchCalDAVEvents error:", error);
    return [];
  }
}
