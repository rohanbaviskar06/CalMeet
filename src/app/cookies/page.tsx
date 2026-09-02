"use client";

import { Navbar } from "@/components/landing/navbar";
import { motion } from "framer-motion";
import { Cookie, Settings, BarChart2, Shield, RefreshCw, Globe, CheckCircle2, XCircle } from "lucide-react";

const lastUpdated = "September 2, 2025";

const cookieTypes = [
  {
    icon: <Shield className="h-5 w-5" />,
    name: "Strictly Necessary",
    required: true,
    color: "emerald",
    description: "These cookies are essential for the website to function. They cannot be disabled.",
    examples: [
      { name: "next-auth.session-token", purpose: "Stores your encrypted login session", duration: "30 days", provider: "CalMeet" },
      { name: "next-auth.csrf-token", purpose: "CSRF protection for form submissions", duration: "Session", provider: "CalMeet" },
      { name: "__Host-next-auth.csrf-token", purpose: "Secure CSRF token for HTTPS", duration: "Session", provider: "CalMeet" },
    ]
  },
  {
    icon: <BarChart2 className="h-5 w-5" />,
    name: "Analytics",
    required: false,
    color: "blue",
    description: "Help us understand how visitors interact with the site to improve the experience. No personal data is collected.",
    examples: [
      { name: "Vercel Analytics", purpose: "Anonymized page view tracking (no fingerprinting)", duration: "No cookie stored", provider: "Vercel" },
      { name: "Vercel Speed Insights", purpose: "Core Web Vitals measurement", duration: "No cookie stored", provider: "Vercel" },
    ]
  },
  {
    icon: <Settings className="h-5 w-5" />,
    name: "Preference",
    required: false,
    color: "violet",
    description: "Remember your settings and preferences to improve your experience.",
    examples: [
      { name: "theme", purpose: "Remembers your dark/light mode preference", duration: "1 year", provider: "CalMeet" },
      { name: "timezone", purpose: "Caches detected timezone for booking pages", duration: "Session", provider: "CalMeet" },
    ]
  },
];

const colorMap: Record<string, { badge: string; icon: string; border: string; gradient: string }> = {
  emerald: { badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: "text-emerald-400", border: "border-emerald-500/20", gradient: "from-emerald-500/10 to-teal-500/5" },
  blue: { badge: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: "text-blue-400", border: "border-blue-500/20", gradient: "from-blue-500/10 to-cyan-500/5" },
  violet: { badge: "bg-violet-500/10 text-violet-400 border-violet-500/20", icon: "text-violet-400", border: "border-violet-500/20", gradient: "from-violet-500/10 to-purple-500/5" },
};

export default function CookiesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/15 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-600/6 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-8"
          >
            <Cookie className="h-4 w-4" />
            Cookie Policy
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold tracking-tight mb-6"
          >
            Cookies, explained{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              clearly.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-400 mb-8 max-w-2xl leading-relaxed"
          >
            We use only the cookies we need. No advertising cookies, no cross-site tracking,
            no third-party marketing pixels. Here&apos;s exactly what we use and why.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            {[
              { icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />, text: "No advertising cookies" },
              { icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />, text: "No cross-site tracking" },
              { icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />, text: "No behavioral profiling" },
              { icon: <XCircle className="h-4 w-4 text-red-400" />, text: "No cookie banners (because we don't need them)" },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-2 px-3 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
                {item.icon}
                {item.text}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What is a cookie */}
      <div className="container mx-auto px-4 max-w-4xl mb-12">
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="flex items-start gap-4">
            <Cookie className="h-5 w-5 text-amber-400 shrink-0 mt-1" />
            <div>
              <h2 className="font-semibold text-white mb-2">What is a cookie?</h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Cookies are small text files stored on your device when you visit a website. They allow the website to
                remember information about your visit — like whether you&apos;re logged in — so you don&apos;t have to
                re-enter details on every page. CalMeet uses cookies only for essential functionality and
                privacy-friendly analytics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Types */}
      <div className="container mx-auto px-4 max-w-4xl mb-24 space-y-6">
        <h2 className="text-2xl font-bold text-white mb-6">Cookies We Use</h2>

        {cookieTypes.map((type, i) => {
          const cls = colorMap[type.color];
          return (
            <motion.div
              key={type.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`rounded-2xl bg-gradient-to-br ${cls.gradient} border ${cls.border} overflow-hidden`}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className={`${cls.badge} p-2 rounded-lg border`}>
                    {type.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{type.name}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">{type.description}</p>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1.5 rounded-full border font-medium ${cls.badge}`}>
                  {type.required ? "Required" : "Optional"}
                </span>
              </div>

              {/* Cookie table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left p-4 text-zinc-500 font-medium text-xs uppercase">Name</th>
                      <th className="text-left p-4 text-zinc-500 font-medium text-xs uppercase">Purpose</th>
                      <th className="text-left p-4 text-zinc-500 font-medium text-xs uppercase">Duration</th>
                      <th className="text-left p-4 text-zinc-500 font-medium text-xs uppercase">Provider</th>
                    </tr>
                  </thead>
                  <tbody>
                    {type.examples.map((ex, j) => (
                      <tr key={ex.name} className={j < type.examples.length - 1 ? "border-b border-zinc-800/50" : ""}>
                        <td className="p-4 font-mono text-xs text-zinc-300">{ex.name}</td>
                        <td className="p-4 text-zinc-400 text-xs">{ex.purpose}</td>
                        <td className="p-4 text-zinc-400 text-xs whitespace-nowrap">{ex.duration}</td>
                        <td className="p-4 text-zinc-400 text-xs">{ex.provider}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Managing cookies */}
      <section className="container mx-auto px-4 max-w-4xl mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Managing Your Cookies</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            {
              icon: <Globe className="h-5 w-5" />,
              title: "Browser Settings",
              desc: "You can control cookies through your browser settings. Most browsers allow you to block or delete cookies. Note: blocking essential cookies will prevent you from staying logged in.",
              links: [
                { name: "Chrome", href: "https://support.google.com/chrome/answer/95647" },
                { name: "Firefox", href: "https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" },
                { name: "Safari", href: "https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" },
              ]
            },
            {
              icon: <RefreshCw className="h-5 w-5" />,
              title: "Opting Out of Analytics",
              desc: "Vercel Analytics respects Do Not Track headers and does not use cookies. You can also install the Vercel Analytics opt-out browser extension.",
              links: []
            },
          ].map(item => (
            <div key={item.title} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-white">{item.title}</h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">{item.desc}</p>
              {item.links.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.links.map(link => (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
                    >
                      {link.name} →
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Changes */}
      <section className="container mx-auto px-4 max-w-4xl mb-24">
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-start gap-4">
          <RefreshCw className="h-5 w-5 text-zinc-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-white mb-1">Changes to This Policy</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              We may update this Cookie Policy as our services evolve. Any changes will be posted on this page
              with an updated &quot;Last Updated&quot; date. We will notify registered users of significant changes via email.
            </p>
            <p className="text-xs text-zinc-600 mt-2">Last Updated: {lastUpdated}</p>
          </div>
        </div>
      </section>

      <div className="text-center text-zinc-700 text-xs pb-10">
        Questions? Contact us at{" "}
        <a href="mailto:privacy@calmeet.com" className="text-zinc-500 hover:text-white transition-colors">
          privacy@calmeet.com
        </a>
      </div>
    </div>
  );
}
