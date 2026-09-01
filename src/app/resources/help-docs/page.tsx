"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Search, 
  BookOpen, 
  MessageCircle, 
  ArrowRight, 
  Play,
  Zap, 
  User, 
  LayoutGrid, 
  CreditCard, 
  Users, 
  Code2,
  ChevronDown,
  HelpCircle,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FAQItem {
  id: string;
  question: string;
  category: string;
  answer: string;
  link?: { label: string; href: string };
}

const faqs: FAQItem[] = [
  {
    id: "gcal-sync",
    category: "Integrations",
    question: "How do I connect and sync my Google Calendar with CalMeet?",
    answer: "Go to Dashboard > Settings > Calendar Integrations or Integrations Hub and click 'Connect with Google'. Once connected, CalMeet automatically reads your busy calendar events to prevent double bookings and generates unique Google Meet links for every new meeting.",
    link: { label: "Go to Integrations", href: "/dashboard/integrations" }
  },
  {
    id: "working-hours",
    category: "Getting Started",
    question: "How do I configure custom availability and multiple shifts?",
    answer: "Navigate to Dashboard > Availability. You can toggle each day of the week, specify multiple intervals (e.g. 9:00 AM – 12:00 PM and 1:00 PM – 5:00 PM), and use the 'Copy to other days' tool to quickly replicate your hours across your entire work week.",
    link: { label: "Edit Availability", href: "/dashboard/availability" }
  },
  {
    id: "routing-forms",
    category: "Team Management",
    question: "What are Routing Forms and how do they route attendees?",
    answer: "Routing forms allow you to ask screening questions before an attendee books. Based on their answers (such as Company Size or Budget), CalMeet can automatically direct them to specific team members, custom event types, or external URLs.",
    link: { label: "Manage Routing Forms", href: "/dashboard/routing" }
  },
  {
    id: "api-keys-webhooks",
    category: "Developers & API",
    question: "How do I authenticate with the REST API and receive Webhooks?",
    answer: "You can generate live API keys from Settings > API Keys. Include your key as a Bearer token in the Authorization header. You can also configure webhook subscriptions to receive instant JSON payloads when bookings are created or canceled.",
    link: { label: "View API Docs", href: "/resources/api-docs" }
  },
  {
    id: "paid-bookings",
    category: "Billing & Plans",
    question: "Can I charge attendees for bookings and consultations?",
    answer: "Yes! When creating or editing an Event Type, enable 'Requires Payment' and configure your fee and currency. Attendees will be prompted to complete checkout securely before their meeting slot is confirmed.",
    link: { label: "Event Types", href: "/dashboard/event-types" }
  },
  {
    id: "custom-slug",
    category: "Account & Settings",
    question: "How do I customize my public booking link and username?",
    answer: "You can change your username and profile bio anytime in Dashboard > Settings > Profile. Your public booking page will be instantly accessible at calmeet.app/[username].",
    link: { label: "Profile Settings", href: "/dashboard/settings" }
  }
];

const categories = [
  { title: "All Topics", count: faqs.length, icon: <BookOpen className="h-5 w-5" /> },
  { title: "Getting Started", count: 1, icon: <Zap className="h-5 w-5" /> },
  { title: "Account & Settings", count: 1, icon: <User className="h-5 w-5" /> },
  { title: "Integrations", count: 1, icon: <LayoutGrid className="h-5 w-5" /> },
  { title: "Billing & Plans", count: 1, icon: <CreditCard className="h-5 w-5" /> },
  { title: "Team Management", count: 1, icon: <Users className="h-5 w-5" /> },
  { title: "Developers & API", count: 1, icon: <Code2 className="h-5 w-5" /> },
];

export default function HelpDocsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  const [expandedFaq, setExpandedFaq] = useState<string | null>("gcal-sync");

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === "All Topics" || faq.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q) ||
      faq.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50/60 dark:bg-[#0c0c0e] text-foreground">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 space-y-16">
        {/* Hero & Search */}
        <section className="container mx-auto px-4 max-w-5xl text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Knowledge Base & Support</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              How can we <span className="text-primary italic">help you?</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Search step-by-step guides, frequently asked questions, and platform tutorials to get the most out of CalMeet.
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto relative pt-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <input 
              type="search"
              placeholder="Search guides, calendar sync, webhooks, payments..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-13 pl-12 pr-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
            />
          </div>
        </section>

        {/* Categories Bar */}
        <section className="container mx-auto px-4 max-w-5xl">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.title;
              return (
                <button
                  key={cat.title}
                  onClick={() => setSelectedCategory(cat.title)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer",
                    isActive
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs"
                      : "bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                  )}
                >
                  <span className="opacity-80">{cat.icon}</span>
                  <span>{cat.title}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* FAQs & Answers Accordion */}
        <section className="container mx-auto px-4 max-w-5xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <h2 className="font-heading text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {selectedCategory} ({filteredFaqs.length})
            </h2>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs text-primary font-semibold hover:underline cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-950 p-8 space-y-3">
              <HelpCircle className="h-8 w-8 text-zinc-400 mx-auto" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                No guides found
              </h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                We couldn&apos;t find any articles matching &ldquo;{searchQuery}&rdquo;. Try another keyword or reach out to our team.
              </p>
              <Link href="/support">
                <Button size="sm" variant="outline" className="mt-2 rounded-xl text-xs font-semibold">
                  Contact Support
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const isExpanded = expandedFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-2xs transition-all"
                  >
                    <button
                      onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                          {faq.category}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
                          {faq.question}
                        </h3>
                      </div>

                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-zinc-400 shrink-0 transition-transform duration-200",
                          isExpanded && "rotate-180 text-zinc-900 dark:text-zinc-100"
                        )}
                      />
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-zinc-150 dark:border-zinc-850 space-y-4">
                            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                              {faq.answer}
                            </p>

                            {faq.link && (
                              <Link
                                href={faq.link.href}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                              >
                                <span>{faq.link.label}</span>
                                <ArrowRight className="h-3 w-3" />
                              </Link>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Support CTA Card */}
        <section className="container mx-auto px-4 max-w-5xl">
          <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 sm:p-12 shadow-2xs text-center space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <MessageCircle className="h-6 w-6" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
                Still have questions?
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Can&apos;t find what you&apos;re looking for? Our team is available to help you configure your calendar, integrations, and automated workflows.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/support">
                <Button className="h-10 px-6 text-xs font-semibold rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-2xs gap-2">
                  <MessageCircle className="h-4 w-4" /> Contact Support
                </Button>
              </Link>
              <a href="mailto:support@calmeet.app">
                <Button variant="outline" className="h-10 px-6 text-xs font-semibold rounded-xl border-zinc-200 dark:border-zinc-800 gap-2">
                  <Mail className="h-4 w-4" /> Email Us
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
