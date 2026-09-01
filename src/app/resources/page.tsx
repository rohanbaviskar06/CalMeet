"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { motion } from "framer-motion";
import { 
  Type, 
  Code2, 
  Newspaper, 
  Smartphone, 
  Moon, 
  Zap, 
  Users, 
  CreditCard, 
  Link as LinkIcon, 
  FileText, 
  Network, 
  Webhook,
  Search,
  ChevronRight,
  Sparkles,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const resources = [
  {
    title: "Font: CalMeet Sans",
    description: "Our own variable typeface for user interface design",
    icon: <Type className="h-6 w-6" />,
    href: "/resources/font"
  },
  {
    title: "Embed",
    description: "Embed CalMeet into your website or web app",
    icon: <Code2 className="h-6 w-6" />,
    href: "/resources/embed"
  },
  {
    title: "REST API Docs",
    description: "Developer guides, endpoints, and code samples",
    icon: <Code2 className="h-6 w-6" />,
    href: "/resources/api-docs"
  },
  {
    title: "Blog & Updates",
    description: "Stay up to date with the latest features and news",
    icon: <Newspaper className="h-6 w-6" />,
    href: "/blog"
  },
  {
    title: "App Store & Integrations",
    description: "Connect Google Calendar, Zoom, Slack, and Zapier",
    logo: "/logos/google-calendar.svg",
    href: "/resources/app-store"
  },
  {
    title: "Out Of Office",
    description: "Schedule time off and forward bookings easily",
    icon: <Moon className="h-6 w-6" />,
    href: "/resources/out-of-office"
  },
  {
    title: "Instant Meetings",
    description: "Meet with clients on-demand in seconds",
    icon: <Zap className="h-6 w-6" />,
    href: "/resources/instant-meetings"
  },
  {
    title: "Collective Events",
    description: "Schedule events with multiple team participants",
    icon: <Users className="h-6 w-6" />,
    href: "/resources/collective-events"
  },
  {
    title: "Payments",
    description: "Accept Stripe payments directly for bookings",
    logo: "/logos/stripe.png",
    href: "/resources/payments"
  },
  {
    title: "Dynamic Group Links",
    description: "Seamlessly book meetings with multiple people",
    icon: <LinkIcon className="h-6 w-6" />,
    href: "/resources/dynamic-group-links"
  },
  {
    title: "Help Center",
    description: "Frequently asked questions and how-to guides",
    icon: <FileText className="h-6 w-6" />,
    href: "/resources/help-docs"
  },
  {
    title: "Workflows",
    description: "Automate SMS, emails, and booking reminders",
    logo: "/logos/zapier.svg",
    href: "/resources/workflows"
  },
  {
    title: "Webhooks",
    description: "Receive instant JSON payloads when bookings change",
    icon: <Webhook className="h-6 w-6" />,
    href: "/resources/webhooks"
  },
  {
    title: "Security & Trust",
    description: "Learn about enterprise security, encryption, and compliance",
    logo: "/logos/teams.png",
    href: "/security"
  },
  {
    title: "Legal & Privacy",
    description: "Terms of service, privacy policy, and cookie guidelines",
    icon: <FileText className="h-6 w-6" />,
    href: "/terms"
  },
  {
    title: "Contact Support",
    description: "Need assistance? Our team is available 24/7",
    icon: <Users className="h-6 w-6" />,
    href: "/support"
  }
];

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = resources.filter(item => {
    const q = searchQuery.toLowerCase();
    return item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50/60 dark:bg-[#0c0c0e] text-foreground">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 space-y-16">
        <div className="container mx-auto px-4 max-w-6xl space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Ecosystem & Platform</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                Resources & <span className="text-primary italic">Tools</span>
              </h1>
              
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Everything you need to integrate, automate, and optimize your scheduling workflow.
              </p>
            </motion.div>

            <div className="max-w-md mx-auto relative pt-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input 
                type="search"
                placeholder="Search tools, guides, API, embeds..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>
          </div>

          {/* Grid Layout */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-10 shadow-2xs"
          >
            {filteredResources.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-sm">
                No resources found matching &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((item) => (
                  <Link 
                    key={item.title} 
                    href={item.href} 
                    className="group p-4 rounded-2xl border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-all flex items-start gap-4"
                  >
                    <div className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform overflow-hidden p-2.5">
                      {item.logo ? (
                        <img src={item.logo} alt={item.title} className="w-full h-full object-contain" />
                      ) : (
                        <div className="text-zinc-600 dark:text-zinc-400 group-hover:text-primary transition-colors">
                          {item.icon}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors truncate">
                          {item.title}
                        </h3>
                        <ChevronRight className="h-3.5 w-3.5 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
          
          {/* CTA Banner */}
          <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 text-white p-8 sm:p-12 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                Can&apos;t find what you&apos;re looking for?
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Our support team is available 24/7 to assist you with integrations, custom routing, or API implementation.
              </p>
            </div>

            <Link href="/support">
              <Button size="lg" className="h-11 px-6 rounded-xl text-xs font-bold bg-white text-zinc-900 hover:bg-zinc-100 shrink-0 shadow-2xs">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
