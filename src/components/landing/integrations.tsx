"use client";

import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

const integrations = [
  {
    name: "Google Calendar",
    description: "Two-way sync for real-time availability",
    category: "Calendar",
    logo: <img src="/logos/google-calendar.svg" alt="Google Calendar" className="w-6 h-6 object-contain" />,
    badge: "bg-zinc-50 dark:bg-zinc-900 text-zinc-600 border-zinc-200 dark:border-zinc-800",
    comingSoon: false,
  },
  {
    name: "Google Meet",
    description: "Auto-generate Meet links on booking",
    category: "Video",
    logo: <img src="/logos/google-meet.svg" alt="Google Meet" className="w-6 h-6 object-contain" />,
    badge: "bg-zinc-50 dark:bg-zinc-900 text-zinc-600 border-zinc-200 dark:border-zinc-800",
  },
  {
    name: "Zoom",
    description: "Automatic Zoom meeting creation",
    category: "Video",
    logo: <img src="/logos/zoom.svg" alt="Zoom" className="w-6 h-6 object-contain" />,
    badge: "bg-zinc-50 dark:bg-zinc-900 text-zinc-600 border-zinc-200 dark:border-zinc-800",
  },
  {
    name: "Outlook Calendar",
    description: "Sync with Microsoft 365 calendars",
    category: "Calendar",
    logo: <img src="/logos/outlook.png" alt="Outlook Calendar" className="w-6 h-6 object-contain" />,
    badge: "bg-zinc-50 dark:bg-zinc-900 text-zinc-600 border-zinc-200 dark:border-zinc-800",
    comingSoon: true,
  },
  {
    name: "Slack",
    description: "Get booking notifications in Slack",
    category: "Notifications",
    logo: <img src="/logos/slack.svg" alt="Slack" className="w-6 h-6 object-contain" />,
    badge: "bg-zinc-50 dark:bg-zinc-900 text-zinc-600 border-zinc-200 dark:border-zinc-800",
    comingSoon: true,
  },
  {
    name: "Stripe",
    description: "Collect payments before meetings",
    category: "Payments",
    logo: <img src="/logos/stripe.png" alt="Stripe" className="w-6 h-6 object-contain" />,
    badge: "bg-zinc-50 dark:bg-zinc-900 text-zinc-600 border-zinc-200 dark:border-zinc-800",
    comingSoon: true,
  },
  {
    name: "Notion",
    description: "Log meetings to Notion databases",
    category: "Productivity",
    logo: (
      <svg className="w-6 h-6 text-zinc-900 dark:text-zinc-100" fill="none" viewBox="0 0 256 256">
        <path fill="currentColor" d="M145.561 64.9543L75.6115 70.1202C69.9697 70.6094 68.0059 74.2965 68.0059 78.7166V155.4C68.0059 158.842 69.2276 161.788 72.1774 165.723L88.6199 187.104C91.321 190.547 93.7773 191.284 98.9352 191.04L180.164 186.122C187.033 185.633 189.001 182.435 189.001 177.029V90.7598C189.001 87.9661 187.897 87.1612 184.648 84.7762L184.088 84.3717L161.763 68.6414C156.361 64.7142 154.153 64.217 145.561 64.9543ZM100.772 89.3481C94.1398 89.7947 92.6354 89.8958 88.8685 86.8322L79.2905 79.2138C78.3169 78.2279 78.8056 76.9971 81.2581 76.7528L148.502 71.8397C154.149 71.3467 157.09 73.3143 159.298 75.0338L170.831 83.39C171.324 83.6381 172.55 85.109 171.075 85.109L101.632 89.289L100.772 89.3481ZM93.04 176.291V103.055C93.04 99.8571 94.0217 98.3825 96.9629 98.1339L176.722 93.4647C179.427 93.2204 180.649 94.9393 180.649 98.1339V170.881C180.649 174.079 180.156 176.784 175.74 177.029L99.4154 181.453C94.9996 181.698 93.04 180.227 93.04 176.291ZM168.383 106.982C168.872 109.195 168.383 111.407 166.171 111.66L162.492 112.389V166.46C159.298 168.179 156.357 169.161 153.9 169.161C149.973 169.161 148.991 167.931 146.05 164.248L121.993 126.399V163.017L129.603 164.741C129.603 164.741 129.603 169.166 123.464 169.166L106.537 170.147C106.044 169.161 106.537 166.705 108.252 166.216L112.672 164.989V116.573L106.537 116.076C106.044 113.864 107.27 110.67 110.709 110.421L128.87 109.199L153.9 147.536V113.62L147.52 112.886C147.027 110.177 148.991 108.209 151.443 107.969L168.383 106.982Z"></path>
      </svg>
    ),
    badge: "bg-zinc-50 dark:bg-zinc-900 text-zinc-600 border-zinc-200 dark:border-zinc-800",
    comingSoon: true,
  },
  {
    name: "Salesforce",
    description: "Auto-log meetings in your CRM",
    category: "CRM",
    logo: (
      <svg className="w-6 h-6 text-[#00A1E0]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.89 10.76a4.4 4.4 0 0 0-3.32-3.41c-.42-.09-.85-.14-1.29-.14A5.5 5.5 0 0 0 9 11.23a4 4 0 0 0-3.15 3.91A4.24 4.24 0 0 0 10.13 19h8.34A3.75 3.75 0 0 0 22 15.22a3.73 3.73 0 0 0-3.11-4.46z"/>
      </svg>
    ),
    badge: "bg-zinc-50 dark:bg-zinc-900 text-zinc-600 border-zinc-200 dark:border-zinc-800",
    comingSoon: true,
  },
  {
    name: "HubSpot",
    description: "Sync contacts and meeting data",
    category: "CRM",
    logo: (
      <svg className="w-6 h-6 text-[#FF7A59]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21.5 10.13h-4.32a3.38 3.38 0 0 0-2.43-2.43V3.38a1.88 1.88 0 0 0-3.75 0v4.32a3.38 3.38 0 0 0-2.43 2.43H4.3a1.88 1.88 0 0 0 0 3.75h4.3a3.38 3.38 0 0 0 2.43 2.43v4.32a1.88 1.88 0 0 0 3.75 0v-4.32a3.38 3.38 0 0 0 2.43-2.43h4.32a1.88 1.88 0 0 0 0-3.75zM12.8 13.6a1.1 1.1 0 1 1 1.1-1.1 1.1 1.1 0 0 1-1.1 1.1z"/>
      </svg>
    ),
    badge: "bg-zinc-50 dark:bg-zinc-900 text-zinc-600 border-zinc-200 dark:border-zinc-800",
    comingSoon: true,
  },
];

export function Integrations() {
  return (
    <section id="integrations" className="py-24 bg-white dark:bg-black border-y">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 mb-4">
            <Zap className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100" />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
              Integrations
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-zinc-900 dark:text-zinc-100">
            Works with your <span className="underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-8">existing stack</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            CalMeet plugs into the tools you already use. No workflow disruption, no new habits to form.
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
              className="group relative flex items-start gap-4 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Logo */}
              <div className="w-11 h-11 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/40 flex items-center justify-center flex-shrink-0">
                {integration.logo}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-sm leading-none text-zinc-900 dark:text-zinc-100">{integration.name}</h3>
                  {integration.comingSoon ? (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 flex-shrink-0">
                      Soon
                    </span>
                  ) : (
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 flex-shrink-0 ${integration.badge}`}>
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
          <Link href="/resources" className="inline-flex items-center gap-1.5 text-sm font-bold text-zinc-900 dark:text-zinc-100 hover:underline underline-offset-4">
            View all integrations <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
