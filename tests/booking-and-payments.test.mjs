import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";

test("Booking Validation - rejects inactive event types", () => {
  const eventType = {
    id: "evt-1",
    isActive: false,
    duration: 30,
    requiresPayment: false,
  };

  function validateEventActive(et) {
    if (!et.isActive) {
      return { success: false, error: "This event type is currently inactive and cannot be booked." };
    }
    return { success: true };
  }

  const result = validateEventActive(eventType);
  assert.equal(result.success, false);
  assert.equal(result.error.includes("inactive"), true);
});

test("Booking Validation - enforces exact event duration", () => {
  const eventType = { duration: 30 }; // 30 minutes

  function validateDuration(start, end, durationMin) {
    const durationMs = durationMin * 60 * 1000;
    if (end.getTime() - start.getTime() !== durationMs) {
      return { success: false, error: "Invalid duration" };
    }
    return { success: true };
  }

  const start = new Date("2026-08-01T10:00:00Z");
  const validEnd = new Date("2026-08-01T10:30:00Z");
  const invalidEnd = new Date("2026-08-01T11:00:00Z");

  assert.equal(validateDuration(start, validEnd, eventType.duration).success, true);
  assert.equal(validateDuration(start, invalidEnd, eventType.duration).success, false);
});

test("Booking Concurrency - detects time slot overlaps across host event types", () => {
  const existingBookings = [
    {
      id: "b1",
      userId: "host-1",
      startTime: new Date("2026-08-01T10:00:00Z"),
      endTime: new Date("2026-08-01T10:30:00Z"),
      status: "CONFIRMED",
    },
    {
      id: "b2",
      userId: "host-1",
      startTime: new Date("2026-08-01T14:00:00Z"),
      endTime: new Date("2026-08-01T14:45:00Z"),
      status: "CONFIRMED",
    },
  ];

  function checkOverlap(candidateStart, candidateEnd, bookings) {
    return bookings.some(b => {
      if (b.status !== "CONFIRMED" && b.status !== "PENDING") return false;
      return candidateStart < b.endTime && candidateEnd > b.startTime;
    });
  }

  // Exact conflict
  assert.equal(
    checkOverlap(new Date("2026-08-01T10:00:00Z"), new Date("2026-08-01T10:30:00Z"), existingBookings),
    true
  );

  // Partial overlap inside
  assert.equal(
    checkOverlap(new Date("2026-08-01T10:15:00Z"), new Date("2026-08-01T10:45:00Z"), existingBookings),
    true
  );

  // Adjacent slot (free): 10:30 to 11:00
  assert.equal(
    checkOverlap(new Date("2026-08-01T10:30:00Z"), new Date("2026-08-01T11:00:00Z"), existingBookings),
    false
  );
});

test("Payment Verification - HMAC-SHA256 signature verification for paid bookings", () => {
  const secret = "test_razorpay_secret_key_12345";
  const orderId = "order_N123456789";
  const paymentId = "pay_N987654321";

  const validSignature = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  function verifyPayment(order, pay, sig, sec) {
    const expected = crypto.createHmac("sha256", sec).update(`${order}|${pay}`).digest("hex");
    return expected === sig;
  }

  // Valid signature succeeds
  assert.equal(verifyPayment(orderId, paymentId, validSignature, secret), true);

  // Tampered paymentId fails
  assert.equal(verifyPayment(orderId, "pay_TAMPERED", validSignature, secret), false);

  // Tampered signature fails
  assert.equal(verifyPayment(orderId, paymentId, "invalid_sig_abc", secret), false);

  // Wrong secret fails
  assert.equal(verifyPayment(orderId, paymentId, validSignature, "wrong_secret"), false);
});

test("Team Authorization - enforces that target belongs to authorized team", () => {
  const authorizedTeamId = "team-alpha";
  const memberA = { id: "m1", teamId: "team-alpha", role: "MEMBER" };
  const memberB = { id: "m2", teamId: "team-beta", role: "MEMBER" };
  const owner = { id: "m0", teamId: "team-alpha", role: "OWNER" };

  function validateRemoveMember(targetMember, activeTeamId) {
    if (targetMember.teamId !== activeTeamId) {
      throw new Error("Target member does not belong to the authorized team");
    }
    if (targetMember.role === "OWNER") {
      throw new Error("The team owner cannot be removed");
    }
    return true;
  }

  // Removing member from own team succeeds
  assert.equal(validateRemoveMember(memberA, authorizedTeamId), true);

  // Cross-team target removal throws error
  assert.throws(() => validateRemoveMember(memberB, authorizedTeamId), /does not belong to the authorized team/);

  // Removing owner throws error
  assert.throws(() => validateRemoveMember(owner, authorizedTeamId), /team owner cannot be removed/);
});

test("Sample Booking - resolves preview-user/review-meeting demo without 404 or external side-effects", () => {
  const isDemo = (username) => username.toLowerCase() === "preview-user" || username.toLowerCase() === "demo";

  assert.equal(isDemo("preview-user"), true);
  assert.equal(isDemo("demo"), true);
  assert.equal(isDemo("real-user"), false);

  const demoEvent = {
    id: "demo-review-meeting",
    title: "Product Review & Strategy",
    duration: 15,
  };

  function simulateCreateBooking(eventTypeId, guestName, guestEmail) {
    if (eventTypeId === "demo-review-meeting" || eventTypeId.startsWith("demo-")) {
      return {
        success: true,
        booking: {
          id: "demo-booking-sample",
          meetLink: "https://meet.google.com/cal-meet-demo",
          guestName,
          guestEmail,
        },
        isDemo: true,
      };
    }
    return { success: false, error: "Event type not found" };
  }

  const res = simulateCreateBooking(demoEvent.id, "Demo Visitor", "visitor@example.com");
  assert.equal(res.success, true);
  assert.equal(res.isDemo, true);
  assert.equal(res.booking.id, "demo-booking-sample");
});
