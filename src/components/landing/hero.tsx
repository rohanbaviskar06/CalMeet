"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function Hero() {
  const { status } = useSession();

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-secondary text-secondary-foreground border">
            The next generation of scheduling
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Scheduling simplified <br />
            <span className="text-muted-foreground">for modern teams.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10">
            CalMeet helps you connect with people when it matters. Automate your meetings,
            sync your calendars, and reclaim your time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {status === "loading" ? (
              <div className="w-48 h-12 bg-muted animate-pulse rounded-md" />
            ) : status === "authenticated" ? (
              <Link href="/dashboard">
                <Button size="lg" className="h-12 px-8 text-base gap-2">
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/signup">
                <Button size="lg" className="h-12 px-8 text-base gap-2">
                  Get Started for Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <Link href="/demo">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                View Live Demo
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Free forever plan
            </div>
          </div>
        </motion.div>

        {/* Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          <div className="relative rounded-2xl border bg-card shadow-2xl overflow-hidden min-h-[500px] md:aspect-[16/10]">
            <div className="absolute inset-0 bg-gradient-to-tr from-background via-transparent to-background/50 pointer-events-none" />
            <div className="p-4 border-b bg-muted/50 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive/20 border border-destructive/30" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30" />
            </div>
            <div className="p-0 h-full flex flex-col md:flex-row overflow-hidden">
              {/* Left Info Panel Mock */}
              <div className="w-full md:w-[350px] border-b md:border-b-0 md:border-r p-6 md:p-8 bg-card flex flex-col gap-6 text-left">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-primary/10 border-2 border-background shadow-sm flex items-center justify-center text-primary font-bold text-lg md:text-xl">
                    JD
                  </div>
                  <div>
                    <div className="text-xs md:text-sm font-medium text-muted-foreground">Jane Doe</div>
                    <div className="text-base md:text-lg font-bold">15 Minute Meeting</div>
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="p-2 rounded-lg bg-secondary"><div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin-slow" /></div>
                    <span className="font-medium text-sm">15 mins</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="p-2 rounded-lg bg-secondary"><div className="w-4 h-4 rounded-full border-2 border-current" /></div>
                    <span className="font-medium text-sm">Video Call</span>
                  </div>
                </div>

                <div className="hidden md:block mt-auto p-4 rounded-2xl bg-primary/5 border border-primary/10">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    "Looking forward to connecting and discussing how we can help your team scale!"
                  </p>
                </div>
              </div>

              {/* Right Calendar Panel Mock */}
              <div className="flex-1 p-6 md:p-8 bg-muted/5 flex flex-col gap-6 text-left">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-lg md:text-xl font-bold">Select Date & Time</h3>
                  <div className="text-xs md:text-sm text-muted-foreground font-medium">March 2025</div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                  {/* Mini Calendar Mock */}
                  <div className="flex-1 grid grid-cols-7 gap-1 md:gap-2">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                      <div key={i} className="h-6 md:h-8 flex items-center justify-center text-[9px] md:text-[10px] font-bold text-muted-foreground">{d}</div>
                    ))}
                    {Array.from({ length: 28 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-8 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center text-xs md:text-sm font-medium border transition-colors ${i + 1 === 15 ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" : "bg-card hover:border-primary/50 cursor-pointer"}`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>

                  {/* Time Slots Mock */}
                  <div className="w-full lg:w-48 flex flex-col gap-2">
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 md:mb-2">Available Slots</div>
                    <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                      {["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM"].map(time => (
                        <div key={time} className="h-10 md:h-11 rounded-lg md:rounded-xl border bg-card flex items-center justify-center text-xs md:text-sm font-bold hover:border-primary transition-all cursor-pointer group">
                          <span className="group-hover:text-primary transition-colors">{time}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 h-10 md:h-11 rounded-lg md:rounded-xl bg-primary flex items-center justify-center text-xs md:text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 cursor-pointer hover:brightness-110 transition-all">
                      Confirm
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
