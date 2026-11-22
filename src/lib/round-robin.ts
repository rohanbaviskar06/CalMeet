import { prisma } from "@/lib/prisma";
import { isSlotWithinHostAvailability } from "@/lib/timezone";

export interface TeamMemberAvailabilityInfo {
  userId: string;
  name: string | null;
  email: string | null;
  timezone: string;
  isAvailable: boolean;
  activeBookingsCount: number;
}

/**
 * Round-Robin Member Selector
 * 
 * Given a team event slot, checks availability of all team members and selects
 * the available member with the fewest active bookings for optimal load balancing.
 */
export async function selectRoundRobinHost(
  teamMemberUserIds: string[],
  startTime: Date,
  endTime: Date
): Promise<{
  selectedUserId: string | null;
  availableMembers: TeamMemberAvailabilityInfo[];
  unavailableReason?: string;
}> {
  if (teamMemberUserIds.length === 0) {
    return { selectedUserId: null, availableMembers: [], unavailableReason: "No team members configured." };
  }

  // Fetch all members with their availability and existing active bookings
  const members = await prisma.user.findMany({
    where: { id: { in: teamMemberUserIds } },
    include: {
      availability: true,
      bookings: {
        where: {
          status: { in: ["CONFIRMED", "PENDING"] },
          startTime: { lt: endTime },
          endTime: { gt: startTime },
        },
      },
      _count: {
        select: {
          bookings: {
            where: {
              status: "CONFIRMED",
              createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
            },
          },
        },
      },
    },
  });

  const memberInfos: TeamMemberAvailabilityInfo[] = [];

  for (const member of members) {
    const timezone = member.timezone || "UTC";
    const hasWorkingHours =
      member.availability.length === 0 ||
      isSlotWithinHostAvailability(startTime, endTime, member.availability, timezone);

    const hasConflict = member.bookings.length > 0;
    const isAvailable = hasWorkingHours && !hasConflict;

    memberInfos.push({
      userId: member.id,
      name: member.name,
      email: member.email,
      timezone,
      isAvailable,
      activeBookingsCount: member._count.bookings,
    });
  }

  const available = memberInfos.filter((m) => m.isAvailable);

  if (available.length === 0) {
    return {
      selectedUserId: null,
      availableMembers: memberInfos,
      unavailableReason: "All team members are busy or outside their working hours during this slot.",
    };
  }

  // Fair load balancing: Sort available members by lowest 30-day booking count
  available.sort((a, b) => a.activeBookingsCount - b.activeBookingsCount);
  const chosenHost = available[0];

  return {
    selectedUserId: chosenHost.userId,
    availableMembers: memberInfos,
  };
}
