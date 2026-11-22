/**
 * Timezone and Daylight Saving Time utilities for CalMeet.
 * Uses standard Intl.DateTimeFormat to ensure accurate IANA timezone conversions and DST adherence.
 */

export interface AvailabilityWindow {
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
}

export interface ZonedTimeInfo {
  dayOfWeek: number;
  hours: number;
  minutes: number;
  minutesFromMidnight: number;
}

/**
 * Returns the day of the week (0 = Sunday, 6 = Saturday) and local minutes from midnight
 * for a given date in the target IANA timezone, accurately accounting for DST.
 */
export function getZonedTimeInfo(date: Date, timeZone: string): ZonedTimeInfo {
  let resolvedTz = timeZone;
  try {
    Intl.DateTimeFormat(undefined, { timeZone: resolvedTz });
  } catch {
    resolvedTz = "UTC";
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: resolvedTz,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  let weekdayStr = "";
  let hourStr = "0";
  let minuteStr = "0";

  for (const part of parts) {
    if (part.type === "weekday") weekdayStr = part.value;
    if (part.type === "hour") hourStr = part.value;
    if (part.type === "minute") minuteStr = part.value;
  }

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const dayOfWeek = weekdayMap[weekdayStr] ?? date.getUTCDay();
  const hours = parseInt(hourStr, 10) % 24;
  const minutes = parseInt(minuteStr, 10);
  const minutesFromMidnight = hours * 60 + minutes;

  return { dayOfWeek, hours, minutes, minutesFromMidnight };
}

/**
 * Checks if a candidate time window [start, end] in UTC falls strictly within
 * the host's configured availability on that day in the host's timezone.
 */
export function isSlotWithinHostAvailability(
  startTime: Date,
  endTime: Date,
  availabilities: AvailabilityWindow[],
  hostTimezone = "UTC"
): boolean {
  if (!availabilities || availabilities.length === 0) {
    return true; // No availability rules configured
  }

  const startInfo = getZonedTimeInfo(startTime, hostTimezone);
  const endInfo = getZonedTimeInfo(endTime, hostTimezone);

  const dayAvailabilities = availabilities.filter((a) => a.dayOfWeek === startInfo.dayOfWeek);
  if (dayAvailabilities.length === 0) {
    return false;
  }

  return dayAvailabilities.some((avail) => {
    const [startH, startM] = avail.startTime.split(":").map(Number);
    const [endH, endM] = avail.endTime.split(":").map(Number);

    const availStartMin = startH * 60 + startM;
    const availEndMin = endH * 60 + endM;

    return (
      startInfo.minutesFromMidnight >= availStartMin &&
      endInfo.minutesFromMidnight <= availEndMin &&
      endInfo.minutesFromMidnight > startInfo.minutesFromMidnight
    );
  });
}
