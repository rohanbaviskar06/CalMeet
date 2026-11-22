"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createWorkflow(data: {
  name: string;
  trigger: string;
  action: string;
  isPremium: boolean;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  const workflow = await prisma.workflow.create({
    data: {
      userId,
      name: data.name,
      trigger: data.trigger,
      action: data.action,
      isActive: true,
      isPremium: data.isPremium,
    }
  });

  revalidatePath("/dashboard/workflows");
  return workflow;
}

export async function toggleWorkflowStatus(id: string, currentStatus: boolean) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  await prisma.workflow.update({
    where: { id, userId },
    data: { isActive: !currentStatus }
  });

  revalidatePath("/dashboard/workflows");
}

export async function deleteWorkflow(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  await prisma.workflow.delete({
    where: { id, userId }
  });

  revalidatePath("/dashboard/workflows");
}

export async function updateWorkflow(id: string, data: {
  name: string;
  trigger: string;
  action: string;
  isPremium: boolean;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  await prisma.workflow.update({
    where: { id, userId },
    data: {
      name: data.name,
      trigger: data.trigger,
      action: data.action,
      isPremium: data.isPremium,
    }
  });

  revalidatePath("/dashboard/workflows");
}

export async function duplicateWorkflow(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  const original = await prisma.workflow.findUnique({
    where: { id, userId }
  });

  if (!original) throw new Error("Workflow not found");

  const workflow = await prisma.workflow.create({
    data: {
      userId,
      name: `${original.name} (Copy)`,
      trigger: original.trigger,
      action: original.action,
      isActive: true,
      isPremium: original.isPremium,
    }
  });

  revalidatePath("/dashboard/workflows");
  return workflow;
}

export async function executeWorkflowsForEvent(
  userId: string,
  triggerType: "BOOKING_CREATED" | "BEFORE_EVENT" | "BOOKING_CANCELLED",
  context: {
    booking: any;
    eventType: any;
    host: any;
  }
) {
  try {
    const activeWorkflows = await prisma.workflow.findMany({
      where: {
        userId,
        isActive: true,
      },
    });

    if (!activeWorkflows || activeWorkflows.length === 0) return { executed: 0 };

    const { booking, eventType, host } = context;
    let executedCount = 0;

    for (const wf of activeWorkflows) {
      const triggerLower = wf.trigger.toLowerCase();
      let matches = false;

      if (triggerType === "BOOKING_CREATED") {
        matches =
          triggerLower.includes("booked") ||
          triggerLower.includes("create") ||
          triggerLower.includes("new") ||
          triggerLower.includes("when event is booked");
      } else if (triggerType === "BEFORE_EVENT") {
        matches =
          triggerLower.includes("before") ||
          triggerLower.includes("start") ||
          triggerLower.includes("reminder");
      } else if (triggerType === "BOOKING_CANCELLED") {
        matches =
          triggerLower.includes("cancel") ||
          triggerLower.includes("cancelled");
      }

      if (!matches) continue;

      let subjectTemplate = "Event notification: {EVENT_NAME}";
      let bodyTemplate = "Hi {ATTENDEE},\n\nYour meeting {EVENT_NAME} has an update.\nTime: {EVENT_DATE_ddd, MMM D, YYYY h:mma}\nLink: {MEETING_URL}";
      let targetRecipient = "attendees";

      try {
        if (wf.action.startsWith("{")) {
          const parsed = JSON.parse(wf.action);
          if (parsed.subject) subjectTemplate = parsed.subject;
          if (parsed.body) bodyTemplate = parsed.body;
          if (parsed.target) targetRecipient = parsed.target;
        }
      } catch {
        // Plain string action
      }

      const actionLower = wf.action.toLowerCase();
      if (actionLower.includes("host")) {
        targetRecipient = "host";
      }

      const startTimeDate = new Date(booking.startTime);
      const hostTimezone = host?.timezone || eventType?.user?.timezone || "UTC";
      const formattedDate = startTimeDate.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: hostTimezone,
      });

      const formattedEndTime = new Date(booking.endTime).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: hostTimezone,
      });

      const replaceVars = (text: string) => {
        return text
          .replace(/{EVENT_NAME}/g, eventType?.title || "Scheduled Meeting")
          .replace(/{EVENT_DATE_ddd, MMM D, YYYY h:mma}/g, formattedDate)
          .replace(/{EVENT_END_TIME}/g, formattedEndTime)
          .replace(/{ATTENDEE}/g, booking.guestName || "Guest")
          .replace(/{ATTENDEE_EMAIL}/g, booking.guestEmail || "")
          .replace(/{HOST_NAME}/g, host?.name || "Host")
          .replace(/{TIMEZONE}/g, hostTimezone)
          .replace(/{MEETING_URL}/g, booking.meetLink || "http://localhost:3000")
          .replace(/{LOCATION}/g, booking.meetLink ? "Online / Video Meeting" : "In-Person");
      };

      const finalSubject = replaceVars(subjectTemplate);
      const finalBody = replaceVars(bodyTemplate);

      // Perform Action
      if (actionLower.includes("email") || !actionLower.includes("webhook")) {
        const { sendEmail } = await import("@/lib/resend");
        const recipientEmail = targetRecipient === "host" ? (host?.email || "") : booking.guestEmail;

        if (recipientEmail) {
          await sendEmail({
            to: recipientEmail,
            subject: finalSubject,
            html: `<div style="font-family: sans-serif; white-space: pre-wrap; line-height: 1.6;">${finalBody}</div>`,
            fromName: "CalMeet Workflows",
          });
        }
      } else if (actionLower.includes("webhook")) {
        const { dispatchCustomWebhooks } = await import("@/app/actions/bookings");
        await dispatchCustomWebhooks(userId, `workflow.${triggerType.toLowerCase()}`, {
          workflowId: wf.id,
          workflowName: wf.name,
          bookingId: booking.id,
          guestName: booking.guestName,
          guestEmail: booking.guestEmail,
          startTime: booking.startTime,
        });
      }

      // Record in notifications
      try {
        const { createNotificationInternal } = await import("@/app/actions/notifications");
        await createNotificationInternal(
          userId,
          `Workflow Executed: ${wf.name}`,
          `Workflow "${wf.name}" triggered on ${triggerType.replace(/_/g, " ").toLowerCase()} for ${booking.guestName}.`,
          "BOOKING_CREATED",
          booking.meetLink
        );
      } catch (notifyErr) {
        console.error("Workflow notification error:", notifyErr);
      }

      executedCount++;
    }

    return { executed: executedCount };
  } catch (error) {
    console.error("Workflow execution error:", error);
    return { executed: 0, error };
  }
}


