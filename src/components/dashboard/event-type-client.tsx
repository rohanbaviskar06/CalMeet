"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  MoreVertical, 
  Settings, 
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Code
} from "lucide-react";
import { toast } from "sonner";
import { toggleEventTypeStatus, deleteEventType } from "@/app/actions/event-types";

export function EventTypeActions({ event }: { event: any }) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    try {
      setIsToggling(true);
      await toggleEventTypeStatus(event.id, event.isActive);
      toast.success(`Event type ${event.isActive ? 'disabled' : 'enabled'}`);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this event type?")) {
      try {
        await deleteEventType(event.id);
        toast.success("Event type deleted");
      } catch (error) {
        toast.error("Failed to delete event type");
      }
    }
  };

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2">
      <Switch 
        checked={event.isActive} 
        onCheckedChange={handleToggle}
        disabled={isToggling}
      />
      <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
              <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
              <DropdownMenuItem className="gap-2" onClick={() => window.location.href = `/dashboard/event-types/${event.id}`}>
                  <Settings className="h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2" onClick={() => window.open(`/${event.user.username}/${event.slug}`, "_blank")}>
                  <ExternalLink className="h-4 w-4" /> Preview
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2" onClick={() => window.location.href = `/dashboard/event-types/${event.id}/embed`}>
                  <Code className="h-4 w-4" /> Embed
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive gap-2" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" /> Delete
              </DropdownMenuItem>
          </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function CopyLinkButton({ username, slug }: { username: string, slug: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    const link = `${window.location.origin}/${username}/${slug}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="gap-2"
      onClick={copy}
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      Copy Link
    </Button>
  );
}
