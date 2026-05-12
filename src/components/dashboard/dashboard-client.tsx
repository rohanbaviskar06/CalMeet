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

export function MeetingActions({ id, meetLink }: { id: string, meetLink?: string | null }) {
  const handleCancel = async () => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      try {
        await cancelBooking(id);
        toast.success("Booking cancelled");
      } catch (error) {
        toast.error("Failed to cancel booking");
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
          <MoreVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {meetLink && (
          <DropdownMenuItem className="gap-2" onClick={() => window.open(meetLink, "_blank")}>
            <ExternalLink className="h-4 w-4" /> Join Meeting
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="text-destructive gap-2" onClick={handleCancel}>
          Cancel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ShareLinkBox({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const link = origin ? `${origin.replace(/^https?:\/\//, "")}/${username}` : `meetme.app/${username}`;

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
