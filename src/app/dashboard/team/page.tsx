import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { TeamClient } from "@/components/dashboard/team-client";

export default async function TeamPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;
  const userEmail = session.user.email?.toLowerCase();

  // If there's an invite token in the URL, we can parse it
  const searchParams = await props.searchParams;
  const token = typeof searchParams.token === "string" ? searchParams.token : undefined;
  const selectedTeamId = typeof searchParams.teamId === "string" ? searchParams.teamId : undefined;

  // Fetch user details
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    redirect("/login");
  }

  // Fetch teams the user belongs to
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
                  image: true,
                },
              },
            },
          },
          invitations: true,
        },
      },
    },
  });

  // Get current active team based on query parameter, or select default
  const activeMembership = selectedTeamId 
    ? teamMemberships.find((m) => m.teamId === selectedTeamId) || teamMemberships[0] || null
    : teamMemberships.find((m) => m.role === "OWNER") || teamMemberships[0] || null;
  const activeTeam = activeMembership?.team || null;

  // Fetch pending invitations matching this user's email
  const invitationsReceived = userEmail
    ? await prisma.teamInvitation.findMany({
        where: { email: userEmail },
        include: {
          team: {
            include: {
              owner: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      })
    : [];

  return (
    <div className="max-w-5xl mx-auto">
      <TeamClient
        user={user}
        activeTeam={activeTeam}
        userRole={activeMembership?.role || null}
        invitationsReceived={invitationsReceived}
        initialToken={token}
        allMemberships={teamMemberships}
      />
    </div>
  );
}

