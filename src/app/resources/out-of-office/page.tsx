"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Moon, Calendar, Bell, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Clock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  {
    title: "Automated Calendar Date Blocking",
    description: "Select vacation or conference dates once. CalMeet automatically closes public booking slots across all your active event types.",
    icon: Calendar,
  },
  {
    title: "Teammate Rerouting & Delegation",
    description: "Forward urgent booking requests to available team members while you're away so client momentum never stops.",
    icon: Globe,
  },
  {
    title: "Custom OOO Auto-Responder",
    description: "Display personalized out-of-office messages on your public booking page with exact return dates.",
    icon: Bell,
  },
  {
    title: "Return Buffers & Ramp-up",
    description: "Add a 24-48 hour buffer after returning from leave to clear your inbox before meetings resume.",
    icon: Clock,
  },
];

export default function OutOfOfficePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-6">
            <Link href="/resources" className="hover:text-zinc-600 dark:hover:text-zinc-200">Resources</Link>
            <span>/</span>
            <span className="text-zinc-800 dark:text-zinc-200 font-medium">Out of Office</span>
          </div>

          {/* Hero */}
          <div className="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold mb-3 border border-zinc-200 dark:border-zinc-700">
              <Moon className="h-3.5 w-3.5" />
              <span>Availability & Time-Off Management</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Protect your time off with Out of Office
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mb-6">
              Set your vacation dates once. CalMeet automatically blocks booking slots, notifies visitors, and routes urgent requests to teammates.
            </p>
            <div className="flex gap-3">
              <Button render={<Link href="/dashboard/settings" />} size="sm" className="h-9 px-4 text-xs font-semibold">
                Configure Out of Office <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>

          {/* 4 Feature Cards */}
          <div className="grid sm:grid-cols-2 gap-3 mb-12">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-2"
                >
                  <div className="w-7 h-7 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{f.title}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>

          {/* Checklist Box */}
          <div className="mb-12 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 p-6 shadow-2xs">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide mb-4">
              Vacation & Leave Safeguards
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Instant slot blocking across all active event types",
                "Google Calendar vacation entry detection",
                "Optional teammate fallback routing",
                "Custom return date announcement banner",
                "Automatic recovery buffer after leave ends",
                "Works with individual and team schedules",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">Planning upcoming time off?</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Set your dates in Settings to keep your calendar protected.</div>
            </div>
            <Button render={<Link href="/dashboard/settings" />} size="sm" className="h-9 px-4 text-xs font-semibold">
              Open Settings
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
