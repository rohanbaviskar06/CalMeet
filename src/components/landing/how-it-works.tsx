"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  CalendarCheck2,
  Link2,
  Sparkles,
  Check,
  Calendar,
  Clock,
  Globe,
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
      "Sync Google Calendar or Outlook in one click. MeetMe reads your busy times in real-time — no double bookings, no conflicts, ever.",
    icon: CalendarCheck2,
    accent: "blue",
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
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <Plus className="h-4 w-4 text-primary" />
            </div>
          </div>

          {/* Calendar rows */}
          {[
            { name: "Google Calendar", email: "alex@gmail.com", active: true, color: "bg-blue-500" },
            { name: "Outlook Office 365", email: "alex@company.com", active: false, color: "bg-indigo-500" },
            { name: "iCloud Calendar", email: "alex@icloud.com", active: false, color: "bg-zinc-400" },
          ].map((cal, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                cal.active
                  ? "bg-white dark:bg-zinc-800 border-blue-200 dark:border-blue-900 shadow-sm"
                  : "bg-muted/20 border-border/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${cal.color} flex items-center justify-center`}>
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-none">{cal.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{cal.email}</p>
                </div>
              </div>
              {cal.active ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 dark:bg-green-900/30 rounded-full border border-green-200 dark:border-green-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[10px] font-bold text-green-600 dark:text-green-400">Synced</span>
                </div>
              ) : (
                <button className="text-[10px] font-bold text-primary px-2.5 py-1 rounded-full border border-primary/30 hover:bg-primary/5 transition-colors">
                  Connect
                </button>
              )}
            </motion.div>
          ))}

          {/* Conflict shield */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 mt-4">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
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
    accent: "violet",
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
                <code className="text-sm text-primary font-mono truncate block">
                  meetme.app/<span className="font-bold">alex</span>/intro
                </code>
              </div>
              <button className="flex-shrink-0 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-[11px] font-bold shadow-sm">
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
              { name: "Quick Chat", duration: "15 min", color: "bg-violet-500", active: true },
              { name: "Strategy Call", duration: "45 min", color: "bg-blue-500", active: false },
              { name: "Deep Dive", duration: "60 min", color: "bg-amber-500", active: false },
            ].map((evt, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  evt.active
                    ? "bg-white dark:bg-zinc-800 border-violet-200 dark:border-violet-900 shadow-sm"
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
    accent: "amber",
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
            <div className="bg-gradient-to-r from-primary to-primary/80 px-5 py-4 text-primary-foreground">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide opacity-90">Confirmed</span>
              </div>
              <h4 className="text-lg font-bold">Meeting Booked!</h4>
              <p className="text-xs opacity-80 mt-0.5">A calendar invite has been sent to both parties</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Date</p>
                  <p className="text-sm font-semibold">Monday, May 19, 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-violet-500" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Time</p>
                  <p className="text-sm font-semibold">10:00 — 10:15 AM IST</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Video className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Location</p>
                  <p className="text-sm font-semibold text-primary">Google Meet link ready</p>
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
                  className="w-8 h-8 rounded-full border-2 border-background bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-xs font-bold"
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
  blue: {
    ring: "ring-blue-500",
    bg: "bg-blue-500",
    text: "text-blue-600 dark:text-blue-400",
    badge: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  },
  violet: {
    ring: "ring-violet-500",
    bg: "bg-violet-500",
    text: "text-violet-600 dark:text-violet-400",
    badge: "bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 border-violet-200 dark:border-violet-800",
  },
  amber: {
    ring: "ring-amber-500",
    bg: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  },
};

const STEP_DURATION = 3500;

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const active = steps[activeStep];
  const colors = accentMap[active.accent];

  const startTimer = () => {
    // progress bar tick every 30ms
    setProgress(0);
    progressRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + (30 / STEP_DURATION) * 100, 100));
    }, 30);
    // step advance
    intervalRef.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
      setProgress(0);
    }, STEP_DURATION);
  };

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
  };

  useEffect(() => {
    if (!paused) startTimer();
    else stopTimer();
    return stopTimer;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, activeStep]);

  const handleStepClick = (index: number) => {
    stopTimer();
    setActiveStep(index);
    setProgress(0);
    setPaused(false);
  };

  return (
    <section
      id="how-it-works"
      className="py-24 bg-muted/30 border-y"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
            How it works
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Up and running in{" "}
            <span className="text-primary">3 simple steps</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg max-w-xl mx-auto">
            No complex setup. No steep learning curve. Just plug in and start getting booked.
          </p>
        </motion.div>

        {/* Main layout */}
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6 lg:gap-10 items-stretch max-w-6xl mx-auto">
          {/* LEFT — Step list */}
          <div className="flex flex-col gap-3">
            {steps.map((step, index) => {
              const c = accentMap[step.accent];
              const isActive = activeStep === index;
              return (
                <motion.button
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className={`text-left w-full rounded-2xl border p-5 transition-all duration-300 group ${
                    isActive
                      ? "bg-white dark:bg-zinc-900 shadow-lg border-border"
                      : "bg-transparent border-transparent hover:border-border hover:bg-white/50 dark:hover:bg-zinc-900/50"
                  }`}
                >
                  <div className="flex gap-4 items-start">
                    {/* Step number + icon */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-1.5 pt-0.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? `${c.bg} text-white shadow-md`
                            : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                        }`}
                      >
                        <step.icon className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest ${
                            isActive ? c.text : "text-muted-foreground"
                          }`}
                        >
                          Step {step.step}
                        </span>
                        {isActive && (
                          <motion.div
                            layoutId="pill"
                            className={`h-px flex-1 max-w-[40px] ${c.bg} rounded-full`}
                          />
                        )}
                      </div>
                      <h3 className="text-base font-bold leading-snug">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed hidden sm:block">
                        {step.description}
                      </p>

                      {/* Tags */}
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="flex flex-wrap gap-1.5 pt-2"
                        >
                          {step.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${c.badge}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </motion.div>
                      )}

                      {/* Progress bar for active step */}
                      {isActive && (
                        <div className="mt-3 h-0.5 w-full bg-border rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${c.bg} rounded-full`}
                            style={{ width: `${progress}%` }}
                            transition={{ ease: "linear" }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* RIGHT — Preview panel */}
          <div className="relative">
            <div className="sticky top-24 rounded-3xl border bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden h-[480px] lg:h-[520px]">
              {/* Browser chrome bar */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b bg-muted/40">
                {["bg-red-400", "bg-yellow-400", "bg-green-400"].map((c, i) => (
                  <div key={i} className={`w-2.5 h-2.5 rounded-full ${c} opacity-70`} />
                ))}
                <div className="flex-1 mx-4">
                  <div className="bg-background border rounded-md px-3 py-1 text-[11px] text-muted-foreground font-mono">
                    meetme.app/dashboard
                  </div>
                </div>
              </div>

              {/* Content area */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="h-full overflow-hidden"
                >
                  {active.preview}
                </motion.div>
              </AnimatePresence>

              {/* Step indicator dots at bottom */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {steps.map((_, i) => {
                  const c = accentMap[steps[i].accent];
                  return (
                    <button
                      key={i}
                      onClick={() => handleStepClick(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === activeStep ? `w-6 ${c.bg}` : "w-1.5 bg-muted-foreground/30"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
