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



const benefits = [
  {
    icon: Timer,
    tag: "Productivity",
    title: "Stop wasting time on scheduling",
    description:
      "The average professional spends 4.8 hours per week on scheduling emails. CalMeet automates all of it — so you can invest those hours back into the work that grows your business.",
    accent: "neutral",
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
      "Define exactly when you're available. Set buffer times between meetings, minimum notice periods, and daily limits. CalMeet enforces your boundaries so you don't have to.",
    accent: "neutral",
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
      "Add your CalMeet link to emails, LinkedIn, or your website. Prospects go from 'interested' to 'booked' in under 60 seconds — without your involvement.",
    accent: "neutral",
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
      "Your booking page looks premium, loads fast, and works perfectly on any device. First impressions matter — CalMeet makes yours count.",
    accent: "neutral",
    highlight: "Professional from day one",
    points: [
      "Custom branding & colors",
      "Mobile-optimized",
      "Instant confirmation emails",
    ],
  },
];

const monochromeMap = {
  icon: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100",
  tag: "bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800",
  check: "text-zinc-900 dark:text-zinc-100",
  dot: "bg-zinc-900 dark:bg-zinc-100",
};

const testimonials = [
  {
    quote: "CalMeet cut my scheduling time from 5 hours to almost nothing. It's indispensable for my consulting practice.",
    name: "Sarah J.",
    role: "UX Design Lead",
    initials: "SJ",
    stars: 5,
  },
  {
    quote: "My close rate improved because prospects could book demos instantly. The friction was killing my pipeline.",
    name: "Marcus T.",
    role: "Head of Sales, TechFlow",
    initials: "MT",
    stars: 5,
  },
  {
    quote: "I look way more professional now. Clients love that they can self-serve without any email chains.",
    name: "Priya K.",
    role: "Freelance Strategist",
    initials: "PK",
    stars: 5,
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="py-24 bg-white dark:bg-black border-t">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
            Why CalMeet
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-5 text-zinc-900 dark:text-zinc-100">
            Built for people who value{" "}
            <span className="underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-8">their time</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Whether you're a solo consultant, a sales team, or an enterprise — CalMeet removes the friction between interest and action.
          </p>
        </motion.div>



        {/* Benefits grid */}
        <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto mb-20">
          {benefits.map((benefit, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                className="group relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-7 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
              >
                <div className="relative z-10 space-y-5">
                  {/* Icon + Tag row */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${monochromeMap.icon} flex items-center justify-center border border-zinc-200 dark:border-zinc-700`}>
                      <benefit.icon className="h-6 w-6" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${monochromeMap.tag}`}>
                      {benefit.tag}
                    </span>
                  </div>

                  {/* Title & description */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold leading-snug text-zinc-900 dark:text-zinc-100">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>

                  {/* Highlight pill */}
                  <div className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border ${monochromeMap.tag}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${monochromeMap.dot}`} />
                    {benefit.highlight}
                  </div>

                  {/* Feature list */}
                  <ul className="space-y-2 pt-1 border-t border-zinc-100 dark:border-zinc-900">
                    {benefit.points.map((point, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm">
                        <CheckCircle2 className={`h-4 w-4 flex-shrink-0 ${monochromeMap.check}`} />
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
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">
              Trusted by professionals
            </p>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">What our users say</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 space-y-4 hover:shadow-lg transition-shadow duration-300"
              >
                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100 fill-zinc-900 dark:fill-zinc-100" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-900">
                  <div className="w-9 h-9 rounded-full bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-zinc-100 dark:text-zinc-900 text-xs font-bold flex-shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-none text-zinc-900 dark:text-zinc-100">{t.name}</p>
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
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-sm shadow-lg hover:shadow-xl transition-shadow"
              >
                Start for free — no credit card needed
              </motion.button>
            </Link>
            <p className="text-xs text-muted-foreground mt-3">
              Join 10,000+ professionals already using CalMeet
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
