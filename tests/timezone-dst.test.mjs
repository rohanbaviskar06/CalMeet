import { test } from "node:test";
import assert from "node:assert/strict";
import { getZonedTimeInfo, isSlotWithinHostAvailability } from "../src/lib/timezone.ts";

test("Timezone & DST - accurate day of week and local time in America/New_York (Summer DST vs Winter Standard)", () => {
  // July 15, 2026 at 15:00 UTC -> 11:00 EDT (UTC-4)
  const summerDate = new Date("2026-07-15T15:00:00Z");
  const summerInfo = getZonedTimeInfo(summerDate, "America/New_York");
  assert.equal(summerInfo.hours, 11);
  assert.equal(summerInfo.minutes, 0);
  assert.equal(summerInfo.dayOfWeek, 3); // Wednesday

  // January 15, 2026 at 15:00 UTC -> 10:00 EST (UTC-5)
  const winterDate = new Date("2026-01-15T15:00:00Z");
  const winterInfo = getZonedTimeInfo(winterDate, "America/New_York");
  assert.equal(winterInfo.hours, 10);
  assert.equal(winterInfo.minutes, 0);
  assert.equal(winterInfo.dayOfWeek, 4); // Thursday
});

test("Timezone & DST - Asia/Kolkata (UTC+5:30) half-hour offset handling", () => {
  const date = new Date("2026-07-15T10:00:00Z");
  const info = getZonedTimeInfo(date, "Asia/Kolkata");
  // 10:00 UTC + 5:30 = 15:30
  assert.equal(info.hours, 15);
  assert.equal(info.minutes, 30);
  assert.equal(info.minutesFromMidnight, 15 * 60 + 30);
});

test("Availability Checking - validates slots inside host working hours", () => {
  const availabilities = [
    { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" }, // Monday
    { dayOfWeek: 2, startTime: "09:00", endTime: "17:00" }, // Tuesday
    { dayOfWeek: 3, startTime: "09:00", endTime: "17:00" }, // Wednesday
    { dayOfWeek: 4, startTime: "09:00", endTime: "17:00" }, // Thursday
    { dayOfWeek: 5, startTime: "09:00", endTime: "17:00" }, // Friday
  ];

  // Wednesday at 10:00 to 10:30 host time (EDT = UTC-4 -> 14:00 to 14:30 UTC)
  const validStart = new Date("2026-07-15T14:00:00Z");
  const validEnd = new Date("2026-07-15T14:30:00Z");
  const ok = isSlotWithinHostAvailability(validStart, validEnd, availabilities, "America/New_York");
  assert.equal(ok, true);

  // Wednesday early morning: 08:00 host time (12:00 UTC) -> Before 09:00 working hours
  const earlyStart = new Date("2026-07-15T12:00:00Z");
  const earlyEnd = new Date("2026-07-15T12:30:00Z");
  const tooEarly = isSlotWithinHostAvailability(earlyStart, earlyEnd, availabilities, "America/New_York");
  assert.equal(tooEarly, false);

  // Sunday: Not in configured working days
  const sundayStart = new Date("2026-07-19T14:00:00Z");
  const sundayEnd = new Date("2026-07-19T14:30:00Z");
  const sundaySlot = isSlotWithinHostAvailability(sundayStart, sundayEnd, availabilities, "America/New_York");
  assert.equal(sundaySlot, false);
});
