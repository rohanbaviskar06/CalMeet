"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAuditLogs, AuditLogEntry } from "@/lib/audit";

export async function getTeamAuditLogs(teamId: string): Promise<AuditLogEntry[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  // Verify requester is OWNER or ADMIN of the team
  const member = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId,
        userId,
      },
    },
  });

  if (!member || (member.role !== "OWNER" && member.role !== "ADMIN")) {
    throw new Error("Unauthorized to view team audit logs");
  }

  return getAuditLogs({ teamId, limit: 100 });
}
