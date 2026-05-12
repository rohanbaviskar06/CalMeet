"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { createGoogleMeetEvent } from "@/lib/google-calendar";
import { createZoomMeeting } from "@/lib/zoom";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const bookingSchema = z.object({
  eventTypeId: z.string(),
  guestName: z.string().min(2),
  guestEmail: z.string().email(),
  startTime: z.string(),
  endTime: z.string(),
  notes: z.string().optional(),
});

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
    } else {
      const googleMeetResult = await createGoogleMeetEvent(eventType.userId, {
        summary: `${eventType.title} with ${validatedData.guestName}`,
        description: validatedData.notes || "Scheduled via MeetMe",
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
      },
    });

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

  await prisma.booking.update({
    where: { 
      id,
      eventType: {
        userId: userId
      }
    },
    data: { status: "CANCELLED" }
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/bookings");
}
