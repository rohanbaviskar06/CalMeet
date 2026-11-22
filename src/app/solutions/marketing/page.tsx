"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { 
  BarChart3, 
  GitMerge, 
  Target, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Layers,
  Globe
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Lead Qualification & Routing",
    description: "Use custom routing forms to qualify inbound prospects before they book. Ensure high-intent leads route directly to Account Executives.",
    icon: GitMerge,
  },
  {
    title: "Conversion Tracking & Attribution",
    description: "Track appointment conversions cleanly across your marketing campaigns with redirect parameters and webhook events.",
    icon: Target,
  },
  {
    title: "High-Converting Embeds",
    description: "Embed responsive booking calendars directly inside your landing pages, blog posts, and campaign microsites.",
    icon: Layers,
  },
  {
    title: "Automated Lead Notifications",
    description: "Send instant calendar invites, email reminders, and branded meeting links that increase show-up rates and accelerate velocity.",
    icon: BarChart3,
  },
];

export default function MarketingSolutionPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-6">
            <Link href="/solutions" className="hover:text-zinc-600 dark:hover:text-zinc-200">Solutions</Link>
            <span>/</span>
            <span className="text-zinc-800 dark:text-zinc-200 font-medium">Marketing</span>
          </div>

          {/* Hero Header */}
          <div className="mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-semibold mb-3 border border-orange-500/20">
              <BarChart3 className="h-3.5 w-3.5" />
              <span>For Growth & Inbound Teams</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Convert campaign traffic into qualified meetings
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mb-6">
              Bridge the gap between marketing clicks and sales conversations with fast, high-converting scheduling funnels.
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
                  <div className="w-7 h-7 rounded-md bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400">
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
              Marketing Team Capabilities
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Drop-in responsive iframe and inline calendar embed widgets",
                "Custom form qualification questions before booking slot selection",
                "Signed webhooks for campaign attribution and CRM automation",
                "Dynamic redirect URLs on completed appointment booking",
                "Automated reminder triggers to reduce inbound lead drop-off",
                "Custom booking page branding and white-labeling",
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
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">Ready to optimize inbound conversions?</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Set up your first marketing booking form in under two minutes.</div>
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
