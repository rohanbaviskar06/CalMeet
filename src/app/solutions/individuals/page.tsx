"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { 
  User, 
  Calendar, 
  Clock, 
  CreditCard, 
  Globe, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Video,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Personalized Booking Link",
    description: "Claim your custom calmeet.com/username link. Share it across email signatures, LinkedIn, X, or your portfolio website.",
    icon: Globe,
  },
  {
    title: "Automated 2-Way Calendar Sync",
    description: "Connect Google Calendar. CalMeet automatically checks your real-time busy slots and adds newly confirmed meetings instantly.",
    icon: Calendar,
  },
  {
    title: "Guarded Availability & Buffer Times",
    description: "Prevent back-to-back fatigue by adding 10-15 min buffers between calls, setting daily meeting limits, and enforcing notice windows.",
    icon: Clock,
  },
  {
    title: "Paid Consultation Checkouts",
    description: "Monetize your advisory calls. Collect payments upfront via Razorpay or Stripe before booking confirmation.",
    icon: CreditCard,
  },
];

export default function IndividualsSolutionPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-6">
            <Link href="/solutions" className="hover:text-zinc-600 dark:hover:text-zinc-200">Solutions</Link>
            <span>/</span>
            <span className="text-zinc-800 dark:text-zinc-200 font-medium">Individuals</span>
          </div>

          {/* Hero Header */}
          <div className="mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold mb-3 border border-zinc-200 dark:border-zinc-700">
              <User className="h-3.5 w-3.5" />
              <span>For Freelancers, Founders & Solo Creators</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              One booking link to rule your schedule
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mb-6">
              Eliminate the back-and-forth emails. Give clients, collaborators, and peers a frictionless way to book time with you.
            </p>
            <div className="flex gap-3">
              <Button render={<Link href="/signup" />} size="sm" className="h-9 px-4 text-xs font-semibold">
                Get Started Free <ArrowRight className="h-3.5 w-3.5 ml-1" />
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
              Everything included in the Personal Plan
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Unlimited confirmed bookings",
                "Google Calendar & Google Meet sync",
                "Custom 12h/24h time formatting",
                "Automatic timezone detection",
                "Custom email confirmation templates",
                "14-day free trial on Pro features",
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
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">Ready to streamline your personal calendar?</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Create your booking link in under 60 seconds.</div>
            </div>
            <Button render={<Link href="/signup" />} size="sm" className="h-9 px-4 text-xs font-semibold">
              Claim Your Link
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
