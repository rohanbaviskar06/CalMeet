/**
 * CalMeet Monitoring and Error Alerting Service
 * 
 * Captures exceptions, logs structured telemetry, and dispatches real-time alerts
 * to webhooks (Slack/Discord/PagerDuty) or admin emails when critical incidents occur.
 */

export type AlertSeverity = "INFO" | "WARN" | "ERROR" | "CRITICAL";

export interface ErrorReport {
  id: string;
  timestamp: string;
  severity: AlertSeverity;
  message: string;
  context?: Record<string, any>;
  stack?: string;
  userId?: string;
  url?: string;
}

// In-memory buffer of recent incidents for admin diagnostics
const recentIncidents: ErrorReport[] = [];
const MAX_INCIDENTS_BUFFER = 50;

/**
 * Capture an error with context and dispatch alerts for critical severity.
 */
export async function captureError(
  error: unknown,
  context?: Record<string, any>,
  severity: AlertSeverity = "ERROR"
): Promise<ErrorReport> {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  const incident: ErrorReport = {
    id: `inc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    severity,
    message: errorObj.message || "Unknown error",
    stack: errorObj.stack,
    context,
    userId: context?.userId,
    url: context?.url,
  };

  recentIncidents.unshift(incident);
  if (recentIncidents.length > MAX_INCIDENTS_BUFFER) {
    recentIncidents.pop();
  }

  // Structured console log
  console.error(`[MONITORING:${severity}] ${incident.message}`, {
    id: incident.id,
    timestamp: incident.timestamp,
    context: incident.context,
  });

  // Dispatch alert if CRITICAL or ERROR
  if (severity === "CRITICAL" || severity === "ERROR") {
    await dispatchAlert(incident).catch((err) => {
      console.error("[MONITORING] Failed to dispatch alert notification:", err);
    });
  }

  return incident;
}

/**
 * Dispatch error alert to webhook (Slack, Discord, Opsgenie) if configured.
 */
async function dispatchAlert(incident: ErrorReport): Promise<void> {
  const alertWebhookUrl = process.env.ALERT_WEBHOOK_URL;
  if (!alertWebhookUrl) return;

  try {
    const payload = {
      text: `🚨 *[CalMeet ${incident.severity}]* ${incident.message}`,
      attachments: [
        {
          color: incident.severity === "CRITICAL" ? "#ef4444" : "#f59e0b",
          fields: [
            { title: "Incident ID", value: incident.id, short: true },
            { title: "Timestamp", value: incident.timestamp, short: true },
            { title: "User ID", value: incident.userId || "Anonymous", short: true },
            { title: "Context", value: JSON.stringify(incident.context || {}), short: false },
          ],
        },
      ],
    };

    await fetch(alertWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });
  } catch (err) {
    console.error("[MONITORING] Error sending webhook alert:", err);
  }
}

/**
 * Retrieve recent incidents for admin dashboard review.
 */
export function getRecentIncidents(limit = 20): ErrorReport[] {
  return recentIncidents.slice(0, limit);
}
