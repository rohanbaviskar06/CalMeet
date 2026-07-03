"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactsClient({ contacts }: { contacts: any[] }) {
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [filter, setFilter] = useState<"all" | "upcoming" | "frequent">("all");

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === "upcoming") return matchesSearch && c.nextMeeting;
    if (filter === "frequent") return matchesSearch && c.totalMeetings > 1;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-muted p-1 rounded-lg flex items-center gap-1">
             <Button 
               variant={viewMode === "grid" ? "secondary" : "ghost"} 
               size="icon-xs" 
               className="h-8 w-8"
               onClick={() => setViewMode("grid")}
             >
               <LayoutGrid className="h-4 w-4" />
             </Button>
             <Button 
               variant={viewMode === "table" ? "secondary" : "ghost"} 
               size="icon-xs" 
               className="h-8 w-8"
               onClick={() => setViewMode("table")}
             >
               <List className="h-4 w-4" />
             </Button>
          </div>
          
          <div className="h-8 w-[1px] bg-border mx-2" />
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <Button 
              variant={filter === "all" ? "default" : "outline"} 
              size="sm" 
              className="rounded-full h-8"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button 
              variant={filter === "upcoming" ? "default" : "outline"} 
              size="sm" 
              className="rounded-full h-8"
              onClick={() => setFilter("upcoming")}
            >
              Upcoming
            </Button>
            <Button 
              variant={filter === "frequent" ? "default" : "outline"} 
              size="sm" 
              className="rounded-full h-8"
              onClick={() => setFilter("frequent")}
            >
              Frequent
            </Button>
          </div>
        </div>
      </div>

      {filteredContacts.length === 0 ? (
        <Card className="border-dashed border-2 bg-transparent shadow-none rounded-2xl">
          <CardContent className="py-16 flex flex-col items-center justify-center text-muted-foreground gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
               <Search className="h-8 w-8 opacity-20" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">No contacts found</p>
              <p className="text-sm">Try adjusting your search or filter.</p>
            </div>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animation-fade-in">
          {filteredContacts.map(contact => (
            <Card 
              key={contact.email} 
              className="group hover:ring-1 hover:ring-primary/20 hover:shadow-md transition-all cursor-pointer rounded-2xl border-none shadow-sm"
              onClick={() => setSelectedContact(contact)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                      {contact.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-bold text-lg truncate leading-none">{contact.name}</h3>
                  <p className="text-sm text-muted-foreground truncate mt-2 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> {contact.email}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-muted/50">
                   <Badge variant="secondary" className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/5 text-primary border-none">
                     {contact.totalMeetings} MEETING{contact.totalMeetings !== 1 ? 'S' : ''}
                   </Badge>
                   {contact.nextMeeting && (
                      <Badge variant="default" className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-600 border-none">
                        ACTIVE
                      </Badge>
                   )}
                   {contact.totalMeetings > 3 && (
                      <Badge variant="outline" className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-500 dark:border-amber-900">
                        VIP
                      </Badge>
                   )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="rounded-2xl border-none shadow-sm overflow-hidden animation-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted/50 text-muted-foreground text-xs font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Bookings</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted/50">
                {filteredContacts.map(contact => (
                  <tr 
                    key={contact.email} 
                    className="hover:bg-muted/30 transition-colors cursor-pointer group"
                    onClick={() => setSelectedContact(contact)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                            {contact.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-sm">{contact.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{contact.email}</td>
                    <td className="px-6 py-4">
                       <span className="text-sm font-medium">{contact.totalMeetings}</span>
                    </td>
                    <td className="px-6 py-4">
                       {contact.nextMeeting ? (
                         <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-[10px] uppercase">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Upcoming
                         </div>
                       ) : (
                         <span className="text-[10px] uppercase font-bold text-muted-foreground">Inactive</span>
                       )}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <Button variant="ghost" size="icon" className="h-8 w-8">
                         <ChevronRight className="h-4 w-4" />
                       </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Contact Details Dialog (Popup) */}
      <Dialog open={!!selectedContact} onOpenChange={(open) => !open && setSelectedContact(null)}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto border-none p-0 bg-[#fafafa] dark:bg-[#0a0a0a] rounded-[2.5rem] shadow-2xl">
          {selectedContact && (
            <div className="relative">
              {/* Header with Background */}
              <div className="h-40 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-3xl rounded-full" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full" />
              </div>

              <div className="px-8 -mt-16 pb-12 space-y-8 relative">
                {/* Profile Section */}
                <div className="flex flex-col items-center text-center gap-4">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-2xl relative z-10">
                    <AvatarFallback className="bg-primary text-primary-foreground text-4xl font-black">
                      {selectedContact.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black tracking-tight leading-none">{selectedContact.name}</h3>
                    <p className="text-muted-foreground flex items-center justify-center gap-2 font-medium">
                      <Mail className="h-4 w-4" /> {selectedContact.email}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="rounded-full h-10 px-6 font-bold shadow-sm" 
                      nativeButton={false}
                      render={(props) => <a {...props} href={`mailto:${selectedContact.email}`} />}
                    >
                       <Mail className="h-4 w-4 mr-2" /> Send Email
                    </Button>
                    <Button variant="secondary" size="icon" className="rounded-full h-10 w-10 shadow-sm">
                       <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-5 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-muted/50 shadow-sm flex flex-col items-center text-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                         <History className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Meetings</p>
                        <p className="text-3xl font-black">{selectedContact.totalMeetings}</p>
                      </div>
                   </div>
                   <div className="p-5 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-muted/50 shadow-sm flex flex-col items-center text-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                         <UserCheck className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Relationship</p>
                        <p className="text-3xl font-black text-emerald-500 truncate">
                          {selectedContact.totalMeetings > 3 ? "VIP" : selectedContact.totalMeetings > 1 ? "Repeat" : "New"}
                        </p>
                      </div>
                   </div>
                </div>

                {/* Timeline Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-muted pb-4">
                    <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Booking Journey</h4>
                    <span className="text-[10px] font-bold bg-muted px-2 py-1 rounded-full">{selectedContact.bookings.length} EVENTS</span>
                  </div>
                  
                  <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-muted/50 before:dashed">
                    {selectedContact.bookings.map((booking: any) => {
                      const isUpcoming = new Date(booking.startTime) >= new Date() && booking.status !== "CANCELLED";
                      const isCanceled = booking.status === "CANCELLED";

                      return (
                        <div 
                          key={booking.id} 
                          className="relative pl-12 group transition-all"
                        >
                          <div className={`absolute left-0 top-1 w-10 h-10 rounded-full border-4 border-[#fafafa] dark:border-[#0a0a0a] flex items-center justify-center shadow-md z-10 transition-transform group-hover:scale-110 ${
                            isCanceled ? 'bg-red-50 text-red-500 dark:bg-red-950/20' : 
                            isUpcoming ? 'bg-emerald-500 text-white shadow-emerald-200' : 
                            'bg-zinc-100 text-zinc-500 dark:bg-zinc-800'
                          }`}>
                            {isUpcoming ? <Calendar className="h-4 w-4" /> : isCanceled ? <Clock className="h-4 w-4 rotate-45" /> : <Clock className="h-4 w-4" />}
                          </div>
                          
                          <div className={`p-6 rounded-[2.5rem] border transition-all hover:shadow-xl ${
                            isUpcoming ? 'bg-emerald-50/20 border-emerald-100/50' : 
                            isCanceled ? 'bg-red-50/10 border-red-100/20' :
                            'bg-white dark:bg-zinc-900 border-muted/50'
                          }`}>
                            <div className="flex justify-between items-start mb-4">
                              <div className="space-y-1">
                                <h5 className="font-black text-lg leading-none group-hover:text-primary transition-colors">{booking.eventType.title}</h5>
                                <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                   <span>{format(new Date(booking.startTime), "MMM d, yyyy")}</span>
                                   <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                   <span>{format(new Date(booking.startTime), "h:mm a")}</span>
                                </div>
                              </div>
                              {isCanceled ? (
                                <Badge variant="secondary" className="rounded-full text-[9px] font-black tracking-widest bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 border-none px-3">CANCELLED</Badge>
                              ) : isUpcoming ? (
                                <Badge variant="default" className="rounded-full text-[9px] font-black tracking-widest bg-emerald-500 border-none px-3">ACTIVE</Badge>
                              ) : (
                                <Badge variant="secondary" className="rounded-full text-[9px] font-black tracking-widest bg-zinc-100 text-zinc-600 border-none px-3">COMPLETED</Badge>
                              )}
                            </div>
                            
                            {booking.meetLink && !isCanceled && (
                              <Button 
                                variant="secondary" 
                                size="sm" 
                                className="w-full h-10 rounded-2xl text-xs font-bold gap-2 bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-all shadow-sm" 
                                nativeButton={false}
                                render={(props) => <a {...props} href={booking.meetLink} target="_blank" rel="noreferrer" />}
                              >
                                <Video className="h-4 w-4" /> Join Meeting <ExternalLink className="h-3 w-3 opacity-50 ml-auto" />
                              </Button>
                            )}
                            
                            {booking.notes && (
                              <div className="mt-4 p-4 bg-muted/10 rounded-2xl text-xs leading-relaxed italic text-muted-foreground border-l-2 border-primary/20">
                                "{booking.notes}"
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>


    </div>
  );
}
