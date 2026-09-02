"use client";

import { Navbar } from "@/components/landing/navbar";
import { Cookie, Shield, BarChart2, Settings, RefreshCw, Globe, CheckCircle2, XCircle } from "lucide-react";

const lastUpdated = "September 2, 2025";

const cookieTypes = [
  {
    icon: <Shield className="h-4 w-4" />,
    name: "Strictly Necessary",
    required: true,
    description: "Essential for the website to function. Cannot be disabled.",
    cookies: [
      { name: "next-auth.session-token", purpose: "Stores your encrypted login session", duration: "30 days", provider: "CalMeet" },
      { name: "next-auth.csrf-token", purpose: "CSRF protection for form submissions", duration: "Session", provider: "CalMeet" },
      { name: "__Host-next-auth.csrf-token", purpose: "Secure CSRF token (HTTPS only)", duration: "Session", provider: "CalMeet" },
    ]
  },
  {
    icon: <BarChart2 className="h-4 w-4" />,
    name: "Analytics",
    required: false,
    description: "Help us understand how visitors use the site. No personal data is collected.",
    cookies: [
      { name: "Vercel Analytics", purpose: "Anonymized page view tracking — no fingerprinting", duration: "No cookie stored", provider: "Vercel" },
      { name: "Vercel Speed Insights", purpose: "Core Web Vitals measurement", duration: "No cookie stored", provider: "Vercel" },
    ]
  },
  {
    icon: <Settings className="h-4 w-4" />,
    name: "Preference",
    required: false,
    description: "Remember your settings to improve your experience.",
    cookies: [
      { name: "theme", purpose: "Remembers your dark/light mode preference", duration: "1 year", provider: "CalMeet" },
      { name: "timezone", purpose: "Caches detected timezone for booking pages", duration: "Session", provider: "CalMeet" },
    ]
  },
];

export default function CookiesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Header */}
          <div className="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-3">
              <Cookie className="h-3.5 w-3.5" />
              <span>Legal</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
              Cookie Policy
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mb-4">
              We use only the cookies we need — no advertising cookies, no cross-site tracking, no behavioral profiling.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                { icon: <CheckCircle2 className="h-3 w-3 text-zinc-400" />, text: "No advertising cookies" },
                { icon: <CheckCircle2 className="h-3 w-3 text-zinc-400" />, text: "No cross-site tracking" },
                { icon: <XCircle className="h-3 w-3 text-zinc-400" />, text: "No annoying cookie banner" },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2.5 py-1 rounded-full">
                  {item.icon}
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* What is a cookie */}
          <div className="mb-8 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-start gap-3">
            <div className="w-7 h-7 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 shrink-0">
              <Cookie className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">What is a cookie?</div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Cookies are small text files stored on your device when you visit a website. They allow the site to remember information about your visit — like whether you&apos;re logged in. CalMeet uses cookies only for essential functionality and privacy-friendly analytics.
              </p>
            </div>
          </div>

          {/* Cookie Types */}
          <div className="mb-10 space-y-4">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Cookies We Use</h2>

            {cookieTypes.map(type => (
              <div key={type.name} className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-2xs overflow-hidden">
                {/* Type header */}
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                      {type.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{type.name}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">{type.description}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full border font-medium ${
                    type.required
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500 border-zinc-200 dark:border-zinc-700"
                  }`}>
                    {type.required ? "Required" : "Optional"}
                  </span>
                </div>

                {/* Cookie table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                        <th className="text-left px-4 py-2 text-[10px] font-medium text-zinc-400 uppercase tracking-wide">Name</th>
                        <th className="text-left px-4 py-2 text-[10px] font-medium text-zinc-400 uppercase tracking-wide">Purpose</th>
                        <th className="text-left px-4 py-2 text-[10px] font-medium text-zinc-400 uppercase tracking-wide">Duration</th>
                        <th className="text-left px-4 py-2 text-[10px] font-medium text-zinc-400 uppercase tracking-wide">Provider</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {type.cookies.map(cookie => (
                        <tr key={cookie.name} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                          <td className="px-4 py-3 font-mono text-[11px] text-zinc-600 dark:text-zinc-400 whitespace-nowrap">{cookie.name}</td>
                          <td className="px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">{cookie.purpose}</td>
                          <td className="px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">{cookie.duration}</td>
                          <td className="px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">{cookie.provider}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* Managing cookies */}
          <div className="mb-10">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Managing Your Cookies</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                    <Globe className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Browser Settings</span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 leading-relaxed">
                  You can control or delete cookies through your browser settings. Note: blocking essential cookies will prevent you from staying logged in.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: "Chrome", href: "https://support.google.com/chrome/answer/95647" },
                    { name: "Firefox", href: "https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" },
                    { name: "Safari", href: "https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" },
                  ].map(link => (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 transition-colors"
                    >
                      {link.name} →
                    </a>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                    <RefreshCw className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Analytics Opt-Out</span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Vercel Analytics respects Do Not Track browser headers and does not use cookies. You can also use a content blocker to prevent analytics requests entirely.
                </p>
              </div>
            </div>
          </div>

          {/* Changes */}
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-start gap-3 mb-6">
            <div className="w-7 h-7 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 shrink-0">
              <RefreshCw className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">Policy Updates</div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                We may update this Cookie Policy as our services evolve. Registered users will be notified of significant changes via email. Last updated: {lastUpdated}.
              </p>
            </div>
          </div>

          <div className="text-center text-[11px] text-zinc-400">
            Questions? <a href="mailto:privacy@calmeet.com" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">privacy@calmeet.com</a>
          </div>
        </div>
      </main>
    </div>
  );
}
