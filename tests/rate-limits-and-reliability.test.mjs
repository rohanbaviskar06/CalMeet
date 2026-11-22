import test from "node:test";
import assert from "node:assert/strict";
import { rateLimiter, RATE_LIMIT_PRESETS } from "../src/lib/rate-limit.ts";
import { captureError, getRecentIncidents } from "../src/lib/monitoring.ts";

test("Rate Limiter - enforces max requests within window", () => {
  const testKey = "test_user_rate_limit";
  rateLimiter.reset(testKey);

  // Allow up to 3 requests in a 1000ms window
  const max = 3;
  const windowMs = 1000;

  const res1 = rateLimiter.check(testKey, max, windowMs);
  assert.equal(res1.success, true);
  assert.equal(res1.remaining, 2);

  const res2 = rateLimiter.check(testKey, max, windowMs);
  assert.equal(res2.success, true);
  assert.equal(res2.remaining, 1);

  const res3 = rateLimiter.check(testKey, max, windowMs);
  assert.equal(res3.success, true);
  assert.equal(res3.remaining, 0);

  // 4th request should be blocked
  const res4 = rateLimiter.check(testKey, max, windowMs);
  assert.equal(res4.success, false);
  assert.equal(res4.remaining, 0);
  assert.ok(res4.retryAfter > 0);

  // Reset should unblock
  rateLimiter.reset(testKey);
  const res5 = rateLimiter.check(testKey, max, windowMs);
  assert.equal(res5.success, true);
});

test("Rate Limiter - standard presets verification", () => {
  assert.equal(RATE_LIMIT_PRESETS.AUTH.maxRequests, 5);
  assert.equal(RATE_LIMIT_PRESETS.BOOKING.maxRequests, 15);
  assert.equal(RATE_LIMIT_PRESETS.API.maxRequests, 60);
});

test("Monitoring & Error Alerting - captures incident and buffers for diagnostics", async () => {
  const error = new Error("Database query timeout during payment confirmation");
  const report = await captureError(error, { userId: "usr_123", route: "/api/bookings" }, "ERROR");

  assert.ok(report.id.startsWith("inc_"));
  assert.equal(report.severity, "ERROR");
  assert.equal(report.message, "Database query timeout during payment confirmation");
  assert.equal(report.userId, "usr_123");

  const incidents = getRecentIncidents(5);
  const found = incidents.find((inc) => inc.id === report.id);
  assert.ok(found);
  assert.equal(found.message, report.message);
});
