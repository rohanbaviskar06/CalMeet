"use client";

import { Navbar } from "@/components/landing/navbar";
import { motion } from "framer-motion";
import {
  ShieldCheck, Lock, Eye, Server, Zap, Globe,
  CheckCircle2, KeyRound, RefreshCw, CloudCog,
  AlertTriangle, FileText, ArrowRight
} from "lucide-react";

const pillars = [
  {
    icon: <Lock className="h-6 w-6" />,
    title: "End-to-End Encryption",
    desc: "All data in transit is encrypted with TLS 1.3. Data at rest uses AES-256 encryption. Your scheduling data is never transmitted in plain text.",
    color: "emerald",
  },
  {
    icon: <KeyRound className="h-6 w-6" />,
    title: "Authentication & Access",
    desc: "OAuth 2.0 via Google, GitHub, and Zoom. JWT-based sessions with short-lived tokens. API keys are hashed with bcrypt before storage — never stored in plain text.",
    color: "blue",
  },
  {
    icon: <Eye className="h-6 w-6" />,
    title: "Privacy by Design",
    desc: "We collect only what's strictly necessary. No behavioral tracking, no third-party ad networks. You control your data — export or delete it anytime.",
    color: "violet",
  },
  {
    icon: <Server className="h-6 w-6" />,
    title: "Infrastructure Security",
    desc: "Hosted on Vercel's edge network with automatic DDoS mitigation. Database powered by Supabase with automated backups, point-in-time recovery, and row-level security.",
    color: "orange",
  },
  {
    icon: <RefreshCw className="h-6 w-6" />,
    title: "Continuous Monitoring",
    desc: "24/7 uptime monitoring and anomaly detection. Security patches are applied within hours of disclosure. Our incident response SLA is under 1 hour.",
    color: "pink",
  },
  {
    icon: <CloudCog className="h-6 w-6" />,
    title: "Compliance Ready",
    desc: "GDPR and CCPA compliant data handling. Data Processing Agreements (DPAs) available for enterprise customers. Regular third-party security audits.",
    color: "cyan",
  },
];

const colorMap: Record<string, string> = {
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 from-emerald-500/10 to-teal-500/10",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20 from-blue-500/10 to-cyan-500/10",
  violet: "bg-violet-500/10 text-violet-400 border-violet-500/20 from-violet-500/10 to-purple-500/10",
  orange: "bg-orange-500/10 text-orange-400 border-orange-500/20 from-orange-500/10 to-amber-500/10",
  pink: "bg-pink-500/10 text-pink-400 border-pink-500/20 from-pink-500/10 to-rose-500/10",
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 from-cyan-500/10 to-sky-500/10",
};

const practices = [
  "TLS 1.3 in transit + AES-256 at rest",
  "API keys hashed with bcrypt — never stored plain",
  "HMAC-SHA256 signed webhook payloads",
  "Row-Level Security on all database tables",
  "Automated nightly database backups",
  "Zero-trust network architecture",
  "Secure session management with JWT",
  "GDPR & CCPA compliant data handling",
  "Regular third-party penetration testing",
  "CSP, HSTS, and X-Frame-Options headers",
  "Dependency vulnerability scanning on every deploy",
  "Incident response SLA under 1 hour",
];

export default function SecurityPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8"
          >
            <ShieldCheck className="h-4 w-4" />
            Enterprise-Grade Security
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            Built with{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              security first.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Your scheduling data is sensitive. We treat it that way — with industry-leading
            encryption, zero-trust architecture, and continuous monitoring.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {["GDPR Compliant", "CCPA Compliant", "AES-256 Encrypted", "TLS 1.3"].map(badge => (
              <div key={badge} className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                {badge}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Security Pillars */}
      <section className="container mx-auto px-4 max-w-6xl mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">Security Pillars</h2>
          <p className="text-zinc-500">The layers of protection protecting your data 24/7.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map((p, i) => {
            const cls = colorMap[p.color];
            const [bg, text, border, fromTo] = cls.split(" ");
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`p-6 rounded-2xl bg-gradient-to-br ${fromTo} border ${border} hover:scale-[1.01] transition-all`}
              >
                <div className={`p-3 rounded-xl ${bg} border ${border} ${text} w-fit mb-4`}>
                  {p.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{p.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Security Practices Checklist */}
      <section className="container mx-auto px-4 max-w-4xl mb-24">
        <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-white">Security Practices</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {practices.map(p => (
              <div key={p} className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-800/50 transition-colors">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-sm text-zinc-300">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Report Vulnerability */}
      <section className="container mx-auto px-4 max-w-3xl mb-24">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-amber-900/20 to-orange-900/10 border border-amber-500/20 text-center">
          <AlertTriangle className="h-10 w-10 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Found a Vulnerability?</h2>
          <p className="text-zinc-400 mb-6 max-w-lg mx-auto">
            We take security reports seriously. If you discover a security issue, please report it
            responsibly and we&apos;ll address it within 48 hours.
          </p>
          <a
            href="mailto:security@calmeet.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-full font-semibold transition-colors"
          >
            <FileText className="h-4 w-4" /> Report Security Issue
          </a>
        </div>
      </section>

      <div className="text-center text-zinc-600 text-xs pb-10">
        Security questions? Contact us at{" "}
        <a href="mailto:security@calmeet.com" className="text-zinc-400 hover:text-white transition-colors">
          security@calmeet.com
        </a>
      </div>
    </div>
  );
}
