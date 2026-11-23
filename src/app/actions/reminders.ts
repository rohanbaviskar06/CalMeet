"use server";

import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import { generateMeetingReminderEmail } from "@/lib/email-templates";
import { generateBookingGuestToken } from "@/lib/booking-auth";

/**
 * Dispatch reminder emails for bookings starting in the next 24 hours.
 * Deduplicates dispatches to ensure guests are only reminded once per meeting.
 */
export async function dispatchUpcomingReminders(windowHours = 24) {
  try {
    const now = new Date();
    const windowEnd = new Date(now.getTime() + windowHours * 60 * 60 * 1000);

    console.log(`Checking for upcoming bookings between ${now.toISOString()} and ${windowEnd.toISOString()}...`);

    // Only select bookings that haven't already received a reminder
    const upcomingBookings = await prisma.booking.findMany({
      where: {
        startTime: {
          gte: now,
          lte: windowEnd,
        },
        status: "CONFIRMED",
        NOT: {
          notes: {
            contains: "[REMINDER_SENT]",
          },
        },
      },
      include: {
        eventType: {
          include: {
            user: true,
          },
        },
      },
    });

    console.log(`Found ${upcomingBookings.length} upcoming bookings needing reminder.`);

    let sentCount = 0;

    for (const booking of upcomingBookings) {
      const { eventType, startTime, endTime, guestName, guestEmail, meetLink, notes } = booking;
      const hostName = eventType.user.name || "Host";
      const hostEmail = eventType.user.email || "";

      // Hours remaining
      const hoursRemaining = Math.max(1, Math.round((new Date(startTime).getTime() - now.getTime()) / (1000 * 60 * 60)));
      const reminderNotice = hoursRemaining <= 1 ? "Meeting Starting in 1 Hour" : `Meeting in ${hoursRemaining} Hours`;

      const reminderHtml = generateMeetingReminderEmail({
        guestName,
        guestEmail,
        hostName,
        hostEmail,
        eventTitle: eventType.title,
        duration: eventType.duration,
        startTime,
        endTime,
        meetLink,
        notes: notes?.replace("[REMINDER_SENT]", "").trim(),
        timezone: eventType.user.timezone || "UTC",
        bookingId: booking.id,
        manageToken: generateBookingGuestToken(booking),
        reminderNotice,
      });

      try {
        const sendRes = await sendEmail({
          to: guestEmail,
          subject: `Reminder: ${eventType.title} with ${hostName} (${reminderNotice})`,
          html: reminderHtml,
          fromName: `${hostName} via CalMeet`,
        });

        if (sendRes && (sendRes as any).error) {
          throw new Error((sendRes as any).error);
        }

        // Mark reminder as sent to prevent duplicate dispatch
        const updatedNotes = notes
          ? `${notes}\n[REMINDER_SENT]`
          : "[REMINDER_SENT]";

        await prisma.booking.update({
          where: { id: booking.id },
          data: { notes: updatedNotes },
        });

        // Persist dispatch logs separately from guest notes in database
        try {
          await prisma.integration.create({
            data: {
              userId: eventType.userId,
              type: "reminder_dispatch_log",
              credentials: JSON.stringify({
                bookingId: booking.id,
                recipient: guestEmail,
                dispatchedAt: new Date().toISOString(),
                windowHours,
                status: "DELIVERED",
              }),
            },
          });
        } catch (logErr) {
          console.warn("Could not write reminder dispatch log:", logErr);
        }

        sentCount++;
        console.log(`Reminder successfully sent to guest: ${guestEmail}`);
      } catch (err) {
        console.error(`Failed to send reminder to guest ${guestEmail}:`, err);
      }
    }

    return {
      success: true,
      processed: upcomingBookings.length,
      sentCount,
    };
  } catch (error: any) {
    console.error("Error dispatching upcoming reminders:", error);
    return {
      success: false,
      error: error.message || "Failed to dispatch reminders",
    };
  }
}
