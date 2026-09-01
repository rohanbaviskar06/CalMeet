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
  MoreHorizontal, 
  Settings, 
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Code,
  Clock,
  Video,
  Plus,
  Search,
  Lock,
  Layers,
  Sparkles,
  Link2
} from "lucide-react";
import { toast } from "sonner";
import { toggleEventTypeStatus, deleteEventType } from "@/app/actions/event-types";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EventTypeListProps {
  initialEventTypes: any[];
  username: string;
}

export function EventTypeList({ initialEventTypes, username }: EventTypeListProps) {
  const [events, setEvents] = useState(initialEventTypes);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredEvents = events.filter((e) => {
    const q = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.slug.toLowerCase().includes(q) ||
      (e.description && e.description.toLowerCase().includes(q))
    );
  });

  const handleToggle = async (eventId: string, currentStatus: boolean) => {
    // Optimistic update
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, isActive: !currentStatus } : e))
    );
    try {
      await toggleEventTypeStatus(eventId, currentStatus);
      toast.success(`Event type ${!currentStatus ? "enabled" : "disabled"}`);
    } catch (error) {
      toast.error("Failed to update event status");
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, isActive: currentStatus } : e))
      );
    }
  };

  const handleDelete = async (eventId: string) => {
    if (confirm("Are you sure you want to delete this event type?")) {
      try {
        await deleteEventType(eventId);
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
        toast.success("Event type deleted");
      } catch (error) {
        toast.error("Failed to delete event type");
      }
    }
  };

  const copyLink = (slug: string, id: string) => {
    const link = `${window.location.origin}/${username}/${slug}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Event Types
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Configure different events for people to book on your calendar.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search bar */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-8 pr-3 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
            />
          </div>

          {/* New Event Type Button */}
          <Link href="/dashboard/event-types/new">
            <Button size="sm" className="h-9 px-3.5 gap-1.5 rounded-lg font-medium text-xs bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 shadow-sm shrink-0">
              <Plus className="h-3.5 w-3.5" />
              <span>New</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <div className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/20">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
            <Link2 className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {searchQuery ? "No matching event types" : "No event types yet"}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
            {searchQuery
              ? "Try searching for a different keyword or clear the search filter."
              : "Create your first event type so clients and guests can book meetings with you."}
          </p>
          {!searchQuery && (
            <Link href="/dashboard/event-types/new" className="mt-4">
              <Button size="sm" className="h-9 gap-1.5 rounded-lg text-xs font-medium">
                <Plus className="h-3.5 w-3.5" />
                Create Event Type
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl divide-y divide-zinc-200 dark:divide-zinc-800 bg-card overflow-hidden shadow-sm">
          {filteredEvents.map((event) => {
            const isCopied = copiedId === event.id;
            const eventUrl = `/${username}/${event.slug}`;

            return (
              <div
                key={event.id}
                className={cn(
                  "p-4 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-zinc-50/60 dark:hover:bg-zinc-900/40",
                  !event.isActive && "opacity-60 bg-zinc-50/30 dark:bg-zinc-950/20"
                )}
              >
                {/* Left side: Title, slug, duration, provider */}
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/dashboard/event-types/${event.id}`}
                      className="font-medium text-sm text-zinc-900 dark:text-zinc-100 hover:underline flex items-center gap-1.5"
                    >
                      {event.title}
                    </Link>
                    <span className="text-xs text-zinc-400">/{username}/{event.slug}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 flex-wrap">
                    <span className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                      <Clock className="h-3 w-3" />
                      {event.duration}m
                    </span>

                    {event.videoCallProvider && (
                      <span className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded text-[11px] text-zinc-600 dark:text-zinc-400">
                        <Video className="h-3 w-3" />
                        {event.videoCallProvider === "GOOGLE_MEET" ? "Google Meet" : event.videoCallProvider}
                      </span>
                    )}

                    {!event.isActive && (
                      <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded text-[11px] font-semibold border border-amber-500/20">
                        Disabled
                      </span>
                    )}
                  </div>
                </div>

                {/* Right side: Toggle, Preview, Copy, Menu */}
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {/* Status Toggle */}
                  <Switch
                    checked={event.isActive}
                    onCheckedChange={() => handleToggle(event.id, event.isActive)}
                    className="scale-90 data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-100"
                  />

                  {/* Open in new tab button */}
                  <a
                    href={eventUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Preview booking page"
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>

                  {/* Copy Link Button */}
                  <button
                    onClick={() => copyLink(event.slug, event.id)}
                    title="Copy booking link"
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>

                  {/* 3-dots Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors outline-none">
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 text-xs">
                      <DropdownMenuItem
                        className="gap-2 cursor-pointer"
                        onClick={() => (window.location.href = `/dashboard/event-types/${event.id}`)}
                      >
                        <Settings className="h-3.5 w-3.5" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2 cursor-pointer"
                        onClick={() => window.open(eventUrl, "_blank")}
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2 cursor-pointer"
                        onClick={() => (window.location.href = `/dashboard/event-types/${event.id}/embed`)}
                      >
                        <Code className="h-3.5 w-3.5" /> Embed
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 dark:text-red-400 gap-2 cursor-pointer focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30"
                        onClick={() => handleDelete(event.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function CopyLinkButton({ username, slug }: { username: string; slug: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    const link = `${window.location.origin}/${username}/${slug}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="ghost" size="sm" className="gap-1.5 h-8 text-xs font-medium" onClick={copy}>
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      Copy Link
    </Button>
  );
}
