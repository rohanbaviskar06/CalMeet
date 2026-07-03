"use client";

import { useState, useEffect } from "react";
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
import { createBooking, deletePendingBooking, verifyBookingPayment } from "@/app/actions/bookings";
import { toast } from "sonner";

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

function FormattedDescription({ text }: { text: string }) {
  if (!text) return null;
  
  return (
    <div 
      className="text-sm text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
}

export function BookingForm({ user, eventType, availability, bookings }: BookingFormProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        } catch (e) {
          setReferer(document.referrer);
        }
      }
    }
  }, []);

  // Calculate available slots for the selected date
  const availableSlots = date ? (() => {
    const dayOfWeek = date.getDay();
    const dayAvailabilities = availability.filter(a => a.dayOfWeek === dayOfWeek);
    
    if (dayAvailabilities.length === 0) return [];
    
    const slots: string[] = [];
    const now = new Date();

    dayAvailabilities.forEach(avail => {
      let [startH, startM] = avail.startTime.split(':').map(Number);
      let [endH, endM] = avail.endTime.split(':').map(Number);
      
      let current = new Date(date);
      current.setHours(startH, startM, 0, 0);
      
      const windowEnd = new Date(date);
      windowEnd.setHours(endH, endM, 0, 0);
      
      // Use duration as interval, but minimum 15 mins
      const interval = Math.max(eventType.duration, 15);
      
      while (current.getTime() + eventType.duration * 60000 <= windowEnd.getTime()) {
        // Add a 1-hour buffer to avoid last-minute bookings
        const bufferTime = 60 * 60 * 1000; 
        if (current.getTime() > now.getTime() + bufferTime) {
          // Check if this slot overlaps with any existing booking
          const slotStart = current.getTime();
          const slotEnd = slotStart + eventType.duration * 60000;
          
          const isBooked = bookings.some(booking => {
            const bStart = new Date(booking.startTime).getTime();
            const bEnd = new Date(booking.endTime).getTime();
            return (slotStart < bEnd && slotEnd > bStart);
          });

          if (!isBooked) {
            slots.push(format(current, "hh:mm a"));
          }
        }
        current.setMinutes(current.getMinutes() + interval);
      }
    });
    
    // Sort slots just in case multiple windows overlap or are out of order
    return Array.from(new Set(slots)).sort((a, b) => {
      const timeA = new Date(`2000-01-01 ${a}`).getTime();
      const timeB = new Date(`2000-01-01 ${b}`).getTime();
      return timeA - timeB;
    });
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
        utmSource,
        utmMedium,
        referer,
      });

      if (result.success) {
        const matches = eventType.description?.match(/<!-- PAYMENT_LINK: (.*?) -->/);
        const customPaymentLink = matches ? matches[1] : null;

        if (customPaymentLink) {
          const bookingId = result.booking?.id || result.bookingId;
          if (bookingId) {
            toast.success("Redirecting to payment gateway to complete your booking...");
            const separator = customPaymentLink.includes("?") ? "&" : "?";
            const paymentLinkWithRef = `${customPaymentLink}${separator}reference_id=${bookingId}`;
            setTimeout(() => {
              try {
                // If loaded in an iframe, redirect the parent window to keep it on the same tab
                if (window.self !== window.top) {
                  window.top!.location.href = paymentLinkWithRef;
                } else {
                  window.location.href = paymentLinkWithRef;
                }
              } catch (e) {
                window.location.href = paymentLinkWithRef;
              }
            }, 1200);
          }
          return;
        }

        if (result.requiresPayment && result.razorpayOrder) {
          // Dynamic Razorpay SDK loader helper
          const loadScript = () => {
            return new Promise((resolve) => {
              if ((window as any).Razorpay) {
                resolve(true);
                return;
              }
              const script = document.createElement("script");
              script.src = "https://checkout.razorpay.com/v1/checkout.js";
              script.onload = () => resolve(true);
              script.onerror = () => resolve(false);
              document.body.appendChild(script);
            });
          };

          const isLoaded = await loadScript();
          if (!isLoaded) {
            toast.error("Failed to load payment gateway. Please check your internet connection.");
            setIsSubmitting(false);
            return;
          }

          const options = {
            key: result.keyId,
            amount: result.razorpayOrder.amount,
            currency: result.razorpayOrder.currency,
            name: "CalMeet Booking",
            description: `${eventType.title} Booking Payment`,
            order_id: result.razorpayOrder.id,
            handler: async function (response: any) {
              setIsSubmitting(true);
              try {
                const verifyResult = await verifyBookingPayment(
                  result.bookingId,
                  response.razorpay_payment_id,
                  response.razorpay_order_id,
                  response.razorpay_signature
                );
                if (verifyResult.success) {
                  toast.success("Payment verified and meeting scheduled!");
                  setStep(3); // Success step
                } else {
                  toast.error(verifyResult.error || "Payment verification failed.");
                }
              } catch (err) {
                toast.error("An error occurred during payment verification.");
              } finally {
                setIsSubmitting(false);
              }
            },
            prefill: {
              name: formData.get('name') as string,
              email: formData.get('email') as string,
            },
            theme: {
              color: "#0f172a",
            },
            modal: {
              ondismiss: async function () {
                toast.info("Payment cancelled.");
                setIsSubmitting(false);
                try {
                  await deletePendingBooking(result.bookingId);
                } catch (e) {
                  console.error("Failed to delete pending booking:", e);
                }
              }
            }
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        } else {
          toast.success("Meeting booked successfully!");
          setStep(3); // Success step
        }
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
    <div className="grid md:grid-cols-12 h-full min-h-[600px]">
      {/* Left Info Panel */}
      <div className="md:col-span-5 lg:col-span-4 border-r p-8 bg-card">
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
              <h3 className="text-zinc-500 dark:text-zinc-400 text-sm font-normal">{user.name}</h3>
              {user.bio && (
                <p className="text-xs text-muted-foreground mt-1 max-w-[245px] leading-relaxed break-words">{user.bio}</p>
              )}
              <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mt-2">{eventType.title}</h1>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-150 dark:border-zinc-800">
            <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
              <Clock className="h-4.5 w-4.5" />
              <span className="font-normal text-sm">{eventType.duration} mins</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
              <Globe className="h-4.5 w-4.5" />
              <span className="font-normal text-sm">{user.timezone || "Universal Time UTC +05:30"}</span>
            </div>
            {step === 2 && date && selectedTime && (
              <div className="flex items-center gap-3 text-primary font-medium">
                <CalendarIcon className="h-4.5 w-4.5" />
                <span className="text-sm">
                  {selectedTime}, {format(date, "eeee, MMMM d, yyyy")}
                </span>
              </div>
            )}
            {eventType.requiresPayment && eventType.price && (
              <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="text-sm px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/30">
                  💰 Price: {eventType.currency === "INR" ? "₹" : "$"}
                  {eventType.price}
                </span>
              </div>
            )}
          </div>

          <FormattedDescription 
            text={eventType.description || "A meeting to discuss project requirements."} 
          />
        </div>
      </div>

      {/* Right Interactive Panel */}
      <div className="md:col-span-7 lg:col-span-8 p-8 bg-muted/5">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              <div className="mb-8">
                <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Select Date & Time</h2>
                <p className="text-zinc-500 dark:text-zinc-450 text-sm mt-1">Select a day and time that works best for you.</p>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 bg-white dark:bg-zinc-900/60 rounded-2xl p-6 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="p-0 border-none w-full"
                    classNames={{
                      weekday: "text-zinc-400 font-medium text-[10px] uppercase tracking-widest pb-4 flex-1 text-center flex items-center justify-center",
                      day: "h-10 flex-1 text-center text-sm p-0 relative flex items-center justify-center",
                      month_caption: "flex justify-center items-center h-10 mb-8 relative",
                      caption_label: "text-sm font-semibold tracking-tight",
                      nav: "absolute inset-x-0 h-10 flex items-center justify-between pointer-events-none",
                      button_previous: "relative left-0 h-10 w-10 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-full border border-zinc-150 dark:border-zinc-800 flex items-center justify-center transition-all z-10 pointer-events-auto",
                      button_next: "relative right-0 h-10 w-10 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-full border border-zinc-150 dark:border-zinc-800 flex items-center justify-center transition-all z-10 pointer-events-auto",
                    }}
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                  />
                </div>

                <div className="w-full lg:w-72 flex flex-col">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                      {date ? format(date, "eeee, MMM d") : "Availability"}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/5 px-2.5 py-0.5 rounded-full">
                      {availableSlots.length} Slots
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto max-h-[360px] pr-2 scrollbar-thin scrollbar-thumb-zinc-250 dark:scrollbar-thumb-zinc-800">
                    <AnimatePresence mode="popLayout">
                      {availableSlots.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {availableSlots.map((time, idx) => (
                            <motion.div
                              key={time}
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.03 }}
                            >
                              <Button 
                                variant="outline" 
                                className="w-full h-11 justify-center font-normal border-zinc-200 dark:border-zinc-800/80 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all rounded-xl text-sm"
                                onClick={() => handleTimeSelect(time)}
                              >
                                {time}
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex flex-col items-center justify-center py-12 px-4 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed"
                        >
                          <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
                             <Clock className="h-5 w-5 text-zinc-400" />
                          </div>
                          <p className="text-xs text-muted-foreground font-medium italic">
                            No slots available for this day.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
              <h2 className="text-xl font-semibold mb-6 text-zinc-900 dark:text-zinc-155">Enter Details</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Full Name *</label>
                  <input 
                    name="name"
                    type="text" 
                    placeholder="John Smith" 
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-background text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email Address *</label>
                  <input 
                    name="email"
                    type="email" 
                    placeholder="john@example.com" 
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-background text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Please share anything that will help prepare for our meeting.</label>
                  <textarea 
                    name="notes"
                    rows={4}
                    placeholder="Brief description of your project..." 
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-background text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all resize-none"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-medium rounded-xl shadow-md bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Booking..." : "Confirm Booking"}
                </Button>
                <p className="text-xs text-center text-zinc-400 dark:text-zinc-500">
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
