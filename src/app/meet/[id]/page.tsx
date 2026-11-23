import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { MeetingRoomClient } from "@/components/meet/meeting-room-client";
import { verifyBookingAccess } from "@/lib/booking-auth";
import { Lock } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string; email?: string; token?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { eventType: true },
  });
  return {
    title: booking ? `${booking.eventType.title} — Video Room` : "Video Meeting Room",
    description: "Join your secure CalMeet video meeting room.",
  };
}

export default async function MeetingRoomPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { name, email, token } = await searchParams;

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

  // Enforce access verification: authorized only for host session, guest session, or valid signed guest token
  const access = await verifyBookingAccess(booking, token);

  if (!access.authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 text-white">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/90 p-8 text-center shadow-xl backdrop-blur-md">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight mb-2">Meeting Access Restricted</h1>
          <p className="text-xs text-zinc-400 leading-relaxed mb-6">
            This video room is restricted to verified participants. Please sign in with your host or guest account, or use the secure join link sent to your confirmation email.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href={`/login?callbackUrl=/meet/${booking.id}`}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-white text-xs font-semibold text-black hover:bg-zinc-200 transition cursor-pointer"
            >
              Sign In to Join
            </Link>
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-800/60 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition cursor-pointer"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const session = await getServerSession(authOptions);
  const isHost = access.role === "HOST";

  let displayName = "Participant";
  let displayEmail = "";

  if (isHost && session?.user) {
    displayName = session.user.name || booking.user?.name || "Host";
    displayEmail = session.user.email || booking.user?.email || "";
  } else {
    displayName = name || booking.guestName;
    displayEmail = email || booking.guestEmail;
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
