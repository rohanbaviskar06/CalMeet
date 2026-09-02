"use client";

import { Navbar } from "@/components/landing/navbar";
import {
  ShieldCheck, Lock, KeyRound, Server, Eye,
  RefreshCw, CheckCircle2, AlertTriangle, FileText, Globe
} from "lucide-react";

const pillars = [
  {
    icon: <Lock className="h-4 w-4" />,
    title: "Encryption in Transit & at Rest",
    desc: "All data in transit uses TLS 1.3. Data at rest is encrypted with AES-256. Nothing is transmitted unencrypted."
  },
  {
    icon: <KeyRound className="h-4 w-4" />,
    title: "Authentication & API Keys",
    desc: "OAuth 2.0 via Google and GitHub. JWT sessions with short-lived tokens. API keys are bcrypt-hashed — never stored in plain text."
  },
  {
    icon: <Eye className="h-4 w-4" />,
    title: "Privacy by Design",
    desc: "We collect only what's strictly necessary. No ad trackers, no third-party marketing pixels, no behavioral profiling."
  },
  {
    icon: <Server className="h-4 w-4" />,
    title: "Infrastructure",
    desc: "Hosted on Vercel's edge network with automatic DDoS mitigation. Database on Supabase with row-level security and automated backups."
  },
  {
    icon: <RefreshCw className="h-4 w-4" />,
    title: "Monitoring & Response",
    desc: "24/7 uptime monitoring and anomaly detection. Security patches applied within hours. Incident response SLA under 1 hour."
  },
  {
    icon: <Globe className="h-4 w-4" />,
    title: "Compliance",
    desc: "GDPR and CCPA compliant. Data Processing Agreements available for enterprise customers. Regular third-party security audits."
  },
];

const checklist = [
  "TLS 1.3 in transit, AES-256 at rest",
  "API keys bcrypt-hashed before storage",
  "HMAC-SHA256 signed webhook payloads",
  "Row-Level Security on all database tables",
  "Automated nightly database backups",
  "Zero-trust network architecture",
  "JWT session management",
  "GDPR & CCPA compliant data handling",
  "Regular third-party penetration tests",
  "CSP, HSTS, X-Frame-Options headers enforced",
  "Dependency vulnerability scanning on every deploy",
  "Incident response SLA under 1 hour",
];

export default function SecurityPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Header */}
          <div className="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-3">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Security</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
              Security at CalMeet
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
              We take security seriously. CalMeet is built with industry-standard encryption,
              zero-trust architecture, and continuous monitoring to protect your scheduling data.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {["GDPR Compliant", "CCPA Compliant", "AES-256 Encrypted", "TLS 1.3"].map(badge => (
                <div key={badge} className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="h-3 w-3 text-zinc-400" />
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Pillars */}
          <div className="mb-10">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Security Pillars</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5">The layers of protection keeping your data safe.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {pillars.map(p => (
                <div
                  key={p.title}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                      {p.icon}
                    </div>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{p.title}</span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div className="mb-10">
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Security Practices</h2>
                <p className="text-[11px] text-zinc-400 mt-0.5">What we do to protect your data every day.</p>
              </div>
              <div className="p-4">
                <div className="grid sm:grid-cols-2 gap-2">
                  {checklist.map(item => (
                    <div key={item} className="flex items-center gap-2.5 text-xs text-zinc-600 dark:text-zinc-400 py-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Vulnerability Disclosure */}
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="w-8 h-8 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 shrink-0 mt-0.5">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">Found a Vulnerability?</div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                If you discover a security issue, please report it responsibly. We take all reports seriously and respond within 48 hours.
              </p>
              <a
                href="mailto:security@calmeet.com"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                <FileText className="h-3.5 w-3.5" /> security@calmeet.com
              </a>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
