"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Calendar, 
  Video, 
  Clock, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  ChevronRight,
  ExternalLink,
  History,
  MoreHorizontal,
  UserCheck,
  Download,
  Copy,
  Check,
  Sparkles,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ContactItem {
  email: string;
  name: string;
  totalMeetings: number;
  nextMeeting: Date | null;
  lastMeeting: Date | null;
  bookings: any[];
}

export function ContactsClient({ contacts }: { contacts: ContactItem[] }) {
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [filter, setFilter] = useState<"all" | "upcoming" | "frequent">("all");
  const [copiedEmail, setCopiedEmail] = useState(false);

  const filteredContacts = contacts.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = c.name.toLowerCase().includes(q) || 
                          c.email.toLowerCase().includes(q);
    
    if (filter === "upcoming") return matchesSearch && c.nextMeeting;
    if (filter === "frequent") return matchesSearch && c.totalMeetings > 1;
    return matchesSearch;
  });

  const exportContactsCSV = () => {
    if (contacts.length === 0) {
      toast.error("No contacts to export.");
      return;
    }

    const headers = ["Name", "Email", "Total Meetings", "Next Meeting", "Last Meeting"];
    const rows = contacts.map(c => [
      `"${c.name || ""}"`,
      `"${c.email}"`,
      c.totalMeetings,
      c.nextMeeting ? `"${new Date(c.nextMeeting).toISOString()}"` : '""',
      c.lastMeeting ? `"${new Date(c.lastMeeting).toISOString()}"` : '""',
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `calmeet-contacts-${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Contacts exported to CSV!");
  };

  const copyEmailToClipboard = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    toast.success("Email copied to clipboard!");
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Contacts
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Directory of attendees who have scheduled meetings with you.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="inline-flex p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs font-semibold">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-1.5 rounded-lg transition-all cursor-pointer",
                viewMode === "grid"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs"
                  : "text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              )}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "p-1.5 rounded-lg transition-all cursor-pointer",
                viewMode === "table"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs"
                  : "text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              )}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <Button 
            onClick={exportContactsCSV}
            variant="outline"
            size="sm"
            className="h-9 px-3 gap-1.5 text-xs rounded-xl border-zinc-200 dark:border-zinc-800 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-2xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: "all", label: "All Contacts", count: contacts.length },
            { key: "upcoming", label: "Upcoming", count: contacts.filter(c => c.nextMeeting).length },
            { key: "frequent", label: "Repeat / VIP", count: contacts.filter(c => c.totalMeetings > 1).length },
          ].map((tab) => {
            const isActive = filter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
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

        {/* Search Box */}
        <div className="relative w-full sm:w-60">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
          <input 
            type="search" 
            placeholder="Search by name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8.5 pl-8 pr-3 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-background text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
          />
        </div>
      </div>

      {/* Content View */}
      {filteredContacts.length === 0 ? (
        <div className="border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-16 text-center flex flex-col items-center justify-center bg-white dark:bg-zinc-950 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 mb-4 border border-zinc-200/60 dark:border-zinc-800">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
            No contacts found
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm leading-relaxed">
            {searchQuery
              ? "No contacts matched your search query. Try adjusting your filter."
              : "As soon as guests book meetings with you, their contact profiles will appear here."}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredContacts.map(contact => (
            <div 
              key={contact.email} 
              onClick={() => setSelectedContact(contact)}
              className="group rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-2xs hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Avatar className="h-11 w-11 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs bg-zinc-100 dark:bg-zinc-900">
                    <AvatarFallback className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                      {contact.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {contact.totalMeetings > 3 ? (
                    <span className="text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
                      VIP
                    </span>
                  ) : contact.nextMeeting ? (
                    <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  ) : null}
                </div>

                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors truncate">
                    {contact.name}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5 flex items-center gap-1.5">
                    <Mail className="h-3 w-3 text-zinc-400" />
                    <span>{contact.email}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-200/80 dark:border-zinc-800 text-xs">
                <span className="text-zinc-500 dark:text-zinc-400 font-medium">
                  {contact.totalMeetings} {contact.totalMeetings === 1 ? "meeting" : "meetings"}
                </span>

                <span className="text-primary font-semibold text-xs flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  View <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50/80 dark:bg-zinc-900/40 border-b border-zinc-200/80 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Contact</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">Meetings</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/80 dark:divide-zinc-800">
                {filteredContacts.map(contact => (
                  <tr 
                    key={contact.email} 
                    className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors cursor-pointer group"
                    onClick={() => setSelectedContact(contact)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-zinc-200/80 dark:border-zinc-800">
                          <AvatarFallback className="text-xs font-bold bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200">
                            {contact.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors">
                          {contact.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-zinc-500 dark:text-zinc-400">{contact.email}</td>
                    <td className="px-5 py-4 font-semibold text-zinc-800 dark:text-zinc-200">
                      {contact.totalMeetings}
                    </td>
                    <td className="px-5 py-4">
                      {contact.nextMeeting ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-zinc-400">
                          Completed
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 inline" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Contact Details & History */}
      {selectedContact && (
        <Dialog open={!!selectedContact} onOpenChange={(open) => !open && setSelectedContact(null)}>
          <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
                  <AvatarFallback className="text-base font-bold text-zinc-800 dark:text-zinc-200">
                    {selectedContact.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {selectedContact.name}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                    <Mail className="h-3 w-3" /> {selectedContact.email}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-5 py-3 text-xs">
              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-xs hover:opacity-90 transition-opacity"
                >
                  <Mail className="h-3.5 w-3.5" /> Send Email
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyEmailToClipboard(selectedContact.email)}
                  className="h-8 px-3 gap-1.5 text-xs rounded-xl border-zinc-200 dark:border-zinc-800"
                >
                  {copiedEmail ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedEmail ? "Copied" : "Copy Email"}</span>
                </Button>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-zinc-50/60 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Total Meetings</span>
                  <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{selectedContact.totalMeetings}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50/60 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Relationship</span>
                  <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedContact.totalMeetings > 3 ? "VIP" : selectedContact.totalMeetings > 1 ? "Repeat" : "New"}
                  </div>
                </div>
              </div>

              {/* Booking History Timeline */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                    Booking History
                  </h4>
                  <span className="text-[10px] font-semibold text-zinc-400">
                    {selectedContact.bookings.length} {selectedContact.bookings.length === 1 ? "Event" : "Events"}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {selectedContact.bookings.map((booking: any) => {
                    const isUpcoming = new Date(booking.startTime) >= new Date() && booking.status !== "CANCELLED";
                    const isCanceled = booking.status === "CANCELLED";

                    return (
                      <div 
                        key={booking.id}
                        className="p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-card space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h5 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                              {booking.eventType?.title || "Meeting"}
                            </h5>
                            <span className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                              <Clock className="h-3 w-3" />
                              {format(new Date(booking.startTime), "MMM d, yyyy • h:mm a")}
                            </span>
                          </div>

                          {isCanceled ? (
                            <span className="bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/20">
                              Canceled
                            </span>
                          ) : isUpcoming ? (
                            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                              Upcoming
                            </span>
                          ) : (
                            <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Completed
                            </span>
                          )}
                        </div>

                        {booking.meetingUrl && !isCanceled && (
                          <div className="pt-1">
                            <a
                              href={booking.meetingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary hover:underline"
                            >
                              <Video className="h-3 w-3" /> Join Meeting <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedContact(null)}
                className="text-xs h-8 border-zinc-200 dark:border-zinc-800"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
