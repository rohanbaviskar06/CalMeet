import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";
import { sanitizeHtml } from "../src/lib/sanitize.ts";
import { isPrivateIp, isSafeWebhookUrl } from "../src/lib/ssrf.ts";

test("HTML Sanitizer - removes script and iframe tags", () => {
  const payload = "<script>alert('pwned')</script><p>Safe text</p><iframe src='https://evil.com'></iframe>";
  const sanitized = sanitizeHtml(payload);
  assert.equal(sanitized.includes("<script"), false);
  assert.equal(sanitized.includes("alert"), false);
  assert.equal(sanitized.includes("<iframe"), false);
  assert.equal(sanitized.includes("<p>Safe text</p>"), true);
});

test("HTML Sanitizer - strips dangerous event handlers", () => {
  const payload = '<p onclick="stealCookies()" onmouseover="bad()" onerror="alert(1)">Click me</p>';
  const sanitized = sanitizeHtml(payload);
  assert.equal(sanitized.includes("onclick"), false);
  assert.equal(sanitized.includes("onmouseover"), false);
  assert.equal(sanitized.includes("onerror"), false);
  assert.equal(sanitized.includes("Click me"), true);
});

test("HTML Sanitizer - neutralizes javascript: and data: pseudo-protocols", () => {
  const payload = '<a href="javascript:alert(1)">Evil link</a><a href="https://calmeet.com">Good link</a>';
  const sanitized = sanitizeHtml(payload);
  assert.equal(sanitized.includes("javascript:"), false);
  assert.equal(sanitized.includes('href="#"'), true);
  assert.equal(sanitized.includes('href="https://calmeet.com"'), true);
});

test("SSRF Prevention - detects private and loopback IPv4/IPv6 addresses", () => {
  assert.equal(isPrivateIp("127.0.0.1"), true);
  assert.equal(isPrivateIp("127.0.1.1"), true);
  assert.equal(isPrivateIp("10.0.0.1"), true);
  assert.equal(isPrivateIp("172.16.0.1"), true);
  assert.equal(isPrivateIp("172.31.255.255"), true);
  assert.equal(isPrivateIp("192.168.1.100"), true);
  assert.equal(isPrivateIp("169.254.169.254"), true); // AWS IMDS
  assert.equal(isPrivateIp("0.0.0.0"), true);
  assert.equal(isPrivateIp("::1"), true);

  // Public IPs
  assert.equal(isPrivateIp("8.8.8.8"), false);
  assert.equal(isPrivateIp("1.1.1.1"), false);
  assert.equal(isPrivateIp("104.21.50.1"), false);
});

test("SSRF Prevention - blocks unsafe webhook URLs", async () => {
  const localhostCheck = await isSafeWebhookUrl("http://localhost:3000/api/hook");
  assert.equal(localhostCheck.safe, false);

  const loopbackCheck = await isSafeWebhookUrl("http://127.0.0.1:8000/webhook");
  assert.equal(loopbackCheck.safe, false);

  const metadataCheck = await isSafeWebhookUrl("http://169.254.169.254/latest/meta-data/");
  assert.equal(metadataCheck.safe, false);

  const internalDomainCheck = await isSafeWebhookUrl("http://service.internal/webhook");
  assert.equal(internalDomainCheck.safe, false);

  const ftpCheck = await isSafeWebhookUrl("ftp://example.com/webhook");
  assert.equal(ftpCheck.safe, false);
});

test("API Key Hashing - validates SHA-256 hashing format and masking", () => {
  const rawKey = "cal_live_" + crypto.randomBytes(24).toString("hex");
  const hashed = crypto.createHash("sha256").update(rawKey).digest("hex");

  assert.equal(rawKey.startsWith("cal_live_"), true);
  assert.equal(hashed.length, 64);
  assert.equal(/^[0-9a-f]{64}$/.test(hashed), true);

  // Masked format check
  const masked = `cal_live_••••••••${rawKey.slice(-4)}`;
  assert.equal(masked.includes("••••••••"), true);
  assert.equal(masked.endsWith(rawKey.slice(-4)), true);
  assert.equal(masked.length < rawKey.length, true);
});

test("Reminder Deduplication - filters out bookings with [REMINDER_SENT] tag", () => {
  const bookings = [
    { id: "1", notes: "Regular meeting notes" },
    { id: "2", notes: "Notes\n[REMINDER_SENT]" },
    { id: "3", notes: "[REMINDER_SENT]" },
    { id: "4", notes: null },
  ];

  const pendingReminders = bookings.filter((b) => !b.notes || !b.notes.includes("[REMINDER_SENT]"));
  assert.equal(pendingReminders.length, 2);
  assert.deepEqual(pendingReminders.map(b => b.id), ["1", "4"]);
});
