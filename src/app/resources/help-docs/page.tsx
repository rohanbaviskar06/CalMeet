"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  Calendar,
  CreditCard,
  Zap,
  Users,
  Code2,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  link?: { label: string; href: string };
}

const faqs: FAQItem[] = [
  {
    id: "gcal-sync",
    category: "Integrations",
    question: "How do I connect and sync Google Calendar with CalMeet?",
    answer: "Go to Dashboard → Settings → Integrations and click 'Connect with Google'. CalMeet automatically checks your busy slots to prevent double bookings and generates unique Google Meet links for every new meeting.",
    link: { label: "Go to Settings", href: "/dashboard/settings" }
  },
  {
    id: "working-hours",
    category: "Getting Started",
    question: "How do I configure custom availability and working hours?",
    answer: "Navigate to Dashboard → Availability. You can toggle each day of the week, specify multiple intervals (e.g. 9:00 AM – 12:00 PM and 1:00 PM – 5:00 PM), and set buffer times between appointments.",
    link: { label: "Edit Availability", href: "/dashboard/availability" }
  },
  {
    id: "routing-forms",
    category: "Team Management",
    question: "What are Routing Forms and how do they route attendees?",
    answer: "Routing forms let you ask qualifying questions before booking. Based on attendee answers (e.g. Company Size or Budget), CalMeet directs them to specific team members or event types.",
    link: { label: "Manage Routing Forms", href: "/dashboard/routing-forms" }
  },
  {
    id: "paid-bookings",
    category: "Payments",
    question: "How do I accept payments for bookings via Stripe or Razorpay?",
    answer: "Open any Event Type in your dashboard, toggle 'Requires Payment', set your price and currency (INR / USD), and connect your payment account. Guests must pay upfront to confirm the appointment.",
    link: { label: "View Event Types", href: "/dashboard/event-types" }
  },
  {
    id: "webhooks-setup",
    category: "Developers",
    question: "How do I set up webhooks for real-time booking events?",
    answer: "Go to Dashboard → Settings → Webhooks and add your endpoint URL. CalMeet sends HTTP POST payloads with HMAC-SHA256 signatures whenever bookings are created or canceled.",
    link: { label: "Webhook Settings", href: "/dashboard/settings?tab=webhooks" }
  },
  {
    id: "embed-widget",
    category: "Getting Started",
    question: "How do I embed my booking calendar on my website?",
    answer: "Use our lightweight iframe snippet or embed script. Simply copy the embed snippet from Resources → Embed and paste it into your React, Next.js, Webflow, or WordPress page.",
    link: { label: "Embed Guide", href: "/resources/embed" }
  },
];

const categories = ["All", "Getting Started", "Integrations", "Team Management", "Payments", "Developers"];

export default function HelpDocsPage() {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({ "gcal-sync": true });

  const toggleOpen = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCat = selectedCat === "All" || faq.category === selectedCat;
    const q = search.toLowerCase();
    const matchesSearch = faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-6">
            <Link href="/resources" className="hover:text-zinc-600 dark:hover:text-zinc-200">Resources</Link>
            <span>/</span>
            <span className="text-zinc-800 dark:text-zinc-200 font-medium">Help Documentation</span>
          </div>

          {/* Hero */}
          <div className="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold mb-3 border border-zinc-200 dark:border-zinc-700">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Knowledge Base & Guides</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              CalMeet Help Documentation
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mb-6">
              Step-by-step answers and guides to help you set up integrations, manage team availability, and configure developer webhooks.
            </p>

            {/* Search & Categories */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search articles and troubleshooting guides..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCat(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                      selectedCat === cat
                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100"
                        : "bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3 mb-12">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                <p className="text-xs text-zinc-400">No matching articles found. Try a different keyword.</p>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = !!openIds[faq.id];
                return (
                  <div
                    key={faq.id}
                    className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-2xs overflow-hidden"
                  >
                    <button
                      onClick={() => toggleOpen(faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <div className="pr-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1 block">
                          {faq.category}
                        </span>
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          {faq.question}
                        </h3>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-zinc-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {faq.answer}
                        </p>
                        {faq.link && (
                          <Link
                            href={faq.link.href}
                            className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors flex items-center gap-1"
                          >
                            {faq.link.label} <ArrowRight className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* CTA */}
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">Still have questions?</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Our 24/7 support team is available via live chat.</div>
            </div>
            <Button render={<Link href="/support" />} size="sm" className="h-9 px-4 text-xs font-semibold">
              Contact Support
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
