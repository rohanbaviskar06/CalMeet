"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MeetingActions } from "@/components/dashboard/dashboard-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BookingsClientProps {
  initialBookings: any[];
  teamMemberships: any[];
  user: any;
}

export function BookingsClient({ initialBookings, teamMemberships, user }: BookingsClientProps) {
  const [viewMode, setViewMode] = useState<"personal" | "team">("personal");
  const [activeTeamId, setActiveTeamId] = useState<string>("all");
  const [selectedMemberId, setSelectedMemberId] = useState<string>("all");

  const now = new Date();

  // Find all teams the user belongs to as owner/admin
  const adminTeams = teamMemberships
    .filter((m) => m.role === "OWNER" || m.role === "ADMIN")
    .map((m) => m.team);

  // Filter bookings based on view mode
  const getFilteredBookings = () => {
    if (viewMode === "personal") {
      return initialBookings.filter((b) => b.userId === user.id);
    }

    // Team bookings filter logic
    return initialBookings.filter((b) => {
      // Find booking's owner membership status
      const matchMembership = teamMemberships.find(
        (m) => m.userId === b.userId && (activeTeamId === "all" || m.teamId === activeTeamId)
      );

      // Verify the host is a member of the selected team filter, and the host filter matches if selected
      const matchesTeam = !!matchMembership;
      const matchesMember = selectedMemberId === "all" || b.userId === selectedMemberId;

      // Don't show host's own bookings twice if they aren't looking at team context
      return matchesTeam && matchesMember;
    });
  };

  const filteredBookings = getFilteredBookings();

  const upcomingBookings = filteredBookings.filter(
    (b) => new Date(b.startTime) >= now && b.status !== "CANCELLED"
  );
  const pastBookings = filteredBookings.filter(
    (b) => new Date(b.startTime) < now && b.status !== "CANCELLED"
  );
  const canceledBookings = filteredBookings.filter((b) => b.status === "CANCELLED");

  // Get members for the currently selected active team to populate the host filter dropdown
  const getFilterableMembers = () => {
    if (activeTeamId === "all") {
      // Return distinct members across all admined teams
      const allMembers = adminTeams.flatMap((t) => t.members);
      const uniqueIds = Array.from(new Set(allMembers.map((m) => m.userId)));
      return uniqueIds.map((id) => allMembers.find((m) => m.userId === id));
    }
    const selectedTeam = adminTeams.find((t) => t.id === activeTeamId);
    return selectedTeam ? selectedTeam.members : [];
  };

  const filterableMembers = getFilterableMembers();

  return (
    <div className="space-y-6">
      {/* Switcher & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-2xl bg-card">
        {/* Toggle Mode */}
        <div className="flex bg-muted/60 p-1 rounded-xl w-fit">
          <Button
            size="sm"
            variant={viewMode === "personal" ? "default" : "ghost"}
            onClick={() => setViewMode("personal")}
            className="rounded-lg text-xs font-semibold px-4 h-8"
          >
            <Calendar className="mr-1.5 h-3.5 w-3.5" />
            My Bookings
          </Button>
          {adminTeams.length > 0 && (
            <Button
              size="sm"
              variant={viewMode === "team" ? "default" : "ghost"}
              onClick={() => setViewMode("team")}
              className="rounded-lg text-xs font-semibold px-4 h-8"
            >
              <Users className="mr-1.5 h-3.5 w-3.5" />
              Team Bookings
            </Button>
          )}
        </div>

        {/* Filters for Team View */}
        {viewMode === "team" && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-semibold">Team:</span>
              <Select value={activeTeamId} onValueChange={(val: string | null) => {
                if (val) {
                  setActiveTeamId(val);
                  setSelectedMemberId("all");
                }
              }}>
                <SelectTrigger className="w-[160px] h-8 rounded-lg text-xs border bg-background">
                  <SelectValue placeholder="All Teams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  {adminTeams.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-semibold">Host:</span>
              <Select value={selectedMemberId} onValueChange={(val: string | null) => {
                if (val) {
                  setSelectedMemberId(val);
                }
              }}>
                <SelectTrigger className="w-[160px] h-8 rounded-lg text-xs border bg-background">
                  <SelectValue placeholder="All Members" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  {filterableMembers.map((m: any) => (
                    <SelectItem key={m.id} value={m.userId}>
                      {m.user.name || m.user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-6 p-1 bg-muted/60 border rounded-2xl h-11 w-full md:w-fit flex items-center justify-start overflow-x-auto no-scrollbar gap-1 max-w-full">
          <TabsTrigger value="upcoming" className="rounded-xl py-2 px-5 text-xs font-bold transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">Upcoming</TabsTrigger>
          <TabsTrigger value="past" className="rounded-xl py-2 px-5 text-xs font-bold transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">Past</TabsTrigger>
          <TabsTrigger value="canceled" className="rounded-xl py-2 px-5 text-xs font-bold transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">Canceled</TabsTrigger>
          <TabsTrigger value="all" className="rounded-xl py-2 px-5 text-xs font-bold transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">All Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 focus-visible:outline-none">
          {upcomingBookings.length === 0 ? (
            <EmptyState message="No upcoming bookings." />
          ) : (
            upcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} viewMode={viewMode} />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 focus-visible:outline-none">
          {pastBookings.length === 0 ? (
            <EmptyState message="No past bookings." />
          ) : (
            pastBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} viewMode={viewMode} />
            ))
          )}
        </TabsContent>

        <TabsContent value="canceled" className="space-y-4 focus-visible:outline-none">
          {canceledBookings.length === 0 ? (
            <EmptyState message="No canceled bookings." />
          ) : (
            canceledBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} viewMode={viewMode} />
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4 focus-visible:outline-none">
          {filteredBookings.length === 0 ? (
            <EmptyState message="No bookings found." />
          ) : (
            filteredBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} viewMode={viewMode} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card className="border-dashed border-2 bg-transparent shadow-none rounded-2xl">
      <CardContent className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-2">
        <Calendar className="h-8 w-8 opacity-20" />
        <p className="text-sm font-medium">{message}</p>
      </CardContent>
    </Card>
  );
}

function BookingCard({ booking, viewMode }: { booking: any; viewMode: "personal" | "team" }) {
  const isCanceled = booking.status === "CANCELLED";
  const isPast = new Date(booking.startTime) < new Date();

  return (
    <Card className={`hover:bg-muted/30 transition-colors ${isCanceled ? 'opacity-60 border-destructive/20' : ''} ${isPast && !isCanceled ? 'opacity-75' : ''} rounded-2xl overflow-hidden`}>
      <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isCanceled ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
            <Calendar className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-sm truncate">{booking.eventType.title}</h4>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5 text-xs">
              <span className="font-medium text-foreground">{booking.guestName}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{format(new Date(booking.startTime), "MMM d, yyyy • h:mm a")}</span>
              {viewMode === "team" && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <span className="font-semibold text-primary">Host: {booking.user?.name || booking.user?.email || "Unknown"}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          {isCanceled ? (
            <Badge variant="destructive" className="text-[10px] uppercase font-bold">Canceled</Badge>
          ) : (
            <Badge variant={!isPast ? "secondary" : "outline"} className="text-[10px] uppercase font-bold">
              {booking.status}
            </Badge>
          )}
          {!isCanceled && <MeetingActions id={booking.id} meetLink={booking.meetLink} />}
        </div>
      </CardContent>
    </Card>
  );
}
