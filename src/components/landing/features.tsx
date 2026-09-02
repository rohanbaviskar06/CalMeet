"use client";

import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Globe, 
  Webhook, 
  GitMerge, 
  ShieldCheck, 
  CreditCard,
  Code2,
  Workflow,
  Sparkles
} from "lucide-react";

const features = [
  {
    title: "Instant Cal.com-Style Booking",
    description: "Share single day or multi-day week booking pages. 12h/24h toggle, timezone intelligence, and frictionless guest scheduling.",
    icon: Calendar,
    tag: "Core Experience"
  },
  {
    title: "Routing Forms & Lead Qualification",
    description: "Ask custom questions before booking and route qualified prospects to the right team member or event type automatically.",
    icon: GitMerge,
    tag: "Conversion"
  },
  {
    title: "Developer REST API & Webhooks",
    description: "Programmatic booking creation, event listeners with HMAC-SHA256 signatures, and secure API keys for custom integrations.",
    icon: Webhook,
    tag: "Developers"
  },
  {
    title: "Advanced Availability & Buffer Rules",
    description: "Set cool-down buffers before and after calls, daily booking limits, minimum notice hours, and custom weekly working hours.",
    icon: Clock,
    tag: "Control"
  },
  {
    title: "Paid Bookings & Instant Checkout",
    description: "Charge for consultations upfront in INR or USD with built-in Razorpay and Stripe checkout workflows.",
    icon: CreditCard,
    tag: "Monetization"
  },
  {
    title: "Enterprise Privacy & White-Labeling",
    description: "Remove CalMeet branding, connect custom domains, enforce SSO, and keep your calendar data GDPR & CCPA compliant.",
    icon: ShieldCheck,
    tag: "Enterprise"
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-zinc-50/60 dark:bg-zinc-950/60 border-y border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold mb-3 border border-zinc-200 dark:border-zinc-700">
            <Sparkles className="h-3.5 w-3.5 text-zinc-500" />
            <span>Built for Modern Scheduling</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Everything you need to schedule with confidence
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
            Engineered to remove all friction between you and your meetings, from personal links to enterprise sales teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-2xs group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 group-hover:scale-105 transition-transform">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                    {feature.tag}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
