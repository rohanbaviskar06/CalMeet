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

export interface ZonedParts {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
  dayOfWeek: number;
  dateStr: string; // "YYYY-MM-DD"
  timeStr: string; // "HH:mm"
}

export interface SlotOption {
  utcIso: string;
  timeStr: string;
  displayTime: string;
  guestDateStr: string;
}

/**
 * Returns exact year, month, day, hour, minute, and day of week in the target timezone.
 */
export function getZonedParts(date: Date, timeZone: string): ZonedParts {
  let resolvedTz = timeZone;
  try {
    Intl.DateTimeFormat(undefined, { timeZone: resolvedTz });
  } catch {
    resolvedTz = "UTC";
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: resolvedTz,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    weekday: "short",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  let y = 1970, m = 1, d = 1, h = 0, min = 0, s = 0, weekday = "Sun";
  for (const p of parts) {
    if (p.type === "year") y = parseInt(p.value, 10);
    if (p.type === "month") m = parseInt(p.value, 10);
    if (p.type === "day") d = parseInt(p.value, 10);
    if (p.type === "hour") h = parseInt(p.value, 10) % 24;
    if (p.type === "minute") min = parseInt(p.value, 10);
    if (p.type === "second") s = parseInt(p.value, 10);
    if (p.type === "weekday") weekday = p.value;
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

  return {
    year: y,
    month: m,
    day: d,
    hours: h,
    minutes: min,
    seconds: s,
    dayOfWeek: weekdayMap[weekday] ?? 0,
    dateStr: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
    timeStr: `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`,
  };
}

/**
 * Accurately converts a local wall clock time (year, month, day, hours, minutes)
 * in any IANA timezone into its corresponding exact UTC Date instant.
 * Correctly accounts for Daylight Saving Time shifts and half-hour offsets.
 */
export function zonedTimeToUtc(
  year: number,
  month: number, // 1-12
  day: number,
  hours: number,
  minutes: number,
  timeZone: string
): Date {
  const guessUtc = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0));
  const p = getZonedParts(guessUtc, timeZone);
  const zonedAsUtc = Date.UTC(p.year, p.month - 1, p.day, p.hours, p.minutes, 0, 0);
  const diffMs = zonedAsUtc - guessUtc.getTime();
  return new Date(guessUtc.getTime() - diffMs);
}

/**
 * Returns the day of the week (0 = Sunday, 6 = Saturday) and local minutes from midnight
 * for a given date in the target IANA timezone, accurately accounting for DST.
 */
