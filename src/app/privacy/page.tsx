"use client";

import { Navbar } from "@/components/landing/navbar";
import { useState } from "react";
import { Shield, Eye, Database, UserCheck, Globe, Bell, Lock, ChevronDown } from "lucide-react";

const lastUpdated = "September 2, 2025";

const sections = [
  {
    icon: <Eye className="h-4 w-4" />,
    title: "Information We Collect",
    subsections: [
      { title: "Account Information", text: "When you create a CalMeet account, we collect your name, email address, and profile picture (if provided via Google/GitHub OAuth). Passwords for credential-based accounts are hashed using bcrypt — never stored in plain text." },
      { title: "Scheduling Data", text: "We store the event types you create, your availability settings, and booking details (guest name, email, meeting time, notes). This data is necessary to operate the service." },
      { title: "Calendar Data", text: "If you connect Google Calendar, we request read access to check your free/busy status and write access to create calendar events. We never read the content of your existing calendar events." },
      { title: "Usage & Analytics", text: "We collect anonymized usage data to improve the product. We do not use third-party advertising trackers. Vercel Analytics is used, which is privacy-focused and does not fingerprint users." },
    ]
  },
  {
    icon: <Database className="h-4 w-4" />,
    title: "How We Use Your Information",
    subsections: [
      { title: "Operating the Service", text: "We use your data to create and manage your account, send booking confirmation emails to you and your guests, sync with connected calendars, and display your public booking page." },
      { title: "Communications", text: "We send transactional emails (booking confirmations, cancellations, reminders). You can unsubscribe from product update emails at any time." },
      { title: "What We Never Do", text: "We never sell your data. We never use your data for advertising. We do not share personal information with third parties except as required to operate the service." },
    ]
  },
  {
    icon: <Globe className="h-4 w-4" />,
    title: "Data Sharing & Third Parties",
    subsections: [
      { title: "Infrastructure Partners", text: "Your data is hosted on Supabase (PostgreSQL) and Vercel (compute). Both are SOC 2 certified. Cloudinary is used for profile image storage." },
      { title: "Integrations You Enable", text: "When you connect Google Calendar, Zoom, or other services, data required for the integration is shared with those services per their privacy policies." },
      { title: "Legal Requirements", text: "We may disclose information if required by law or to protect the rights and safety of our users." },
    ]
  },
  {
    icon: <UserCheck className="h-4 w-4" />,
    title: "Your Rights & Choices",
    subsections: [
      { title: "Access & Export", text: "You can access and export all your data from Settings → Account at any time. Data is provided in JSON format." },
      { title: "Deletion", text: "You can delete your account from Settings → Account → Delete Account. Deletion is permanent. We process deletion requests within 30 days." },
      { title: "GDPR & CCPA", text: "EU/UK residents have rights to access, correct, delete, and port their data under GDPR. California residents have similar rights under CCPA. Contact privacy@calmeet.com to exercise these rights." },
    ]
  },
  {
    icon: <Lock className="h-4 w-4" />,
    title: "Data Security",
    subsections: [
      { title: "Encryption", text: "All data in transit is encrypted with TLS 1.3. All data at rest is encrypted with AES-256. API keys and passwords are never stored in plain text." },
      { title: "Access Controls", text: "Access to production data is limited to core team members on a need-to-know basis. All access is logged and audited." },
    ]
  },
  {
    icon: <Bell className="h-4 w-4" />,
    title: "Cookies",
    subsections: [
      { title: "Session Cookies", text: "We use strictly necessary cookies to maintain your login session (NextAuth.js session token). These cannot be disabled as they are essential for the service to function." },
      { title: "No Advertising Cookies", text: "We do not use advertising cookies, tracking pixels, or behavioral analytics cookies. See our Cookie Policy for full details." },
    ]
  },
  {
    icon: <Globe className="h-4 w-4" />,
    title: "Changes to This Policy",
    subsections: [
      { title: "Updates", text: "We may update this Privacy Policy as our services evolve. We will notify registered users of significant changes via email at least 14 days before they take effect. The date at the top of this page reflects the last revision." },
    ]
  },
];

function Section({ section, index }: { section: typeof sections[0]; index: number }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-2xs overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
            {section.icon}
          </div>
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            <span className="text-zinc-400 font-normal mr-1.5">{index + 1}.</span>
            {section.title}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-zinc-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="border-t border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-200 dark:divide-zinc-800">
          {section.subsections.map(sub => (
            <div key={sub.title} className="px-4 py-3">
              <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">{sub.title}</div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{sub.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Header */}
          <div className="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-3">
              <Shield className="h-3.5 w-3.5" />
              <span>Legal</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
              Privacy Policy
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mb-4">
              We believe privacy is a fundamental right. We never sell your data and only collect what&apos;s strictly necessary to provide the service.
            </p>
            <div className="flex flex-wrap gap-4 text-[11px] text-zinc-400">
              <span>Last updated: {lastUpdated}</span>
              <span>GDPR Compliant</span>
              <span>CCPA Compliant</span>
            </div>
          </div>

          {/* Promise banner */}
          <div className="mb-8 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-start gap-3">
            <div className="w-7 h-7 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 shrink-0">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">Our Privacy Promise</div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                We never sell your data. We only collect what&apos;s strictly necessary. You can export or delete all your data at any time. No advertising trackers. No behavioral profiling.
              </p>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-3 mb-10">
            {sections.map((section, i) => (
              <Section key={section.title} section={section} index={i} />
            ))}
          </div>

          {/* Contact */}
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">Privacy questions?</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Our Data Protection Officer will respond within 48 hours.</div>
            </div>
            <a
              href="mailto:privacy@calmeet.com"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors whitespace-nowrap"
            >
              privacy@calmeet.com
            </a>
          </div>

          <div className="mt-6 text-center text-[11px] text-zinc-400">
            CalMeet · Effective {lastUpdated} · Replaces all prior versions
          </div>
        </div>
      </main>
    </div>
  );
}
