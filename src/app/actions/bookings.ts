"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { createGoogleMeetEvent } from "@/lib/google-calendar";
import { createZoomMeeting } from "@/lib/zoom";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { resend } from "@/lib/resend";
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
          include: { user: true }
        }
      }
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
        timeZone: eventType.user.timezone || "UTC"
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
        const { webhookUrl } = JSON.parse(slackIntegration.credentials as string || "{}");
        if (webhookUrl) {
          console.log("Sending booking notification to Slack webhook...");
          const formattedDate = startTime.toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZoneName: "short",
            timeZone: eventType.user.timezone || "UTC"
          });

          await fetch(webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: `📅 *New Meeting Booked!*\n\n*Event*: ${eventType.title}\n*Host*: ${eventType.user.name || "User"}\n*Guest*: ${guestName} (${guestEmail})\n*Time*: ${formattedDate}\n*Video Call Link*: ${meetLink || "Offline/No Link"}\n*Notes*: _${notes || "None"}_`
            }),
          });
          console.log("Slack notification successfully dispatched.");
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
        const { webhookUrl } = JSON.parse(zapierIntegration.credentials as string || "{}");
        if (webhookUrl) {
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
          });
          console.log("Zapier webhook successfully triggered.");
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

    // 5. Send rich confirmation emails to Guest (no account required) & Host
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

      // Send to the Guest (No account needed!)
      await sendEmail({
        to: guestEmail,
        subject: `Confirmed: ${eventType.title} with ${hostName}`,
        html: emailHtml,
        fromName: `${hostName} via CalMeet`,
      });

      // Send notification to Host
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
  } catch (error) {
    console.error("Notification process error:", error);
  }
}

export async function createBooking(formData: z.infer<typeof bookingSchema>) {
  try {
    const validatedData = bookingSchema.parse(formData);

    // 1. Get the event type and its owner
    const eventType = await prisma.eventType.findUnique({
      where: { id: validatedData.eventTypeId },
      include: { user: true },
    });

    if (!eventType) {
      return { success: false, error: "Event type not found" };
    }

    const startTime = new Date(validatedData.startTime);
    const endTime = new Date(validatedData.endTime);



    // 2. Try to create a video call link based on event type settings
    let meetLink = null;
    
    // @ts-ignore - newly added field
    if (eventType.videoCallProvider === "ZOOM") {
      const zoomResult = await createZoomMeeting(eventType.userId, {
        summary: `${eventType.title} with ${validatedData.guestName}`,
        startTime,
        duration: eventType.duration,
      });
      if (zoomResult) {
        meetLink = zoomResult.joinUrl;
      }
    } else if (eventType.videoCallProvider === "CALMEET") {
      // CalMeet native rooms: generate link after booking is created (uses booking ID)
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
      }
    }

    // 3. Create the booking in our database
    const booking = await prisma.booking.create({
      data: {
        eventTypeId: validatedData.eventTypeId,
        userId: eventType.userId,
        guestName: validatedData.guestName,
        guestEmail: validatedData.guestEmail,
        startTime,
        endTime,
        status: "CONFIRMED",
        meetLink: meetLink,
        notes: validatedData.notes || null,
        utmSource: validatedData.utmSource || null,
        utmMedium: validatedData.utmMedium || null,
        referer: validatedData.referer || null,
        paymentStatus: "PAID",
      },
    });

    // For CalMeet native rooms, update meetLink with the booking ID now that we have it
    if (eventType.videoCallProvider === "CALMEET") {
      meetLink = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/meet/${booking.id}`;
      await prisma.booking.update({
        where: { id: booking.id },
        data: { meetLink },
      });
    }

    // Send notifications/emails for bookings immediately
    await sendBookingNotifications(booking.id);

    return { 
      success: true, 
      booking 
    };
  } catch (error) {
    console.error("Booking creation error:", error);
    return { success: false, error: "Failed to create booking" };
  }
}

export async function cancelBooking(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { eventType: true }
  });

  await prisma.booking.update({
    where: { 
      id,
      eventType: {
        userId: userId
      }
    },
    data: { status: "CANCELLED" }
  });

  if (booking) {
    try {
      const { createNotificationInternal } = await import("@/app/actions/notifications");
      const formattedDateForNotify = new Date(booking.startTime).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      // Find the guest user in the system if they are a registered user
      const guestUser = await prisma.user.findUnique({
        where: { email: booking.guestEmail }
      });

      // If the current user cancelling is the host, notify the guest (if registered)
      // If the current user cancelling is NOT the host, notify the host
      const targetUserId = userId === booking.eventType.userId
        ? guestUser?.id
        : booking.eventType.userId;

      if (targetUserId) {
        await createNotificationInternal(
          targetUserId,
          "Meeting Cancelled",
          `Meeting "${booking.eventType.title}" with ${booking.guestName} on ${formattedDateForNotify} was cancelled`,
          "BOOKING_CREATED"
        );
      }
    } catch (notifyErr) {
      console.error("Failed to trigger internal notification for booking cancellation:", notifyErr);
    }

    // Trigger Developer Custom Webhooks on booking cancellation
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
      });
    } catch (whErr) {
      console.error("Failed to dispatch developer webhooks on cancel:", whErr);
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/bookings");
}

export async function deletePendingBooking(id: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id }
    });

    if (booking && booking.status === "PENDING" && booking.paymentStatus === "UNPAID") {
      await prisma.booking.delete({
        where: { id }
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
 */
async function dispatchCustomWebhooks(
  userId: string,
  eventName: "booking.created" | "booking.canceled",
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
            signal: AbortSignal.timeout(8000), // 8s timeout
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

