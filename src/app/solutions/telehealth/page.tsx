"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { 
  Video, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Lock,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Secure Video Room Links",
    description: "Generate unique, private Google Meet or Zoom video links for each consultation, preventing unexpected attendee overlap.",
    icon: Video,
  },
  {
    title: "Compliant Cloud Infrastructure",
    description: "CalMeet is hosted on HIPAA and SOC2-compliant cloud providers (AWS, Supabase) with encrypted secrets and hashed credentials.",
    icon: ShieldCheck,
  },
  {
    title: "Automated Patient Reminders",
    description: "Dispatch automated email notifications before appointments to minimize clinic no-shows and keep schedules on track.",
    icon: Clock,
  },
  {
    title: "Custom Intake & Triage Forms",
    description: "Collect necessary pre-visit information and intake disclosures securely before patients confirm their time slots.",
    icon: Lock,
  },
];

export default function TelehealthSolutionPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-6">
            <Link href="/solutions" className="hover:text-zinc-600 dark:hover:text-zinc-200">Solutions</Link>
            <span>/</span>
            <span className="text-zinc-800 dark:text-zinc-200 font-medium">Telehealth</span>
          </div>

          {/* Hero Header */}
          <div className="mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold mb-3 border border-purple-500/20">
              <Video className="h-3.5 w-3.5" />
              <span>For Clinics & Virtual Care Providers</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Reliable, friction-free scheduling for virtual care
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mb-6">
              Connect patients with practitioners through automated calendar bookings, pre-session intake questions, and secure video links.
            </p>
            <div className="flex gap-3">
              <Button render={<Link href="/signup" />} size="sm" className="h-9 px-4 text-xs font-semibold">
                Start Free Trial <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
              <Button render={<Link href="/pricing" />} variant="outline" size="sm" className="h-9 px-4 text-xs font-semibold border-zinc-200 dark:border-zinc-800">
                View Pricing
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
                  <div className="w-7 h-7 rounded-md bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
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
              Telehealth & Clinic Features
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Unique video room URLs per appointment (Google Meet / Zoom)",
                "Custom intake questions and medical disclosure checkboxes",
                "Two-way calendar sync preventing practitioner double-booking",
                "Automated patient confirmation emails and calendar invites",
                "Hosted on SOC2 and HIPAA-compliant cloud data centers",
                "Buffer times between consults for notes and charting",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Box */}
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">Ready to streamline patient appointments?</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Get started today or test the flow with a live demo.</div>
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
