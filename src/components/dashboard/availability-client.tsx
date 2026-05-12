"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { updateAvailability } from "@/app/actions/availability";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const days = [
  { label: "Sunday", value: 0 },
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
];

export function AvailabilityForm({ 
  initialAvailability, 
  initialTimezone 
}: { 
  initialAvailability: any[],
  initialTimezone: string 
}) {
  const [availability, setAvailability] = useState(
    days.map(day => {
      const existing = initialAvailability.find(d => d.dayOfWeek === day.value);
      return {
        dayOfWeek: day.value,
        label: day.label,
        isActive: !!existing,
        startTime: existing?.startTime || "09:00",
        endTime: existing?.endTime || "17:00",
      };
    })
  );

  const [timezone, setTimezone] = useState(initialTimezone);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const commonTimezones = [
    { label: "India Standard Time (Asia/Kolkata)", value: "Asia/Kolkata" },
    { label: "UTC", value: "UTC" },
    { label: "Eastern Time (America/New_York)", value: "America/New_York" },
    { label: "Pacific Time (America/Los_Angeles)", value: "America/Los_Angeles" },
    { label: "London (Europe/London)", value: "Europe/London" },
  ];

  const allTimezones = mounted ? Intl.supportedValuesOf('timeZone') : [];
  const filteredTimezones = allTimezones.filter(tz => !commonTimezones.find(ct => ct.value === tz));

  const [isSaving, setIsSaving] = useState(false);

  const toggleDay = (dayValue: number) => {
    setAvailability(prev => prev.map(d => 
      d.dayOfWeek === dayValue ? { ...d, isActive: !d.isActive } : d
    ));
  };

  const updateTime = (dayValue: number, field: "startTime" | "endTime", value: string) => {
    setAvailability(prev => prev.map(d => 
      d.dayOfWeek === dayValue ? { ...d, [field]: value } : d
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateAvailability(availability, timezone);
      toast.success("Availability updated successfully");
    } catch (error) {
      toast.error("Failed to update availability");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Timezone</span>
            <span className="text-sm text-muted-foreground">The timezone used for your schedule.</span>
          </div>
          <select 
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="bg-background border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 min-w-[240px]"
          >
            <optgroup label="Common">
              {commonTimezones.map(tz => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </optgroup>
            <optgroup label="All Timezones">
              {filteredTimezones.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </optgroup>
          </select>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {availability.map((day) => (
          <Card key={day.dayOfWeek} className={!day.isActive ? "opacity-60 bg-muted/20" : ""}>
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-[140px]">
                <Switch 
                  checked={day.isActive} 
                  onCheckedChange={() => toggleDay(day.dayOfWeek)} 
                />
                <span className="font-semibold">{day.label}</span>
              </div>
              
              {day.isActive ? (
                <div className="flex items-center gap-2">
                  <input 
                    type="time" 
                    value={day.startTime}
                    onChange={(e) => updateTime(day.dayOfWeek, "startTime", e.target.value)}
                    className="bg-background border rounded px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="text-muted-foreground">to</span>
                  <input 
                    type="time" 
                    value={day.endTime}
                    onChange={(e) => updateTime(day.dayOfWeek, "endTime", e.target.value)}
                    className="bg-background border rounded px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              ) : (
                <span className="text-sm text-muted-foreground italic py-1.5">Unavailable</span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={isSaving} className="min-w-[120px]">
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
