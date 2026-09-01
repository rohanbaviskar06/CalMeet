"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  ExternalLink,
  MoreVertical,
  Check,
  Copy,
  Plus,
  Calendar,
  Clock,
  Video,
  Share2,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { cancelBooking } from "@/app/actions/bookings";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import Link from "next/link";

export function MeetingActions({ id, meetLink }: { id: string, meetLink?: string | null }) {
  const isCalMeetRoom = meetLink?.includes("/meet/");
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const confirmCancel = async () => {
    setIsCancelling(true);
    try {
      await cancelBooking(id);
      toast.success("Booking cancelled");
      setIsCancelConfirmOpen(false);
    } catch (error) {
      toast.error("Failed to cancel booking");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      {meetLink && (
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 text-xs h-7 px-2.5 rounded-lg border-zinc-200 dark:border-zinc-800 bg-background hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          onClick={() => window.open(meetLink, isCalMeetRoom ? "_self" : "_blank")}
        >
          <ExternalLink className="h-3 w-3" />
          <span>{isCalMeetRoom ? "Join Room" : "Join"}</span>
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            />
          }
        >
          <MoreVertical className="h-3.5 w-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="text-xs">
          {meetLink && (
            <DropdownMenuItem className="gap-2" onClick={() => window.open(meetLink, isCalMeetRoom ? "_self" : "_blank")}>
              <ExternalLink className="h-3.5 w-3.5" /> Open Meeting
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="text-red-600 dark:text-red-400 gap-2" onClick={() => setIsCancelConfirmOpen(true)}>
            Cancel Booking
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isCancelConfirmOpen} onOpenChange={setIsCancelConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Cancel Booking</DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to cancel this booking? This action cannot be undone.
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
              onClick={confirmCancel}
            >
              {isCancelling ? "Cancelling..." : "Yes, Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function ShareLinkBox({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const fullLink = origin ? `${origin}/${username}` : `https://calmeet.app/${username}`;
  const displayLink = origin ? `${origin.replace(/^https?:\/\//, "")}/${username}` : `calmeet.app/${username}`;

  const copy = () => {
    navigator.clipboard.writeText(fullLink);
    setCopied(true);
    toast.success("Public booking link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 p-1.5 pl-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30">
      <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono truncate flex-1">
        {displayLink}
      </span>
      <Button
        size="sm"
        onClick={copy}
        className="h-7 px-3 text-xs font-semibold gap-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition-opacity"
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        <span>{copied ? "Copied" : "Copy"}</span>
      </Button>
    </div>
  );
}

export function DashboardHeaderActions({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const fullLink = origin ? `${origin}/${username}` : `https://calmeet.app/${username}`;

  const copy = () => {
    navigator.clipboard.writeText(fullLink);
    setCopied(true);
    toast.success("Public link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={copy}
        className="h-8 text-xs font-medium gap-1.5 rounded-lg border-zinc-200 dark:border-zinc-800 bg-background text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
        <span className="hidden sm:inline">Copy link</span>
      </Button>

      <Button
        size="sm"
        variant="outline"
        render={
          <a
            href={fullLink}
            target="_blank"
            rel="noopener noreferrer"
          />
        }
        className="h-8 text-xs font-medium gap-1.5 rounded-lg border-zinc-200 dark:border-zinc-800 bg-background text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">View public page</span>
      </Button>

      <Button
        size="sm"
        render={<Link href="/dashboard/event-types" />}
        className="h-8 text-xs font-semibold gap-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition-opacity"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>New Event Type</span>
      </Button>
    </div>
  );
}
