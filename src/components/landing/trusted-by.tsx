"use client";

import { motion } from "framer-motion";
import { 
  Calendar, 
  Video, 
  CreditCard, 
  Webhook, 
  ShieldCheck, 
  Zap,
  CheckCircle2
} from "lucide-react";

const integrations = [
  {
    name: "Google Calendar",
    category: "Calendar Sync",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4H19ZM19 20H5V9H19V20Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Google Meet",
    category: "Video Calls",
    icon: <Video className="w-4 h-4 text-emerald-500" />,
  },
  {
    name: "Zoom Video",
    category: "Conferencing",
    icon: (
      <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h7A2.5 2.5 0 0 1 16 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 4 17.5v-11ZM17.5 9.5l4-3v11l-4-3v-5Z" />
      </svg>
    ),
  },
  {
    name: "Razorpay & Stripe",
    category: "Payments",
    icon: <CreditCard className="w-4 h-4 text-indigo-500" />,
  },
  {
    name: "Developer Webhooks",
    category: "HMAC-SHA256",
    icon: <Webhook className="w-4 h-4 text-amber-500" />,
  },
  {
    name: "REST API & Zapier",
    category: "Automation",
    icon: <Zap className="w-4 h-4 text-violet-500" />,
  },
  {
    name: "Cal Video Built-in",
    category: "Native Video",
    icon: <Video className="w-4 h-4 text-zinc-400" />,
  },
  {
    name: "NextAuth OAuth 2.0",
    category: "Authentication",
    icon: <ShieldCheck className="w-4 h-4 text-teal-500" />,
  },
];

const doubled = [...integrations, ...integrations];

export function TrustedBy() {
  return (
    <section className="py-10 border-y border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/60 overflow-hidden text-zinc-900 dark:text-zinc-100">
      <div className="container mx-auto px-4 mb-6 text-center">
        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Works seamlessly with your entire tech stack
        </p>
      </div>

      {/* Infinite Seamless Marquee */}
      <div className="relative w-full flex overflow-hidden">
        {/* Left & Right gradient fade */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-r from-white dark:from-[#0c0c0c] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-l from-white dark:from-[#0c0c0c] to-transparent pointer-events-none" />

        <motion.div
          className="flex gap-3 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            duration: 25,
          }}
        >
          {doubled.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex-shrink-0 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="w-6 h-6 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 flex-shrink-0">
                {item.icon}
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                  {item.name}
                </div>
                <div className="text-[10px] text-zinc-400 whitespace-nowrap">
                  {item.category}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 4 Trust & Reliability Badges */}
      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-center">
          {[
            { label: "Zero Conflicts", desc: "Real-time calendar verification" },
            { label: "99.9% Reliability", desc: "Edge-hosted on Vercel" },
            { label: "Encrypted & Private", desc: "TLS 1.3 + AES-256 data at rest" },
            { label: "Self-Hostable", desc: "100% Open source codebase" },
          ].map((badge, idx) => (
            <div key={idx} className="p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/40">
              <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                {badge.label}
              </div>
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                {badge.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
