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

export async function submitSupportTicket(data: SupportTicketInput) {
  if (!data.name || !data.email || !data.subject || !data.message) {
    return { success: false, error: "Please fill out all required fields." };
  }

  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const ticketId = `TICK-${Date.now().toString(36).toUpperCase()}`;
  const deliveryChannels: string[] = [];

  // 1. Notify Admin via in-app notification if admin exists
  try {
    const adminUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: process.env.ADMIN_EMAIL || "admin@calmeet.app" },
          { email: { in: (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim()).filter(Boolean) } },
        ],
      },
    });

    if (adminUser) {
      const { createNotificationInternal } = await import("@/app/actions/notifications");
      await createNotificationInternal(
        adminUser.id,
        `Support Ticket: ${data.subject}`,
        `[${data.priority}] ${data.name} (${data.email}): ${data.message.substring(0, 100)}...`,
        "BOOKING_CREATED",
        `/admin`
      );
      deliveryChannels.push(`in_app_notification:${adminUser.email}`);
    }
  } catch (err) {
    console.error("[SUPPORT] In-app admin notification failed:", err);
  }

  // 2. Dispatch email to support team inbox
  const teamEmail = process.env.SUPPORT_EMAIL || process.env.ADMIN_EMAIL || process.env.SMTP_USER || "support@calmeet.app";
  try {
    const emailResult = await sendEmail({
      to: teamEmail,
      subject: `[SUPPORT-${data.priority}] ${data.subject} (${ticketId})`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e4e4e7;border-radius:12px;background:#ffffff;">
          <div style="background:#18181b;color:#ffffff;padding:16px 20px;border-radius:8px;margin-bottom:16px;">
            <h2 style="margin:0;font-size:18px;">Support Request: ${ticketId}</h2>
            <p style="margin:4px 0 0 0;font-size:12px;color:#a1a1aa;">Priority: ${data.priority} | Category: ${data.category}</p>
          </div>
          <table cellpadding="6" cellspacing="0" border="0" style="font-size:13px;color:#27272a;width:100%;">
            <tr><td style="color:#71717a;width:100px;">From:</td><td><strong>${data.name}</strong> (&lt;<a href="mailto:${data.email}">${data.email}</a>&gt;)</td></tr>
            <tr><td style="color:#71717a;">User ID:</td><td>${userId || "Guest / Unauthenticated"}</td></tr>
            <tr><td style="color:#71717a;">Subject:</td><td><strong>${data.subject}</strong></td></tr>
          </table>
          <hr style="border:0;border-top:1px solid #e4e4e7;margin:16px 0;" />
          <div style="font-size:13px;line-height:1.6;color:#18181b;background:#f4f4f5;padding:16px;border-radius:8px;white-space:pre-wrap;">
${data.message}
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

  const saved = saveSupportTicketToDisk(ticketRecord);
  if (!saved) {
    console.error(`[SUPPORT] Ticket ${ticketId} failed to persist to disk.`);
    return {
      success: false,
      error: "Failed to persist support record. Please try again or reach out to support@calmeet.app.",
    };
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
  return getAllSupportTickets();
}
