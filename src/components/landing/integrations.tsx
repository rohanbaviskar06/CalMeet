"use client";

import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

const integrations = [
  {
    name: "Google Calendar",
    description: "Two-way sync for real-time availability",
    category: "Calendar",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    logo: "GC",
    badge: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 border-blue-200 dark:border-blue-800",
  },
  {
    name: "Google Meet",
    description: "Auto-generate Meet links on booking",
    category: "Video",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    logo: "GM",
    badge: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 border-emerald-200 dark:border-emerald-800",
  },
  {
    name: "Zoom",
    description: "Automatic Zoom meeting creation",
    category: "Video",
    color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    logo: "Zm",
    badge: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 border-indigo-200 dark:border-indigo-800",
  },
  {
    name: "Outlook Calendar",
    description: "Sync with Microsoft 365 calendars",
    category: "Calendar",
    color: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    logo: "OL",
    badge: "bg-sky-50 dark:bg-sky-900/30 text-sky-600 border-sky-200 dark:border-sky-800",
  },
  {
    name: "Slack",
    description: "Get booking notifications in Slack",
    category: "Notifications",
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    logo: "Sl",
    badge: "bg-rose-50 dark:bg-rose-900/30 text-rose-600 border-rose-200 dark:border-rose-800",
  },
  {
    name: "Stripe",
    description: "Collect payments before meetings",
    category: "Payments",
    color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    logo: "St",
    badge: "bg-violet-50 dark:bg-violet-900/30 text-violet-600 border-violet-200 dark:border-violet-800",
  },
  {
    name: "Notion",
    description: "Log meetings to Notion databases",
    category: "Productivity",
    color: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
    logo: "No",
    badge: "bg-zinc-50 dark:bg-zinc-900/30 text-zinc-600 border-zinc-200 dark:border-zinc-700",
  },
  {
    name: "Salesforce",
    description: "Auto-log meetings in your CRM",
    category: "CRM",
    color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    logo: "SF",
    badge: "bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 border-cyan-200 dark:border-cyan-800",
    comingSoon: true,
  },
  {
    name: "HubSpot",
    description: "Sync contacts and meeting data",
    category: "CRM",
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    logo: "HS",
    badge: "bg-orange-50 dark:bg-orange-900/30 text-orange-600 border-orange-200 dark:border-orange-800",
    comingSoon: true,
  },
];

export function Integrations() {
  return (
    <section id="integrations" className="py-24 bg-muted/30 border-y">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-card mb-4">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Integrations
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            Works with your{" "}
            <span className="text-primary">existing stack</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            MeetMe plugs into the tools you already use. No workflow disruption, no new habits to form.
          </p>
        </motion.div>

        {/* Integration cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {integrations.map((integration, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="group relative flex items-start gap-4 p-5 rounded-2xl border bg-card hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              {/* Logo */}
              <div className={`w-11 h-11 rounded-xl ${integration.color} flex items-center justify-center font-black text-sm flex-shrink-0`}>
                {integration.logo}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-sm leading-none">{integration.name}</h3>
                  {integration.comingSoon ? (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted border text-muted-foreground flex-shrink-0">
                      Soon
                    </span>
                  ) : (
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex-shrink-0 ${integration.badge}`}>
                      {integration.category}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {integration.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Link href="/resources" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline underline-offset-4">
            View all integrations <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
