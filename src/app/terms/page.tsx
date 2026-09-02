"use client";

import { Navbar } from "@/components/landing/navbar";
import { motion } from "framer-motion";
import { FileText, Users, CreditCard, Scale, AlertTriangle, RefreshCw, Globe, Mail } from "lucide-react";

const lastUpdated = "September 2, 2025";

const sections = [
  {
    icon: <Users className="h-5 w-5" />,
    title: "Acceptance of Terms",
    content: "By accessing or using CalMeet (cal-meet.vercel.app), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use the service. These terms apply to all users, including free, pro, and enterprise plan holders."
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: "Use of the Service",
    subsections: [
      { title: "Permitted Use", text: "CalMeet is a scheduling and meeting management platform. You may use CalMeet for personal, professional, or business scheduling purposes in compliance with these Terms and all applicable laws." },
      { title: "Prohibited Conduct", text: "You may not use CalMeet to send spam or unsolicited messages; impersonate any person or entity; distribute malware or harmful code; scrape or harvest user data without permission; use the service to violate any applicable laws; or attempt to gain unauthorized access to any system." },
      { title: "Account Responsibility", text: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately at support@calmeet.com if you suspect unauthorized access." },
    ]
  },
  {
    icon: <CreditCard className="h-5 w-5" />,
    title: "Billing & Subscriptions",
    subsections: [
      { title: "Plans", text: "CalMeet offers Free, Pro, Teams, and Enterprise plans. Plan features and pricing are described on our Pricing page. Features may change with reasonable notice." },
      { title: "Payment", text: "Paid plans are billed monthly or annually in advance. We accept major credit/debit cards and UPI for Indian customers, processed securely via Razorpay." },
      { title: "Refunds", text: "We offer a 14-day money-back guarantee for new paid subscriptions. To request a refund, contact support@calmeet.com within 14 days of your first payment. Annual plans upgraded mid-cycle receive prorated credit." },
      { title: "Cancellation", text: "You may cancel your subscription at any time from Settings → Billing. Your plan remains active until the end of the current billing period. We do not charge cancellation fees." },
    ]
  },
  {
    icon: <Scale className="h-5 w-5" />,
    title: "Intellectual Property",
    content: "CalMeet and its original content, features, and functionality are owned by CalMeet and protected by applicable intellectual property laws. You retain ownership of all content you create through the service (event types, booking pages, etc.). By using the service, you grant CalMeet a limited license to host, display, and process your content solely to operate the service."
  },
  {
    icon: <AlertTriangle className="h-5 w-5" />,
    title: "Disclaimer of Warranties",
    content: "CalMeet is provided \"as is\" and \"as available\" without warranties of any kind, either express or implied. We do not warrant that the service will be uninterrupted, error-free, or free of viruses. We do not warrant the accuracy, completeness, or usefulness of any content on the service."
  },
  {
    icon: <Scale className="h-5 w-5" />,
    title: "Limitation of Liability",
    content: "To the maximum extent permitted by applicable law, CalMeet shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use or inability to use the service. Our total liability to you for any claim arising from these Terms shall not exceed the amount you paid us in the 12 months preceding the claim."
  },
  {
    icon: <RefreshCw className="h-5 w-5" />,
    title: "Termination",
    content: "We reserve the right to suspend or terminate your account at any time for violation of these Terms, fraudulent activity, or at our discretion with reasonable notice. Upon termination, your right to use the service ceases and we may delete your data after 30 days (excluding any legally required retention)."
  },
  {
    icon: <Globe className="h-5 w-5" />,
    title: "Governing Law",
    content: "These Terms are governed by the laws of India, without regard to conflict of law principles. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra, India."
  },
  {
    icon: <RefreshCw className="h-5 w-5" />,
    title: "Changes to Terms",
    content: "We may update these Terms from time to time. We will notify you of significant changes via email or a prominent notice on the service at least 14 days before the changes take effect. Continued use of the service after the effective date constitutes your acceptance of the updated Terms."
  }
];

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8"
          >
            <FileText className="h-4 w-4" />
            Terms of Service
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold tracking-tight mb-6"
          >
            Clear terms,{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              no surprises.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-400 mb-8 max-w-2xl leading-relaxed"
          >
            We&apos;ve written these terms in plain language so you know exactly what you&apos;re agreeing to.
            No legalese. No hidden clauses.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-6 text-sm text-zinc-500 border-t border-zinc-800 pt-6"
          >
            <span>Last updated: {lastUpdated}</span>
            <span>Effective immediately for new users</span>
            <span>14-day notice for existing users on changes</span>
          </motion.div>
        </div>
      </section>

      {/* Table of Contents */}
      <div className="container mx-auto px-4 max-w-4xl mb-12">
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-4">Table of Contents</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {sections.map((s, i) => (
              <a
                key={s.title}
                href={`#terms-${i}`}
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
            id={`terms-${i}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                {section.icon}
              </div>
              <h2 className="text-xl font-bold text-white">
                <span className="text-zinc-600 mr-2 font-normal">{i + 1}.</span>
                {section.title}
              </h2>
            </div>

            <div className="pl-0 md:pl-12">
              {"content" in section ? (
                <p className="text-sm text-zinc-400 leading-relaxed border-l-2 border-zinc-800 pl-5">{section.content as string}</p>
              ) : (
                <div className="space-y-5">
                  {(section as any).subsections.map((sub: any) => (
                    <div key={sub.title} className="border-l-2 border-zinc-800 pl-5">
                      <h3 className="font-semibold text-zinc-200 mb-2">{sub.title}</h3>
                      <p className="text-sm text-zinc-400 leading-relaxed">{sub.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        ))}
      </div>

      {/* Contact */}
      <section className="container mx-auto px-4 max-w-3xl mb-24">
        <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 text-center">
          <Mail className="h-8 w-8 text-indigo-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">Questions about our Terms?</h2>
          <p className="text-zinc-400 mb-6 text-sm max-w-md mx-auto">
            If you have questions about these Terms of Service or need a custom agreement for enterprise use, we&apos;re here to help.
          </p>
          <a
            href="mailto:legal@calmeet.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold transition-colors text-sm"
          >
            <Mail className="h-4 w-4" /> legal@calmeet.com
          </a>
        </div>
      </section>

      <div className="text-center text-zinc-700 text-xs pb-10">
        CalMeet · Terms of Service · Effective {lastUpdated}
      </div>
    </div>
  );
}
