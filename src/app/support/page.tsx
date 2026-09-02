"use client";

import { Navbar } from "@/components/landing/navbar";
import { useState } from "react";
import {
  LifeBuoy, MessageSquare, Mail, BookOpen,
  Search, ChevronDown, Clock, CheckCircle2,
  Zap, CreditCard, Globe, ArrowRight
} from "lucide-react";

const faqs = [
  {
    category: "Getting Started",
    items: [
      {
        q: "How do I create my first event type?",
        a: "Go to your dashboard and click 'New Event Type'. Fill in the name, duration, and availability. Your booking link is instantly ready to share."
      },
      {
        q: "How do I share my booking link?",
        a: "Your booking link is available at calmeet.com/[your-username]. Copy it from the dashboard and share via email, LinkedIn, or anywhere else."
      },
      {
        q: "Can I connect my Google Calendar?",
        a: "Yes. Go to Settings → Integrations → Google Calendar. Once connected, CalMeet will automatically check your availability and add confirmed bookings to your calendar."
      },
    ]
  },
  {
    category: "Billing & Plans",
    items: [
      {
        q: "Can I upgrade or downgrade my plan anytime?",
        a: "Yes, you can change your plan at any time from Settings → Billing. Upgrades take effect immediately, downgrades apply at the next billing cycle."
      },
      {
        q: "Do you offer a free trial for Pro?",
        a: "Yes. All new accounts get a 14-day Pro trial with no credit card required. You can explore all Pro features and decide if it's right for you."
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit/debit cards (Visa, Mastercard, Amex), as well as UPI and net banking for Indian customers."
      },
    ]
  },
  {
    category: "Integrations",
    items: [
      {
        q: "Which video conferencing tools do you support?",
        a: "CalMeet integrates with Google Meet, Zoom, Microsoft Teams, and Cal Video (our built-in video solution)."
      },
      {
        q: "Is there a CalMeet API?",
        a: "Yes. Our REST API lets you create bookings, manage event types, and set up webhooks programmatically. Visit the Developers page for full documentation."
      },
      {
        q: "Can I embed my booking page on my website?",
        a: "Yes. From any event type, click the Embed option and copy the iframe snippet. It works on any website or Notion page."
      },
    ]
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800 last:border-0">
      <button
        className="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="pr-6">{q}</span>
        <ChevronDown className={`h-4 w-4 text-zinc-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <p className="pb-4 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed pr-8">{a}</p>
      )}
    </div>
  );
}

export default function SupportPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...faqs.map(f => f.category)];

  const filteredFaqs = faqs
    .map(section => ({
      ...section,
      items: section.items.filter(item =>
        (activeCategory === "All" || activeCategory === section.category) &&
        (search === "" ||
          item.q.toLowerCase().includes(search.toLowerCase()) ||
          item.a.toLowerCase().includes(search.toLowerCase()))
      )
    }))
    .filter(section => section.items.length > 0);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Header */}
          <div className="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-3">
              <LifeBuoy className="h-3.5 w-3.5" />
              <span>Help Center</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
              Support
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
              Find answers to common questions, or reach out to our team directly. We typically respond within 2 minutes via live chat.
            </p>
          </div>

          {/* Contact Channels */}
          <div className="grid sm:grid-cols-3 gap-3 mb-10">
            {[
              {
                icon: <MessageSquare className="h-4 w-4" />,
                title: "Live Chat",
                desc: "Talk to our team in real time.",
                badge: "~2 min",
                action: "Start chat →"
              },
              {
                icon: <Mail className="h-4 w-4" />,
                title: "Email",
                desc: "Send us a detailed question.",
                badge: "~4 hrs",
                action: "support@calmeet.com"
              },
              {
                icon: <BookOpen className="h-4 w-4" />,
                title: "Documentation",
                desc: "Browse our developer guides.",
                badge: "Always open",
                action: "View docs →"
              },
            ].map(ch => (
              <div
                key={ch.title}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-2xs"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-7 h-7 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                    {ch.icon}
                  </div>
                  <span className="text-[10px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">{ch.badge}</span>
                </div>
                <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-0.5">{ch.title}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">{ch.desc}</div>
                <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{ch.action}</div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Frequently Asked Questions</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Everything you need to know about CalMeet.</p>

            {/* Search */}
            <div className="relative mb-5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    activeCategory === cat
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100"
                      : "bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                <Search className="h-8 w-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-2" />
                <p className="text-sm text-zinc-400">No results for &ldquo;{search}&rdquo;</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredFaqs.map(section => (
                  <div key={section.category}>
                    <div className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">
                      {section.category}
                    </div>
                    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 px-4 shadow-2xs">
                      {section.items.map(item => (
                        <FAQItem key={item.q} q={item.q} a={item.a} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">Still need help?</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Our support team is online and ready to help.</div>
            </div>
            <div className="flex gap-2">
              <a
                href="mailto:support@calmeet.com"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                <Mail className="h-3.5 w-3.5" /> Email us
              </a>
            </div>
          </div>

          <div className="mt-6 text-center text-[11px] text-zinc-400">
            <Clock className="h-3 w-3 inline mr-1" />
            Chat available 24/7 · Email support Mon–Fri 9am–6pm IST
          </div>
        </div>
      </main>
    </div>
  );
}
