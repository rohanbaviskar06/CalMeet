"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/resend";
import crypto from "crypto";

export async function createTeam(name: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  // Create the team and the owner team membership in a transaction
  const team = await prisma.$transaction(async (tx) => {
    const newTeam = await tx.team.create({
      data: {
        name,
        ownerId: userId,
      },
    });

    await tx.teamMember.create({
      data: {
        teamId: newTeam.id,
        userId: userId,
        role: "OWNER",
      },
    });

    return newTeam;
  });

  revalidatePath("/dashboard/team");
  return { success: true, team };
}

export async function updateTeamName(teamId: string, name: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  // Verify ownership or admin status
  const member = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId,
        userId,
      },
    },
  });

  if (!member || (member.role !== "OWNER" && member.role !== "ADMIN")) {
    throw new Error("Unauthorized to update team details");
  }

  await prisma.team.update({
    where: { id: teamId },
    data: { name },
  });

  revalidatePath("/dashboard/team");
  return { success: true };
}

export async function inviteTeamMember(teamId: string, email: string, role: string = "MEMBER") {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;
  const userEmail = session.user.email;

  if (email.toLowerCase() === userEmail?.toLowerCase()) {
    throw new Error("You cannot invite yourself");
  }

  // Verify current user has permission to invite (OWNER or ADMIN)
  const requester = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId,
        userId,
      },
    },
    include: {
      team: true,
    },
  });

  if (!requester || (requester.role !== "OWNER" && requester.role !== "ADMIN")) {
    throw new Error("Unauthorized to invite team members");
  }

  // Check if user is already a member
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: existingUser.id,
        },
      },
    });
    if (existingMember) {
      throw new Error("User is already a member of this team");
    }
  }

  // Check if invitation already exists
  const existingInvitation = await prisma.teamInvitation.findUnique({
    where: {
      teamId_email: {
        teamId,
        email,
      },
    },
  });

  if (existingInvitation) {
    throw new Error("An invitation has already been sent to this email address");
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date();
  expires.setDate(expires.getDate() + 7); // Expires in 7 days

  const invitation = await prisma.teamInvitation.create({
    data: {
      teamId,
      email: email.toLowerCase(),
      role,
      token,
      expires,
    },
  });

  // Send invitation email
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const acceptLink = `${baseUrl}/dashboard/team?token=${token}`;
    const teamName = requester.team.name;
    const inviterName = session.user.name || "A team member";

    await sendEmail({
      to: email,
      subject: `Join ${teamName} on CalMeet! 🤝`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 12px;">
          <h2 style="color: #0F172A; margin-bottom: 16px;">You're Invited!</h2>
          <p style="color: #475569; font-size: 16px; line-height: 24px;">
            <strong>${inviterName}</strong> has invited you to join the team <strong>${teamName}</strong> on CalMeet as a <strong>${role.toLowerCase()}</strong>.
          </p>
          <p style="color: #475569; font-size: 16px; line-height: 24px;">
            Click the button below to log in or sign up and accept the invitation:
          </p>
          <a href="${acceptLink}" style="display: inline-block; background-color: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 15px; text-align: center;">Accept Invitation</a>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 25px;">
            This invitation link will expire in 7 days. If you did not expect this invitation, you can safely ignore this email.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send invitation email:", error);
  }

  revalidatePath("/dashboard/team");
  return { success: true, invitation };
}

export async function cancelInvitation(teamId: string, invitationId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  const requester = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId,
        userId,
      },
    },
  });

  if (!requester || (requester.role !== "OWNER" && requester.role !== "ADMIN")) {
    throw new Error("Unauthorized to cancel invitations");
  }

  await prisma.teamInvitation.delete({
    where: { id: invitationId },
  });

  revalidatePath("/dashboard/team");
  return { success: true };
}

export async function acceptInvitation(invitationId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;
  const userEmail = session.user.email?.toLowerCase();

  const invitation = await prisma.teamInvitation.findUnique({
    where: { id: invitationId },
  });

  if (!invitation) throw new Error("Invitation not found");

  if (invitation.email.toLowerCase() !== userEmail) {
    throw new Error("This invitation was sent to a different email address");
  }

  if (new Date() > invitation.expires) {
    await prisma.teamInvitation.delete({ where: { id: invitationId } });
    throw new Error("This invitation has expired");
  }

  await prisma.$transaction(async (tx) => {
    // Add to members
    await tx.teamMember.create({
      data: {
        teamId: invitation.teamId,
        userId: userId,
        role: invitation.role,
      },
    });

    // Delete the invitation
    await tx.teamInvitation.delete({
      where: { id: invitationId },
    });
  });

  revalidatePath("/dashboard/team");
  return { success: true };
}

export async function declineInvitation(invitationId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userEmail = session.user.email?.toLowerCase();

  const invitation = await prisma.teamInvitation.findUnique({
    where: { id: invitationId },
  });

  if (!invitation) throw new Error("Invitation not found");

  if (invitation.email.toLowerCase() !== userEmail) {
    throw new Error("This invitation was sent to a different email address");
  }

  await prisma.teamInvitation.delete({
    where: { id: invitationId },
  });

  revalidatePath("/dashboard/team");
  return { success: true };
}

export async function removeTeamMember(teamId: string, memberId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  const requester = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId,
        userId,
      },
    },
  });

  if (!requester || (requester.role !== "OWNER" && requester.role !== "ADMIN")) {
    throw new Error("Unauthorized to remove team members");
  }

  const memberToRemove = await prisma.teamMember.findUnique({
    where: { id: memberId },
  });

  if (!memberToRemove) throw new Error("Team member not found");

  // Prevent removing the owner
  if (memberToRemove.role === "OWNER") {
    throw new Error("The team owner cannot be removed");
  }

  // Admins cannot remove other admins or owners
  if (requester.role === "ADMIN" && (memberToRemove.role === "ADMIN" || memberToRemove.role === "OWNER")) {
    throw new Error("Admins cannot remove other admins or owners");
  }

  await prisma.teamMember.delete({
    where: { id: memberId },
  });

  revalidatePath("/dashboard/team");
  return { success: true };
}
