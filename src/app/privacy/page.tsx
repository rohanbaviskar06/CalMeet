"use client";

import { Navbar } from "@/components/landing/navbar";
import { motion } from "framer-motion";
import { Shield, Eye, Database, UserCheck, Globe, Bell, Download, Lock } from "lucide-react";

const lastUpdated = "September 2, 2025";

const sections = [
  {
    icon: <Eye className="h-5 w-5" />,
    title: "Information We Collect",
    content: [
      {
        subtitle: "Account Information",
        text: "When you create a CalMeet account, we collect your name, email address, and profile picture (if provided via Google/GitHub OAuth). Passwords for credential-based accounts are hashed using bcrypt — we never store them in plain text."
      },
      {
        subtitle: "Scheduling Data",
        text: "We store the event types you create, your availability settings, and booking details (guest name, email, meeting time, notes). This data is necessary to operate the service."
      },
      {
        subtitle: "Calendar Data",
        text: "If you connect Google Calendar, we request read access to check your free/busy status and write access to create calendar events for confirmed bookings. We never read the content of your existing calendar events."
      },
      {
        subtitle: "Usage & Analytics",
        text: "We collect anonymized usage data (pages visited, features used) to improve the product. We do not use third-party advertising trackers. Vercel Analytics and Speed Insights are used, which are privacy-focused and do not fingerprint users."
      }
    ]
  },
  {
    icon: <Database className="h-5 w-5" />,
    title: "How We Use Your Information",
    content: [
      {
        subtitle: "Operating the Service",
        text: "We use your data to create and manage your account, send booking confirmation emails to you and your guests, sync with connected calendars, and display your public booking page."
      },
      {
        subtitle: "Communications",
        text: "We send transactional emails (booking confirmations, cancellations, reminders). We may send product update emails — you can unsubscribe at any time from any email."
      },
      {
        subtitle: "What We Never Do",
        text: "We never sell your data to third parties. We never use your data for advertising. We never share your personal information with third parties except as needed to operate the service (e.g., our cloud infrastructure providers)."
      }
    ]
  },
  {
    icon: <Globe className="h-5 w-5" />,
    title: "Data Sharing & Third Parties",
    content: [
      {
        subtitle: "Infrastructure Partners",
        text: "Your data is hosted on Supabase (PostgreSQL database) and Vercel (compute and edge network). Both are SOC 2 certified providers. Cloudinary is used for profile image storage."
      },
      {
        subtitle: "Integrations You Enable",
        text: "When you connect Google Calendar, Zoom, or other third-party services, data necessary for the integration is shared with those services per their privacy policies."
      },
      {
        subtitle: "Legal Requirements",
        text: "We may disclose information if required by law, court order, or to protect the rights and safety of our users and the public."
      }
    ]
  },
  {
    icon: <UserCheck className="h-5 w-5" />,
    title: "Your Rights & Choices",
    content: [
      {
        subtitle: "Access & Export",
        text: "You can access and export all your data at any time from Settings → Account. Exported data is provided in JSON format."
      },
      {
        subtitle: "Deletion",
        text: "You can delete your account and all associated data from Settings → Account → Delete Account. Deletion is permanent and irreversible. We process deletion requests within 30 days."
      },
      {
        subtitle: "GDPR & CCPA Rights",
        text: "EU/UK residents have the right to access, correct, delete, and port their data under GDPR. California residents have similar rights under CCPA. To exercise these rights, contact us at privacy@calmeet.com."
      }
    ]
  },
  {
    icon: <Lock className="h-5 w-5" />,
    title: "Data Security",
    content: [
      {
        subtitle: "Encryption",
        text: "All data in transit is encrypted with TLS 1.3. All data at rest is encrypted with AES-256. API keys and passwords are never stored in plain text."
      },
      {
        subtitle: "Access Controls",
        text: "Access to production data is limited to core team members on a need-to-know basis. All access is logged and audited."
      }
    ]
  },
  {
    icon: <Bell className="h-5 w-5" />,
    title: "Cookies & Tracking",
    content: [
      {
        subtitle: "Session Cookies",
        text: "We use strictly necessary cookies to maintain your login session (NextAuth.js session token). These are essential for the service to function."
      },
      {
        subtitle: "No Advertising Cookies",
        text: "We do not use advertising cookies, third-party tracking pixels, or behavioral analytics. See our Cookie Policy for full details."
      }
    ]
  },
  {
    icon: <Globe className="h-5 w-5" />,
    title: "International Data Transfers",
    content: [
      {
        subtitle: "Data Location",
        text: "Your data is primarily stored in AWS ap-south-1 (Mumbai) for users in India and Asia. Vercel's edge network may process requests globally. All transfers comply with applicable data protection laws."
      }
    ]
  }
];

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8"
          >
            <Shield className="h-4 w-4" />
            Privacy Policy
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold tracking-tight mb-6"
          >
            Your privacy is a{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              fundamental right.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-400 mb-8 max-w-2xl leading-relaxed"
          >
            We believe in radical transparency. This policy explains exactly what data we collect,
            why we collect it, and how you can control it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-6 text-sm text-zinc-500 border-t border-zinc-800 pt-6"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full" /> Last updated: {lastUpdated}
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full" /> GDPR Compliant
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-violet-400 rounded-full" /> CCPA Compliant
            </span>
          </motion.div>
        </div>
      </section>

      {/* Promise banner */}
      <div className="container mx-auto px-4 max-w-4xl mb-12">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/30 to-cyan-900/20 border border-blue-500/20">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0 mt-0.5">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Our Privacy Promise</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                We never sell your data. We only collect what&apos;s strictly necessary to provide the service. 
                You can export or delete all your data at any time. No advertising trackers. No behavioral profiling.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="container mx-auto px-4 max-w-4xl mb-12">
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-4">Table of Contents</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {sections.map((s, i) => (
              <a
                key={s.title}
                href={`#section-${i}`}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <span className="text-zinc-600 w-5 text-right">{i + 1}.</span>
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="container mx-auto px-4 max-w-4xl mb-24 space-y-12">
        {sections.map((section, i) => (
          <motion.section
            key={section.title}
            id={`section-${i}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                {section.icon}
              </div>
              <h2 className="text-2xl font-bold text-white">
                <span className="text-zinc-600 mr-2 font-normal text-lg">{i + 1}.</span>
                {section.title}
              </h2>
            </div>
            <div className="space-y-5 pl-0 md:pl-12">
              {section.content.map(item => (
                <div key={item.subtitle} className="border-l-2 border-zinc-800 pl-5">
                  <h3 className="font-semibold text-zinc-200 mb-2">{item.subtitle}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* Contact */}
      <section className="container mx-auto px-4 max-w-3xl mb-24">
        <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Privacy Questions?</h2>
          <p className="text-zinc-400 mb-6 text-sm">
            Our Data Protection Officer is available to answer any questions you have about how we handle your data.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="mailto:privacy@calmeet.com" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-sm font-semibold transition-colors">
              privacy@calmeet.com
            </a>
            <a href="/support" className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full text-sm font-semibold transition-colors border border-zinc-700">
              Visit Support
            </a>
          </div>
        </div>
      </section>

      <div className="text-center text-zinc-700 text-xs pb-10">
        CalMeet · Effective {lastUpdated} · Replaces all prior versions
      </div>
    </div>
  );
}
