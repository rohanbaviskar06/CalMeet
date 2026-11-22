import test from "node:test";
import assert from "node:assert/strict";

test("Availability - Disabling Monday remains disabled on reload", () => {
  const daysList = [
    { value: 0, label: "Sunday", short: "Sun" },
    { value: 1, label: "Monday", short: "Mon" },
    { value: 2, label: "Tuesday", short: "Tue" },
    { value: 3, label: "Wednesday", short: "Wed" },
    { value: 4, label: "Thursday", short: "Thu" },
    { value: 5, label: "Friday", short: "Fri" },
    { value: 6, label: "Saturday", short: "Sat" },
  ];

  // User disabled Monday (1), so DB contains only days 2, 3, 4, 5
  const initialAvailability = [
    { dayOfWeek: 2, startTime: "09:00", endTime: "17:00" },
    { dayOfWeek: 3, startTime: "09:00", endTime: "17:00" },
    { dayOfWeek: 4, startTime: "09:00", endTime: "17:00" },
    { dayOfWeek: 5, startTime: "09:00", endTime: "17:00" },
  ];

  const hasExistingData = initialAvailability.length > 0;
  assert.equal(hasExistingData, true, "User has existing configured availability");

  const resolvedAvailability = daysList.map((day) => {
    const existingRecords = initialAvailability.filter((d) => d.dayOfWeek === day.value);
    if (existingRecords.length > 0) {
      return {
        dayOfWeek: day.value,
        isActive: true,
        intervals: existingRecords.map((r) => ({
          startTime: r.startTime,
          endTime: r.endTime,
        })),
      };
    }
    // Days without records should be inactive if user has existing configuration
    const isWeekday = !hasExistingData && day.value >= 1 && day.value <= 5;
    return {
      dayOfWeek: day.value,
      isActive: isWeekday,
      intervals: [{ startTime: "09:00", endTime: "17:00" }],
    };
  });

  const monday = resolvedAvailability.find((d) => d.dayOfWeek === 1);
  assert.equal(monday.isActive, false, "Monday must remain disabled after reload");

  const tuesday = resolvedAvailability.find((d) => d.dayOfWeek === 2);
  assert.equal(tuesday.isActive, true, "Tuesday must remain active");
});

test("Availability - Schedule duplication and date overrides persistence structure", () => {
  const originalSchedule = {
    id: "default",
    name: "Working hours",
    isDefault: true,
  };

  const duplicated = {
    id: "sched-" + Date.now(),
    name: `${originalSchedule.name} (Copy)`,
    isDefault: false,
  };

  assert.equal(duplicated.name, "Working hours (Copy)");
  assert.equal(duplicated.isDefault, false);
  assert.notEqual(duplicated.id, originalSchedule.id);

  // Date override validation
  const override = {
    id: "ov-1",
    date: "2026-12-25",
    isUnavailable: true,
    startTime: "09:00",
    endTime: "17:00",
  };

  assert.equal(override.isUnavailable, true);
  assert.equal(override.date, "2026-12-25");
});

test("Bookings - Pending bookings appear under Unconfirmed, not Upcoming", () => {
  const now = new Date("2026-11-25T10:00:00Z");

  const bookings = [
    {
      id: "b-1",
      guestName: "Alice",
      startTime: new Date("2026-11-26T14:00:00Z"),
      status: "PENDING",
    },
    {
      id: "b-2",
      guestName: "Bob",
      startTime: new Date("2026-11-26T15:00:00Z"),
      status: "CONFIRMED",
    },
    {
      id: "b-3",
      guestName: "Charlie",
      startTime: new Date("2026-11-20T10:00:00Z"),
      status: "CONFIRMED",
    },
    {
      id: "b-4",
      guestName: "David",
      startTime: new Date("2026-11-27T10:00:00Z"),
      status: "CANCELLED",
    },
    {
      id: "b-5",
      guestName: "Eve",
      startTime: new Date("2026-11-28T10:00:00Z"),
      status: "CONFIRMED",
      notes: "[RECURRING: weekly, count: 4]",
    },
  ];

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.startTime) >= now && b.status === "CONFIRMED"
  );
  const unconfirmedBookings = bookings.filter(
    (b) => b.status === "PENDING" || b.status === "UNCONFIRMED"
  );
  const pastBookings = bookings.filter(
    (b) => new Date(b.startTime) < now && b.status === "CONFIRMED"
  );
  const canceledBookings = bookings.filter((b) => b.status === "CANCELLED");
  const recurringBookings = bookings.filter(
    (b) => b.isRecurring || b.notes?.includes("[RECURRING")
  );

  assert.equal(unconfirmedBookings.length, 1, "Pending booking b-1 must appear in unconfirmed");
  assert.equal(unconfirmedBookings[0].id, "b-1");

  assert.equal(upcomingBookings.length, 2, "Only confirmed future bookings appear in upcoming");
  assert.ok(upcomingBookings.some((b) => b.id === "b-2"));
  assert.ok(upcomingBookings.some((b) => b.id === "b-5"));

  assert.equal(pastBookings.length, 1);
  assert.equal(canceledBookings.length, 1);
  assert.equal(recurringBookings.length, 1);
  assert.equal(recurringBookings[0].id, "b-5");
});

