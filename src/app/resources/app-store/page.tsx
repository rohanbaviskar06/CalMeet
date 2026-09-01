"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { motion } from "framer-motion";
import { Search, Zap, LayoutGrid, ArrowRight, ExternalLink, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const apps = [
  { name: "Google Calendar", category: "Calendar", logo: "/logos/google-calendar.svg", status: "Installed", href: "/dashboard/integrations" },
  { name: "Google Meet", category: "Video", logo: "/logos/google-meet.svg", status: "Installed", href: "/dashboard/integrations" },
  { name: "Zoom", category: "Video", logo: "/logos/zoom.svg", status: "Installed", href: "/dashboard/integrations" },
  { name: "Outlook Calendar", category: "Calendar", logo: "/logos/outlook.png", status: "Connect", href: "/dashboard/integrations" },
  { name: "Slack", category: "Notifications", logo: "/logos/slack.svg", status: "Connect", href: "/dashboard/integrations" },
  { name: "Zapier", category: "Automation", logo: "/logos/zapier.svg", status: "Connect", href: "/dashboard/integrations" },
  { name: "Stripe", category: "Payments", logo: "/logos/stripe.png", status: "Connect", href: "/dashboard/integrations" },
  { name: "Microsoft Teams", category: "Video", logo: "/logos/teams.png", status: "Coming Soon", href: "#" },
  { name: "Salesforce", category: "CRM", logo: "/logos/teams.png", status: "Coming Soon", href: "#" },
  { name: "HubSpot", category: "CRM", logo: "/logos/teams.png", status: "Coming Soon", href: "#" },
];

const categories = ["All Apps", "Calendar", "Video", "CRM", "Notifications", "Automation", "Payments"];

export default function AppStorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Apps");

  const filteredApps = apps.filter((app) => {
    const matchesCategory = selectedCategory === "All Apps" || app.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = app.name.toLowerCase().includes(q) || app.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50/60 dark:bg-[#0c0c0e] text-foreground">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 space-y-16">
        {/* Header */}
        <section className="container mx-auto px-4 max-w-5xl text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>App Directory</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Extend your <span className="text-primary italic">workflow.</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Connect CalMeet with the tools you use every day. Calendars, video conferencing, CRM, and automated triggers.
            </p>
          </motion.div>

          <div className="max-w-xl mx-auto relative pt-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input 
              type="search"
              placeholder="Search for an app or integration..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
          </div>
        </section>

        {/* Categories Section */}
        <section className="container mx-auto px-4 max-w-5xl">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar justify-start sm:justify-center">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
                    isActive
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs"
                      : "bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* App Grid */}
        <section className="container mx-auto px-4 max-w-5xl">
          {filteredApps.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-950 p-8">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">No applications found</h3>
              <p className="text-xs text-zinc-500 mt-1">Try another keyword or search category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredApps.map((app) => (
                <div
                  key={app.name}
                  className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-2xs flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center p-2.5 shadow-2xs">
                        <img src={app.logo} alt={app.name} className="w-full h-full object-contain" />
                      </div>

                      {app.status === "Installed" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      ) : app.status === "Coming Soon" ? (
                        <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                          Coming Soon
                        </span>
                      ) : (
                        <Link href="/dashboard/integrations">
                          <Button size="sm" variant="outline" className="h-7 text-[11px] px-3 rounded-lg border-zinc-200 dark:border-zinc-800 font-semibold cursor-pointer">
                            Connect
                          </Button>
                        </Link>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {app.name}
                      </h3>
                      <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold mt-0.5">
                        {app.category}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between text-xs">
                    <Link href="/dashboard/integrations" className="text-zinc-500 dark:text-zinc-400 hover:text-primary transition-colors flex items-center gap-1 font-medium text-[11px]">
                      <span>Configure in dashboard</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 max-w-5xl">
          <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 text-white p-8 sm:p-12 shadow-2xs text-center space-y-6">
            <div className="space-y-2 max-w-xl mx-auto">
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                Missing your favorite tool?
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Our team is constantly adding new apps and webhook integrations. Let us know what you&apos;d like to see next.
              </p>
            </div>

            <Link href="/support">
              <Button size="lg" className="h-10 px-6 text-xs font-bold rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 shadow-2xs">
                Request an App
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
