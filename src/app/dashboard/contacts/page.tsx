import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ContactsClient } from "@/components/dashboard/contacts-client";

export default async function ContactsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;
  // Fetch all bookings to extract unique contacts
  const bookings = await prisma.booking.findMany({
    where: {
      eventType: {
        userId: userId
      }
    },
    include: {
      eventType: true
    },
    orderBy: {
      startTime: "desc"
    }
  });

  // Aggregate bookings by guestEmail
  const contactsMap = new Map<string, any>();

  const now = new Date();

  bookings.forEach(booking => {
    const email = booking.guestEmail;
    
    if (!contactsMap.has(email)) {
      contactsMap.set(email, {
        email: email,
        name: booking.guestName,
        totalMeetings: 0,
        nextMeeting: null,
        lastMeeting: null,
        bookings: []
      });
    }

    const contact = contactsMap.get(email);
    contact.totalMeetings += 1;
    contact.bookings.push(booking);

    const bookingDate = new Date(booking.startTime);
    const isUpcoming = bookingDate >= now && booking.status !== "CANCELLED";
    const isPast = bookingDate < now;

    if (isUpcoming) {
      if (!contact.nextMeeting || bookingDate < contact.nextMeeting) {
        contact.nextMeeting = bookingDate;
      }
    }

    if (isPast) {
      if (!contact.lastMeeting || bookingDate > contact.lastMeeting) {
        contact.lastMeeting = bookingDate;
      }
    }
  });

  // Convert map to array and sort by most recent interaction
  const contacts = Array.from(contactsMap.values()).sort((a, b) => {
    // Sort logic: Upcoming first, then by last meeting
    if (a.nextMeeting && !b.nextMeeting) return -1;
    if (!a.nextMeeting && b.nextMeeting) return 1;
    
    const dateA = a.nextMeeting || a.lastMeeting || new Date(0);
    const dateB = b.nextMeeting || b.lastMeeting || new Date(0);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="max-w-5xl mx-auto py-2">
      <ContactsClient contacts={contacts} />
    </div>
  );
}

