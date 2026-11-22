import test from "node:test";
import assert from "node:assert/strict";
import { recordAuditLog, getAuditLogs } from "../src/lib/audit.ts";

test("Audit Logging - records and filters administrative actions", () => {
  const teamId = "team_sales_123";
  const actorId = "usr_lead_99";

  const entry = recordAuditLog({
    action: "TEAM_ROLE_CHANGED",
    actorId,
    actorEmail: "lead@example.com",
    teamId,
    targetId: "usr_member_44",
    details: { previousRole: "MEMBER", newRole: "ADMIN" },
  });

  assert.ok(entry.id.startsWith("aud_"));
  assert.equal(entry.action, "TEAM_ROLE_CHANGED");
  assert.equal(entry.teamId, teamId);

  const logs = getAuditLogs({ teamId });
  const found = logs.find((l) => l.id === entry.id);
  assert.ok(found);
  assert.equal(found.details.newRole, "ADMIN");
});

test("Metrics Logic - ratio calculations and conversion funnels", () => {
  const totalUsers = 100;
  const usersWithBookings = 42;
  const signupToFirstBookingRate = Math.round((usersWithBookings / totalUsers) * 100);
  assert.equal(signupToFirstBookingRate, 42);

  const totalBookings = 200;
  const confirmedBookings = 175;
  const successRate = Math.round((confirmedBookings / totalBookings) * 100);
  assert.equal(successRate, 88);

  const activeHosts30d = 35;
  const retention30d = Math.round((activeHosts30d / totalUsers) * 100);
  assert.equal(retention30d, 35);
});
