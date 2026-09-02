"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Search, LayoutGrid, ArrowRight, ExternalLink, Sparkles, CheckCircle2, Calendar, Video, CreditCard, Webhook, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const apps = [
  { name: "Google Calendar", category: "Calendar", desc: "Two-way real-time calendar synchronization", status: "Installed", href: "/dashboard/settings" },
  { name: "Google Meet", category: "Video", desc: "Automated instant video room generation", status: "Installed", href: "/dashboard/settings" },
  { name: "Zoom Video", category: "Video", desc: "Dynamic Zoom meeting URLs for booked slots", status: "Connect", href: "/dashboard/settings" },
  { name: "Stripe", category: "Payments", desc: "Accept international card payments upfront", status: "Connect", href: "/dashboard/settings" },
  { name: "Razorpay", category: "Payments", desc: "Accept UPI, Cards & Net Banking in INR", status: "Installed", href: "/dashboard/settings" },
  { name: "Developer Webhooks", category: "Automation", desc: "Signed HMAC-SHA256 event listeners", status: "Installed", href: "/dashboard/settings?tab=webhooks" },
  { name: "Zapier", category: "Automation", desc: "Connect with 5,000+ business applications", status: "Connect", href: "/dashboard/settings" },
  { name: "Slack", category: "Notifications", desc: "Instant team channel alerts for new bookings", status: "Connect", href: "/dashboard/settings" },
  { name: "Microsoft Teams", category: "Video", desc: "Enterprise video conferencing integration", status: "Coming Soon", href: "#" },
  { name: "HubSpot CRM", category: "CRM", desc: "Log meeting notes and contact info to CRM", status: "Coming Soon", href: "#" },
];

const categories = ["All Apps", "Calendar", "Video", "Payments", "Automation", "CRM", "Notifications"];

export default function AppStorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Apps");

  const filteredApps = apps.filter((app) => {
    const matchesCategory = selectedCategory === "All Apps" || app.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = app.name.toLowerCase().includes(q) || app.category.toLowerCase().includes(q) || app.desc.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-6">
            <Link href="/resources" className="hover:text-zinc-600 dark:hover:text-zinc-200">Resources</Link>
            <span>/</span>
            <span className="text-zinc-800 dark:text-zinc-200 font-medium">App Directory</span>
          </div>

          {/* Header */}
          <div className="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold mb-3 border border-zinc-200 dark:border-zinc-700">
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Integrations Ecosystem</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              CalMeet App Directory
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mb-6">
              Connect CalMeet with calendars, video tools, payment gateways, and CRMs to automate your scheduling workflows.
            </p>

            {/* Filter & Search */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                      selectedCategory === cat
                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100"
                        : "bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                <input
                  placeholder="Search integrations..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* App Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12">
            {filteredApps.map((app) => (
              <div
                key={app.name}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                      {app.category}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      app.status === "Installed"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : app.status === "Coming Soon"
                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{app.name}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-1">{app.desc}</p>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                  {app.status === "Coming Soon" ? (
                    <span className="text-[11px] text-zinc-400 font-medium">In Development</span>
                  ) : (
                    <Link
                      href={app.href}
                      className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors flex items-center gap-1"
                    >
                      Configure <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">Want to build a custom app on CalMeet?</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Use our REST APIs and signed webhooks to build bespoke workflows.</div>
            </div>
            <Button render={<Link href="/resources/api-docs" />} size="sm" className="h-9 px-4 text-xs font-semibold">
              Read Developer Docs
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
