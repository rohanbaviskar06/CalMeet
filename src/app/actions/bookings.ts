"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { createGoogleMeetEvent, getGoogleCalendarBusyTimes } from "@/lib/google-calendar";
import { createZoomMeeting } from "@/lib/zoom";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { isSlotWithinHostAvailability } from "@/lib/timezone";
import { isSafeWebhookUrl } from "@/lib/ssrf";
import crypto from "crypto";

const bookingSchema = z.object({
  eventTypeId: z.string(),
  guestName: z.string().min(2),
  guestEmail: z.string().email(),
  startTime: z.string(),
  endTime: z.string(),
  notes: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  referer: z.string().optional(),
});

export async function sendBookingNotifications(bookingId: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        eventType: {
          include: { user: true },
        },
      },
    });

    if (!booking) {
      console.error("Booking not found for notification sending:", bookingId);
      return;
    }

    const { eventType, startTime, endTime, guestName, guestEmail, notes, meetLink } = booking;

    // 1. Create a notification for the host
    try {
      const { createNotificationInternal } = await import("@/app/actions/notifications");
      const formattedDateForNotify = startTime.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: eventType.user.timezone || "UTC",
      });
      await createNotificationInternal(
        eventType.userId,
        "New Meeting Scheduled",
        `${guestName} booked "${eventType.title}" for ${formattedDateForNotify}`,
        "BOOKING_CREATED",
        meetLink
      );
    } catch (notifyErr) {
      console.error("Failed to trigger internal notification for booking creation:", notifyErr);
    }

    // 2. Trigger Slack integration notification if configured
    try {
      const slackIntegration = await prisma.integration.findFirst({
        where: {
          userId: eventType.userId,
          type: "slack",
        },
      });

      if (slackIntegration) {
        const { webhookUrl } = JSON.parse((slackIntegration.credentials as string) || "{}");
        if (webhookUrl) {
          const urlCheck = await isSafeWebhookUrl(webhookUrl);
          if (urlCheck.safe) {
            console.log("Sending booking notification to Slack webhook...");
            const formattedDate = startTime.toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              timeZoneName: "short",
              timeZone: eventType.user.timezone || "UTC",
            });

            await fetch(webhookUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                text: `📅 *New Meeting Booked!*\n\n*Event*: ${eventType.title}\n*Host*: ${eventType.user.name || "User"}\n*Guest*: ${guestName} (${guestEmail})\n*Time*: ${formattedDate}\n*Video Call Link*: ${meetLink || "Offline/No Link"}\n*Notes*: _${notes || "None"}_`,
              }),
              signal: AbortSignal.timeout(8000),
            });
            console.log("Slack notification successfully dispatched.");
          } else {
            console.warn("Blocked Slack notification dispatch due to unsafe webhook URL:", urlCheck.reason);
          }
        }
      }
    } catch (slackError) {
      console.error("Failed to dispatch Slack notification:", slackError);
    }

    // 3. Trigger Zapier webhook if configured
    try {
      const zapierIntegration = await prisma.integration.findFirst({
        where: { userId: eventType.userId, type: "zapier" },
      });

      if (zapierIntegration) {
        const { webhookUrl } = JSON.parse((zapierIntegration.credentials as string) || "{}");
        if (webhookUrl) {
          const urlCheck = await isSafeWebhookUrl(webhookUrl);
          if (urlCheck.safe) {
            console.log("Sending booking data to Zapier webhook...");
            await fetch(webhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                event: "booking.created",
                guestName: guestName,
                guestEmail: guestEmail,
                eventTitle: eventType.title,
                hostName: eventType.user.name || "Host",
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                meetLink: meetLink || null,
                notes: notes || null,
                bookingId: booking.id,
              }),
              signal: AbortSignal.timeout(8000),
            });
            console.log("Zapier webhook successfully triggered.");
          } else {
            console.warn("Blocked Zapier webhook dispatch due to unsafe webhook URL:", urlCheck.reason);
          }
        }
      }
    } catch (zapierError) {
      console.error("Failed to trigger Zapier webhook:", zapierError);
    }

    // 4. Trigger Developer Custom Webhooks
    try {
      await dispatchCustomWebhooks(eventType.userId, "booking.created", {
        bookingId: booking.id,
        eventTypeId: eventType.id,
        eventTitle: eventType.title,
        duration: eventType.duration,
        host: {
          id: eventType.user.id,
          name: eventType.user.name,
          email: eventType.user.email,
        },
        guest: {
          name: guestName,
          email: guestEmail,
        },
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        meetLink: meetLink || null,
        status: booking.status,
        notes: notes || null,
      });
    } catch (whErr) {
      console.error("Failed to dispatch developer webhooks:", whErr);
    }

    // 5. Send rich confirmation emails to Guest & Host
    try {
      console.log(`Sending booking confirmation email to guest (${guestEmail}) and host (${eventType.user.email})...`);
      const { generateGuestConfirmationEmail } = await import("@/lib/email-templates");
      const { sendEmail } = await import("@/lib/resend");

      const hostName = eventType.user.name || "Host";
      const hostEmail = eventType.user.email || "";

      const emailHtml = generateGuestConfirmationEmail({
        guestName,
        guestEmail,
        hostName,
        hostEmail,
        eventTitle: eventType.title,
        duration: eventType.duration,
        startTime,
        endTime,
        meetLink,
        notes,
        timezone: eventType.user.timezone || "UTC",
        bookingId: booking.id,
      });

      await sendEmail({
        to: guestEmail,
        subject: `Confirmed: ${eventType.title} with ${hostName}`,
        html: emailHtml,
        fromName: `${hostName} via CalMeet`,
      });

      if (hostEmail) {
        await sendEmail({
          to: hostEmail,
          subject: `New Booking: ${guestName} - ${eventType.title}`,
          html: emailHtml,
          fromName: "CalMeet Scheduling",
        });
      }
      console.log("Confirmation emails successfully dispatched.");
    } catch (emailError) {
      console.error("Failed to send booking confirmation emails:", emailError);
    }

    // 6. Execute user-configured active workflows for BOOKING_CREATED
    try {
      const { executeWorkflowsForEvent } = await import("@/app/actions/workflows");
      await executeWorkflowsForEvent(eventType.userId, "BOOKING_CREATED", {
        booking,
        eventType,
        host: eventType.user,
      });
    } catch (wfErr) {
      console.error("Failed to execute workflows for booking creation:", wfErr);
    }
  } catch (error) {
    console.error("Notification process error:", error);
  }
}

