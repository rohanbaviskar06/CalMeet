"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { 
  Network, 
  Zap, 
  Bell, 
  Mail, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Workflow,
  Clock,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const workflowTemplates = [
  {
    title: "Instant Booking Confirmation",
    trigger: "When meeting is booked",
    action: "Send email with calendar invite and Google Meet link to guest & host",
    icon: Mail,
  },
  {
    title: "24-Hour Pre-Meeting SMS Reminder",
    trigger: "24 hours before meeting starts",
    action: "Send SMS reminder with 1-click reschedule link to reduce no-shows",
    icon: MessageSquare,
  },
  {
    title: "Post-Meeting Follow-up & Feedback",
    trigger: "1 hour after meeting ends",
    action: "Send thank-you email with feedback questionnaire and presentation link",
    icon: Send,
  },
  {
    title: "Team Slack Channel Notification",
    trigger: "When high-value demo is scheduled",
    action: "Post prospect details to #sales-leads channel via webhook",
    icon: Bell,
  },
];

export default function WorkflowsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-6">
            <Link href="/resources" className="hover:text-zinc-600 dark:hover:text-zinc-200">Resources</Link>
            <span>/</span>
            <span className="text-zinc-800 dark:text-zinc-200 font-medium">Workflows</span>
          </div>

          {/* Hero */}
          <div className="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold mb-3 border border-zinc-200 dark:border-zinc-700">
              <Workflow className="h-3.5 w-3.5" />
              <span>Automated Meeting Operations</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Automate reminders, follow-ups & notifications
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mb-6">
              Put your meeting communications on autopilot. Build custom trigger-action workflows to eliminate no-shows and streamline follow-ups.
            </p>
            <div className="flex gap-3">
              <Button render={<Link href="/signup" />} size="sm" className="h-9 px-4 text-xs font-semibold">
                Create First Workflow <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>

          {/* Workflow Architecture Showcase */}
          <div className="mb-10 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 p-6 shadow-2xs space-y-4">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
              How CalMeet Workflows Operate
            </span>

            <div className="grid sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Step 1</span>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Trigger Event</h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Booking created, rescheduled, canceled, or time before/after start.</p>
              </div>

              <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Step 2</span>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Conditions & Filters</h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Filter by specific event type, attendee domain, or host assigned.</p>
              </div>

              <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Step 3</span>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Action Execution</h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Send custom emails, SMS alerts, or post to webhooks/Slack.</p>
              </div>
            </div>
          </div>

          {/* 4 Template Cards */}
          <div className="space-y-3 mb-12">
            <h2 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
              Popular Automation Templates
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {workflowTemplates.map((tpl) => {
                const Icon = tpl.icon;
                return (
                  <div
                    key={tpl.title}
                    className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{tpl.title}</h3>
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400 bg-zinc-50 dark:bg-zinc-950 px-2 py-1 rounded border border-zinc-100 dark:border-zinc-800/80">
                      Trigger: {tpl.trigger}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{tpl.action}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Checklist Box */}
          <div className="mb-12 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 p-6 shadow-2xs">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide mb-4">
              Workflow Features & Channels
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Custom email templates with dynamic merge variables",
                "SMS notifications via Twilio gateway",
                "Slack and Microsoft Teams channel webhook triggers",
                "Dynamic reschedule and cancellation links included",
                "Automated delivery logs and failure retries",
                "Works across personal and team event types",
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
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">Ready to automate your meeting follow-ups?</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Activate pre-built workflows in your dashboard in 1 click.</div>
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
