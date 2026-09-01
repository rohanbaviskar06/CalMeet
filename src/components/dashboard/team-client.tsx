"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Users, 
  Mail, 
  UserPlus, 
  Trash2, 
  X, 
  Check, 
  Plus, 
  Shield, 
  User, 
  Edit3, 
  ExternalLink,
  Copy,
  CheckCheck,
  Sparkles,
  ArrowRight,
  GitBranch,
  ShieldCheck,
  Clock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  createTeam, 
  updateTeamName, 
  inviteTeamMember, 
  cancelInvitation, 
  acceptInvitation, 
  declineInvitation, 
  removeTeamMember 
} from "@/app/actions/team";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { usePricingModal } from "@/components/dashboard/pricing-modal";

interface TeamClientProps {
  user: any;
  activeTeam: any;
  userRole: string | null;
  invitationsReceived: any[];
  initialToken?: string;
  allMemberships?: any[];
}

export function TeamClient({
  user,
  activeTeam,
  userRole,
  invitationsReceived,
  initialToken,
  allMemberships = []
}: TeamClientProps) {
  const router = useRouter();
  const { openPricingModal } = usePricingModal();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [newTeamName, setNewTeamName] = useState(activeTeam?.name || "");

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("MEMBER");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const getMemberStatus = (userId: string) => {
    const hash = userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const statuses = [
      { text: "Online", color: "bg-emerald-500" },
      { text: "In a Meeting", color: "bg-red-500" },
      { text: "Busy", color: "bg-amber-500" },
      { text: "Offline", color: "bg-zinc-400" }
    ];
    return statuses[hash % statuses.length];
  };

  const copyInviteLink = () => {
    if (!activeTeam) return;
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const link = `${baseUrl}/signup?teamId=${activeTeam.id}`;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    toast.success("Invite link copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  useEffect(() => {
    if (initialToken && invitationsReceived.length > 0) {
      const match = invitationsReceived.find(inv => inv.token === initialToken);
      if (match) {
        handleAcceptInvite(match.id, match.team.name);
      }
    }
  }, [initialToken, invitationsReceived]);

  const handleOpenCreateTeamModal = () => {
    if (user?.plan === "FREE") {
      toast.error("Team creation is available on Teams, Organizations, and Enterprise plans.");
      openPricingModal();
      return;
    }

    const ownedTeamsCount = allMemberships.filter((m: any) => m.role === "OWNER").length;
    if (user?.plan === "PRO" && ownedTeamsCount >= 1) {
      toast.error("The Teams plan includes 1 primary team. Upgrade to Organizations to create multiple sub-teams & departments.");
      openPricingModal();
      return;
    }

    setIsCreateOpen(true);
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    setIsLoading(true);
    try {
      const res = await createTeam(teamName);
      if (res.success) {
        toast.success(`Team "${teamName}" created successfully!`);
        setIsCreateOpen(false);
        setTeamName("");
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create team");
      if (err.message?.includes("upgrade") || err.message?.includes("Organizations")) {
        openPricingModal();
      }
    } finally {
      setIsLoading(false);
    }
  };


  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim() || !activeTeam) return;

    setIsLoading(true);
    try {
      const res = await updateTeamName(activeTeam.id, newTeamName);
      if (res.success) {
        toast.success("Team name updated successfully!");
        setIsEditNameOpen(false);
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update team name");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !activeTeam) return;

    setIsLoading(true);
    try {
      const res = await inviteTeamMember(activeTeam.id, inviteEmail, inviteRole);
      if (res.success) {
        toast.success(`Invitation sent to ${inviteEmail}!`);
        setIsInviteOpen(false);
        setInviteEmail("");
        setInviteRole("MEMBER");
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to send invitation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelInvite = async (invitationId: string, email: string) => {
    if (!activeTeam) return;
    try {
      const res = await cancelInvitation(activeTeam.id, invitationId);
      if (res.success) {
        toast.success(`Invitation to ${email} cancelled.`);
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel invitation");
    }
  };

  const handleAcceptInvite = async (invitationId: string, teamName: string) => {
    try {
      const res = await acceptInvitation(invitationId);
      if (res.success) {
        toast.success(`Joined ${teamName}!`);
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to accept invitation");
    }
  };

  const handleDeclineInvite = async (invitationId: string) => {
    try {
      const res = await declineInvitation(invitationId);
      if (res.success) {
        toast.info("Invitation declined.");
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to decline invitation");
    }
  };

  const handleRemoveMember = async (targetUserId: string, memberName: string) => {
    if (!activeTeam) return;
    if (!confirm(`Are you sure you want to remove ${memberName} from the team?`)) return;

    try {
      const res = await removeTeamMember(activeTeam.id, targetUserId);
      if (res.success) {
        toast.success(`${memberName} has been removed.`);
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to remove member");
    }
  };

  const isOwnerOrAdmin = userRole === "OWNER" || userRole === "ADMIN";

  // Pending invites notification
  const receivedSection = invitationsReceived.length > 0 && (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-zinc-50 dark:bg-zinc-900/50 shadow-sm space-y-3">
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
        <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
          Pending Invitations ({invitationsReceived.length})
        </h3>
      </div>
      <div className="space-y-2">
        {invitationsReceived.map((invite) => (
          <div
            key={invite.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-card border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs"
          >
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {invite.team.name}
              </span>
              <span className="text-zinc-400 ml-2">Role: {invite.role}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => handleAcceptInvite(invite.id, invite.team.name)}
                className="h-7 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-md gap-1"
              >
                <Check className="h-3 w-3" /> Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDeclineInvite(invite.id)}
                className="h-7 px-3 text-xs border-zinc-200 dark:border-zinc-800 rounded-md gap-1"
              >
                <X className="h-3 w-3" /> Decline
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-2 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Teams
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Manage your organization, round-robin distribution, and team members.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {activeTeam && allMemberships.length > 1 && (
            <Select 
              value={activeTeam.id} 
              onValueChange={(teamId) => {
                router.push(`/dashboard/team?teamId=${teamId}`);
                router.refresh();
              }}
            >
              <SelectTrigger className="w-[180px] h-9 text-xs rounded-lg border-zinc-200 dark:border-zinc-800">
                <SelectValue placeholder="Switch team" />
              </SelectTrigger>
              <SelectContent>
                {allMemberships.map((m) => (
                  <SelectItem key={m.team.id} value={m.team.id} className="text-xs">
                    {m.team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button
            onClick={handleOpenCreateTeamModal}
            size="sm"
            className="h-9 px-3.5 gap-1.5 rounded-lg text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Team</span>
          </Button>
        </div>
      </div>

      {receivedSection}

      {/* If No Active Team: Cal.com Inspired Feature Promo Hero */}
      {!activeTeam ? (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-card shadow-sm grid grid-cols-1 md:grid-cols-12">
          {/* Left Column: Feature Highlights */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                <Users className="h-3.5 w-3.5" />
                <span>Teams</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Automatically route meetings to your team
              </h2>

              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                Turn individual scheduling into a collaborative system that assigns, distributes, and manages bookings across all team members.
              </p>

              <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                  <span>Route inbound requests to the right person based on criteria</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                  <span>Distribute meetings fairly with round-robin availability</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                  <span>See team performance analytics and booking conversion</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                onClick={handleOpenCreateTeamModal}
                size="sm"
                className="h-9 px-4 text-xs font-medium gap-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
              >
                <span>{user?.plan === "FREE" ? "Upgrade to Teams" : "Create a Team"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>


          {/* Right Column: Visual Diagram */}
          <div className="md:col-span-5 bg-zinc-50 dark:bg-zinc-900/50 border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-800 p-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-xs space-y-3">
              {/* Form answers node */}
              <div className="p-3 bg-card rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-semibold">
                  👤
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">Customer Request</div>
                  <div className="text-[11px] text-zinc-400">Enterprise Sales Inquiry</div>
                </div>
              </div>

              {/* Connector */}
              <div className="flex justify-center">
                <div className="w-0.5 h-4 bg-zinc-300 dark:bg-zinc-700" />
              </div>

              {/* Round-robin Router Node */}
              <div className="p-3 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-xl shadow-sm text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
                  Round-Robin Routing
                </span>
                <span className="text-xs font-semibold">Distributes to Next Available Host</span>
              </div>

              {/* Connector */}
              <div className="flex justify-center">
                <div className="w-0.5 h-4 bg-zinc-300 dark:bg-zinc-700" />
              </div>

              {/* Assigned Host Node */}
              <div className="p-3 bg-card rounded-xl border border-emerald-500/30 shadow-xs flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">Meeting Confirmed</div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Assigned to Account Executive
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Team Members & Details View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Team Info Card */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 bg-card shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                  {activeTeam.name}
                </h3>
                <span className="text-xs text-zinc-400">
                  Your Role: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{userRole}</span>
                </span>
              </div>
              {userRole === "OWNER" && (
                <button
                  onClick={() => setIsEditNameOpen(true)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="text-xs text-zinc-500 space-y-1.5 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex justify-between">
                <span>Members:</span>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">{activeTeam.members?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Pending Invites:</span>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">{activeTeam.invitations?.length || 0}</span>
              </div>
            </div>

            {isOwnerOrAdmin && (
              <div className="space-y-2 pt-2">
                <Button
                  onClick={() => setIsInviteOpen(true)}
                  size="sm"
                  className="w-full h-8 text-xs gap-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                >
                  <UserPlus className="h-3.5 w-3.5" /> Invite Member
                </Button>
                <Button
                  onClick={copyInviteLink}
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs gap-1.5 rounded-lg border-zinc-200 dark:border-zinc-800"
                >
                  {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {isCopied ? "Link Copied" : "Copy Invite Link"}
                </Button>
              </div>
            )}
          </div>

          {/* Members List */}
          <div className="lg:col-span-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-card overflow-hidden shadow-sm">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between">
              <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                Team Members ({activeTeam.members?.length || 0})
              </span>
            </div>

            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {activeTeam.members?.map((member: any) => {
                const isCurrentUser = member.user.id === user.id;
                const status = getMemberStatus(member.user.id);

                return (
                  <div
                    key={member.id}
                    className="p-4 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={member.user.image} />
                        <AvatarFallback className="rounded-lg text-xs font-semibold">
                          {member.user.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {member.user.name}
                          </span>
                          {isCurrentUser && (
                            <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.2 rounded text-zinc-500">
                              You
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-zinc-400">{member.user.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {member.role}
                      </span>
                      {isOwnerOrAdmin && !isCurrentUser && (
                        <button
                          onClick={() => handleRemoveMember(member.user.id, member.user.name)}
                          className="p-1 text-zinc-400 hover:text-red-500 rounded"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Create Team Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleCreateTeam}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Create a new team</DialogTitle>
              <DialogDescription className="text-xs">
                Set up a team workspace for your company or department.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  placeholder="Acme Sales"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Team"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Invite Member Dialog */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSendInvite}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Invite a teammate</DialogTitle>
              <DialogDescription className="text-xs">
                Send an email invitation to join {activeTeam?.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="invite-email">Teammate Email</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="invite-role">Role</Label>
                <Select value={inviteRole} onValueChange={(val) => setInviteRole(val || "MEMBER")}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MEMBER" className="text-xs">Member</SelectItem>
                    <SelectItem value="ADMIN" className="text-xs">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsInviteOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Invite"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
