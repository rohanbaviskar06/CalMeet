"use client";

import { motion } from "framer-motion";
import { 
  BarChart3, 
  Calendar, 
  Clock, 
  Users, 
  CreditCard,
  CheckCircle2,
  Video,
  ExternalLink,
  Plus,
  Settings,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function DashboardDemo() {
  return (
    <section className="py-24 bg-white dark:bg-[#0c0c0c] text-zinc-900 dark:text-zinc-100 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold mb-3 border border-zinc-200 dark:border-zinc-700">
            <BarChart3 className="h-3.5 w-3.5 text-zinc-500" />
            <span>Intuitive Command Center</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Manage your entire schedule in one place
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
            Track upcoming bookings, manage event types, monitor earnings, and configure custom webhooks with ease.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/80 p-3 sm:p-6 shadow-xl"
        >
          {/* Inner Dashboard Mock */}
          <div className="space-y-4">
            {/* Top Bar inside mockup */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Welcome back, Alex
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Here&apos;s an overview of your schedule and booking activity today.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-zinc-600 dark:text-zinc-400">
                  calmeet.com/alex
                </span>
                <div className="px-3 py-1 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold flex items-center gap-1">
                  <Plus className="h-3 w-3" /> New Event
                </div>
              </div>
            </div>

            {/* 4 Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              {[
                { title: "Total Bookings", value: "148", desc: "All time scheduled", icon: Users },
                { title: "Upcoming", value: "6", desc: "In your queue", icon: Calendar },
                { title: "Avg. Duration", value: "25m", desc: "Per event type", icon: Clock },
                { title: "Revenue", value: "₹45,000", desc: "Collected earnings", icon: CreditCard },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.title}
                    className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        {stat.title}
                      </span>
                      <div className="w-6 h-6 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                        <Icon className="h-3 w-3" />
                      </div>
                    </div>
                    <div>
                      <div className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        {stat.value}
                      </div>
                      <p className="text-[10px] text-zinc-400">
                        {stat.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 2-Column Split: Upcoming Meetings + Event Types */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-1">
              {/* Upcoming list (7 cols) */}
              <div className="lg:col-span-7 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2.5">
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Upcoming Meetings</div>
                  <span className="text-[11px] text-zinc-400">Today & Tomorrow</span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { name: "Sarah Jenkins", role: "Product Strategy Sync", time: "Today · 2:30 PM", dur: "30m", link: "meet.google.com/abc-xyz" },
                    { name: "David Chen", role: "Client Intro & Onboarding", time: "Tomorrow · 10:00 AM", dur: "15m", link: "meet.google.com/def-uvw" },
                    { name: "Elena Rostova", role: "Design Review", time: "Tomorrow · 4:00 PM", dur: "45m", link: "meet.google.com/ghi-rst" },
                  ].map((m, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100">{m.name}</div>
                        <div className="text-[11px] text-zinc-400">{m.role} · {m.time} ({m.dur})</div>
                      </div>
                      <div className="px-2.5 py-1 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-bold flex items-center gap-1">
                        <Video className="h-3 w-3" /> Join
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Event Types list (5 cols) */}
              <div className="lg:col-span-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2.5">
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Active Event Types</div>
                  <span className="text-[11px] text-zinc-400">3 Active</span>
                </div>

                <div className="space-y-2">
                  {[
                    { title: "15 Min Meeting", slug: "/15min", dur: "15 mins", type: "1-on-1" },
                    { title: "Strategy Consultation", slug: "/strategy", dur: "45 mins", type: "Paid (₹2,500)" },
                    { title: "Team Discovery", slug: "/team-sync", dur: "30 mins", type: "Collective" },
                  ].map((et, i) => (
                    <div key={i} className="p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/40 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100">{et.title}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">{et.slug} · {et.dur}</div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
                        {et.type}
                      </span>
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
