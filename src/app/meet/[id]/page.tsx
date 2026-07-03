import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { MeetingRoomClient } from "@/components/meet/meeting-room-client";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string; email?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { eventType: true },
  });
  return {
    title: booking ? `${booking.eventType.title} — CalMeet Room` : "Meeting Room — CalMeet",
    description: "Join your CalMeet video meeting room.",
  };
}

export default async function MeetingRoomPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { name, email } = await searchParams;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      eventType: true,
      user: true,
    },
  });

  if (!booking || booking.status === "CANCELLED") {
    notFound();
  }

  // Determine who is joining
  const session = await getServerSession(authOptions);
  const isHost = session?.user && (session.user as any).id === booking.userId;

  let displayName = "Guest";
  let displayEmail = "";

  if (isHost && session?.user) {
    displayName = session.user.name || "Host";
    displayEmail = session.user.email || "";
  } else if (name) {
    displayName = name;
    displayEmail = email || booking.guestEmail;
  } else {
    // Default to guest info from booking
    displayName = booking.guestName;
    displayEmail = booking.guestEmail;
  }

  let userImage: string | null = null;
  if (isHost && booking.user?.image) {
    userImage = booking.user.image;
  } else if (session?.user && session.user.image) {
    userImage = session.user.image;
  }

  const roomName = `calmeet-${booking.id}`;

  return (
    <MeetingRoomClient
      bookingId={booking.id}
      roomName={roomName}
      displayName={displayName}
      email={displayEmail}
      userImage={userImage}
      eventTitle={booking.eventType.title}
      hostName={booking.user?.name || "Host"}
      startTime={booking.startTime.toISOString()}
      endTime={booking.endTime.toISOString()}
    />
  );
}
