"use client";

import { useEffect, useState, use, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
  Globe,
  Lock,
  ShieldAlert
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

function BookingManageContent({ bookingId }: { bookingId: string }) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || undefined;

  const [booking, setBooking] = useState<any>(null);
  const [tokenState, setTokenState] = useState<string | undefined>(token);
  const [roleState, setRoleState] = useState<"HOST" | "GUEST">("GUEST");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

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
        const res = await getBookingForManagement(bookingId, token);
        if (res.success && res.booking) {
          setBooking(res.booking);
          if (res.token) setTokenState(res.token);
          if (res.role) setRoleState(res.role);
        } else if (res.unauthorized) {
          setIsUnauthorized(true);
          setError(res.error || "Secure authorization required");
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
  }, [bookingId, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Verifying booking security & loading details...</p>
        </div>
      </div>
    );
  }

  if (isUnauthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <Card className="max-w-md w-full border-zinc-200 dark:border-zinc-800 shadow-sm text-center p-6 space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center mx-auto">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-xl">Authentication Required</CardTitle>
            <CardDescription className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              To protect scheduling privacy and prevent unauthorized tampering, managing this booking requires account sign-in or the secure guest link from your confirmation email.
            </CardDescription>
          </div>
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-left text-xs space-y-2 border border-zinc-200 dark:border-zinc-800">
            <div className="font-semibold text-zinc-800 dark:text-zinc-200">How to access:</div>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400">
              <li>Click the <strong>Manage Your Booking</strong> link in your email confirmation.</li>
              <li>Or sign in with the Google or email account associated with this meeting.</li>
            </ul>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <Link href="/login" className="flex-1">
              <Button className="w-full text-xs h-9 font-semibold">Sign In</Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full text-xs h-9">Return Home</Button>
            </Link>
          </div>
        </Card>
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
        cancelledBy: roleState,
        token: tokenState,
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
        rescheduledBy: roleState,
        token: tokenState,
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
                  Hosted by {booking.eventType.host.name}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center font-bold text-sm text-zinc-700 dark:text-zinc-300">
                {booking.eventType.host.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Meta info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CalendarIcon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-muted-foreground">Date</div>
                  <div className="text-sm font-medium">{formattedDate}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-muted-foreground">Time & Duration</div>
                  <div className="text-sm font-medium">{formattedTime} ({booking.eventType.duration}m)</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-muted-foreground">Attendee</div>
                  <div className="text-sm font-medium">{booking.guestName}</div>
                  <div className="text-xs text-muted-foreground">{booking.guestEmail}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-muted-foreground">Timezone</div>
                  <div className="text-sm font-medium">{booking.eventType.host.timezone}</div>
                </div>
              </div>
            </div>

            {/* Video Call Link */}
            {booking.meetLink && !isCancelled && (
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Video className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Video Meeting Room</div>
                    <div className="text-[11px] text-zinc-500 truncate max-w-[240px] sm:max-w-xs">{booking.meetLink}</div>
                  </div>
                </div>
                <a href={booking.meetLink} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="h-8 text-xs font-semibold">
                    Join Video Call
                  </Button>
                </a>
              </div>
            )}

            {/* Notes if any */}
            {booking.notes && (
              <div className="space-y-1.5 border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
                <div className="text-xs font-semibold text-muted-foreground">Notes / Agenda</div>
                <div className="text-xs text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900 p-3 rounded-lg border border-zinc-200/50 dark:border-zinc-800 whitespace-pre-wrap">
                  {booking.notes.replace(/\[GCAL_EVENT_ID:[^\]]+\]/g, "").replace(/\[REMINDER_SENT\]/g, "").trim()}
                </div>
              </div>
            )}

            {/* Status alerts */}
            {isCancelled && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <XCircle className="h-4 w-4 shrink-0" />
                <span>This meeting was cancelled. You can book a new session anytime.</span>
              </div>
            )}

            {/* Actions: Reschedule or Cancel */}
            {!isCancelled && !isCancelling && !isRescheduling && (
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => setIsRescheduling(true)}
                  variant="outline" 
                  className="flex-1 text-xs font-semibold h-10 border-zinc-200 dark:border-zinc-800"
                >
                  <CalendarCheck className="h-4 w-4 mr-1.5 text-primary" /> Reschedule Meeting
                </Button>
                <Button 
                  onClick={() => setIsCancelling(true)}
                  variant="outline" 
                  className="flex-1 text-xs font-semibold h-10 border-red-200 dark:border-red-950 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <XCircle className="h-4 w-4 mr-1.5" /> Cancel Meeting
                </Button>
              </div>
            )}

            {/* Cancel Form */}
            {isCancelling && (
              <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/20 dark:bg-red-950/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-red-700 dark:text-red-400">Cancel Appointment</h3>
                  <Button variant="ghost" size="sm" onClick={() => setIsCancelling(false)} className="h-7 text-xs">
                    Dismiss
                  </Button>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Reason for cancellation (optional)</Label>
                  <Input 
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="e.g. Schedule conflict, no longer needed..."
                    className="text-xs h-9 bg-white dark:bg-zinc-900"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleCancel} 
                    disabled={submittingCancel}
                    variant="destructive" 
                    size="sm" 
                    className="h-8 text-xs font-semibold"
                  >
                    {submittingCancel ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                    Confirm Cancellation
                  </Button>
                  <Button 
                    onClick={() => setIsCancelling(false)} 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs"
                  >
                    Back
                  </Button>
                </div>
              </div>
            )}

            {/* Reschedule Form */}
            {isRescheduling && (
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Select New Date & Time</h3>
                  <Button variant="ghost" size="sm" onClick={() => setIsRescheduling(false)} className="h-7 text-xs">
                    Dismiss
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">New Date</Label>
                    <Input 
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="text-xs h-9 bg-white dark:bg-zinc-950"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">New Start Time</Label>
                    <Input 
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="text-xs h-9 bg-white dark:bg-zinc-950"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleReschedule} 
                    disabled={submittingReschedule}
                    size="sm" 
                    className="h-8 text-xs font-semibold"
                  >
                    {submittingReschedule ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                    Confirm Reschedule
                  </Button>
                  <Button 
                    onClick={() => setIsRescheduling(false)} 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs"
                  >
                    Back
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer link */}
        <div className="text-center">
          <Link href={`/${booking.eventType.host.username}`}>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
              Book another meeting with {booking.eventType.host.name} <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BookingManagePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const bookingId = resolvedParams.id;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Loading booking portal...</p>
          </div>
        </div>
      }
    >
      <BookingManageContent bookingId={bookingId} />
    </Suspense>
  );
}
