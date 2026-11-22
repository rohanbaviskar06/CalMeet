"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { captureError } from "@/lib/monitoring";

export interface SupportTicketInput {
  name: string;
  email: string;
  category: "BOOKING" | "BILLING" | "INTEGRATIONS" | "TEAMS" | "BUG" | "OTHER";
  priority: "LOW" | "NORMAL" | "URGENT";
  subject: string;
  message: string;
}

export async function submitSupportTicket(data: SupportTicketInput) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const ticketId = `TICK-${Date.now().toString(36).toUpperCase()}`;

  console.log(`[SUPPORT] New ticket ${ticketId} created by ${data.email}: ${data.subject}`, {
    category: data.category,
    priority: data.priority,
    userId,
  });

  // Notify admin users
  try {
    const adminUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: process.env.ADMIN_EMAIL || "admin@calmeet.app" },
          { email: { in: (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim()) } },
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
    }
  } catch (err) {
    console.error("[SUPPORT] Failed to notify admin:", err);
  }

  // If urgent, log to monitoring
  if (data.priority === "URGENT") {
    await captureError(new Error(`URGENT Support Ticket: ${data.subject}`), {
      ticketId,
      email: data.email,
      category: data.category,
      message: data.message,
    }, "WARN");
  }

  return {
    success: true,
    ticketId,
    message: "Thank you for reaching out. Our support engineering team will respond within 24 hours.",
  };
}
