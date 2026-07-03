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
  Copy
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
    <div className="flex items-center gap-2">
      {meetLink && (
        <Button
          size="sm"
          variant={isCalMeetRoom ? "default" : "outline"}
          className={`gap-1.5 text-xs h-8 ${isCalMeetRoom ? "bg-primary" : ""}`}
          onClick={() => window.open(meetLink, isCalMeetRoom ? "_self" : "_blank")}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          {isCalMeetRoom ? "Join Room" : "Join Meeting"}
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
            <MoreVertical className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {meetLink && (
            <DropdownMenuItem className="gap-2" onClick={() => window.open(meetLink, isCalMeetRoom ? "_self" : "_blank")}>
              <ExternalLink className="h-4 w-4" /> {isCalMeetRoom ? "Open Meeting Room" : "Join Meeting"}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="text-destructive gap-2" onClick={() => setIsCancelConfirmOpen(true)}>
            Cancel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isCancelConfirmOpen} onOpenChange={setIsCancelConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 flex justify-end">
            <Button
              variant="outline"
              disabled={isCancelling}
              onClick={() => setIsCancelConfirmOpen(false)}
            >
              No, Keep Booking
            </Button>
            <Button
              variant="destructive"
              disabled={isCancelling}
              onClick={confirmCancel}
            >
              {isCancelling ? "Cancelling..." : "Yes, Cancel Booking"}
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

  const link = origin ? `${origin.replace(/^https?:\/\//, "")}/${username}` : `calmeet.app/${username}`;

  const copy = () => {
    const fullLink = `${origin}/${username}`;
    navigator.clipboard.writeText(fullLink);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
      <span className="text-sm truncate flex-1">{link}</span>
      <Button size="sm" variant="secondary" onClick={copy}>
        {copied ? <Check className="h-4 w-4" /> : "Copy"}
      </Button>
    </div>
  );
}
