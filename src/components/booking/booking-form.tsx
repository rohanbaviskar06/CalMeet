"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Globe, 
  Calendar as CalendarIcon,
  ArrowLeft,
  Video,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CalendarDays,
  Columns3,
  User as UserIcon,
  Mail,
  MessageSquare,
  Check
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  isToday, 
  addDays, 
  subDays 
} from "date-fns";
import { createBooking } from "@/app/actions/bookings";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BookingFormProps {
  user: {
    name: string | null;
    image: string | null;
    username: string | null;
    timezone: string | null;
    bio?: string | null;
  };
  eventType: {
    id: string;
    title: string;
    description: string | null;
    duration: number;
    videoCallProvider?: string;
    requiresPayment?: boolean;
    price?: number | null;
    currency?: string;
  };
  availability: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
  bookings: {
    startTime: Date;
    endTime: Date;
  }[];
}

const COMMON_TIMEZONES = [
  "Asia/Kolkata",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "Europe/London",
  "Europe/Paris",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "UTC"
];

function FormattedDescription({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div 
      className="text-xs text-zinc-400 leading-relaxed prose prose-invert max-w-none break-words"
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
}

export function BookingForm({ user, eventType, availability, bookings }: BookingFormProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekStartDate, setWeekStartDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Cal.com options: 12h vs 24h & view modes
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("12h");
  const [viewMode, setViewMode] = useState<"month" | "columns">("month");
  
  // Timezone selector
  const [selectedTimezone, setSelectedTimezone] = useState<string>(
    user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata"
  );
  const [isTzOpen, setIsTzOpen] = useState(false);

  const [utmSource, setUtmSource] = useState<string | undefined>(undefined);
  const [utmMedium, setUtmMedium] = useState<string | undefined>(undefined);
  const [referer, setReferer] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const source = params.get("utm_source");
      const medium = params.get("utm_medium");
      if (source) setUtmSource(source);
      if (medium) setUtmMedium(medium);

      if (document.referrer) {
        try {
          const url = new URL(document.referrer);
          setReferer(url.hostname);
        } catch {
          setReferer(document.referrer);
        }
      }
    }
  }, []);

  // Helper to generate slots for a specific date
  const getSlotsForDate = (targetDate: Date) => {
    const dayOfWeek = targetDate.getDay();
    const dayAvailabilities = availability.filter(a => a.dayOfWeek === dayOfWeek);
    if (dayAvailabilities.length === 0) return [];
    
    const slots: string[] = [];
    const now = new Date();

    dayAvailabilities.forEach(avail => {
      const [startH, startM] = avail.startTime.split(':').map(Number);
      const [endH, endM] = avail.endTime.split(':').map(Number);
      
      const current = new Date(targetDate);
      current.setHours(startH, startM, 0, 0);
      
      const windowEnd = new Date(targetDate);
      windowEnd.setHours(endH, endM, 0, 0);
      
      const interval = Math.max(eventType.duration, 15);
      
      while (current.getTime() + eventType.duration * 60000 <= windowEnd.getTime()) {
        const bufferTime = 30 * 60 * 1000; // 30 min buffer
        if (current.getTime() > now.getTime() + bufferTime) {
          const slotStart = current.getTime();
          const slotEnd = slotStart + eventType.duration * 60000;
          
          const isBooked = bookings.some(booking => {
            const bStart = new Date(booking.startTime).getTime();
            const bEnd = new Date(booking.endTime).getTime();
            return (slotStart < bEnd && slotEnd > bStart);
          });

          if (!isBooked) {
            slots.push(format(current, "HH:mm"));
          }
        }
        current.setMinutes(current.getMinutes() + interval);
      }
    });

    return Array.from(new Set(slots)).sort();
  };

  // Available slots for selected date
  const availableSlots = useMemo(() => {
    return getSlotsForDate(selectedDate);
  }, [selectedDate, availability, bookings, eventType.duration]);

  // Format time for display (12h vs 24h like Cal.com)
  const formatSlotTime = (hhmm: string) => {
    const [h, m] = hhmm.split(':').map(Number);
    if (timeFormat === "24h") {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }
    const period = h >= 12 ? "pm" : "am";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${String(m).padStart(2, '0')}${period}`;
  };

  // Calendar dates generation
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  // Multi-day columns (for week view on desktop)
  const weekDays = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => addDays(weekStartDate, i));
  }, [weekStartDate]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const handleDateClick = (day: Date) => {
    if (day < today) return;
    setSelectedDate(day);
    setWeekStartDate(day);
  };

  const handleTimeSelect = (timeStr: string) => {
    setSelectedTime(timeStr);
    setStep(2);
  };

  const handlePrevWeek = () => {
    const newStart = subDays(weekStartDate, 6);
    if (newStart >= today) {
      setWeekStartDate(newStart);
      setSelectedDate(newStart);
    } else {
      setWeekStartDate(today);
      setSelectedDate(today);
    }
  };

  const handleNextWeek = () => {
    const newStart = addDays(weekStartDate, 6);
    setWeekStartDate(newStart);
    setSelectedDate(newStart);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const startTime = new Date(selectedDate);
    startTime.setHours(hours, minutes, 0, 0);
    
    const endTime = new Date(startTime);
    endTime.setMinutes(startTime.getMinutes() + eventType.duration);

    try {
      const result = await createBooking({
        eventTypeId: eventType.id,
        guestName: formData.get('name') as string,
        guestEmail: formData.get('email') as string,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        notes: formData.get('notes') as string,
        utmSource,
        utmMedium,
        referer,
      });

      if (result.success) {
        toast.success("Meeting booked successfully!");
        setStep(3);
      } else {
        toast.error(result.error || "Failed to book meeting");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Calendar Grid
  const renderCalendar = (isCompact = false) => (
    <div className={cn("space-y-2.5 sm:space-y-3", isCompact && "pt-4 border-t border-zinc-800/80")}>
      {/* Month header & navigation */}
      <div className="flex items-center justify-between pb-1">
        <h2 className={cn("font-bold text-white tracking-tight", isCompact ? "text-xs" : "text-sm sm:text-base")}>
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Weekday Names */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
          <span key={d} className="text-[10px] sm:text-xs font-semibold text-zinc-500 uppercase tracking-wider py-1">
            {d}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {calendarDays.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = isSameDay(day, selectedDate);
          const isPast = day < today;

          if (!isCurrentMonth) {
            return <div key={idx} className={isCompact ? "h-8 w-full" : "h-9 sm:h-10 w-full"} />;
          }

          if (isPast) {
            return (
              <div
                key={idx}
                className={cn(
                  "w-full flex items-center justify-center text-zinc-600 font-normal cursor-not-allowed select-none",
                  isCompact ? "h-8 text-[11px]" : "h-9 sm:h-10 text-xs sm:text-sm"
                )}
              >
                {format(day, "d")}
              </div>
            );
          }

          if (isSelected) {
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleDateClick(day)}
                className={cn(
                  "w-full rounded-lg bg-white text-black font-bold flex flex-col items-center justify-center shadow-md transition transform scale-105 cursor-pointer relative",
                  isCompact ? "h-8 text-[11px]" : "h-9 sm:h-10 text-xs sm:text-sm"
                )}
              >
                <span>{format(day, "d")}</span>
                <span className="w-1 h-1 rounded-full bg-black mt-0.5" />
              </button>
            );
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleDateClick(day)}
              className={cn(
                "w-full rounded-lg bg-[#242424] hover:bg-[#333333] text-zinc-200 hover:text-white font-medium flex items-center justify-center transition cursor-pointer",
                isCompact ? "h-8 text-[11px]" : "h-9 sm:h-10 text-xs sm:text-sm"
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );

  // Step 3: Success Confirmation Screen
  if (step === 3) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-6 sm:p-14 min-h-[460px] bg-[#141414] text-white">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-5 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
          <Check className="h-6 w-6 sm:h-7 sm:w-7 stroke-[2.5]" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
          This meeting is scheduled
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-sm mb-6 sm:mb-8 leading-relaxed">
          We sent a calendar invite to your email address with the video call link.
        </p>

        <div className="bg-[#1c1c1c] border border-zinc-800 p-4 sm:p-5 rounded-xl sm:rounded-2xl w-full max-w-md space-y-2.5 text-left shadow-md">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
            <span className="font-bold text-xs sm:text-sm text-white">{eventType.title}</span>
            <span className="text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">
              {eventType.duration}m
            </span>
          </div>
          
          <div className="space-y-2 text-xs text-zinc-300">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
              <span>{format(selectedDate, "eeee, MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
              <span>{selectedTime && formatSlotTime(selectedTime)} ({selectedTimezone})</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
              <span>{eventType.videoCallProvider === "CALMEET" ? "CalMeet Video Call" : "Google Meet Video"}</span>
            </div>
          </div>
        </div>

        <Button 
          className="mt-6 sm:mt-8 rounded-xl h-10 px-5 text-xs font-semibold bg-white text-black hover:bg-zinc-200 transition cursor-pointer" 
          onClick={() => window.location.reload()}
        >
          Book another meeting
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[#111111] text-white flex flex-col font-sans">
      {/* Top Cal.com Control Bar */}
      <div className="flex items-center justify-between sm:justify-end gap-3 px-4 sm:px-8 py-2.5 sm:py-3.5 border-b border-zinc-800/80 bg-[#161616]">
        <button 
          type="button"
          onClick={() => window.open("mailto:support@calmeet.app", "_blank")}
          className="flex items-center gap-1.5 px-3 py-1 sm:py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700/50 transition cursor-pointer"
        >
          Need help?
        </button>

        {/* View Switcher (Visible on both Mobile and Desktop) */}
        <div className="flex items-center bg-zinc-800/80 p-0.5 rounded-lg border border-zinc-700/50">
          <button
            type="button"
            onClick={() => setViewMode("month")}
            className={cn(
              "p-1.5 rounded-md text-xs transition cursor-pointer",
              viewMode === "month" ? "bg-zinc-700 text-white shadow-xs" : "text-zinc-400 hover:text-white"
            )}
            title="Single Day / Month View"
          >
            <CalendarDays className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("columns")}
            className={cn(
              "p-1.5 rounded-md text-xs transition cursor-pointer",
              viewMode === "columns" ? "bg-zinc-700 text-white shadow-xs" : "text-zinc-400 hover:text-white"
            )}
            title="Multi-Day Week View"
          >
            <Columns3 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid md:grid-cols-12 min-h-[480px] sm:min-h-[540px]">
        
        {/* 1. Left Host & Event Panel */}
        <div className={cn(
          "p-4 sm:p-6 md:p-7 border-b md:border-b-0 md:border-r border-zinc-800/80 bg-[#141414] flex flex-col justify-between",
          viewMode === "columns" ? "md:col-span-5 lg:col-span-4" : "md:col-span-4 lg:col-span-3.5"
        )}>
          <div className="space-y-4 sm:space-y-5">
            {step === 2 && (
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition -ml-1 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
            )}

            {/* Host Avatar & Name */}
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11 sm:h-12 sm:w-12 border border-zinc-700/60 ring-2 ring-zinc-800 shadow-md">
                <AvatarImage src={user.image || undefined} alt={user.name || "Host"} />
                <AvatarFallback className="bg-zinc-800 text-white text-xs font-bold">
                  {user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <span className="text-xs sm:text-sm text-zinc-300 font-semibold block">
                  {user.name || "Host"}
                </span>
                {user.username && (
                  <span className="text-[11px] text-zinc-500 font-mono">
                    @{user.username}
                  </span>
                )}
              </div>
            </div>

            {/* Event Title */}
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                {eventType.title}
              </h1>
            </div>

            {/* Meta tags (Horizontal wrapping flex on mobile, vertical on desktop) */}
            <div className="flex flex-wrap md:flex-col gap-x-4 gap-y-2 text-xs text-zinc-300 font-medium">
              <div className="flex items-center gap-1.5 sm:gap-2 text-zinc-400">
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span>{eventType.duration}m</span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 text-zinc-400">
                <Video className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span>
                  {eventType.videoCallProvider === "CALMEET" 
                    ? "CalMeet Video" 
                    : eventType.videoCallProvider === "ZOOM"
                    ? "Zoom Video"
                    : "Google Meet"}
                </span>
              </div>

              {/* Timezone Selector Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsTzOpen(!isTzOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 text-zinc-400 hover:text-white transition cursor-pointer text-left"
                >
                  <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate max-w-[140px] sm:max-w-[170px]">{selectedTimezone}</span>
                  <ChevronDown className="h-3 w-3 shrink-0" />
                </button>

                {isTzOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 sm:w-52 bg-[#1f1f1f] border border-zinc-700/80 rounded-xl shadow-2xl py-1 z-50 max-h-48 overflow-y-auto">
                    {COMMON_TIMEZONES.map((tz) => (
                      <button
                        key={tz}
                        type="button"
                        onClick={() => {
                          setSelectedTimezone(tz);
                          setIsTzOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-1.5 text-xs hover:bg-zinc-800 transition cursor-pointer",
                          selectedTimezone === tz ? "text-white font-bold bg-zinc-800/60" : "text-zinc-400"
                        )}
                      >
                        {tz}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* In week view on desktop, show mini calendar in left sidebar */}
            {viewMode === "columns" && step === 1 && (
              <div className="hidden md:block">
                {renderCalendar(true)}
              </div>
            )}

            {/* Description */}
            {eventType.description && (
              <div className="pt-3 sm:pt-4 border-t border-zinc-800/80">
                <FormattedDescription text={eventType.description} />
              </div>
            )}
          </div>
        </div>

        {/* 2. Middle & Right Panels: Calendar & Time Slots Picker */}
        <div className={cn(
          "p-4 sm:p-6 md:p-7 flex flex-col justify-center",
          viewMode === "columns" ? "md:col-span-7 lg:col-span-8" : "md:col-span-8 lg:col-span-8.5"
        )}>
          <AnimatePresence mode="wait">
            {step === 1 ? (
              viewMode === "month" ? (
                /* Standard Cal.com view (Month Calendar + Time slots) */
                <motion.div 
                  key="month-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start"
                >
                  {/* Cal.com Month Calendar */}
                  <div className="lg:col-span-7">
                    {renderCalendar(false)}
                  </div>

                  {/* Cal.com Available Time Slots (2-column on mobile, 1-column on desktop) */}
                  <div className="lg:col-span-5 space-y-2.5 sm:space-y-3 pt-2 lg:pt-0">
                    {/* Header: Date title + 12h/24h toggle */}
                    <div className="flex items-center justify-between pb-1 border-b border-zinc-800/60 lg:border-none">
                      <span className="text-xs sm:text-sm font-semibold text-zinc-200">
                        {format(selectedDate, "EEE do")}
                      </span>

                      {/* 12h / 24h Toggle */}
                      <div className="flex items-center bg-[#222222] p-0.5 rounded-md border border-zinc-800">
                        <button
                          type="button"
                          onClick={() => setTimeFormat("12h")}
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer",
                            timeFormat === "12h" ? "bg-[#333333] text-white" : "text-zinc-400 hover:text-white"
                          )}
                        >
                          12h
                        </button>
                        <button
                          type="button"
                          onClick={() => setTimeFormat("24h")}
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer",
                            timeFormat === "24h" ? "bg-[#333333] text-white" : "text-zinc-400 hover:text-white"
                          )}
                        >
                          24h
                        </button>
                      </div>
                    </div>

                    {/* Slots Grid (2 columns on mobile, 1 column on wide screens) */}
                    <div className="overflow-y-auto max-h-[260px] sm:max-h-[320px] pr-0.5 scrollbar-thin scrollbar-thumb-zinc-800">
                      {availableSlots.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                          {availableSlots.map((time) => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => handleTimeSelect(time)}
                              className="w-full h-10 sm:h-10 px-3 sm:px-4 rounded-xl border border-zinc-800/90 bg-[#181818] hover:border-zinc-500 hover:bg-[#222222] text-xs font-semibold text-zinc-200 flex items-center justify-center lg:justify-start gap-2 transition active:scale-[0.98] cursor-pointer"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                              <span>{formatSlotTime(time)}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 sm:p-8 text-center border border-dashed border-zinc-800 rounded-xl">
                          <p className="text-xs text-zinc-500 font-medium">
                            No available slots for this day.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Cal.com Multi-Column Week View (Desktop & Tablet) */
                <motion.div 
                  key="week-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3.5"
                >
                  {/* Top Week Range Header with < > arrows and 12h/24h toggle */}
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {format(weekStartDate, "MMM d")} - {format(addDays(weekStartDate, 5), "MMM d, yyyy")}
                      </span>
                      <div className="flex items-center gap-1 ml-1">
                        <button
                          type="button"
                          onClick={handlePrevWeek}
                          className="h-6 w-6 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextWeek}
                          className="h-6 w-6 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center bg-[#222222] p-0.5 rounded-md border border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setTimeFormat("12h")}
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer",
                          timeFormat === "12h" ? "bg-[#333333] text-white" : "text-zinc-400"
                        )}
                      >
                        12h
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimeFormat("24h")}
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer",
                          timeFormat === "24h" ? "bg-[#333333] text-white" : "text-zinc-400"
                        )}
                      >
                        24h
                      </button>
                    </div>
                  </div>

                  {/* Multi-Day Column Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {weekDays.map((colDay) => {
                      const daySlots = getSlotsForDate(colDay);
                      const isColSelected = isSameDay(colDay, selectedDate);

                      return (
                        <div key={colDay.toISOString()} className="space-y-1.5">
                          {/* Column Date Header */}
                          <button
                            type="button"
                            onClick={() => setSelectedDate(colDay)}
                            className={cn(
                              "w-full text-center p-1.5 sm:p-2 rounded-lg border transition cursor-pointer",
                              isColSelected 
                                ? "bg-white text-black font-bold border-white shadow-sm" 
                                : "bg-[#1c1c1c] text-zinc-300 border-zinc-800 hover:border-zinc-600"
                            )}
                          >
                            <span className="text-[10px] uppercase block leading-tight">{format(colDay, "EEE")}</span>
                            <span className="text-xs font-semibold leading-tight">{format(colDay, "do")}</span>
                          </button>

                          {/* Slots in this column */}
                          <div className="space-y-1.5 max-h-[280px] overflow-y-auto scrollbar-none">
                            {daySlots.length > 0 ? (
                              daySlots.map((time) => (
                                <button
                                  key={time}
                                  type="button"
                                  onClick={() => {
                                    setSelectedDate(colDay);
                                    handleTimeSelect(time);
                                  }}
                                  className="w-full h-8 px-1.5 rounded-lg border border-zinc-800 bg-[#181818] hover:border-zinc-500 hover:bg-[#222222] text-[11px] font-medium text-zinc-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                  <span>{formatSlotTime(time)}</span>
                                </button>
                              ))
                            ) : (
                              <div className="p-2.5 text-center text-[10px] text-zinc-600">
                                –
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )
            ) : (
              /* Step 2: Guest Details Form */
              <motion.div 
                key="step2-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 sm:space-y-5 max-w-md mx-auto w-full"
              >
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    Enter details
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {format(selectedDate, "eeee, MMMM d, yyyy")} at {selectedTime && formatSlotTime(selectedTime)}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">
                      Your name *
                    </label>
                    <input 
                      name="name"
                      type="text" 
                      placeholder="John Doe" 
                      className="w-full h-10 sm:h-11 px-3 rounded-xl border border-zinc-800 bg-[#181818] text-white text-xs sm:text-sm focus:border-zinc-500 focus:outline-none transition"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">
                      Email address *
                    </label>
                    <input 
                      name="email"
                      type="email" 
                      placeholder="john@example.com" 
                      className="w-full h-10 sm:h-11 px-3 rounded-xl border border-zinc-800 bg-[#181818] text-white text-xs sm:text-sm focus:border-zinc-500 focus:outline-none transition"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">
                      Additional notes
                    </label>
                    <textarea 
                      name="notes"
                      rows={3}
                      placeholder="Please share anything that will help prepare for our meeting." 
                      className="w-full p-3 rounded-xl border border-zinc-800 bg-[#181818] text-white text-xs sm:text-sm focus:border-zinc-500 focus:outline-none transition resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-10 sm:h-11 text-xs sm:text-sm font-bold rounded-xl bg-white text-black hover:bg-zinc-200 transition cursor-pointer shadow-sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Confirming..." : "Confirm"}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
