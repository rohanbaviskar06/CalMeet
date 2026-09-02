"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Video, Globe, Clock, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function Hero() {
  const { status } = useSession();

  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-white dark:bg-[#0c0c0c] text-zinc-900 dark:text-zinc-100">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 text-xs font-medium rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Open Source Scheduling Infrastructure</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Scheduling simplified <br />
            <span className="text-zinc-400 dark:text-zinc-500">for modern teams.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed">
            CalMeet gives you total control over your calendar. Share personalized booking links, 
            automate follow-ups, trigger webhooks, and eliminate the back-and-forth forever.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {status === "loading" ? (
              <div className="w-48 h-11 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-lg" />
            ) : status === "authenticated" ? (
              <Button render={<Link href="/dashboard" />} size="lg" className="h-11 px-6 text-sm font-semibold rounded-lg">
                Go to Dashboard <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            ) : (
              <Button render={<Link href="/signup" />} size="lg" className="h-11 px-6 text-sm font-semibold rounded-lg">
                Get Started for Free <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            )}
            <Button render={<Link href="/pricing" />} variant="outline" size="lg" className="h-11 px-6 text-sm font-semibold rounded-lg border-zinc-200 dark:border-zinc-800">
              View Plans & Pricing
            </Button>
          </div>

          {/* Highlights */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-zinc-700 dark:text-zinc-300" />
              No credit card required
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-zinc-700 dark:text-zinc-300" />
              Free forever plan
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-zinc-700 dark:text-zinc-300" />
              Developer API & Webhooks
            </div>
          </div>
        </motion.div>

        {/* Real CalMeet Booking Page Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 relative mx-auto max-w-4xl"
        >
          {/* Container simulating the real booking UI */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111111] text-zinc-900 dark:text-zinc-100 shadow-xl overflow-hidden text-left">
            {/* Top Minimal Bar */}
            <div className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/60 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <span className="font-mono font-medium text-[11px]">calmeet.com/alex/15min</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-zinc-200/70 dark:bg-zinc-800 text-[10px] font-semibold text-zinc-700 dark:text-zinc-300">
                  12h / 24h
                </span>
                <span className="px-2 py-0.5 rounded-md bg-zinc-900 dark:bg-zinc-100 text-[10px] font-semibold text-white dark:text-zinc-900">
                  Month View
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800">
              {/* Left Host Panel */}
              <div className="md:col-span-4 p-6 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-sm text-zinc-800 dark:text-zinc-200">
                      AU
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Alex User</p>
                      <h3 className="text-base font-bold tracking-tight">15 Min Meeting</h3>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-zinc-400" />
                      <span>15 minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Cal Video (Google Meet)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Asia/Kolkata (GMT+5:30)</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
                  &ldquo;Quick 15-min sync to discuss product updates and collaboration.&rdquo;
                </div>
              </div>

              {/* Middle Calendar Grid */}
              <div className="md:col-span-5 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">March 2026</span>
                  <div className="flex items-center gap-1 text-xs text-zinc-400">
                    <span>&lsaquo;</span>
                    <span>&rsaquo;</span>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <span key={i} className="text-[10px] font-bold text-zinc-400 py-1">{d}</span>
                  ))}
                  {Array.from({ length: 31 }).map((_, i) => {
                    const day = i + 1;
                    const isSelected = day === 4;
                    const isAvailable = [2, 3, 4, 5, 6, 9, 10, 11, 12, 13].includes(day);
                    return (
                      <div
                        key={i}
                        className={`h-8 rounded-lg flex items-center justify-center font-medium text-xs transition-colors ${
                          isSelected
                            ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold shadow-xs"
                            : isAvailable
                            ? "bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
                            : "text-zinc-300 dark:text-zinc-700"
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Time Slots */}
              <div className="md:col-span-3 p-6 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                  Wed, Mar 4
                </div>

                <div className="space-y-2">
                  {[
                    "9:00 AM",
                    "9:30 AM",
                    "10:00 AM",
                    "11:30 AM",
                    "2:00 PM",
                  ].map((time, idx) => (
                    <div
                      key={time}
                      className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                        idx === 1
                          ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                          : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-800 dark:text-zinc-200"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${idx === 1 ? "bg-emerald-400" : "bg-emerald-500"}`} />
                        <span>{time}</span>
                      </div>
                      {idx === 1 && <span className="text-[10px] uppercase font-bold">Selected</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