export async function createBooking(formData: z.infer<typeof bookingSchema>) {
  try {
    const validatedData = bookingSchema.parse(formData);

    // Safe walkthrough/demo bookings that don't touch database or send live emails
    if (validatedData.eventTypeId === "demo-review-meeting" || validatedData.eventTypeId.startsWith("demo-")) {
      return {
        success: true,
        booking: {
          id: "demo-booking-sample",
          startTime: new Date(validatedData.startTime),
          endTime: new Date(validatedData.endTime),
          guestName: validatedData.guestName,
          guestEmail: validatedData.guestEmail,
          meetLink: "https://meet.google.com/cal-meet-demo",
        },
        isDemo: true,
      };
    }

    // 1. Get the event type and its owner
    const eventType = await prisma.eventType.findUnique({
      where: { id: validatedData.eventTypeId },
      include: { user: true },
    });

    if (!eventType) {
      return { success: false, error: "Event type not found" };
    }

    if (!eventType.isActive) {
      return { success: false, error: "This event type is currently inactive and cannot be booked." };
    }

    const startTime = new Date(validatedData.startTime);
    const endTime = new Date(validatedData.endTime);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return { success: false, error: "Invalid booking start or end time." };
    }

    // Prevent past bookings (allow a 60-second grace window for form submission latency)
    if (startTime.getTime() < Date.now() - 60000) {
      return { success: false, error: "Cannot book a meeting time in the past." };
    }

    // Validate duration matches configured event duration
    const durationMs = eventType.duration * 60 * 1000;
    if (endTime.getTime() - startTime.getTime() !== durationMs) {
      return { success: false, error: `Invalid booking duration. Expected ${eventType.duration} minutes.` };
    }

    // 2. Validate availability according to host's working hours and timezone
    const availabilities = await prisma.availability.findMany({
      where: { userId: eventType.userId },
    });

    const isAvailable = isSlotWithinHostAvailability(
      startTime,
      endTime,
      availabilities,
      eventType.user.timezone || "UTC"
    );

    if (!isAvailable) {
      return { success: false, error: "The selected time falls outside the host's configured availability." };
    }

    // 3. Check for Google Calendar busy conflicts if host has Google Calendar connected
    try {
      const busySlots = await getGoogleCalendarBusyTimes(eventType.userId, startTime, endTime);
      const hasCalendarConflict = busySlots.some(
        (busy) => startTime < busy.end && endTime > busy.start
      );
      if (hasCalendarConflict) {
        return { success: false, error: "The host is already busy at this time on their connected calendar." };
      }
    } catch (gcalErr) {
      console.warn("Could not check Google Calendar busy times:", gcalErr);
    }

    const isPaid = eventType.requiresPayment && (eventType.price || 0) > 0;

    // 4. Create the booking inside a transaction with concurrent double-booking protection
    const booking = await prisma.$transaction(async (tx) => {
      // Check for overlapping confirmed or active bookings across ALL event types for this host
      const existingOverlap = await tx.booking.findFirst({
        where: {
          userId: eventType.userId,
          status: { in: ["CONFIRMED", "PENDING"] },
          startTime: { lt: endTime },
          endTime: { gt: startTime },
        },
      });

      if (existingOverlap) {
        throw new Error("This time slot is no longer available. Please select another time.");
      }

      return tx.booking.create({
        data: {
          eventTypeId: validatedData.eventTypeId,
          userId: eventType.userId,
          guestName: validatedData.guestName,
          guestEmail: validatedData.guestEmail,
          startTime,
          endTime,
          status: isPaid ? "PENDING" : "CONFIRMED",
          meetLink: null,
          notes: validatedData.notes || null,
          utmSource: validatedData.utmSource || null,
          utmMedium: validatedData.utmMedium || null,
          referer: validatedData.referer || null,
          paymentStatus: isPaid ? "UNPAID" : "PAID",
        },
      });
    });

    // 5. If paid, return pending booking awaiting payment completion
    if (isPaid) {
      return {
        success: true,
        booking,
        requiresPayment: true,
        price: eventType.price,
        currency: eventType.currency,
      };
    }

    // 6. Free booking: Generate video call link and dispatch notifications immediately
    let meetLink: string | null = null;
    let gcalEventId: string | null = null;
    if (eventType.videoCallProvider === "ZOOM") {
      const zoomResult = await createZoomMeeting(eventType.userId, {
        summary: `${eventType.title} with ${validatedData.guestName}`,
        startTime,
        duration: eventType.duration,
      });
      if (zoomResult) meetLink = zoomResult.joinUrl;
    } else if (eventType.videoCallProvider === "CALMEET") {
      meetLink = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/meet/${booking.id}`;
    } else {
      const googleMeetResult = await createGoogleMeetEvent(eventType.userId, {
        summary: `${eventType.title} with ${validatedData.guestName}`,
        description: validatedData.notes || "Scheduled via CalMeet",
        startTime,
        endTime,
        guestEmail: validatedData.guestEmail,
      });
      if (googleMeetResult) {
        meetLink = googleMeetResult.meetLink ?? null;
        gcalEventId = googleMeetResult.eventId ?? null;
      }
    }

    const noteUpdates = gcalEventId ? `${booking.notes || ""}\n[GCAL_EVENT_ID:${gcalEventId}]` : booking.notes;

    if (meetLink || gcalEventId) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          meetLink,
          notes: noteUpdates,
        },
      });
    }

    await sendBookingNotifications(booking.id);

    return {
      success: true,
      booking: { ...booking, meetLink },
      requiresPayment: false,
    };
  } catch (error: any) {
    console.error("Booking creation error:", error);
    return { success: false, error: error.message || "Failed to create booking" };
  }
}

/**
 * Verifies Razorpay payment signature before confirming a paid booking.
 */
export async function verifyAndConfirmBookingPayment(data: {
  bookingId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
      include: {
        eventType: {
          include: { user: true },
        },
      },
    });

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    if (booking.status === "CONFIRMED" && booking.paymentStatus === "PAID") {
      return { success: true, booking };
    }

    // Determine Razorpay secret: host's connected integration or server env fallback
    let keySecret = process.env.RAZORPAY_KEY_SECRET;
    const integration = await prisma.integration.findFirst({
      where: { userId: booking.eventType.userId, type: "razorpay" },
    });

    if (integration) {
      try {
        const creds = JSON.parse((integration.credentials as string) || "{}");
        if (creds.keySecret) keySecret = creds.keySecret;
      } catch {}
    }

    if (!keySecret) {
      return { success: false, error: "Payment gateway secret not configured." };
    }

    const payload = `${data.razorpayOrderId}|${data.razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(payload)
      .digest("hex");

    if (expectedSignature !== data.razorpaySignature) {
      return { success: false, error: "Payment verification failed: Invalid signature." };
    }

    // Generate meeting link upon verified payment
    let meetLink: string | null = null;
    let gcalEventId: string | null = null;
    if (booking.eventType.videoCallProvider === "ZOOM") {
      const zoomResult = await createZoomMeeting(booking.eventType.userId, {
        summary: `${booking.eventType.title} with ${booking.guestName}`,
        startTime: booking.startTime,
        duration: booking.eventType.duration,
      });
      if (zoomResult) meetLink = zoomResult.joinUrl;
    } else if (booking.eventType.videoCallProvider === "CALMEET") {
      meetLink = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/meet/${booking.id}`;
    } else {
      const googleMeetResult = await createGoogleMeetEvent(booking.eventType.userId, {
        summary: `${booking.eventType.title} with ${booking.guestName}`,
        description: booking.notes || "Scheduled via CalMeet",
        startTime: booking.startTime,
        endTime: booking.endTime,
        guestEmail: booking.guestEmail,
      });
      if (googleMeetResult) {
        meetLink = googleMeetResult.meetLink ?? null;
        gcalEventId = googleMeetResult.eventId ?? null;
      }
    }

    const finalNotes = gcalEventId ? `${booking.notes || ""}\n[GCAL_EVENT_ID:${gcalEventId}]` : booking.notes;

    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: "CONFIRMED",
        paymentStatus: "PAID",
        razorpayOrderId: data.razorpayOrderId,
        razorpayPaymentId: data.razorpayPaymentId,
        razorpaySignature: data.razorpaySignature,
        meetLink,
        notes: finalNotes,
      },
    });

    await sendBookingNotifications(updatedBooking.id);

    return { success: true, booking: updatedBooking };
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return { success: false, error: error.message || "Failed to verify payment" };
  }
}

export async function cancelBooking(id: string) {
  return cancelBookingWithReason({ bookingId: id });
}

export async function cancelBookingWithReason({
  bookingId,
  reason = "Schedule conflict",
  cancelledBy = "HOST",
}: {
  bookingId: string;
  reason?: string;
  cancelledBy?: "HOST" | "GUEST";
}) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { eventType: { include: { user: true } } },
  });

  if (!booking) throw new Error("Booking not found");

  // Authorization check: If cancelledBy HOST, require session match
  if (cancelledBy === "HOST") {
    if (!session?.user) throw new Error("Unauthorized");
    if (booking.eventType.userId !== userId && booking.userId !== userId) {
      throw new Error("Unauthorized to cancel this booking");
    }
  }

  // Cancel Google Calendar event if associated
  try {
    const match = booking.notes?.match(/\[GCAL_EVENT_ID:([^\s\]]+)\]/);
    if (match && match[1]) {
      const { deleteGoogleCalendarEvent } = await import("@/lib/google-calendar");
      await deleteGoogleCalendarEvent(booking.eventType.userId, match[1]);
    }
  } catch (gcalErr) {
    console.error("Failed to delete Google Calendar event on cancellation:", gcalErr);
  }

  const cancelTag = `\n[CANCELLED by ${cancelledBy} at ${new Date().toISOString()}: ${reason}]`;
  const updatedNotes = (booking.notes || "") + cancelTag;

  await prisma.booking.update({
    where: { id: bookingId },
    data: { 
      status: "CANCELLED",
      notes: updatedNotes,
    },
  });

  try {
    const { createNotificationInternal } = await import("@/app/actions/notifications");
    const formattedDateForNotify = new Date(booking.startTime).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: booking.eventType.user?.timezone || "UTC",
    });

    const guestUser = await prisma.user.findUnique({
      where: { email: booking.guestEmail },
    });

    const targetUserId =
      userId === booking.eventType.userId ? guestUser?.id : booking.eventType.userId;

    if (targetUserId) {
      await createNotificationInternal(
        targetUserId,
        "Meeting Cancelled",
        `Meeting "${booking.eventType.title}" with ${booking.guestName} on ${formattedDateForNotify} was cancelled (${reason})`,
        "BOOKING_CREATED"
      );
    }
  } catch (notifyErr) {
    console.error("Failed to trigger internal notification for booking cancellation:", notifyErr);
  }

  // Execute workflows for cancellation
  try {
    const { executeWorkflowsForEvent } = await import("@/app/actions/workflows");
    await executeWorkflowsForEvent(booking.eventType.userId, "BOOKING_CANCELLED", {
      booking,
      eventType: booking.eventType,
      host: booking.eventType.user,
    });
  } catch (wfErr) {
    console.error("Failed to execute workflows on booking cancellation:", wfErr);
  }

  try {
    await dispatchCustomWebhooks(booking.eventType.userId, "booking.canceled", {
      bookingId: booking.id,
      eventTypeId: booking.eventType.id,
      eventTitle: booking.eventType.title,
      guest: {
        name: booking.guestName,
        email: booking.guestEmail,
      },
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
      status: "CANCELLED",
      reason,
      cancelledBy,
    });
  } catch (whErr) {
    console.error("Failed to dispatch developer webhooks on cancel:", whErr);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/bookings");
  return { success: true };
}

export async function getBookingForManagement(bookingId: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        eventType: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                username: true,
                image: true,
                timezone: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    return {
      success: true,
      booking: {
        id: booking.id,
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        startTime: booking.startTime.toISOString(),
        endTime: booking.endTime.toISOString(),
        status: booking.status,
        meetLink: booking.meetLink,
        notes: booking.notes,
        paymentStatus: booking.paymentStatus,
        eventType: {
          id: booking.eventType.id,
          title: booking.eventType.title,
          description: booking.eventType.description,
          duration: booking.eventType.duration,
          price: booking.eventType.price,
          currency: booking.eventType.currency,
          host: {
            name: booking.eventType.user?.name || "Host",
            username: booking.eventType.user?.username || "user",
            image: booking.eventType.user?.image,
            timezone: booking.eventType.user?.timezone || "UTC",
          },
        },
      },
    };
  } catch (error: any) {
    console.error("getBookingForManagement error:", error);
    return { success: false, error: "Database error" };
  }
}

export async function rescheduleBooking({
  bookingId,
  newStartTime,
  newEndTime,
  reason = "Guest requested new time",
  rescheduledBy = "GUEST",
}: {
  bookingId: string;
  newStartTime: string;
  newEndTime: string;
  reason?: string;
  rescheduledBy?: "HOST" | "GUEST";
}) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        eventType: {
          include: {
            user: {
              include: {
                availability: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    if (booking.status === "CANCELLED") {
      return { success: false, error: "Cannot reschedule a cancelled booking" };
    }

    const newStart = new Date(newStartTime);
    const newEnd = new Date(newEndTime);

    if (isNaN(newStart.getTime()) || isNaN(newEnd.getTime())) {
      return { success: false, error: "Invalid start or end time" };
    }

    // 1. Prevent rescheduling to past time
    if (newStart < new Date()) {
      return { success: false, error: "Cannot reschedule to a time in the past" };
    }

    // 2. Validate duration matches event duration
    const durationMinutes = Math.round((newEnd.getTime() - newStart.getTime()) / (1000 * 60));
    if (durationMinutes !== booking.eventType.duration) {
      return {
        success: false,
        error: `Invalid duration. Expected ${booking.eventType.duration} minutes, received ${durationMinutes} minutes.`,
      };
    }

    // 3. Verify event is active
    if (!booking.eventType.isActive) {
      return { success: false, error: "This event type is currently inactive and cannot be rescheduled" };
    }

    // 4. Validate host availability in host timezone
    const host = booking.eventType.user;
    if (host && host.availability && host.availability.length > 0) {
      const isAvailable = isSlotWithinHostAvailability(
        newStart,
        newEnd,
        host.availability,
        host.timezone || "UTC"
      );
      if (!isAvailable) {
        return {
          success: false,
          error: "Selected time falls outside of the host's configured working hours",
        };
      }
    }

    // 5. Concurrency & Overlap Conflict Check in a transaction
    const updatedBooking = await prisma.$transaction(async (tx) => {
      const conflict = await tx.booking.findFirst({
        where: {
          id: { not: bookingId },
          eventType: { userId: booking.eventType.userId },
          status: { in: ["CONFIRMED", "PENDING"] },
          startTime: { lt: newEnd },
          endTime: { gt: newStart },
        },
      });

      if (conflict) {
        throw new Error("This time slot is already booked with another meeting. Please select a different time.");
      }

      const rescheduleTag = `\n[RESCHEDULED by ${rescheduledBy} from ${booking.startTime.toISOString()} to ${newStart.toISOString()} at ${new Date().toISOString()}: ${reason}]`;
      const updatedNotes = (booking.notes || "") + rescheduleTag;

      return tx.booking.update({
        where: { id: bookingId },
        data: {
          startTime: newStart,
          endTime: newEnd,
          status: "CONFIRMED",
          notes: updatedNotes,
        },
      });
    });

    // 6. Notify host
    try {
      const { createNotificationInternal } = await import("@/app/actions/notifications");
      const formattedDateForNotify = newStart.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: host?.timezone || "UTC",
      });

      await createNotificationInternal(
        booking.eventType.userId,
        "Meeting Rescheduled",
        `Meeting "${booking.eventType.title}" with ${booking.guestName} was rescheduled to ${formattedDateForNotify} (${reason})`,
        "BOOKING_CREATED",
        booking.meetLink
      );
    } catch (notifyErr) {
      console.error("Failed to trigger internal notification for booking reschedule:", notifyErr);
    }

    // 7. Dispatch Webhooks
    try {
      await dispatchCustomWebhooks(booking.eventType.userId, "booking.created", {
        bookingId: updatedBooking.id,
        eventTypeId: booking.eventType.id,
        eventTitle: booking.eventType.title,
        guest: {
          name: updatedBooking.guestName,
          email: updatedBooking.guestEmail,
        },
        startTime: updatedBooking.startTime.toISOString(),
        endTime: updatedBooking.endTime.toISOString(),
        status: updatedBooking.status,
        rescheduled: true,
        previousStartTime: booking.startTime.toISOString(),
        reason,
      });
    } catch (whErr) {
      console.error("Failed to dispatch webhook for reschedule:", whErr);
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/bookings");
    return { success: true, booking: updatedBooking };
  } catch (error: any) {
    console.error("rescheduleBooking error:", error);
    return { success: false, error: error.message || "Failed to reschedule booking" };
  }
}

export async function deletePendingBooking(id: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (booking && booking.status === "PENDING" && booking.paymentStatus === "UNPAID") {
      await prisma.booking.delete({
        where: { id },
      });
      return { success: true };
    }
    return { success: false, error: "Booking is not pending or unpaid" };
  } catch (error) {
    console.error("Failed to delete pending booking:", error);
    return { success: false, error: "Database error" };
  }
}

/**
 * Dispatches a payload to all active registered developer webhooks for a user
 * after verifying target URL is safe from SSRF.
 */
export async function dispatchCustomWebhooks(
  userId: string,
  eventName: string,
  data: any
) {
  try {
    const webhooks = await (prisma as any).webhook.findMany({
      where: {
        userId,
        isActive: true,
      },
    });

    if (!webhooks || webhooks.length === 0) return;

    const payload = {
      event: eventName,
      timestamp: new Date().toISOString(),
      data,
    };

    const payloadString = JSON.stringify(payload);

    await Promise.allSettled(
      webhooks.map(async (wh: any) => {
        try {
          const events: string[] = JSON.parse(wh.events || "[]");
          if (!events.includes(eventName)) return;

          // SSRF prevention: ensure webhook URL does not target localhost or internal subnets
          const urlCheck = await isSafeWebhookUrl(wh.url);
          if (!urlCheck.safe) {
            console.warn(`Blocked custom webhook dispatch to unsafe URL ${wh.url}:`, urlCheck.reason);
            return;
          }

          const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "User-Agent": "CalMeet-Webhook/1.0",
          };

          if (wh.secret) {
            const signature = crypto
              .createHmac("sha256", wh.secret)
              .update(payloadString)
              .digest("hex");
            headers["X-CalMeet-Signature"] = `sha256=${signature}`;
          }

          console.log(`Dispatching webhook ${wh.id} (${eventName}) to ${wh.url}...`);
          const res = await fetch(wh.url, {
            method: "POST",
            headers,
            body: payloadString,
            signal: AbortSignal.timeout(8000),
          });

          console.log(`Webhook ${wh.id} responded with status: ${res.status}`);
        } catch (dispatchErr: any) {
          console.error(`Error sending webhook to ${wh.url}:`, dispatchErr.message || dispatchErr);
        }
      })
    );
  } catch (err: any) {
    console.error("Error in dispatchCustomWebhooks:", err.message || err);
  }
}
