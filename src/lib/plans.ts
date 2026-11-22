/**
 * CalMeet Plan Definitions & Limits
 * 
 * Defines feature gates and usage limits across tiers:
 * FREE, PRO, ORGANIZATION, ENTERPRISE.
 */

export type PlanTier = "FREE" | "PRO" | "ORGANIZATION" | "ENTERPRISE";

export interface PlanLimits {
  name: string;
  maxActiveEventTypes: number;
  maxTeams: number;
  maxTeamMembersPerTeam: number;
  allowPaidBookings: boolean;
  allowCustomBranding: boolean; // Hide watermark
  allowWebhooks: boolean;
  allowRoundRobin: boolean;
  allowAuditLogs: boolean;
  analyticsRetentionDays: number;
  priceMonthlyINR: number;
  priceMonthlyUSD: number;
}

export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  FREE: {
    name: "Free",
    maxActiveEventTypes: 1,
    maxTeams: 0,
    maxTeamMembersPerTeam: 1,
    allowPaidBookings: false,
    allowCustomBranding: false,
    allowWebhooks: false,
    allowRoundRobin: false,
    allowAuditLogs: false,
    analyticsRetentionDays: 30,
    priceMonthlyINR: 0,
    priceMonthlyUSD: 0,
  },
  PRO: {
    name: "Pro",
    maxActiveEventTypes: 9999, // Unlimited
    maxTeams: 1,
    maxTeamMembersPerTeam: 5,
    allowPaidBookings: true,
    allowCustomBranding: true,
    allowWebhooks: true,
    allowRoundRobin: false,
    allowAuditLogs: false,
    analyticsRetentionDays: 365,
    priceMonthlyINR: 999,
    priceMonthlyUSD: 12,
  },
  ORGANIZATION: {
    name: "Organization",
    maxActiveEventTypes: 9999,
    maxTeams: 5,
    maxTeamMembersPerTeam: 25,
    allowPaidBookings: true,
    allowCustomBranding: true,
    allowWebhooks: true,
    allowRoundRobin: true,
    allowAuditLogs: true,
    analyticsRetentionDays: 730,
    priceMonthlyINR: 2999,
    priceMonthlyUSD: 39,
  },
  ENTERPRISE: {
    name: "Enterprise",
    maxActiveEventTypes: 9999,
    maxTeams: 9999,
    maxTeamMembersPerTeam: 9999,
    allowPaidBookings: true,
    allowCustomBranding: true,
    allowWebhooks: true,
    allowRoundRobin: true,
    allowAuditLogs: true,
    analyticsRetentionDays: 9999,
    priceMonthlyINR: 9999,
    priceMonthlyUSD: 129,
  },
};

export function getPlanLimits(plan: string | null | undefined): PlanLimits {
  const tier = (plan?.toUpperCase() || "FREE") as PlanTier;
  return PLAN_LIMITS[tier] || PLAN_LIMITS.FREE;
}
