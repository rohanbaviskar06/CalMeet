export type AuditAction =
  | "USER_LOGIN"
  | "USER_PLAN_UPGRADED"
  | "USER_PLAN_CANCELLED"
  | "TEAM_CREATED"
  | "TEAM_MEMBER_INVITED"
  | "TEAM_MEMBER_REMOVED"
  | "TEAM_ROLE_CHANGED"
  | "BOOKING_CREATED"
  | "BOOKING_RESCHEDULED"
  | "BOOKING_CANCELLED"
  | "API_KEY_CREATED"
  | "WEBHOOK_CREATED";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: AuditAction;
  actorId: string;
  actorEmail?: string;
  targetId?: string;
  teamId?: string;
  details?: Record<string, any>;
  ip?: string;
}

const auditLogStore: AuditLogEntry[] = [];
const MAX_AUDIT_LOGS = 500;

export function recordAuditLog(entry: Omit<AuditLogEntry, "id" | "timestamp">): AuditLogEntry {
  const log: AuditLogEntry = {
    id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };

  auditLogStore.unshift(log);
  if (auditLogStore.length > MAX_AUDIT_LOGS) {
    auditLogStore.pop();
  }

  console.log(`[AUDIT:${log.action}] Actor: ${log.actorEmail || log.actorId}`, {
    target: log.targetId,
    team: log.teamId,
    details: log.details,
  });

  return log;
}

export function getAuditLogs(filters?: { teamId?: string; actorId?: string; limit?: number }): AuditLogEntry[] {
  let logs = auditLogStore;

  if (filters?.teamId) {
    logs = logs.filter((l) => l.teamId === filters.teamId);
  }
  if (filters?.actorId) {
    logs = logs.filter((l) => l.actorId === filters.actorId);
  }

  return logs.slice(0, filters?.limit || 50);
}
