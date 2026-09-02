"use client";

import { Navbar } from "@/components/landing/navbar";
import { useState } from "react";
import { FileText, Users, CreditCard, Scale, AlertTriangle, RefreshCw, Globe, Mail, ChevronDown } from "lucide-react";

const lastUpdated = "September 2, 2025";

const sections = [
  {
    icon: <Users className="h-4 w-4" />,
    title: "Acceptance of Terms",
    subsections: [
      { text: "By accessing or using CalMeet (cal-meet.vercel.app), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use the service. These terms apply to all users, including free, pro, and enterprise plan holders." }
    ]
  },
  {
    icon: <FileText className="h-4 w-4" />,
    title: "Use of the Service",
    subsections: [
      { title: "Permitted Use", text: "CalMeet is a scheduling and meeting management platform. You may use it for personal, professional, or business scheduling purposes in compliance with these Terms and all applicable laws." },
      { title: "Prohibited Conduct", text: "You may not use CalMeet to send spam; impersonate any person or entity; distribute malware; scrape user data without permission; violate any applicable laws; or attempt to gain unauthorized access to any system." },
      { title: "Account Responsibility", text: "You are responsible for maintaining the confidentiality of your credentials and for all activities under your account. Notify us immediately at support@calmeet.com if you suspect unauthorized access." },
    ]
  },
  {
    icon: <CreditCard className="h-4 w-4" />,
    title: "Billing & Subscriptions",
    subsections: [
      { title: "Plans", text: "CalMeet offers Free, Pro, Teams, and Enterprise plans. Features and pricing are described on our Pricing page and may change with reasonable notice." },
      { title: "Payment", text: "Paid plans are billed monthly or annually in advance. We accept major credit/debit cards and UPI for Indian customers, processed via Razorpay." },
      { title: "Refunds", text: "We offer a 14-day money-back guarantee for new paid subscriptions. Contact support@calmeet.com within 14 days of your first payment." },
      { title: "Cancellation", text: "You may cancel your subscription at any time from Settings → Billing. Your plan remains active until the end of the billing period. No cancellation fees." },
    ]
  },
  {
    icon: <Scale className="h-4 w-4" />,
    title: "Intellectual Property",
    subsections: [
      { text: "CalMeet and its original content, features, and functionality are owned by CalMeet and protected by applicable intellectual property laws. You retain ownership of all content you create. By using the service, you grant CalMeet a limited license to host and process your content solely to operate the service." }
    ]
  },
  {
    icon: <AlertTriangle className="h-4 w-4" />,
    title: "Disclaimer of Warranties",
    subsections: [
      { text: "CalMeet is provided \"as is\" and \"as available\" without warranties of any kind. We do not warrant that the service will be uninterrupted, error-free, or free of viruses. We do not warrant the accuracy or completeness of any content on the service." }
    ]
  },
  {
    icon: <Scale className="h-4 w-4" />,
    title: "Limitation of Liability",
    subsections: [
      { text: "To the maximum extent permitted by applicable law, CalMeet shall not be liable for any indirect, incidental, special, consequential, or punitive damages. Our total liability for any claim shall not exceed the amount you paid us in the 12 months preceding the claim." }
    ]
  },
  {
    icon: <RefreshCw className="h-4 w-4" />,
    title: "Termination",
    subsections: [
      { text: "We reserve the right to suspend or terminate your account at any time for violation of these Terms, fraudulent activity, or at our discretion with reasonable notice. Upon termination, your data may be deleted after 30 days." }
    ]
  },
  {
    icon: <Globe className="h-4 w-4" />,
    title: "Governing Law",
    subsections: [
      { text: "These Terms are governed by the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra, India." }
    ]
  },
  {
    icon: <RefreshCw className="h-4 w-4" />,
    title: "Changes to Terms",
    subsections: [
      { text: "We may update these Terms from time to time. We will notify you of significant changes via email or a prominent notice at least 14 days before the changes take effect. Continued use after the effective date constitutes your acceptance." }
    ]
  }
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
          {section.subsections.map((sub, i) => (
            <div key={i} className="px-4 py-3">
              {sub.title && <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">{sub.title}</div>}
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{sub.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Header */}
          <div className="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-3">
              <FileText className="h-3.5 w-3.5" />
              <span>Legal</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
              Terms of Service
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mb-4">
              Please read these terms carefully before using CalMeet. By using our service, you agree to be bound by them.
            </p>
            <div className="flex flex-wrap gap-4 text-[11px] text-zinc-400">
              <span>Last updated: {lastUpdated}</span>
              <span>14-day notice for changes to existing users</span>
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
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">Questions about our Terms?</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">We&apos;re happy to clarify anything. Enterprise customers can request custom agreements.</div>
            </div>
            <a
              href="mailto:legal@calmeet.com"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors whitespace-nowrap"
            >
              <Mail className="h-3.5 w-3.5" /> legal@calmeet.com
            </a>
          </div>

          <div className="mt-6 text-center text-[11px] text-zinc-400">
            CalMeet · Terms of Service · Effective {lastUpdated}
          </div>
        </div>
      </main>
    </div>
  );
}
