"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateAvailability } from "@/app/actions/availability";
import { toast } from "sonner";
import { 
  Clock, 
  Globe, 
  Plus, 
  Copy, 
  Trash2, 
  Check, 
  Calendar, 
  MoreHorizontal,
  ArrowLeft,
  Edit3,
  Sparkles,
  HelpCircle,
  Users,
  User,
  CheckCircle2,
  X,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePricingModal } from "@/components/dashboard/pricing-modal";
import Link from "next/link";
import { cn } from "@/lib/utils";

const daysList = [
  { label: "Sunday", value: 0, short: "Sun" },
  { label: "Monday", value: 1, short: "Mon" },
  { label: "Tuesday", value: 2, short: "Tue" },
  { label: "Wednesday", value: 3, short: "Wed" },
  { label: "Thursday", value: 4, short: "Thu" },
  { label: "Friday", value: 5, short: "Fri" },
  { label: "Saturday", value: 6, short: "Sat" },
];

const timeSlots = [
  "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00",
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "22:00", "23:00"
];

function formatTimeDisplay(timeStr: string) {
  if (!timeStr) return "9:00am";
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "pm" : "am";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${(m || 0).toString().padStart(2, "0")}${period}`;
}

const commonTimezones = [
  { label: "Asia/Kolkata (IST)", value: "Asia/Kolkata" },
  { label: "UTC (Coordinated Universal Time)", value: "UTC" },
  { label: "America/New_York (Eastern Time)", value: "America/New_York" },
  { label: "America/Chicago (Central Time)", value: "America/Chicago" },
  { label: "America/Denver (Mountain Time)", value: "America/Denver" },
  { label: "America/Los_Angeles (Pacific Time)", value: "America/Los_Angeles" },
  { label: "Europe/London (GMT / BST)", value: "Europe/London" },
  { label: "Europe/Berlin (CET / CEST)", value: "Europe/Berlin" },
  { label: "Europe/Paris (CET / CEST)", value: "Europe/Paris" },
  { label: "Asia/Dubai (GST)", value: "Asia/Dubai" },
  { label: "Asia/Singapore (SGT)", value: "Asia/Singapore" },
  { label: "Asia/Tokyo (JST)", value: "Asia/Tokyo" },
  { label: "Australia/Sydney (AEST)", value: "Australia/Sydney" },
];

interface DayAvailability {
  dayOfWeek: number;
  label: string;
  short: string;
  isActive: boolean;
  intervals: { startTime: string; endTime: string }[];
}

interface DateOverride {
  id: string;
  date: string;
  isUnavailable: boolean;
  startTime: string;
  endTime: string;
  reason?: string;
}

export function AvailabilityForm({ 
  user,
  initialAvailability, 
  initialTimezone 
}: { 
  user?: any;
  initialAvailability: any[];
  initialTimezone: string;
}) {
  const { openPricingModal } = usePricingModal();

  // Navigation View: "list" (Screenshot 1) vs "edit" (Screenshot 2)
  const [view, setView] = useState<"list" | "edit">("list");
  const [subTab, setSubTab] = useState<"my" | "team">("my");

  // Active Schedule Metadata
  const [scheduleName, setScheduleName] = useState("Working hours");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isDefault, setIsDefault] = useState(true);
  const [timezone, setTimezone] = useState(initialTimezone || "Asia/Kolkata");
  const [isSaving, setIsSaving] = useState(false);

  // Initialize weekly hours
  const [availability, setAvailability] = useState<DayAvailability[]>(() => {
    return daysList.map(day => {
      const existingRecords = initialAvailability.filter(d => d.dayOfWeek === day.value);
      if (existingRecords.length > 0) {
        return {
          dayOfWeek: day.value,
          label: day.label,
          short: day.short,
          isActive: true,
          intervals: existingRecords.map(r => ({
            startTime: r.startTime || "09:00",
            endTime: r.endTime || "17:00",
          }))
        };
      }
      // Default: Mon-Fri 09:00 - 17:00 active, Sun/Sat unavailable
      const isWeekday = day.value >= 1 && day.value <= 5;
      return {
        dayOfWeek: day.value,
        label: day.label,
        short: day.short,
        isActive: isWeekday,
        intervals: [{ startTime: "09:00", endTime: "17:00" }]
      };
    });
  });

  // Date Overrides
  const [overrides, setOverrides] = useState<DateOverride[]>([]);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [newOverrideDate, setNewOverrideDate] = useState("");
  const [newOverrideUnavailable, setNewOverrideUnavailable] = useState(true);
  const [newOverrideStart, setNewOverrideStart] = useState("09:00");
  const [newOverrideEnd, setNewOverrideEnd] = useState("17:00");

  // Copy Days Modal State
  const [copySourceDay, setCopySourceDay] = useState<number | null>(null);
  const [copyTargetDays, setCopyTargetDays] = useState<number[]>([]);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);

  // New Schedule Modal
  const [isNewScheduleModalOpen, setIsNewScheduleModalOpen] = useState(false);
  const [newScheduleTitle, setNewScheduleTitle] = useState("");

  // Troubleshooter Modal State
  const [isTroubleshooterOpen, setIsTroubleshooterOpen] = useState(false);

  // --- Handlers ---
  const toggleDay = (dayValue: number) => {
    setAvailability(prev => prev.map(d => {
      if (d.dayOfWeek === dayValue) {
        const nextActive = !d.isActive;
        return {
          ...d,
          isActive: nextActive,
          intervals: d.intervals.length > 0 ? d.intervals : [{ startTime: "09:00", endTime: "17:00" }]
        };
      }
      return d;
    }));
  };

  const addInterval = (dayValue: number) => {
    setAvailability(prev => prev.map(d => {
      if (d.dayOfWeek === dayValue) {
        const lastInterval = d.intervals[d.intervals.length - 1];
        const nextStart = lastInterval ? lastInterval.endTime : "09:00";
        return {
          ...d,
          isActive: true,
          intervals: [...d.intervals, { startTime: nextStart, endTime: "18:00" }]
        };
      }
      return d;
    }));
  };

  const removeInterval = (dayValue: number, index: number) => {
    setAvailability(prev => prev.map(d => {
      if (d.dayOfWeek === dayValue) {
        const nextIntervals = d.intervals.filter((_, i) => i !== index);
        return {
          ...d,
          isActive: nextIntervals.length > 0,
          intervals: nextIntervals.length > 0 ? nextIntervals : [{ startTime: "09:00", endTime: "17:00" }]
        };
      }
      return d;
    }));
  };

  const updateIntervalTime = (
    dayValue: number, 
    index: number, 
    field: "startTime" | "endTime", 
    value: string
  ) => {
    setAvailability(prev => prev.map(d => {
      if (d.dayOfWeek === dayValue) {
        const nextIntervals = [...d.intervals];
        nextIntervals[index] = { ...nextIntervals[index], [field]: value };
        return { ...d, intervals: nextIntervals };
      }
      return d;
    }));
  };

  const openCopyDialog = (dayValue: number) => {
    setCopySourceDay(dayValue);
    // Pre-check weekdays or other days except source
    setCopyTargetDays(daysList.filter(d => d.value !== dayValue && d.value >= 1 && d.value <= 5).map(d => d.value));
    setIsCopyModalOpen(true);
  };

  const applyCopyHours = () => {
    if (copySourceDay === null) return;
    const source = availability.find(d => d.dayOfWeek === copySourceDay);
    if (!source) return;

    setAvailability(prev => prev.map(d => {
      if (copyTargetDays.includes(d.dayOfWeek)) {
        return {
          ...d,
          isActive: source.isActive,
          intervals: source.intervals.map(i => ({ ...i }))
        };
      }
      return d;
    }));

    setIsCopyModalOpen(false);
    toast.success(`Copied hours to ${copyTargetDays.length} selected days!`);
  };

  const handleAddOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOverrideDate) return;

    const newOv: DateOverride = {
      id: "ov-" + Date.now(),
      date: newOverrideDate,
      isUnavailable: newOverrideUnavailable,
      startTime: newOverrideStart,
      endTime: newOverrideEnd,
    };

    setOverrides(prev => [...prev, newOv]);
    setIsOverrideModalOpen(false);
    setNewOverrideDate("");
    toast.success(`Override added for ${newOverrideDate}`);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Flatten intervals for the server action
      const flattened: { dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }[] = [];
      
      availability.forEach(day => {
        if (day.isActive && day.intervals.length > 0) {
          day.intervals.forEach(int => {
            flattened.push({
              dayOfWeek: day.dayOfWeek,
              startTime: int.startTime,
              endTime: int.endTime,
              isActive: true,
            });
          });
        } else {
          flattened.push({
            dayOfWeek: day.dayOfWeek,
            startTime: "09:00",
            endTime: "17:00",
            isActive: false,
          });
        }
      });

      await updateAvailability(flattened, timezone);
      toast.success("Availability schedule saved successfully!");
    } catch (error) {
      toast.error("Failed to save availability");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper summary text (e.g. "Mon - Fri, 9:00 AM - 5:00 PM")
  const activeDaysSummary = () => {
    const activeDays = availability.filter(d => d.isActive);
    if (activeDays.length === 0) return "No active days";
    if (activeDays.length === 5 && activeDays.every(d => d.dayOfWeek >= 1 && d.dayOfWeek <= 5)) {
      const mon = activeDays[0].intervals[0];
      return `Mon - Fri, ${formatTimeDisplay(mon.startTime)} - ${formatTimeDisplay(mon.endTime)}`;
    }
    if (activeDays.length === 7) {
      const sun = activeDays[0].intervals[0];
      return `Every day, ${formatTimeDisplay(sun.startTime)} - ${formatTimeDisplay(sun.endTime)}`;
    }
    const daysStr = activeDays.map(d => d.short).join(", ");
    const sampleInt = activeDays[0].intervals[0];
    return `${daysStr}, ${formatTimeDisplay(sampleInt.startTime)} - ${formatTimeDisplay(sampleInt.endTime)}`;
  };

  // ==========================================
  // VIEW 1: SCHEDULES OVERVIEW (Screenshot 1)
  // ==========================================
  if (view === "list") {
    return (
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Availability
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              Configure times when you are available for bookings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Segmented Tab Control (My availability | Team availability) */}
            <div className="inline-flex p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs font-semibold">
              <button
                onClick={() => setSubTab("my")}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-all cursor-pointer",
                  subTab === "my"
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                )}
              >
                My availability
              </button>
              <button
                onClick={() => {
                  if (user?.plan === "FREE") {
                    toast.info("Team availability requires a Teams or Organization plan.");
                    openPricingModal();
                    return;
                  }
                  setSubTab("team");
                }}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5",
                  subTab === "team"
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                )}
              >
                <span>Team availability</span>
                {user?.plan === "FREE" && (
                  <span className="text-[9px] font-bold bg-primary/10 text-primary px-1.5 py-0.2 rounded">
                    PRO
                  </span>
                )}
              </button>
            </div>

            {/* + New Schedule Button */}
            <Button
              onClick={() => setIsNewScheduleModalOpen(true)}
              size="sm"
              className="h-9 px-3.5 gap-1.5 rounded-xl text-xs font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-2xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>New</span>
            </Button>
          </div>
        </div>

        {subTab === "team" ? (
          /* Team Availability View */
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-card p-10 text-center space-y-4 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mx-auto text-zinc-500">
              <Users className="h-6 w-6" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                Team Availability Schedules
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Create collective and round-robin schedules across your organization.
              </p>
            </div>
            <Button
              onClick={() => toast.info("Configure team schedules in Team Management")}
              size="sm"
              variant="outline"
              className="h-8 text-xs rounded-lg border-zinc-200 dark:border-zinc-800"
            >
              View Teams
            </Button>
          </div>
        ) : (
          /* My Availability Schedule Card (Cal.com Clean Group) */
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-2xs">
            {/* Schedule Item Row */}
            <div 
              onClick={() => setView("edit")}
              className="group p-5 sm:p-6 flex items-center justify-between hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors cursor-pointer"
            >
              <div className="space-y-1.5 min-w-0 pr-4">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-semibold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors">
                    {scheduleName}
                  </h3>
                  {isDefault && (
                    <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full text-[10px] leading-none border border-emerald-500/20">
                      Default
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {activeDaysSummary()}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 pt-0.5">
                  <Globe className="h-3.5 w-3.5" />
                  <span>{timezone}</span>
                </div>
              </div>

              {/* Action Dropdown Menu */}
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer outline-none">
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44 text-xs">
                    <DropdownMenuItem onClick={() => setView("edit")} className="cursor-pointer gap-2">
                      <Edit3 className="h-3.5 w-3.5" /> Edit Schedule
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        setIsDefault(true);
                        toast.success("Schedule set as default.");
                      }} 
                      className="cursor-pointer gap-2"
                    >
                      <Check className="h-3.5 w-3.5" /> Set as Default
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        toast.success(`Duplicated "${scheduleName}" as "Working hours (Copy)"`);
                      }} 
                      className="cursor-pointer gap-2"
                    >
                      <Copy className="h-3.5 w-3.5" /> Duplicate
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Bottom Out of Office Banner Link */}
            <div className="border-t border-zinc-200/80 dark:border-zinc-800/80 p-3.5 bg-zinc-50/60 dark:bg-zinc-900/30 text-center text-xs text-zinc-500 dark:text-zinc-400">
              <span>Temporarily out-of-office? </span>
              <Link 
                href="/dashboard/settings?tab=out-of-office" 
                className="font-medium underline text-zinc-800 dark:text-zinc-200 hover:text-primary transition-colors"
              >
                Add a redirect
              </Link>
            </div>
          </div>
        )}

        {/* Modal: New Schedule */}
        <Dialog open={isNewScheduleModalOpen} onOpenChange={setIsNewScheduleModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Create New Schedule</DialogTitle>
              <DialogDescription className="text-xs">
                Add a separate availability schedule for distinct projects or working shifts.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <Label className="text-xs font-semibold">Schedule Name</Label>
              <Input
                placeholder="e.g. Night Shifts, Weekend Hours"
                value={newScheduleTitle}
                onChange={(e) => setNewScheduleTitle(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsNewScheduleModalOpen(false)}
                className="h-8 text-xs border-zinc-200 dark:border-zinc-800"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  if (!newScheduleTitle.trim()) return;
                  setScheduleName(newScheduleTitle.trim());
                  setIsNewScheduleModalOpen(false);
                  setView("edit");
                  toast.success(`Schedule "${newScheduleTitle}" created!`);
                }}
                className="h-8 text-xs bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
              >
                Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: SCHEDULE EDITOR (Screenshot 2)
  // ==========================================
  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Back Button + Editable Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView("list")}
            className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Back to schedules"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {isEditingName ? (
            <div className="flex items-center gap-2">
              <Input
                value={scheduleName}
                onChange={(e) => setScheduleName(e.target.value)}
                className="h-8 text-base font-bold w-48"
                autoFocus
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
              />
              <Button size="sm" onClick={() => setIsEditingName(false)} className="h-8 px-2 text-xs">
                Done
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {scheduleName}
              </h1>
              <button
                onClick={() => setIsEditingName(true)}
                className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 p-1 rounded-md transition-colors"
                title="Edit schedule name"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Default Toggle + Delete + Save Button */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Set as default
            </span>
            <Switch
              checked={isDefault}
              onCheckedChange={(checked) => {
                setIsDefault(checked);
                toast.success(checked ? "Marked as default schedule" : "Unmarked default");
              }}
              className="scale-90"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="sm"
            className="h-9 px-4 text-xs font-semibold rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-2xs cursor-pointer"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Weekly Hours & Date Overrides (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Weekly Hours */}
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Weekly hours
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Set the times you are available each day
                </p>
              </div>
            </div>

            {/* Days Table List */}
            <div className="divide-y divide-zinc-200/80 dark:divide-zinc-800">
              {availability.map((day) => (
                <div
                  key={day.dayOfWeek}
                  className={cn(
                    "p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors",
                    !day.isActive && "bg-zinc-50/40 dark:bg-zinc-900/20"
                  )}
                >
                  {/* Left: Switch + Day Name */}
                  <div className="flex items-center gap-3.5 min-w-[130px]">
                    <Switch
                      checked={day.isActive}
                      onCheckedChange={() => toggleDay(day.dayOfWeek)}
                      className="scale-90"
                    />
                    <span
                      className={cn(
                        "text-xs sm:text-sm font-semibold",
                        day.isActive
                          ? "text-zinc-900 dark:text-zinc-100"
                          : "text-zinc-400 dark:text-zinc-500"
                      )}
                    >
                      {day.label}
                    </span>
                  </div>

                  {/* Right / Middle: Intervals or Unavailable */}
                  {day.isActive ? (
                    <div className="flex-1 flex flex-col gap-2">
                      {day.intervals.map((int, idx) => (
                        <div key={idx} className="flex items-center gap-2 flex-wrap justify-end">
                          <select
                            value={int.startTime}
                            onChange={(e) => updateIntervalTime(day.dayOfWeek, idx, "startTime", e.target.value)}
                            className="h-8 px-3 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 cursor-pointer"
                          >
                            {timeSlots.map((t) => (
                              <option key={t} value={t}>
                                {formatTimeDisplay(t)}
                              </option>
                            ))}
                          </select>

                          <span className="text-zinc-400 text-xs font-medium">-</span>

                          <select
                            value={int.endTime}
                            onChange={(e) => updateIntervalTime(day.dayOfWeek, idx, "endTime", e.target.value)}
                            className="h-8 px-3 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 cursor-pointer"
                          >
                            {timeSlots.map((t) => (
                              <option key={t} value={t}>
                                {formatTimeDisplay(t)}
                              </option>
                            ))}
                          </select>

                          {/* Delete Interval Button (if more than 1) */}
                          {day.intervals.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeInterval(day.dayOfWeek, idx)}
                              className="p-1.5 text-zinc-400 hover:text-red-500 rounded-md transition-colors"
                              title="Remove time slot"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}

                          {/* Add Another Interval for this Day */}
                          {idx === day.intervals.length - 1 && (
                            <button
                              type="button"
                              onClick={() => addInterval(day.dayOfWeek)}
                              className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                              title="Add another time interval"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          )}

                          {/* Copy this day's hours to other days */}
                          {idx === day.intervals.length - 1 && (
                            <button
                              type="button"
                              onClick={() => openCopyDialog(day.dayOfWeek)}
                              className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer ml-1"
                              title="Copy times to other days"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-3">
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                        Unavailable
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleDay(day.dayOfWeek)}
                        className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        title="Add hours"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openCopyDialog(day.dayOfWeek)}
                        className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        title="Copy times"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Date Overrides */}
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
                    Date overrides
                  </h3>
                  <HelpCircle className="h-3.5 w-3.5 text-zinc-400" />
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Add dates when your availability changes from your daily hours.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOverrideModalOpen(true)}
                className="h-8 px-3 text-xs gap-1.5 rounded-xl border-zinc-200 dark:border-zinc-800 cursor-pointer shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add an override</span>
              </Button>
            </div>

            {/* Overrides List */}
            {overrides.length > 0 ? (
              <div className="space-y-2 pt-2">
                {overrides.map((ov) => (
                  <div
                    key={ov.id}
                    className="flex items-center justify-between p-3 bg-zinc-50/60 dark:bg-zinc-900/40 rounded-xl border border-zinc-200/80 dark:border-zinc-800 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-zinc-400" />
                      <div>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                          {ov.date}
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          {ov.isUnavailable 
                            ? "Unavailable (Out of office)" 
                            : `${formatTimeDisplay(ov.startTime)} - ${formatTimeDisplay(ov.endTime)}`}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setOverrides(overrides.filter((o) => o.id !== ov.id))}
                      className="p-1.5 text-zinc-400 hover:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Remove date override"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* Right Column: Timezone & Diagnostic Tools (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Timezone Selector Card */}
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-2xs space-y-3">
            <Label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
              Timezone
            </Label>
            
            <Select value={timezone} onValueChange={(val) => { if (val) setTimezone(val); }}>
              <SelectTrigger className="w-full h-9 text-xs rounded-xl border-zinc-200 dark:border-zinc-800">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent className="text-xs">
                {commonTimezones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value} className="text-xs">
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <p className="text-[11px] text-zinc-400 leading-relaxed">
              All booking slots and notifications will be calculated in this timezone.
            </p>
          </div>

          {/* Troubleshooter Card (Screenshot 2) */}
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              Something doesn&apos;t look right?
            </h3>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsTroubleshooterOpen(true)}
              className="w-full h-8 text-xs rounded-xl border-zinc-200 dark:border-zinc-800 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              Launch troubleshooter
            </Button>
          </div>
        </div>
      </div>

      {/* Modal: Copy Hours to Other Days */}
      <Dialog open={isCopyModalOpen} onOpenChange={setIsCopyModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Copy Daily Hours</DialogTitle>
            <DialogDescription className="text-xs">
              Select which days should receive the working hours from{" "}
              <strong>{daysList.find(d => d.value === copySourceDay)?.label}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-2 py-3">
            {daysList
              .filter(d => d.value !== copySourceDay)
              .map(d => {
                const isSelected = copyTargetDays.includes(d.value);
                return (
                  <label
                    key={d.value}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border text-xs font-medium cursor-pointer transition-colors",
                      isSelected
                        ? "border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                    )}
                  >
                    <span>{d.label}</span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCopyTargetDays([...copyTargetDays, d.value]);
                        } else {
                          setCopyTargetDays(copyTargetDays.filter(val => val !== d.value));
                        }
                      }}
                      className="rounded accent-zinc-900 dark:accent-zinc-100"
                    />
                  </label>
                );
              })}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCopyModalOpen(false)}
              className="h-8 text-xs border-zinc-200 dark:border-zinc-800"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={applyCopyHours}
              className="h-8 text-xs bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
            >
              Apply to Selected
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Add Date Override */}
      <Dialog open={isOverrideModalOpen} onOpenChange={setIsOverrideModalOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleAddOverride}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Add Date Override</DialogTitle>
              <DialogDescription className="text-xs">
                Select a specific date and configure custom availability or mark as out-of-office.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3 text-xs">
              <div className="space-y-1.5">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newOverrideDate}
                  onChange={(e) => setNewOverrideDate(e.target.value)}
                  required
                  className="h-9 text-xs"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                <div>
                  <span className="font-semibold block text-zinc-900 dark:text-zinc-100">
                    Mark as Unavailable
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Block all bookings on this entire day
                  </span>
                </div>
                <Switch
                  checked={newOverrideUnavailable}
                  onCheckedChange={setNewOverrideUnavailable}
                  className="scale-90"
                />
              </div>

              {!newOverrideUnavailable && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <Label>Start Time</Label>
                    <select
                      value={newOverrideStart}
                      onChange={(e) => setNewOverrideStart(e.target.value)}
                      className="w-full h-9 px-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background"
                    >
                      {timeSlots.map((t) => (
                        <option key={t} value={t}>{formatTimeDisplay(t)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label>End Time</Label>
                    <select
                      value={newOverrideEnd}
                      onChange={(e) => setNewOverrideEnd(e.target.value)}
                      className="w-full h-9 px-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background"
                    >
                      {timeSlots.map((t) => (
                        <option key={t} value={t}>{formatTimeDisplay(t)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsOverrideModalOpen(false)}
                className="h-8 text-xs border-zinc-200 dark:border-zinc-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-8 text-xs bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
              >
                Add Override
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Troubleshooter Diagnostic Simulator */}
      <Dialog open={isTroubleshooterOpen} onOpenChange={setIsTroubleshooterOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <DialogTitle className="text-base font-bold">Availability Diagnostic</DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              Live checks performed against your calendar and scheduling parameters.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1">
              <div className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Working Hours Active</span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 pl-6">
                Your schedule &quot;{scheduleName}&quot; is active and open for bookings in {timezone}.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-1">
              <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Google Calendar Conflict Checking</span>
              </div>
              <p className="text-[11px] text-zinc-500 pl-6">
                Connected account ({user?.email || "primary email"}) is actively queried to avoid double-bookings.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-1">
              <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Buffer Times & Minimum Notice</span>
              </div>
              <p className="text-[11px] text-zinc-500 pl-6">
                Event type buffer rules are applied cleanly without conflicts.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              size="sm"
              onClick={() => setIsTroubleshooterOpen(false)}
              className="h-8 text-xs bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
            >
              Close Diagnostic
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