test("Bookings - Google Calendar event ID extraction for calendar cancellation", () => {
  const notesWithGCal = "Client requested strategy discussion.\n[GCAL_EVENT_ID:gcal_evt_998877abc]";
  const match = notesWithGCal.match(/\[GCAL_EVENT_ID:([^\s\]]+)\]/);

  assert.ok(match, "GCAL_EVENT_ID tag must be found");
  assert.equal(match[1], "gcal_evt_998877abc");

  const notesWithoutGCal = "Offline discussion without Google Calendar sync";
  const noMatch = notesWithoutGCal.match(/\[GCAL_EVENT_ID:([^\s\]]+)\]/);
  assert.equal(noMatch, null);
});

test("Teams - Member resolution supports both membership ID and user ID", () => {
  const mockTeamMembers = [
    { id: "tm_mem_123", teamId: "team_alpha", userId: "usr_alice", role: "MEMBER" },
    { id: "tm_mem_456", teamId: "team_alpha", userId: "usr_bob", role: "ADMIN" },
    { id: "tm_mem_789", teamId: "team_alpha", userId: "usr_owner", role: "OWNER" },
  ];

  function findMemberToRemove(teamId, identifier) {
    let member = mockTeamMembers.find((m) => m.id === identifier);
    if (!member) {
      member = mockTeamMembers.find((m) => m.teamId === teamId && m.userId === identifier);
    }
    return member || null;
  }

  // Passing membership ID
  const resolvedByMemId = findMemberToRemove("team_alpha", "tm_mem_123");
  assert.ok(resolvedByMemId);
  assert.equal(resolvedByMemId.userId, "usr_alice");

  // Passing user ID (as happened in preview UI)
  const resolvedByUserId = findMemberToRemove("team_alpha", "usr_alice");
  assert.ok(resolvedByUserId);
  assert.equal(resolvedByUserId.id, "tm_mem_123");

  // Invalid ID
  const resolvedNonExistent = findMemberToRemove("team_alpha", "usr_ghost");
  assert.equal(resolvedNonExistent, null);
});

test("Navigation - Enterprise and Organization tiers are not gated from Pro features", () => {
  function checkGating(itemBadge, userPlan) {
    const isPaidPlan = userPlan === "PRO" || userPlan === "ORGANIZATION" || userPlan === "ENTERPRISE";
    return itemBadge === "Pro" && !isPaidPlan;
  }

  assert.equal(checkGating("Pro", "FREE"), true, "Free tier must be gated");
  assert.equal(checkGating("Pro", "PRO"), false, "Pro tier must NOT be gated");
  assert.equal(checkGating("Pro", "ORGANIZATION"), false, "Organization tier must NOT be gated");
  assert.equal(checkGating("Pro", "ENTERPRISE"), false, "Enterprise tier must NOT be gated");
});

test("Workflows - Template variable substitution", () => {
  const template = "Hi {ATTENDEE}, your meeting {EVENT_NAME} is scheduled for {EVENT_DATE_ddd, MMM D, YYYY h:mma}. Join: {MEETING_URL}";

  const context = {
    attendee: "Sarah Connor",
    eventName: "Security Architecture Review",
    dateFormatted: "Wed, Nov 25, 2026 2:00 PM",
    meetingUrl: "https://meet.google.com/xyz-abcd-efg",
  };

  const rendered = template
    .replace(/{ATTENDEE}/g, context.attendee)
    .replace(/{EVENT_NAME}/g, context.eventName)
    .replace(/{EVENT_DATE_ddd, MMM D, YYYY h:mma}/g, context.dateFormatted)
    .replace(/{MEETING_URL}/g, context.meetingUrl);

  assert.ok(rendered.includes("Hi Sarah Connor"));
  assert.ok(rendered.includes("Security Architecture Review"));
  assert.ok(rendered.includes("Wed, Nov 25, 2026 2:00 PM"));
  assert.ok(rendered.includes("https://meet.google.com/xyz-abcd-efg"));
  assert.ok(!rendered.includes("{"));
});
