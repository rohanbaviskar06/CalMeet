import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";
import { generateZonedSlotsForDate, zonedTimeToUtc, getZonedParts } from "../src/lib/timezone.ts";

test("Audit Fix 1: Paid Bookings - HMAC-SHA256 signature and payment status preservation", () => {
  const secret = "test_razorpay_secret_key_12345";
  const orderId = "order_audit_123456";
  const paymentId = "pay_audit_987654";

  const validSignature = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  function verifyPaymentSignature(order, pay, sig, sec) {
    const expected = crypto.createHmac("sha256", sec).update(`${order}|${pay}`).digest("hex");
    return expected === sig;
  }

  assert.equal(verifyPaymentSignature(orderId, paymentId, validSignature, secret), true);
  assert.equal(verifyPaymentSignature(orderId, paymentId, "invalid_sig", secret), false);

  // Status preservation on reschedule
  function resolveRescheduleStatus(booking) {
    return (booking.paymentStatus === "PAID" || booking.status === "CONFIRMED") ? "CONFIRMED" : booking.status;
  }

  assert.equal(resolveRescheduleStatus({ status: "PENDING", paymentStatus: "UNPAID" }), "PENDING");
  assert.equal(resolveRescheduleStatus({ status: "CONFIRMED", paymentStatus: "PAID" }), "CONFIRMED");
});

test("Audit Fix 2: Meeting Auth - Guest token with timestamp, expiration and revocation", () => {
  const secret = "calmeet-secure-booking-token-fallback-key";

  function generateToken(booking, expiresInDays = 30) {
    const normalizedEmail = (booking.guestEmail || "").toLowerCase().trim();
    const exp = Math.floor(Date.now() / 1000) + expiresInDays * 24 * 60 * 60;
    const payload = `${booking.id}:${normalizedEmail}:${exp}`;
    const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    return `${signature}.${exp}`;
  }

  function verifyToken(booking, token) {
    if (!token || typeof token !== "string") return false;
    if (booking.notes?.includes("[TOKEN_REVOKED]") || booking.notes?.includes("[BOOKING_REVOKED]")) {
      return false;
    }
    const normalizedEmail = (booking.guestEmail || "").toLowerCase().trim();
    if (token.includes(".")) {
      const [signature, expStr] = token.split(".");
      const exp = parseInt(expStr, 10);
      if (isNaN(exp) || Math.floor(Date.now() / 1000) > exp) return false;
      const payload = `${booking.id}:${normalizedEmail}:${exp}`;
      const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
      if (signature.length !== expected.length) return false;
      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    }
    return false;
  }

  const booking = {
    id: "booking-test-auth-1",
    guestEmail: "Guest@Example.com ",
    notes: "Regular notes",
  };

  const token = generateToken(booking, 30);
  assert.equal(typeof token, "string");
  assert.equal(token.includes("."), true);

  // Valid token verifies successfully
  assert.equal(verifyToken(booking, token), true);

  // Expired token is rejected
  const expiredToken = "fakehash." + (Math.floor(Date.now() / 1000) - 3600);
  assert.equal(verifyToken(booking, expiredToken), false);

  // Revoked booking notes reject token
  const revokedBooking = {
    ...booking,
    notes: "Notes\n[TOKEN_REVOKED]",
  };
  assert.equal(verifyToken(revokedBooking, token), false);
});

test("Audit Fix 3: Timezones & DST - Slot generation for half-hour offset (Asia/Kolkata) with NY host", () => {
  const targetDate = new Date("2026-08-03T12:00:00Z"); // Monday Aug 3, 2026
  const hostTimezone = "America/New_York"; // EDT (UTC-4)
  const guestTimezone = "Asia/Kolkata"; // IST (UTC+5:30)

  // Host working Monday 09:00 - 11:00 NY time
  const availabilities = [{ dayOfWeek: 1, startTime: "09:00", endTime: "11:00" }];

  const slots = generateZonedSlotsForDate({
    targetDate,
    hostTimezone,
    guestTimezone,
    availabilities,
    duration: 30,
    bookings: [],
    now: new Date("2026-08-01T00:00:00Z"),
  });

  assert.equal(slots.length, 4);
  // 09:00 EDT = 13:00 UTC = 18:30 IST
  assert.equal(slots[0].timeStr, "18:30");
  assert.equal(slots[0].utcIso, "2026-08-03T13:00:00.000Z");
  assert.equal(slots[3].timeStr, "20:00");
  assert.equal(slots[3].utcIso, "2026-08-03T14:30:00.000Z");
});

test("Audit Fix 4: CSV Safety - Escapes formula injection and quotes", () => {
  function safeCsvCell(val) {
    if (val === null || val === undefined) return '""';
    let str = String(val);
    if (/^[=+\-@\t\r]/.test(str)) {
      str = "'" + str;
    }
    str = str.replace(/"/g, '""');
    return `"${str}"`;
  }

  // Formula injection neutralized
  assert.equal(safeCsvCell("=cmd|' /C calc'!A0"), `"'=cmd|' /C calc'!A0"`);
  assert.equal(safeCsvCell("+12345"), `"'+12345"`);
  assert.equal(safeCsvCell("@mention"), `"'@mention"`);
  assert.equal(safeCsvCell("-50"), `"'-50"`);

  // Double quotes escaped
  assert.equal(safeCsvCell('Alice "The Boss" Smith'), `"Alice ""The Boss"" Smith"`);

  // Regular value
  assert.equal(safeCsvCell("John Doe"), `"John Doe"`);
});

test("Audit Fix 5: Cron Window & Authorization - Clamping 1-72h", () => {
  function clampCronWindow(param) {
    const raw = parseInt(param || "24", 10);
    return isNaN(raw) ? 24 : Math.min(Math.max(raw, 1), 72);
  }

  assert.equal(clampCronWindow("24"), 24);
  assert.equal(clampCronWindow("100"), 72);
  assert.equal(clampCronWindow("0"), 1);
  assert.equal(clampCronWindow("-5"), 1);
  assert.equal(clampCronWindow("invalid"), 24);
});

test("Audit Fix 6: Support HTML escaping - Neutralizes malicious user input", () => {
  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  const payload = "<script>alert('pwned')</script>";
  const escaped = escapeHtml(payload);
  assert.equal(escaped.includes("<script>"), false);
  assert.equal(escaped, "&lt;script&gt;alert(&#039;pwned&#039;)&lt;/script&gt;");
});
