"use client";

import { useEffect, useState, use } from "react";
import { getBookingForManagement, cancelBookingWithReason, rescheduleBooking } from "@/app/actions/bookings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Loader2,
  CalendarCheck,
  Globe
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BookingManagePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const bookingId = resolvedParams.id;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals / action states
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [submittingCancel, setSubmittingCancel] = useState(false);

  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [submittingReschedule, setSubmittingReschedule] = useState(false);

  useEffect(() => {
    async function loadBooking() {
      try {
        const res = await getBookingForManagement(bookingId);
        if (res.success && res.booking) {
          setBooking(res.booking);
        } else {
          setError(res.error || "Booking not found");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load booking details");
      } finally {
        setLoading(false);
      }
    }
    loadBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <Card className="max-w-md w-full border-zinc-200 dark:border-zinc-800 shadow-sm text-center p-6">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl">Booking Not Found</CardTitle>
          <CardDescription className="mt-2 text-sm text-zinc-500">
            {error || "The booking link may have expired or is invalid."}
          </CardDescription>
          <div className="mt-6">
            <Link href="/">
              <Button variant="outline" className="w-full">Return to Home</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const startDate = new Date(booking.startTime);
  const endDate = new Date(booking.endTime);
  const isCancelled = booking.status === "CANCELLED";

  const formattedDate = startDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = `${startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

  const handleCancel = async () => {
    setSubmittingCancel(true);
    try {
      const res = await cancelBookingWithReason({
        bookingId,
        reason: cancelReason || "Cancelled by guest",
        cancelledBy: "GUEST",
      });
      if (res.success) {
        toast.success("Meeting has been successfully cancelled.");
        setBooking({ ...booking, status: "CANCELLED" });
        setIsCancelling(false);
      } else {
        toast.error("Failed to cancel meeting.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel meeting.");
    } finally {
      setSubmittingCancel(false);
    }
  };

  const handleReschedule = async () => {
    if (!newDate || !newTime) {
      toast.error("Please select a new date and time.");
      return;
    }

    setSubmittingReschedule(true);
    try {
      const [hours, minutes] = newTime.split(":").map(Number);
      const start = new Date(newDate);
      start.setHours(hours, minutes, 0, 0);

      const durationMinutes = booking.eventType.duration || 30;
      const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

      const res = await rescheduleBooking({
        bookingId,
        newStartTime: start.toISOString(),
        newEndTime: end.toISOString(),
        reason: "Rescheduled by guest",
        rescheduledBy: "GUEST",
      });

      if (res.success && res.booking) {
        toast.success("Meeting successfully rescheduled!");
        setBooking({
          ...booking,
          startTime: res.booking.startTime.toISOString ? res.booking.startTime.toISOString() : res.booking.startTime,
          endTime: res.booking.endTime.toISOString ? res.booking.endTime.toISOString() : res.booking.endTime,
          status: "CONFIRMED",
        });
        setIsRescheduling(false);
      } else {
        toast.error(res.error || "Failed to reschedule booking.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to reschedule booking.");
    } finally {
      setSubmittingReschedule(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Brand header */}
        <div className="flex items-center justify-between pb-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-zinc-900 dark:text-zinc-100">
            <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-black">C</span>
            CalMeet
          </Link>
          <Badge variant={isCancelled ? "destructive" : "default"}>
            {booking.status}
          </Badge>
        </div>

        {/* Main Card */}
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className={`p-6 ${isCancelled ? "bg-red-50/50 dark:bg-red-950/20 border-b border-red-200 dark:border-red-900/30" : "bg-primary/5 border-b border-primary/10"}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground">
                  Meeting Details
                </span>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                  {booking.eventType.title}
                </h1>
                <p className="text-xs text-zinc-500 mt-1">
                  Hosted by <strong className="text-zinc-700 dark:text-zinc-300">{booking.eventType.host.name}</strong>
                </p>
              </div>
              {isCancelled ? (
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 flex items-center justify-center shrink-0">
                  <XCircle className="h-5 w-5" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              )}
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-card">
                <CalendarIcon className="h-4 w-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <div className="text-[11px] text-muted-foreground font-semibold">Date</div>
                  <div className="font-medium text-xs truncate">{formattedDate}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-card">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <div className="text-[11px] text-muted-foreground font-semibold">Time ({booking.eventType.duration} min)</div>
                  <div className="font-medium text-xs truncate">{formattedTime}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-card">
                <User className="h-4 w-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <div className="text-[11px] text-muted-foreground font-semibold">Guest</div>
                  <div className="font-medium text-xs truncate">{booking.guestName} ({booking.guestEmail})</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-card">
                <Globe className="h-4 w-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <div className="text-[11px] text-muted-foreground font-semibold">Host Timezone</div>
                  <div className="font-medium text-xs truncate">{booking.eventType.host.timezone}</div>
                </div>
              </div>
            </div>

            {/* Video Call Link */}
            {booking.meetLink && !isCancelled && (
              <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center shrink-0">
                    <Video className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Video Call Link</p>
                    <a 
                      href={booking.meetLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-primary underline truncate block"
                    >
                      {booking.meetLink}
                    </a>
                  </div>
                </div>
                <a href={booking.meetLink} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="h-8 text-xs font-semibold">Join Call</Button>
                </a>
              </div>
            )}

            {/* Actions for active bookings */}
            {!isCancelled && (
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsRescheduling(!isRescheduling);
                      setIsCancelling(false);
                    }}
                    className="text-xs font-semibold"
                  >
                    Reschedule Meeting
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsCancelling(!isCancelling);
                      setIsRescheduling(false);
                    }}
                    className="text-xs font-semibold text-destructive hover:bg-destructive/10"
                  >
                    Cancel Meeting
                  </Button>
                </div>

                {/* Reschedule Drawer/Box */}
                {isRescheduling && (
                  <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-3">
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Select New Date & Time</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <Label className="text-xs">Date</Label>
                        <Input 
                          type="date" 
                          min={new Date().toISOString().split("T")[0]}
                          value={newDate} 
                          onChange={(e) => setNewDate(e.target.value)} 
                          className="h-9 text-xs" 
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Time</Label>
                        <Input 
                          type="time" 
                          value={newTime} 
                          onChange={(e) => setNewTime(e.target.value)} 
                          className="h-9 text-xs" 
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="ghost" size="sm" onClick={() => setIsRescheduling(false)} className="text-xs">
                        Dismiss
                      </Button>
                      <Button size="sm" onClick={handleReschedule} disabled={submittingReschedule} className="text-xs">
                        {submittingReschedule ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                        Confirm Reschedule
                      </Button>
                    </div>
                  </div>
                )}

                {/* Cancel Drawer/Box */}
                {isCancelling && (
                  <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50/20 dark:bg-red-950/10 space-y-3">
                    <h3 className="text-xs font-bold text-red-600 dark:text-red-400">Cancel This Booking</h3>
                    <div>
                      <Label className="text-xs">Reason for cancellation (optional)</Label>
                      <Input 
                        placeholder="e.g. Schedule conflict, no longer needed" 
                        value={cancelReason} 
                        onChange={(e) => setCancelReason(e.target.value)} 
                        className="h-9 text-xs mt-1" 
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <Button variant="ghost" size="sm" onClick={() => setIsCancelling(false)} className="text-xs">
                        Keep Meeting
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={handleCancel} 
                        disabled={submittingCancel} 
                        className="text-xs"
                      >
                        {submittingCancel ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                        Confirm Cancellation
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
