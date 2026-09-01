"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { 
  CalendarDays, 
  Clock, 
  Users, 
  Video, 
  Search, 
  Filter, 
  ExternalLink, 
  X, 
  RotateCcw,
  CheckCircle2,
  Calendar as CalendarIcon,
  AlertCircle,
  MoreVertical,
  Download,
  Copy,
  Check,
  User,
  Mail,
  FileText,
  Trash2,
  Globe
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cancelBooking } from "@/app/actions/bookings";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BookingsClientProps {
  initialBookings: any[];
  teamMemberships: any[];
  user: any;
}

type BookingTab = "upcoming" | "unconfirmed" | "recurring" | "past" | "canceled";

export function BookingsClient({ initialBookings, teamMemberships, user }: BookingsClientProps) {
  const [activeTab, setActiveTab] = useState<BookingTab>("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"personal" | "team">("personal");
  
  // Selected booking for detailed view modal
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [bookingToCancelId, setBookingToCancelId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const now = new Date();

  // Admin teams check
  const adminTeams = teamMemberships
    .filter((m) => m.role === "OWNER" || m.role === "ADMIN")
    .map((m) => m.team);

  // Filter bookings based on view mode
  const getBaseBookings = () => {
    if (viewMode === "personal") {
      return initialBookings.filter((b) => b.userId === user.id);
    }
    return initialBookings;
  };

  const baseBookings = getBaseBookings();

  // Search filter
  const searchedBookings = baseBookings.filter((b) => {
    const q = searchQuery.toLowerCase();
    return (
      b.guestName?.toLowerCase().includes(q) ||
      b.guestEmail?.toLowerCase().includes(q) ||
      b.eventType?.title?.toLowerCase().includes(q) ||
      b.notes?.toLowerCase().includes(q)
    );
  });

  // Categorize by tabs
  const upcomingBookings = searchedBookings.filter(
    (b) => new Date(b.startTime) >= now && b.status !== "CANCELLED" && b.status !== "UNCONFIRMED"
  );
  const unconfirmedBookings = searchedBookings.filter((b) => b.status === "UNCONFIRMED");
  const pastBookings = searchedBookings.filter(
    (b) => new Date(b.startTime) < now && b.status !== "CANCELLED"
  );
  const canceledBookings = searchedBookings.filter((b) => b.status === "CANCELLED");
  const recurringBookings = searchedBookings.filter((b) => b.isRecurring);

  const getCurrentTabList = () => {
    switch (activeTab) {
      case "upcoming":
        return upcomingBookings;
      case "unconfirmed":
        return unconfirmedBookings;
      case "recurring":
        return recurringBookings;
      case "past":
        return pastBookings;
      case "canceled":
        return canceledBookings;
      default:
        return upcomingBookings;
    }
  };

  const currentList = getCurrentTabList();

  const tabs: { key: BookingTab; label: string; count: number }[] = [
    { key: "upcoming", label: "Upcoming", count: upcomingBookings.length },
    { key: "unconfirmed", label: "Unconfirmed", count: unconfirmedBookings.length },
    { key: "recurring", label: "Recurring", count: recurringBookings.length },
    { key: "past", label: "Past", count: pastBookings.length },
    { key: "canceled", label: "Canceled", count: canceledBookings.length },
  ];

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(id);
    toast.success("Meeting link copied to clipboard!");
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancelId) return;
    setIsCancelling(true);
    try {
      await cancelBooking(bookingToCancelId);
      toast.success("Booking cancelled successfully.");
      setIsCancelConfirmOpen(false);
      setIsDetailModalOpen(false);
      setBookingToCancelId(null);
    } catch (error) {
      toast.error("Failed to cancel booking.");
    } finally {
      setIsCancelling(false);
    }
  };

  const exportToCSV = () => {
    if (baseBookings.length === 0) {
      toast.error("No bookings to export.");
      return;
    }

    const headers = ["ID", "Event Type", "Guest Name", "Guest Email", "Start Time", "End Time", "Status", "Meeting URL"];
    const rows = baseBookings.map(b => [
      b.id,
      `"${b.eventType?.title || "Meeting"}"`,
      `"${b.guestName || ""}"`,
      `"${b.guestEmail || ""}"`,
      `"${new Date(b.startTime).toISOString()}"`,
      `"${new Date(b.endTime).toISOString()}"`,
      b.status,
      `"${b.meetingUrl || ""}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `calmeet-bookings-${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Bookings exported to CSV!");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Bookings
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            See upcoming, past, and canceled bookings and take actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Team / Personal Toggle if user has admin teams */}
          {adminTeams.length > 0 && (
            <div className="inline-flex p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs font-semibold">
              <button
                onClick={() => setViewMode("personal")}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-all cursor-pointer",
                  viewMode === "personal"
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                )}
              >
                My Bookings
              </button>
              <button
                onClick={() => setViewMode("team")}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-all cursor-pointer",
                  viewMode === "team"
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                )}
              >
                Team Bookings
              </button>
            </div>
          )}

          <Button
            onClick={exportToCSV}
            variant="outline"
            size="sm"
            className="h-9 px-3 gap-1.5 text-xs rounded-xl border-zinc-200 dark:border-zinc-800 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        {/* Horizontal Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer",
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                )}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded-md text-[10px] font-bold leading-none",
                      isActive
                        ? "bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900"
                        : "bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-60">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="search"
            placeholder="Search by guest, title, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8.5 pl-8 pr-3 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-background text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
          />
        </div>
      </div>

      {/* Bookings List or Empty State */}
      {currentList.length === 0 ? (
        <div className="border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-16 text-center flex flex-col items-center justify-center bg-white dark:bg-zinc-950 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 mb-4 border border-zinc-200/60 dark:border-zinc-800">
            <CalendarDays className="h-6 w-6" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
            No {activeTab} bookings
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm leading-relaxed">
            {activeTab === "upcoming"
              ? "You have no upcoming bookings. As soon as someone books a time with you it will show up here."
              : `You have no ${activeTab} bookings recorded.`}
          </p>
        </div>
      ) : (
        <div className="border border-zinc-200/80 dark:border-zinc-800 rounded-2xl divide-y divide-zinc-200/80 dark:divide-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-2xs">
          {currentList.map((booking) => {
            const start = new Date(booking.startTime);
            const end = new Date(booking.endTime);
            const isGoogleMeet = booking.meetingUrl?.includes("meet.google.com");
            const isZoom = booking.meetingUrl?.includes("zoom.us");
            const isCanceled = booking.status === "CANCELLED";

            return (
              <div
                key={booking.id}
                onClick={() => {
                  setSelectedBooking(booking);
                  setIsDetailModalOpen(true);
                }}
                className="group p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 cursor-pointer"
              >
                {/* Left: Calendar Date Badge & Title Info */}
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  {/* Calendar Date Block */}
                  <div className="hidden sm:flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shrink-0 shadow-2xs">
                    <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight">
                      {format(start, "MMM")}
                    </span>
                    <span className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-none">
                      {format(start, "d")}
                    </span>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors truncate">
                        {booking.eventType?.title || "Meeting"}
                      </span>
                      <span className="text-xs text-zinc-400">between you and</span>
                      <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        {booking.guestName}
                      </span>

                      {/* Status Badges */}
                      {isCanceled ? (
                        <span className="bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/20">
                          Canceled
                        </span>
                      ) : (
                        <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                          Confirmed
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 flex-wrap">
                      <span className="flex items-center gap-1 font-medium text-zinc-600 dark:text-zinc-300">
                        <Clock className="h-3.5 w-3.5 text-zinc-400" />
                        {format(start, "EEEE, MMMM d, yyyy")} • {format(start, "h:mm a")} - {format(end, "h:mm a")}
                      </span>

                      {booking.guestEmail && (
                        <span className="text-zinc-400">• {booking.guestEmail}</span>
                      )}
                    </div>

                    {booking.notes && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 italic line-clamp-1 pt-0.5">
                        &ldquo;{booking.notes}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Join meeting & 3-dots Menu */}
                <div 
                  className="flex items-center gap-2.5 self-end md:self-auto shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  {booking.meetingUrl && !isCanceled && (
                    <a
                      href={booking.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="sm"
                        className="h-8 px-3 text-xs gap-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer shadow-2xs font-semibold"
                      >
                        <Video className="h-3.5 w-3.5" />
                        <span>Join</span>
                      </Button>
                    </a>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer outline-none">
                      <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44 text-xs">
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedBooking(booking);
                          setIsDetailModalOpen(true);
                        }}
                        className="cursor-pointer gap-2"
                      >
                        <FileText className="h-3.5 w-3.5" /> View Details
                      </DropdownMenuItem>

                      {booking.meetingUrl && (
                        <DropdownMenuItem 
                          onClick={() => handleCopyLink(booking.meetingUrl, booking.id)}
                          className="cursor-pointer gap-2"
                        >
                          <Copy className="h-3.5 w-3.5" /> Copy Meeting Link
                        </DropdownMenuItem>
                      )}

                      {!isCanceled && (
                        <DropdownMenuItem 
                          onClick={() => {
                            setBookingToCancelId(booking.id);
                            setIsCancelConfirmOpen(true);
                          }}
                          className="cursor-pointer gap-2 text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Cancel Booking
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Booking Detailed View */}
      {selectedBooking && (
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {selectedBooking.eventType?.title || "Meeting Details"}
                </span>
                {selectedBooking.status === "CANCELLED" ? (
                  <span className="bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/20">
                    Canceled
                  </span>
                ) : (
                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Confirmed
                  </span>
                )}
              </div>
              <DialogDescription className="text-xs">
                Scheduled via CalMeet
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3 text-xs">
              {/* Date & Time Info */}
              <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-2">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-semibold">
                  <CalendarIcon className="h-4 w-4 text-zinc-400" />
                  <span>
                    {format(new Date(selectedBooking.startTime), "EEEE, MMMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                  <Clock className="h-4 w-4 text-zinc-400" />
                  <span>
                    {format(new Date(selectedBooking.startTime), "h:mm a")} - {format(new Date(selectedBooking.endTime), "h:mm a")}
                  </span>
                </div>
              </div>

              {/* Guest & Host Info */}
              <div className="space-y-2">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 block">Participants</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-card space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Guest</span>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">{selectedBooking.guestName}</div>
                    <div className="text-[11px] text-zinc-500 truncate">{selectedBooking.guestEmail}</div>
                  </div>

                  <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-card space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Host</span>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">{user.name || "Host"}</div>
                    <div className="text-[11px] text-zinc-500 truncate">{user.email}</div>
                  </div>
                </div>
              </div>

              {/* Meeting URL */}
              {selectedBooking.meetingUrl && (
                <div className="space-y-1.5">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 block">Meeting Link</span>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={selectedBooking.meetingUrl}
                      className="w-full h-9 px-3 text-xs font-mono rounded-xl border border-zinc-200 dark:border-zinc-800 bg-background text-zinc-900 dark:text-zinc-100"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleCopyLink(selectedBooking.meetingUrl, "modal")}
                      className="h-9 px-3 text-xs shrink-0"
                    >
                      {copiedLink === "modal" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedBooking.notes && (
                <div className="space-y-1">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 block">Guest Notes</span>
                  <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 text-zinc-700 dark:text-zinc-300 italic">
                    &ldquo;{selectedBooking.notes}&rdquo;
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex justify-between sm:justify-between items-center pt-2">
              {selectedBooking.status !== "CANCELLED" ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setBookingToCancelId(selectedBooking.id);
                    setIsCancelConfirmOpen(true);
                  }}
                  className="text-xs h-8"
                >
                  Cancel Booking
                </Button>
              ) : <div />}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDetailModalOpen(false)}
                className="text-xs h-8 border-zinc-200 dark:border-zinc-800"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal: Cancel Confirmation */}
      <Dialog open={isCancelConfirmOpen} onOpenChange={setIsCancelConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Cancel Booking</DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to cancel this booking? An automatic notification will be sent to the attendee.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8"
              disabled={isCancelling}
              onClick={() => setIsCancelConfirmOpen(false)}
            >
              No, Keep
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="text-xs h-8"
              disabled={isCancelling}
              onClick={handleConfirmCancel}
            >
              {isCancelling ? "Cancelling..." : "Yes, Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
