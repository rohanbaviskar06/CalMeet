"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { captureError } from "@/lib/monitoring";
import { sendEmail } from "@/lib/resend";
import { saveSupportTicketToDisk, getAllSupportTickets, StoredSupportTicket } from "@/lib/support-store";
import { verifyAdmin } from "@/app/actions/admin";

export interface SupportTicketInput {
  name: string;
  email: string;
  category: "BOOKING" | "BILLING" | "INTEGRATIONS" | "TEAMS" | "BUG" | "OTHER";
  priority: "LOW" | "NORMAL" | "URGENT";
  subject: string;
  message: string;
}

/**
 * Escapes raw user strings to prevent HTML injection and XSS in outbound notification emails.
 */
function escapeHtml(str: string): string {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function submitSupportTicket(data: SupportTicketInput) {
  if (!data.name || !data.email || !data.subject || !data.message) {
    return { success: false, error: "Please fill out all required fields." };
  }

  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const ticketId = `TICK-${Date.now().toString(36).toUpperCase()}`;
  const deliveryChannels: string[] = [];

  // Find admin user for notification and durable storage ownership
  let adminUser: { id: string; email: string | null } | null = null;
  try {
    adminUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: process.env.ADMIN_EMAIL || "admin@calmeet.app" },
          { email: { in: (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim()).filter(Boolean) } },
        ],
      },
      select: { id: true, email: true },
    });
  } catch (findErr) {
    console.warn("[SUPPORT] Could not query admin user:", findErr);
  }

  // 1. Notify Admin via in-app notification if admin exists
  if (adminUser) {
    try {
      const { createNotificationInternal } = await import("@/app/actions/notifications");
      await createNotificationInternal(
        adminUser.id,
        `Support Ticket: ${data.subject}`,
        `[${data.priority}] ${data.name} (${data.email}): ${data.message.substring(0, 100)}...`,
        "BOOKING_CREATED",
        `/admin`
      );
      deliveryChannels.push(`in_app_notification:${adminUser.email || "admin"}`);
    } catch (err) {
      console.error("[SUPPORT] In-app admin notification failed:", err);
    }
  }

  // 2. Dispatch email to support team inbox with sanitized HTML contents
  const teamEmail = process.env.SUPPORT_EMAIL || process.env.ADMIN_EMAIL || process.env.SMTP_USER || "support@calmeet.app";
  try {
    const safeName = escapeHtml(data.name);
    const safeEmail = escapeHtml(data.email);
    const safeSubject = escapeHtml(data.subject);
    const safePriority = escapeHtml(data.priority);
    const safeCategory = escapeHtml(data.category);
    const safeMessage = escapeHtml(data.message);
    const safeUserId = escapeHtml(userId || "Guest / Unauthenticated");

    const emailResult = await sendEmail({
      to: teamEmail,
      subject: `[SUPPORT-${safePriority}] ${safeSubject} (${ticketId})`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e4e4e7;border-radius:12px;background:#ffffff;">
          <div style="background:#18181b;color:#ffffff;padding:16px 20px;border-radius:8px;margin-bottom:16px;">
            <h2 style="margin:0;font-size:18px;">Support Request: ${ticketId}</h2>
            <p style="margin:4px 0 0 0;font-size:12px;color:#a1a1aa;">Priority: ${safePriority} | Category: ${safeCategory}</p>
          </div>
          <table cellpadding="6" cellspacing="0" border="0" style="font-size:13px;color:#27272a;width:100%;">
            <tr><td style="color:#71717a;width:100px;">From:</td><td><strong>${safeName}</strong> (&lt;<a href="mailto:${safeEmail}">${safeEmail}</a>&gt;)</td></tr>
            <tr><td style="color:#71717a;">User ID:</td><td>${safeUserId}</td></tr>
            <tr><td style="color:#71717a;">Subject:</td><td><strong>${safeSubject}</strong></td></tr>
          </table>
          <hr style="border:0;border-top:1px solid #e4e4e7;margin:16px 0;" />
          <div style="font-size:13px;line-height:1.6;color:#18181b;background:#f4f4f5;padding:16px;border-radius:8px;white-space:pre-wrap;">
${safeMessage}
          </div>
          <p style="margin-top:16px;font-size:11px;color:#a1a1aa;">CalMeet Ticket Routing System</p>
        </div>
      `,
      fromName: `CalMeet Support (${data.name})`,
    });

    if (emailResult && !emailResult.error) {
      deliveryChannels.push(`email:${teamEmail}`);
    }
  } catch (emailErr) {
    console.error("[SUPPORT] Team email dispatch failed:", emailErr);
  }

  // 3. If priority is URGENT, log to monitoring
  if (data.priority === "URGENT") {
    await captureError(new Error(`URGENT Support Ticket: ${data.subject}`), {
      ticketId,
      email: data.email,
      category: data.category,
      message: data.message,
    }, "WARN");
    deliveryChannels.push("monitoring_alert");
  }

  // Ensure request reached the team before confirming success
  const deliveredToTeam = deliveryChannels.length > 0;
  if (!deliveredToTeam) {
    console.error(`[SUPPORT] Ticket ${ticketId} failed to reach team via any channel.`);
    return {
      success: false,
      error: "Unable to reach the support engineering team at this moment. Please email support@calmeet.app directly or try again shortly.",
    };
  }

  // 4. Save ticket to persistent store
  const ticketRecord: StoredSupportTicket = {
    id: ticketId,
    createdAt: new Date().toISOString(),
    name: data.name,
    email: data.email,
    category: data.category,
    priority: data.priority,
    subject: data.subject,
    message: data.message,
    userId,
    status: "OPEN",
    deliveredToTeam,
    deliveryChannels,
  };

  // 4a. Persist to Disk backup
  saveSupportTicketToDisk(ticketRecord);

  // 4b. Persist to PostgreSQL database for resilient durability
  try {
    const targetUserId = userId || adminUser?.id;
    if (targetUserId) {
      await prisma.integration.create({
        data: {
          userId: targetUserId,
          type: "support_ticket",
          credentials: JSON.stringify(ticketRecord),
        },
      });
    }
  } catch (dbErr) {
    console.warn("[SUPPORT] Failed to write ticket to database:", dbErr);
  }

  console.log(`[SUPPORT] Ticket ${ticketId} successfully saved and reached team via ${deliveryChannels.join(", ")}`);

  return {
    success: true,
    ticketId,
    message: "Your support request has been received by our engineering team. We will respond within 24 hours.",
  };
}

export async function getSupportTickets() {
  await verifyAdmin();
  const diskTickets = getAllSupportTickets();

  try {
    const dbRecords = await prisma.integration.findMany({
      where: { type: "support_ticket" },
    });

    const dbTickets: StoredSupportTicket[] = [];
    for (const rec of dbRecords) {
      try {
        const parsed = typeof rec.credentials === "string" ? JSON.parse(rec.credentials) : rec.credentials;
        if (parsed && parsed.id) dbTickets.push(parsed);
      } catch {}
    }

    const combined = [...diskTickets];
    const seenIds = new Set(diskTickets.map((t) => t.id));
    for (const t of dbTickets) {
      if (!seenIds.has(t.id)) {
        seenIds.add(t.id);
        combined.push(t);
      }
    }

    return combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return diskTickets;
  }
}
