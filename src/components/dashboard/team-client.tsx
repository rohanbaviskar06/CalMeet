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
  Loader2,
  Copy,
  CheckCheck
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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [newTeamName, setNewTeamName] = useState(activeTeam?.name || "");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("MEMBER");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Generate mock static status designations for team members based on their id
  const getMemberStatus = (userId: string) => {
    const hash = userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const statuses = [
      { text: "Online", color: "bg-emerald-500" },
      { text: "In a Meeting", color: "bg-red-500" },
      { text: "Busy", color: "bg-red-400" },
      { text: "Offline", color: "bg-zinc-400" }
    ];
    return statuses[hash % statuses.length];
  };

  const copyInviteLink = () => {
    if (!activeTeam) return;
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    // We can generate a generic signup URL that includes reference to this team invitation token or ID
    // Let's create a beautiful generic landing link
    const link = `${baseUrl}/signup?teamId=${activeTeam.id}`;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    toast.success("Invite link copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  // If there's an initialToken, try to handle it automatically
  useEffect(() => {
    if (initialToken && invitationsReceived.length > 0) {
      const match = invitationsReceived.find(inv => inv.token === initialToken);
      if (match) {
        handleAcceptInvite(match.id, match.team.name);
      }
    }
  }, [initialToken, invitationsReceived]);

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
        toast.success("Invitation declined.");
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to decline invitation");
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!activeTeam) return;
    if (!confirm(`Are you sure you want to remove ${memberName} from the team?`)) return;

    try {
      const res = await removeTeamMember(activeTeam.id, memberId);
      if (res.success) {
        toast.success(`${memberName} has been removed from the team.`);
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to remove member");
    }
  };

  const isOwnerOrAdmin = userRole === "OWNER" || userRole === "ADMIN";

  // Case 1: Received invitations (show these first to join a team)
  const receivedSection = invitationsReceived.length > 0 && (
    <Card className="border-primary/30 bg-gradient-to-r from-primary/5 via-violet-500/5 to-background overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary animate-bounce" />
          Pending Invitations to Join Teams
        </CardTitle>
        <CardDescription>
          You have been invited to join the following teams. Accept to collaborate.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {invitationsReceived.map((invite) => (
          <div key={invite.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border bg-background/80 backdrop-blur-sm shadow-sm gap-3">
            <div>
              <h4 className="font-semibold text-base">{invite.team.name}</h4>
              <p className="text-sm text-muted-foreground mt-0.5">
                Invited by: {invite.team.owner.name || invite.team.owner.email} as <Badge variant="outline" className="ml-1 text-xs">{invite.role}</Badge>
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                onClick={() => handleAcceptInvite(invite.id, invite.team.name)}
                className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                size="sm"
              >
                <Check className="h-4 w-4" /> Accept
              </Button>
              <Button 
                onClick={() => handleDeclineInvite(invite.id)}
                variant="outline"
                className="flex-1 sm:flex-initial border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-950 dark:hover:bg-red-950/20 gap-1.5"
                size="sm"
              >
                <X className="h-4 w-4" /> Decline
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const activeStatus = activeTeam ? getMemberStatus(user.id) : null;

  return (
    <div className="space-y-6">
      {receivedSection}

      {/* Switcher & Create Top Bar */}
      {activeTeam && allMemberships.length > 1 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-2xl bg-card">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active Team:</span>
            <Select 
              value={activeTeam.id} 
              onValueChange={(teamId) => {
                // Instantly redirect to filter search param for other team if needed
                // For simplicity, we can reload path with selected team token or redirect
                // Since parent page filters, we could update via router
                router.push(`/dashboard/team?teamId=${teamId}`);
                router.refresh();
              }}
            >
              <SelectTrigger className="w-[200px] h-9 rounded-xl border bg-background">
                <SelectValue placeholder="Switch team" />
              </SelectTrigger>
              <SelectContent>
                {allMemberships.map((membership) => (
                  <SelectItem key={membership.team.id} value={membership.team.id}>
                    {membership.team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} variant="outline" size="sm" className="rounded-xl gap-1">
            <Plus className="h-4 w-4" /> Create Another Team
          </Button>
        </div>
      )}

      {!activeTeam ? (
        <Card className="hover:shadow-md transition-shadow duration-300">
          <CardHeader className="text-center py-10">
            <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <Users className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Create or Join a Team</CardTitle>
            <CardDescription className="max-w-md mx-auto mt-2">
              Teams allow multiple team members to manage schedules, view bookings, and run routing forms together.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-10">
            <Button onClick={() => setIsCreateOpen(true)} size="lg" className="px-8 shadow-lg hover:shadow-primary/20 transition-all gap-2">
              <Plus className="h-5 w-5" /> Create a New Team
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Team Details and Members */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Team Details Sidebar Card */}
            <Card className="md:col-span-1 border-primary/20 bg-gradient-to-b from-primary/5 to-background">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold truncate max-w-[200px]" title={activeTeam.name}>
                    {activeTeam.name}
                  </CardTitle>
                  {userRole === "OWNER" && (
                    <Button
                      onClick={() => setIsEditNameOpen(true)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-lg shrink-0"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <CardDescription>
                  Role: <Badge variant="secondary" className="ml-1 text-[10px] tracking-wider uppercase">{userRole}</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-xs text-muted-foreground flex flex-col gap-1.5 pb-2 border-b">
                  <span className="font-semibold text-foreground">Team stats:</span>
                  <span>• Members: {activeTeam.members.length}</span>
                  <span>• Pending invites: {activeTeam.invitations.length}</span>
                  <span>• Created: {new Date(activeTeam.createdAt).toLocaleDateString()}</span>
                </div>
                {isOwnerOrAdmin && (
                  <div className="space-y-2 pt-2">
                    <Button onClick={() => setIsInviteOpen(true)} className="w-full gap-2 shadow-sm">
                      <UserPlus className="h-4 w-4" /> Invite Member
                    </Button>
                    <Button onClick={copyInviteLink} variant="outline" className="w-full gap-2 border bg-background shrink-0">
                      {isCopied ? <CheckCheck className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                      {isCopied ? "Link Copied" : "Copy Invite Link"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Members List */}
            <Card className="md:col-span-2 hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage members and their roles in your team.</CardDescription>
                </div>
                <Badge variant="outline">{activeTeam.members.length} Total</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeTeam.members.map((member: any) => {
                    const isSelf = member.userId === user.id;
                    const isMemberOwner = member.role === "OWNER";
                    const isMemberAdmin = member.role === "ADMIN";
                    const statusInfo = getMemberStatus(member.userId);
                    
                    return (
                      <div key={member.id} className="flex items-center justify-between p-3.5 rounded-xl border bg-card hover:bg-muted/30 transition-colors gap-4">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="relative shrink-0">
                            <Avatar className="h-10 w-10 border shadow-sm">
                              <AvatarImage src={member.user.image || undefined} />
                              <AvatarFallback className="bg-primary/5 text-primary font-bold">
                                {member.user.name?.charAt(0) || member.user.email?.charAt(0).toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <span 
                              className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-background ${statusInfo.color}`} 
                              title={statusInfo.text}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm truncate">
                                {member.user.name || "User"}
                              </span>
                              {isSelf && (
                                <Badge variant="outline" className="text-[9px] bg-primary/5 text-primary font-bold px-1.5 py-0.5 rounded select-none uppercase">
                                  You
                                </Badge>
                              )}
                              <span className="text-[10px] text-muted-foreground">• {statusInfo.text}</span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{member.user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground capitalize">
                            {isMemberOwner ? (
                              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none text-[10px] tracking-wider uppercase font-extrabold gap-1">
                                <Shield className="h-3 w-3" /> Owner
                              </Badge>
                            ) : isMemberAdmin ? (
                              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-none text-[10px] tracking-wider uppercase font-bold gap-1">
                                <Shield className="h-3 w-3" /> Admin
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-[10px] tracking-wider uppercase font-medium gap-1">
                                <User className="h-3 w-3" /> Member
                              </Badge>
                            )}
                          </div>
                          
                          {isOwnerOrAdmin && !isSelf && !isMemberOwner && (
                            // Admins can't delete other admins or owners
                            !(userRole === "ADMIN" && isMemberAdmin) && (
                              <Button
                                onClick={() => handleRemoveMember(member.id, member.user.name || member.user.email)}
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-red-50 text-muted-foreground hover:text-red-600 dark:hover:bg-red-950/20 rounded-lg shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Invitations Section */}
          {isOwnerOrAdmin && activeTeam.invitations.length > 0 && (
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Sent Invitations</CardTitle>
                <CardDescription>Invitations sent to team members that are currently pending.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-xl border">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50 text-muted-foreground font-semibold">
                        <th className="p-4">Email</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Sent Date</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {activeTeam.invitations.map((invite: any) => (
                        <tr key={invite.id} className="hover:bg-muted/10 transition-colors">
                          <td className="p-4 font-medium flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {invite.email}
                          </td>
                          <td className="p-4">
                            <Badge variant="secondary" className="text-[10px] uppercase font-bold">{invite.role}</Badge>
                          </td>
                          <td className="p-4 text-xs text-muted-foreground">
                            {new Date(invite.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-right">
                            <Button
                              onClick={() => handleCancelInvite(invite.id, invite.email)}
                              variant="ghost"
                              size="sm"
                              className="hover:bg-red-50 text-red-600 hover:text-red-700 dark:hover:bg-red-950/20 h-8 px-2 rounded-lg"
                            >
                              Revoke
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Render ALL dialogs unconditionally at the end so hooks are always rendered */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Team</DialogTitle>
            <DialogDescription>
              Set up a team space for your company or group. You'll be the owner.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateTeam}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  placeholder="e.g. Acme Marketing"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-1.5">
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Create Team
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an email invitation to join this team.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSendInvite}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="invite-email">Email Address</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="collaborator@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invite-role">Role</Label>
                <Select value={inviteRole} onValueChange={(value) => setInviteRole(value || "MEMBER")} disabled={isLoading}>
                  <SelectTrigger id="invite-role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MEMBER">Member (Read & Collaborate)</SelectItem>
                    <SelectItem value="ADMIN">Admin (Invite & Manage members)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsInviteOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-1.5">
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Send Invite
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditNameOpen} onOpenChange={setIsEditNameOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Team Name</DialogTitle>
            <DialogDescription>
              Change the display name of your team.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateName}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-team-name">Team Name</Label>
                <Input
                  id="edit-team-name"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditNameOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-1.5">
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
