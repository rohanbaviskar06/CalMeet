import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BookingsClient } from "@/components/dashboard/bookings-client";

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  // 1. Fetch user memberships to identify teams owned/admined by the user
  const teamMemberships = await prisma.teamMember.findMany({
    where: { userId },
    include: {
      team: {
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true
                }
              }
            }
          }
        }
      }
    }
  });

  // Identify teams where the user is OWNER or ADMIN
  const adminTeamIds = teamMemberships
    .filter((m) => m.role === "OWNER" || m.role === "ADMIN")
    .map((m) => m.teamId);

  // 2. Fetch all team members across user's admin teams
  const teamMemberUserIds = await prisma.teamMember.findMany({
    where: { teamId: { in: adminTeamIds } },
    select: { userId: true }
  });

  const distinctMemberIds = Array.from(new Set([
    userId,
    ...teamMemberUserIds.map((m) => m.userId)
  ]));

  // 3. Fetch all bookings (personal bookings + bookings of members in admined teams)
  const bookings = await prisma.booking.findMany({
    where: {
      userId: { in: distinctMemberIds },
      status: { in: ["CONFIRMED", "CANCELLED"] }
    },
    include: {
      eventType: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    },
    orderBy: {
      startTime: "desc"
    }
  });

  return (
    <div className="max-w-5xl mx-auto py-2">
      <BookingsClient 
        initialBookings={bookings} 
        teamMemberships={teamMemberships}
        user={session.user}
      />
    </div>
  );
}