export function getZonedTimeInfo(date: Date, timeZone: string): ZonedTimeInfo {
  const parts = getZonedParts(date, timeZone);
  const minutesFromMidnight = parts.hours * 60 + parts.minutes;
  return {
    dayOfWeek: parts.dayOfWeek,
    hours: parts.hours,
    minutes: parts.minutes,
    minutesFromMidnight,
  };
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

/**
 * Generates timezone-accurate, DST-resilient candidate slots for a guest's selected calendar date.
 * Uses exact UTC instants derived from host working hours in the host's timezone, then
 * projects into guest timezone with support for half-hour offsets and DST transitions.
 */
export function generateZonedSlotsForDate({
  targetDate,
  hostTimezone = "UTC",
  guestTimezone = "UTC",
  availabilities = [],
  duration = 30,
  bookings = [],
  now = new Date(),
  overrides = [],
  outOfOffice,
  timeFormat = "12h",
}: {
  targetDate: Date;
  hostTimezone?: string;
  guestTimezone?: string;
  availabilities?: AvailabilityWindow[];
  duration?: number;
  bookings?: { startTime: Date | string; endTime: Date | string }[];
  now?: Date;
  overrides?: { date: string; isUnavailable: boolean; startTime?: string; endTime?: string }[];
  outOfOffice?: { enabled?: boolean; start?: string; end?: string };
  timeFormat?: "12h" | "24h";
}): SlotOption[] {
  const guestParts = getZonedParts(targetDate, guestTimezone);
  const guestDateStr = guestParts.dateStr;

  // 1. Check Out of office covering entire guest date
  if (outOfOffice && outOfOffice.enabled && outOfOffice.start && outOfOffice.end) {
    if (guestDateStr >= outOfOffice.start && guestDateStr <= outOfOffice.end) {
      return [];
    }
  }

  // 2. Identify candidate host dates (yesterday, today, tomorrow relative to guest day)
  const guestMidnightUtc = zonedTimeToUtc(guestParts.year, guestParts.month, guestParts.day, 0, 0, guestTimezone);

  const candidateDays = [-1, 0, 1].map((offset) => {
    const d = new Date(guestMidnightUtc.getTime() + offset * 86400000);
    return getZonedParts(d, hostTimezone);
  });

  const uniqueHostDays = Array.from(new Set(candidateDays.map((c) => c.dateStr))).map((ds) => {
    return candidateDays.find((c) => c.dateStr === ds)!;
  });

  const slots: SlotOption[] = [];
  const bufferTimeMs = 30 * 60 * 1000;
  const interval = Math.max(duration, 15);

  for (const hostDay of uniqueHostDays) {
    const override = overrides.find((o) => o.date === hostDay.dateStr);
    let dayWindows: { startTime: string; endTime: string }[] = [];

    if (override) {
      if (override.isUnavailable) {
        continue;
      }
      if (override.startTime && override.endTime) {
        dayWindows = [{ startTime: override.startTime, endTime: override.endTime }];
      }
    } else {
      dayWindows = availabilities.filter((a) => a.dayOfWeek === hostDay.dayOfWeek);
    }

    for (const win of dayWindows) {
      const [startH, startM] = win.startTime.split(":").map(Number);
      const [endH, endM] = win.endTime.split(":").map(Number);

      let currentH = startH;
      let currentM = startM;

      while (currentH * 60 + currentM + duration <= endH * 60 + endM) {
        const slotStartUtc = zonedTimeToUtc(
          hostDay.year,
          hostDay.month,
          hostDay.day,
          currentH,
          currentM,
          hostTimezone
        );
        const slotEndUtc = new Date(slotStartUtc.getTime() + duration * 60000);

        // Check buffer from now
        if (slotStartUtc.getTime() > now.getTime() + bufferTimeMs) {
          // Check collision with bookings
          const hasConflict = bookings.some((b) => {
            const bStart = new Date(b.startTime).getTime();
            const bEnd = new Date(b.endTime).getTime();
            return slotStartUtc.getTime() < bEnd && slotEndUtc.getTime() > bStart;
          });

          if (!hasConflict) {
            // Check out of office
            let inOoo = false;
            if (outOfOffice && outOfOffice.enabled && outOfOffice.start && outOfOffice.end) {
              const oooStart = new Date(`${outOfOffice.start}T00:00:00Z`).getTime();
              const oooEnd = new Date(`${outOfOffice.end}T23:59:59.999Z`).getTime();
              if (slotStartUtc.getTime() <= oooEnd && slotEndUtc.getTime() >= oooStart) {
                inOoo = true;
              }
            }

            if (!inOoo) {
              const slotGuestParts = getZonedParts(slotStartUtc, guestTimezone);
              if (slotGuestParts.dateStr === guestDateStr) {
                let displayTime = slotGuestParts.timeStr;
                if (timeFormat === "12h") {
                  const h = slotGuestParts.hours;
                  const m = slotGuestParts.minutes;
                  const period = h >= 12 ? "pm" : "am";
                  const h12 = h % 12 === 0 ? 12 : h % 12;
                  displayTime = `${h12}:${String(m).padStart(2, "0")}${period}`;
                }

                slots.push({
                  utcIso: slotStartUtc.toISOString(),
                  timeStr: slotGuestParts.timeStr,
                  displayTime,
                  guestDateStr: slotGuestParts.dateStr,
                });
              }
            }
          }
        }

        const nextTotalMinutes = currentH * 60 + currentM + interval;
        currentH = Math.floor(nextTotalMinutes / 60);
        currentM = nextTotalMinutes % 60;
      }
    }
  }

  // Deduplicate and sort
  const seen = new Set<string>();
  const deduped: SlotOption[] = [];
  for (const s of slots) {
    if (!seen.has(s.utcIso)) {
      seen.add(s.utcIso);
      deduped.push(s);
    }
  }

  return deduped.sort(
    (a, b) => new Date(a.utcIso).getTime() - new Date(b.utcIso).getTime()
  );
}
