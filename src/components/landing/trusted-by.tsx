"use client";

import { motion } from "framer-motion";
import { 
  Calendar, 
  Video, 
  CreditCard, 
  Webhook, 
  Zap,
  Globe,
  Lock,
  Clock
} from "lucide-react";

const stackItems = [
  {
    name: "Google Calendar",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4H19ZM19 20H5V9H19V20Z" />
      </svg>
    )
  },
  {
    name: "Google Meet",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
      </svg>
    )
  },
  {
    name: "Zoom Video",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h7A2.5 2.5 0 0 1 16 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 4 17.5v-11ZM17.5 9.5l4-3v11l-4-3v-5Z" />
      </svg>
    )
  },
  {
    name: "Stripe",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697.5 12.608.5 7.58.5 4.013 3.167 4.013 7.856c0 6.643 9.143 5.638 9.143 8.523 0 .99-.8 1.458-2.28 1.458-2.508 0-5.46-1.199-7.391-2.298l-.941 5.568c1.921 1.053 5.096 1.893 8.574 1.893 5.378 0 9.074-2.584 9.074-7.581 0-7.05-9.216-5.836-9.216-8.27z" />
      </svg>
    )
  },
  {
    name: "Razorpay",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    )
  },
  {
    name: "Webhooks",
    icon: <Webhook className="w-4 h-4" />
  },
  {
    name: "Zapier",
    icon: <Zap className="w-4 h-4" />
  },
  {
    name: "REST API",
    icon: <Globe className="w-4 h-4" />
  }
];

const doubled = [...stackItems, ...stackItems, ...stackItems];

export function TrustedBy() {
  return (
    <section className="py-12 border-y border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-[#0f0f0f] text-zinc-900 dark:text-zinc-100 overflow-hidden">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-6">
          <p className="text-[11px] font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
            Seamlessly integrates with your daily workflow
          </p>
        </div>

        {/* Minimal Monochrome Continuous Marquee */}
        <div className="relative w-full flex overflow-hidden py-1">
          {/* Edge Gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-zinc-50 dark:from-[#0f0f0f] to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-zinc-50 dark:from-[#0f0f0f] to-transparent pointer-events-none" />

          <motion.div
            className="flex gap-10 sm:gap-14 items-center"
            animate={{ x: ["0%", "-33.333%"] }}
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
                className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors flex-shrink-0 cursor-default"
              >
                <span className="opacity-80">{item.icon}</span>
                <span className="text-xs font-medium tracking-tight whitespace-nowrap">
                  {item.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Minimal 3-Item Trust Pill Strip */}
        <div className="mt-8 pt-6 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="font-medium">Real-time 2-way sync</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600" />
            <span className="font-medium">Zero double-bookings</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600" />
            <span className="font-medium">End-to-end encrypted</span>
          </div>
        </div>
      </div>
    </section>
  );
}
