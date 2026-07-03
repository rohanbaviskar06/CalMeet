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
    <div className="space-y-6 max-w-full">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-background p-8 border">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Team Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Invite and manage your colleagues to collaborate on scheduling and event types.
          </p>
        </div>
      </div>

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
