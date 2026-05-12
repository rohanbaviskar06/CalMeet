"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Globe, 
  Calendar as CalendarIcon,
  ArrowLeft
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { createBooking } from "@/app/actions/bookings";
import { toast } from "sonner";

interface BookingFormProps {
  user: {
    name: string | null;
    image: string | null;
    username: string | null;
  };
  eventType: {
    id: string;
    title: string;
    description: string | null;
    duration: number;
  };
  availability: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
}

export function BookingForm({ user, eventType, availability }: BookingFormProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate available slots for the selected date
  const availableSlots = date ? (() => {
    const dayOfWeek = date.getDay();
    const dayAvailability = availability.find(a => a.dayOfWeek === dayOfWeek);
    
    if (!dayAvailability) return [];
    
    const slots = [];
    let [startH, startM] = dayAvailability.startTime.split(':').map(Number);
    let [endH, endM] = dayAvailability.endTime.split(':').map(Number);
    
    let current = new Date(date);
    current.setHours(startH, startM, 0, 0);
    
    const endTime = new Date(date);
    endTime.setHours(endH, endM, 0, 0);
    
    // If today, don't show past slots
    const now = new Date();
    
    while (current.getTime() + eventType.duration * 60000 <= endTime.getTime()) {
      if (current > now) {
        slots.push(format(current, "hh:mm a"));
      }
      current.setMinutes(current.getMinutes() + 30); // 30 min intervals for selection
    }
    
    return slots;
  })() : [];

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!date || !selectedTime) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    // Combine date and time
    const [time, period] = selectedTime.split(' ');
    const [hours, minutes] = time.split(':');
    let h = parseInt(hours);
    if (period === 'PM' && h < 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    
    const startTime = new Date(date);
    startTime.setHours(h, parseInt(minutes), 0, 0);
    
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
      });

      if (result.success) {
        toast.success("Meeting booked successfully!");
        setStep(3); // Success step
      } else {
        toast.error(result.error || "Failed to book meeting");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 3) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CalendarIcon className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold mb-2">You are scheduled!</h2>
        <p className="text-muted-foreground mb-6">
          A calendar invitation has been sent to your email address.
        </p>
        <div className="bg-muted/50 p-4 rounded-xl w-full max-w-sm space-y-2 text-sm">
          <p className="font-semibold">{eventType.title}</p>
          <p>{selectedTime}, {format(date!, "eeee, MMMM d, yyyy")}</p>
          <p className="text-muted-foreground">15 mins</p>
        </div>
        <Button className="mt-8" variant="outline" onClick={() => window.location.reload()}>
            Book another meeting
        </Button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-5 h-full min-h-[600px]">
      {/* Left Info Panel */}
      <div className="md:col-span-2 border-r p-8 bg-card">
        {step === 2 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="-ml-2 mb-6 gap-2"
            onClick={() => setStep(1)}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        )}
        
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <Avatar className="h-16 w-16 border-2 border-background shadow-md">
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-muted-foreground font-medium">{user.name}</h3>
              <h1 className="text-2xl font-bold">{eventType.title}</h1>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Clock className="h-5 w-5" />
              <span className="font-medium text-sm">{eventType.duration} mins</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Globe className="h-5 w-5" />
              <span className="font-medium text-sm">Universal Time UTC +05:30</span>
            </div>
            {step === 2 && date && selectedTime && (
              <div className="flex items-center gap-3 text-primary font-semibold">
                <CalendarIcon className="h-5 w-5" />
                <span className="text-sm">
                  {selectedTime}, {format(date, "eeee, MMMM d, yyyy")}
                </span>
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {eventType.description || "A meeting to discuss project requirements."}
          </p>
        </div>
      </div>

      {/* Right Interactive Panel */}
      <div className="md:col-span-3 p-8 bg-muted/5">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col"
            >
              <h2 className="text-xl font-bold mb-6">Select Date & Time</h2>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border-none"
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                  />
                </div>
                  <div className="w-full lg:w-48">
                    <div className="text-sm font-medium mb-4">{date ? format(date, "eeee, MMM d") : "Select a date"}</div>
                    <div className="grid grid-cols-1 gap-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                      {availableSlots.length > 0 ? (
                        availableSlots.map((time) => (
                          <Button 
                            key={time} 
                            variant="outline" 
                            className="w-full h-12 justify-center font-medium hover:border-primary hover:bg-primary/5 transition-all"
                            onClick={() => handleTimeSelect(time)}
                          >
                            {time}
                          </Button>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground py-8 text-center italic">
                          No slots available for this day.
                        </div>
                      )}
                    </div>
                  </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <h2 className="text-xl font-bold mb-6">Enter Details</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name *</label>
                  <input 
                    name="name"
                    type="text" 
                    placeholder="John Smith" 
                    className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address *</label>
                  <input 
                    name="email"
                    type="email" 
                    placeholder="john@example.com" 
                    className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Please share anything that will help prepare for our meeting.</label>
                  <textarea 
                    name="notes"
                    rows={4}
                    placeholder="Brief description of your project..." 
                    className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary/20"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Booking..." : "Confirm Booking"}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  By confirming, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
