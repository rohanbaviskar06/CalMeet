"use client";

import { motion } from "framer-motion";
import {
  CalendarCheck2,
  Link2,
  Sparkles,
  Calendar,
  Clock,
  Plus,
  Video,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    id: "connect",
    step: "01",
    title: "Connect your calendar",
    description:
      "Sync Google Calendar or Outlook in one click. CalMeet reads your busy times in real-time — no double bookings, no conflicts, ever.",
    icon: CalendarCheck2,
    accent: "neutral",
    tags: ["Google Calendar", "Outlook", "iCloud"],
    preview: (
      <div className="w-full h-full flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-sm space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Connected Calendars
              </p>
              <h4 className="text-base font-bold mt-0.5">Sync your schedule</h4>
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
              <Plus className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
            </div>
          </div>

          {/* Calendar rows */}
          {[
            { name: "Google Calendar", email: "alex@gmail.com", active: true, color: "bg-zinc-900 dark:bg-zinc-100" },
            { name: "Outlook Office 365", email: "alex@company.com", active: false, color: "bg-zinc-400" },
            { name: "iCloud Calendar", email: "alex@icloud.com", active: false, color: "bg-zinc-200" },
          ].map((cal, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                cal.active
                  ? "bg-white dark:bg-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-sm"
                  : "bg-muted/20 border-border/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${cal.color} flex items-center justify-center`}>
                  <Calendar className={`h-4 w-4 ${cal.active ? "text-zinc-100 dark:text-zinc-900" : "text-white"}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-none">{cal.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{cal.email}</p>
                </div>
              </div>
              {cal.active ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                  <span className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100">Synced</span>
                </div>
              ) : (
                <button className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100 px-2.5 py-1 rounded-full border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  Connect
                </button>
              )}
            </motion.div>
          ))}

          {/* Conflict shield */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 mt-4">
            <CheckCircle2 className="h-4 w-4 text-zinc-900 dark:text-zinc-100 flex-shrink-0" />
            <p className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
              Conflict detection active — no double bookings
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "create",
    step: "02",
    title: "Create your booking page",
    description:
      "Define event types, set your working hours, add buffer times, and generate a personalized booking link — all in under 2 minutes.",
    icon: Link2,
    accent: "neutral",
    tags: ["Custom URL", "Event Types", "Availability Rules"],
    preview: (
      <div className="w-full h-full flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-sm space-y-4">
          {/* URL bar */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Your booking link
            </p>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white dark:bg-zinc-800 border shadow-sm">
              <div className="flex-1 min-w-0">
                <code className="text-sm text-zinc-900 dark:text-zinc-100 font-mono truncate block">
                  calmeet.app/<span className="font-bold">alex</span>/intro
                </code>
              </div>
              <button className="flex-shrink-0 px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-lg text-[11px] font-bold shadow-sm">
                Copy
              </button>
            </div>
          </div>

          {/* Event type cards */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Event types
            </p>
            {[
              { name: "Quick Chat", duration: "15 min", color: "bg-zinc-900 dark:bg-zinc-100", active: true },
              { name: "Strategy Call", duration: "45 min", color: "bg-zinc-400", active: false },
              { name: "Deep Dive", duration: "60 min", color: "bg-zinc-200", active: false },
            ].map((evt, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  evt.active
                    ? "bg-white dark:bg-zinc-800 border-zinc-900 dark:border-zinc-100 shadow-sm"
                    : "bg-muted/20 border-border/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${evt.color}`} />
                  <span className="text-sm font-semibold">{evt.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">{evt.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Video className="h-3 w-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "booked",
    step: "03",
    title: "Get booked automatically",
    description:
      "Share your link anywhere — email signature, website, or Slack. Invitees pick a slot, fill in details, and a meeting invite lands in both calendars instantly.",
    icon: Sparkles,
    accent: "neutral",
    tags: ["Instant Confirmation", "Calendar Invite", "Meet Link"],
    preview: (
      <div className="w-full h-full flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-sm space-y-3">
          {/* Confirmation card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl border overflow-hidden shadow-lg"
          >
            <div className="bg-zinc-900 dark:bg-zinc-100 px-5 py-4 text-zinc-100 dark:text-zinc-900">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide opacity-90">Confirmed</span>
              </div>
              <h4 className="text-lg font-bold">Meeting Booked!</h4>
              <p className="text-xs opacity-80 mt-0.5">A calendar invite has been sent to both parties</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Date</p>
                  <p className="text-sm font-semibold">Monday, May 19, 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Time</p>
                  <p className="text-sm font-semibold">10:00 — 10:15 AM IST</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <Video className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Location</p>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-bold">Google Meet link ready</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Attendees */}
          <div className="flex items-center justify-between px-1">
            <div className="flex -space-x-2">
              {["A", "S"].map((letter, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-background bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-zinc-100 dark:text-zinc-900 text-xs font-bold"
                >
                  {letter}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">2 attendees • invite sent</p>
          </div>
        </div>
      </div>
    ),
  },
];

const accentMap: Record<string, { ring: string; bg: string; text: string; badge: string }> = {
  neutral: {
    ring: "ring-zinc-900 dark:ring-zinc-100",
    bg: "bg-zinc-900 dark:bg-zinc-100",
    text: "text-zinc-900 dark:text-zinc-100",
    badge: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700",
  },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-black border-y overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
            How it works
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Up and running in <span className="underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-8">3 simple steps</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg max-w-xl mx-auto">
            No complex setup. No steep learning curve. Just plug in and start getting booked.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-32 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const isEven = index % 2 === 1;
            const c = accentMap[step.accent];
            
            return (
              <div
                key={step.id}
                className={`flex flex-col ${
                  isEven ? "lg:flex-row-reverse" : "lg:flex-row"
                } gap-12 lg:gap-20 items-center`}
              >
                {/* Text Side */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="flex-1 space-y-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${c.bg} text-zinc-100 dark:text-zinc-900 shadow-lg`}
                      >
                        <step.icon className="h-6 w-6" />
                      </div>
                      <span className={`text-sm font-black uppercase tracking-widest ${c.text}`}>
                        Step {step.step}
                      </span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                      {step.title}
                    </h3>
                  </div>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {step.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs font-semibold px-4 py-1.5 rounded-full border ${c.badge}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Preview Side */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="flex-1 w-full"
                >
                  <div className="relative">
                    {/* Minimal Border Decoration */}
                    <div className="absolute -inset-px rounded-[32px] border border-zinc-200 dark:border-zinc-800 pointer-events-none" />
                    
                    <div className="relative rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden h-[400px] md:h-[480px]">
                      {/* Browser chrome bar */}
                      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/50">
                        {["bg-zinc-300", "bg-zinc-300", "bg-zinc-300"].map((color, i) => (
                          <div key={i} className={`w-2.5 h-2.5 rounded-full ${color} opacity-70`} />
                        ))}
                        <div className="flex-1 mx-4">
                          <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-1 text-[11px] text-zinc-500 font-mono">
                            calmeet.app/{step.id === "connect" ? "dashboard" : step.id === "create" ? "alex/setup" : "confirmed"}
                          </div>
                        </div>
                      </div>

                      {/* Content area */}
                      <div className="h-full overflow-hidden">
                        {step.preview}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
