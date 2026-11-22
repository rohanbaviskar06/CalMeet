import test from "node:test";
import assert from "node:assert/strict";
import { getPlanLimits, PLAN_LIMITS } from "../src/lib/plans.ts";

test("Plan Limits - Free tier restrictions", () => {
  const freeLimits = getPlanLimits("FREE");
  assert.equal(freeLimits.maxActiveEventTypes, 1);
  assert.equal(freeLimits.maxTeams, 0);
  assert.equal(freeLimits.allowPaidBookings, false);
  assert.equal(freeLimits.allowCustomBranding, false);
  assert.equal(freeLimits.allowWebhooks, false);
});

test("Plan Limits - Pro tier permissions", () => {
  const proLimits = getPlanLimits("PRO");
  assert.ok(proLimits.maxActiveEventTypes >= 100);
  assert.equal(proLimits.maxTeams, 1);
  assert.equal(proLimits.allowPaidBookings, true);
  assert.equal(proLimits.allowCustomBranding, true);
  assert.equal(proLimits.allowWebhooks, true);
});

test("Plan Limits - Organization & Enterprise permissions", () => {
  const orgLimits = getPlanLimits("ORGANIZATION");
  assert.equal(orgLimits.maxTeams, 5);
  assert.equal(orgLimits.allowRoundRobin, true);
  assert.equal(orgLimits.allowAuditLogs, true);

  const entLimits = getPlanLimits("ENTERPRISE");
  assert.ok(entLimits.maxTeams >= 100);
  assert.equal(entLimits.allowRoundRobin, true);
  assert.equal(entLimits.allowAuditLogs, true);
});
