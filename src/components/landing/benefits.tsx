"use client";

import { motion } from "framer-motion";
import {
  Timer,
  ShieldCheck,
  TrendingUp,
  Users,
  CheckCircle2,
  Star,
} from "lucide-react";
import Link from "next/link";

const stats = [
  { value: "5h+", label: "Saved per week", color: "text-emerald-500" },
  { value: "2×", label: "More meetings booked", color: "text-blue-500" },
  { value: "Zero", label: "Scheduling conflicts", color: "text-violet-500" },
  { value: "10k+", label: "Professionals trust us", color: "text-amber-500" },
];

const benefits = [
  {
    icon: Timer,
    tag: "Productivity",
    title: "Stop wasting time on scheduling",
    description:
      "The average professional spends 4.8 hours per week on scheduling emails. MeetMe automates all of it — so you can invest those hours back into the work that grows your business.",
    color: "emerald",
    highlight: "4.8 hrs reclaimed weekly",
    points: [
      "No more back-and-forth emails",
      "Instant meeting confirmations",
      "Automatic timezone handling",
    ],
  },
  {
    icon: ShieldCheck,
    tag: "Control",
    title: "Your calendar, your rules",
    description:
      "Define exactly when you're available. Set buffer times between meetings, minimum notice periods, and daily limits. MeetMe enforces your boundaries so you don't have to.",
    color: "blue",
    highlight: "Total schedule ownership",
    points: [
      "Buffer & cool-down periods",
      "Custom availability windows",
      "Meeting caps per day",
    ],
  },
  {
    icon: TrendingUp,
    tag: "Growth",
    title: "Turn interest into booked meetings",
    description:
      "Add your MeetMe link to emails, LinkedIn, or your website. Prospects go from 'interested' to 'booked' in under 60 seconds — without your involvement.",
    color: "violet",
    highlight: "2× faster pipeline velocity",
    points: [
      "One-click booking for clients",
      "Works on any platform",
      "Reduce lead drop-off",
    ],
  },
  {
    icon: Users,
    tag: "Experience",
    title: "A branded experience clients love",
    description:
      "Your booking page looks premium, loads fast, and works perfectly on any device. First impressions matter — MeetMe makes yours count.",
    color: "amber",
    highlight: "Professional from day one",
    points: [
      "Custom branding & colors",
      "Mobile-optimized",
      "Instant confirmation emails",
    ],
  },
];

const colorMap: Record<string, { icon: string; tag: string; check: string; dot: string }> = {
  emerald: {
    icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    tag: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    check: "text-emerald-500",
    dot: "bg-emerald-500",
  },
  blue: {
    icon: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    tag: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    check: "text-blue-500",
    dot: "bg-blue-500",
  },
  violet: {
    icon: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    tag: "bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800",
    check: "text-violet-500",
    dot: "bg-violet-500",
  },
  amber: {
    icon: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    tag: "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    check: "text-amber-500",
    dot: "bg-amber-500",
  },
};

const testimonials = [
  {
    quote: "MeetMe cut my scheduling time from 5 hours to almost nothing. It's indispensable for my consulting practice.",
    name: "Sarah J.",
    role: "UX Design Lead",
    initials: "SJ",
    color: "from-blue-500 to-violet-500",
    stars: 5,
  },
  {
    quote: "My close rate improved because prospects could book demos instantly. The friction was killing my pipeline.",
    name: "Marcus T.",
    role: "Head of Sales, TechFlow",
    initials: "MT",
    color: "from-emerald-500 to-teal-500",
    stars: 5,
  },
  {
    quote: "I look way more professional now. Clients love that they can self-serve without any email chains.",
    name: "Priya K.",
    role: "Freelance Strategist",
    initials: "PK",
    color: "from-amber-500 to-orange-500",
    stars: 5,
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
            Why MeetMe
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-5">
            Built for people who value{" "}
            <span className="text-primary">their time</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Whether you're a solo consultant, a sales team, or an enterprise — MeetMe removes the friction between interest and action.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 max-w-5xl mx-auto"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              viewport={{ once: true }}
              className="text-center p-5 rounded-2xl border bg-muted/30"
            >
              <div className={`text-3xl md:text-4xl font-black ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Benefits grid */}
        <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto mb-20">
          {benefits.map((benefit, index) => {
            const c = colorMap[benefit.color];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                className="group relative bg-card border rounded-3xl p-7 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
              >
                {/* Subtle corner accent */}
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-[80px] ${c.icon} opacity-[0.08] transition-opacity duration-300 group-hover:opacity-[0.14]`} />

                <div className="relative z-10 space-y-5">
                  {/* Icon + Tag row */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${c.icon} flex items-center justify-center`}>
                      <benefit.icon className="h-6 w-6" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${c.tag}`}>
                      {benefit.tag}
                    </span>
                  </div>

                  {/* Title & description */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold leading-snug">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>

                  {/* Highlight pill */}
                  <div className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border ${c.tag}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                    {benefit.highlight}
                  </div>

                  {/* Feature list */}
                  <ul className="space-y-2 pt-1 border-t border-border/50">
                    {benefit.points.map((point, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm">
                        <CheckCircle2 className={`h-4 w-4 flex-shrink-0 ${c.check}`} />
                        <span className="text-muted-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Testimonials row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
              Trusted by professionals
            </p>
            <h3 className="text-2xl font-bold">What our users say</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-card border rounded-3xl p-6 space-y-4 hover:shadow-lg transition-shadow duration-300"
              >
                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-none">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-full font-bold text-sm shadow-lg hover:shadow-xl transition-shadow"
              >
                Start for free — no credit card needed
              </motion.button>
            </Link>
            <p className="text-xs text-muted-foreground mt-3">
              Join 10,000+ professionals already using MeetMe
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
