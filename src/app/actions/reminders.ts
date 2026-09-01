"use server";

import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import { generateMeetingReminderEmail } from "@/lib/email-templates";

/**
 * Dispatch reminder emails for bookings starting in the next 24 hours.
 * Guests do NOT need to have an account on CalMeet — their guestEmail is used directly.
 */
export async function dispatchUpcomingReminders(windowHours = 24) {
  try {
    const now = new Date();
    const windowEnd = new Date(now.getTime() + windowHours * 60 * 60 * 1000);

    console.log(`Checking for upcoming bookings between ${now.toISOString()} and ${windowEnd.toISOString()}...`);

    const upcomingBookings = await prisma.booking.findMany({
      where: {
        startTime: {
          gte: now,
          lte: windowEnd,
        },
        status: "CONFIRMED",
      },
      include: {
        eventType: {
          include: {
            user: true,
          },
        },
      },
    });

    console.log(`Found ${upcomingBookings.length} upcoming bookings needing reminder verification.`);

    let sentCount = 0;

    for (const booking of upcomingBookings) {
      const { eventType, startTime, endTime, guestName, guestEmail, meetLink, notes } = booking;
      const hostName = eventType.user.name || "Host";
      const hostEmail = eventType.user.email || "";

      // Hours remaining
      const hoursRemaining = Math.round((new Date(startTime).getTime() - now.getTime()) / (1000 * 60 * 60));
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
        notes,
        timezone: eventType.user.timezone || "UTC",
        bookingId: booking.id,
        reminderNotice,
      });

      // Send to Guest (No account needed!)
      try {
        await sendEmail({
          to: guestEmail,
          subject: `Reminder: ${eventType.title} with ${hostName} (${reminderNotice})`,
          html: reminderHtml,
          fromName: `${hostName} via CalMeet`,
        });
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
