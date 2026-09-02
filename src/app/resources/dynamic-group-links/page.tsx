"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Link2, Users, GitMerge, Clock, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  {
    title: "URL-Based Ad-Hoc Group Meetings",
    description: "Generate instant multi-person booking links on the fly by combining usernames: `calmeet.com/alex+sarah+david`.",
    icon: Link2,
  },
  {
    title: "Zero Pre-Configuration Required",
    description: "No need to manually create new event types in your dashboard whenever temporary cross-functional teams need to meet.",
    icon: GitMerge,
  },
  {
    title: "Instant Multi-Calendar Intersection",
    description: "Dynamically checks the connected calendars of all usernames in the URL and returns only mutually free time slots.",
    icon: Users,
  },
  {
    title: "Smart Host Location & Video Sync",
    description: "Automatically sets up a shared Google Meet or Zoom room and dispatches calendar invitations to all parties.",
    icon: Globe,
  },
];

export default function DynamicGroupLinksPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-6">
            <Link href="/resources" className="hover:text-zinc-600 dark:hover:text-zinc-200">Resources</Link>
            <span>/</span>
            <span className="text-zinc-800 dark:text-zinc-200 font-medium">Dynamic Group Links</span>
          </div>

          {/* Hero */}
          <div className="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold mb-3 border border-zinc-200 dark:border-zinc-700">
              <Link2 className="h-3.5 w-3.5" />
              <span>Ad-Hoc Multi-Host Links</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Dynamic group booking links on the fly
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mb-6">
              Combine any usernames in a single link with a <code className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-zinc-900 dark:text-zinc-100">+</code> symbol. CalMeet intersects their availability instantly.
            </p>
            <div className="flex gap-3">
              <Button render={<Link href="/signup" />} size="sm" className="h-9 px-4 text-xs font-semibold">
                Try Dynamic Links <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>

          {/* Interactive URL Demo Box */}
          <div className="mb-10 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 p-6 shadow-2xs space-y-3">
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
              How Dynamic Group URLs Work
            </div>
            <pre className="p-3.5 rounded-lg bg-zinc-900 text-zinc-100 font-mono text-xs overflow-x-auto border border-zinc-800 text-emerald-400">
              {`https://calmeet.com/alex+sarah+elena/30min`}
            </pre>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              When a guest opens this URL, CalMeet scans the real-time Google Calendars of Alex, Sarah, and Elena to display only times where all three hosts can attend.
            </p>
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
              Key Capabilities
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Unlimited dynamic group link combinations",
                "Instant multi-calendar availability scan",
                "Works across all public usernames in your team",
                "Automatic video conference link generation",
                "Invites sent to all participating hosts",
                "Timezone converted automatically for every user",
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
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">Ready to schedule group meetings seamlessly?</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Join thousands of teams scheduling smarter with CalMeet.</div>
            </div>
            <Button render={<Link href="/signup" />} size="sm" className="h-9 px-4 text-xs font-semibold">
              Get Started Free
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
