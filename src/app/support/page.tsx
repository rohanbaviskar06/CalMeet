"use client";

import { Navbar } from "@/components/landing/navbar";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  LifeBuoy, MessageSquare, Mail, BookOpen, Video,
  Search, ChevronRight, ChevronDown, Zap, Users, Settings,
  Calendar, CreditCard, Globe, ArrowRight, Clock, CheckCircle2
} from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    category: "Getting Started",
    icon: <Zap className="h-4 w-4" />,
    items: [
      { q: "How do I create my first event type?", a: "Go to your dashboard and click 'New Event Type'. Fill in the name, duration, and availability. Your booking link is instantly ready to share." },
      { q: "How do I share my booking link?", a: "Your booking link is available at calmeet.com/[your-username]. Copy it from the dashboard and share via email, LinkedIn, or anywhere else." },
      { q: "Can I connect my Google Calendar?", a: "Yes! Go to Settings → Integrations → Google Calendar. Once connected, CalMeet will automatically check your availability and add new bookings to your calendar." },
    ]
  },
  {
    category: "Billing & Plans",
    icon: <CreditCard className="h-4 w-4" />,
    items: [
      { q: "Can I upgrade or downgrade my plan anytime?", a: "Yes, you can change your plan at any time from Settings → Billing. Upgrades take effect immediately, downgrades apply at the next billing cycle." },
      { q: "Do you offer a free trial for Pro?", a: "Yes! All new accounts get a 14-day Pro trial with no credit card required. You can explore all Pro features and decide if it's right for you." },
      { q: "What payment methods do you accept?", a: "We accept all major credit and debit cards (Visa, Mastercard, Amex), as well as UPI and net banking for Indian customers." },
    ]
  },
  {
    category: "Integrations",
    icon: <Globe className="h-4 w-4" />,
    items: [
      { q: "Which video conferencing tools do you support?", a: "CalMeet integrates with Google Meet, Zoom, Microsoft Teams, and Cal Video (our built-in video solution)." },
      { q: "Can I use CalMeet with my existing CRM?", a: "Yes! We support Salesforce, HubSpot, and other CRMs via Zapier and our REST API. Enterprise plans get native integrations." },
      { q: "Is there a CalMeet API?", a: "Absolutely. Our REST API lets you create bookings, manage event types, and set up webhooks programmatically. Visit the Developers page for docs." },
    ]
  },
];

const resources = [
  { icon: <BookOpen className="h-5 w-5" />, title: "Documentation", desc: "Detailed guides for every feature", href: "/developers", color: "from-blue-500/20 to-indigo-500/20 border-blue-500/20" },
  { icon: <Video className="h-5 w-5" />, title: "Video Tutorials", desc: "Step-by-step walkthroughs", href: "#", color: "from-purple-500/20 to-pink-500/20 border-purple-500/20" },
  { icon: <Users className="h-5 w-5" />, title: "Community", desc: "Connect with other CalMeet users", href: "#", color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/20" },
  { icon: <Settings className="h-5 w-5" />, title: "API Reference", desc: "REST API for developers", href: "/developers", color: "from-orange-500/20 to-amber-500/20 border-orange-500/20" },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="border border-zinc-800 rounded-2xl overflow-hidden"
      layout
    >
      <button
        className="w-full flex items-center justify-between p-5 text-left hover:bg-zinc-800/50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-zinc-100 pr-4">{q}</span>
        <ChevronDown className={`h-4 w-4 text-zinc-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed">{a}</p>
      </motion.div>
    </motion.div>
  );
}

export default function SupportPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...faqs.map(f => f.category)];

  const filteredFaqs = faqs
    .map(section => ({
      ...section,
      items: section.items.filter(
        item =>
          (activeCategory === "All" || activeCategory === section.category) &&
          (search === "" || item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase()))
      )
    }))
    .filter(section => section.items.length > 0);

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-8"
          >
            <LifeBuoy className="h-4 w-4" />
            24/7 Support Available
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            How can we{" "}
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              help you?
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto"
          >
            Search our knowledge base or reach out directly. We typically respond within 2 minutes.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-2xl mx-auto"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-zinc-900 border border-zinc-700 rounded-2xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* Contact Channels */}
      <section className="container mx-auto px-4 max-w-5xl mb-20">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              icon: <MessageSquare className="h-6 w-6" />,
              title: "Live Chat",
              desc: "Get an instant answer from our team or chatbot.",
              badge: "~2 min",
              badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
              gradient: "from-violet-500/10 to-purple-500/10 hover:from-violet-500/20 hover:to-purple-500/20",
              border: "border-violet-500/20",
              action: "Start Chat"
            },
            {
              icon: <Mail className="h-6 w-6" />,
              title: "Email Support",
              desc: "Detailed questions? Send us an email anytime.",
              badge: "~4 hours",
              badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
              gradient: "from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20",
              border: "border-blue-500/20",
              action: "Send Email"
            },
            {
              icon: <Calendar className="h-6 w-6" />,
              title: "Book a Call",
              desc: "Schedule a 30-min call with a support specialist.",
              badge: "Enterprise",
              badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
              gradient: "from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20",
              border: "border-amber-500/20",
              action: "Schedule Call"
            },
          ].map((ch, i) => (
            <motion.div
              key={ch.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-6 rounded-2xl bg-gradient-to-br ${ch.gradient} border ${ch.border} cursor-pointer group transition-all`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-violet-400">
                  {ch.icon}
                </div>
                <span className={`text-xs px-3 py-1 rounded-full border font-medium ${ch.badgeColor}`}>
                  {ch.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{ch.title}</h3>
              <p className="text-sm text-zinc-400 mb-5">{ch.desc}</p>
              <button className="flex items-center gap-2 text-sm font-semibold text-white group-hover:gap-3 transition-all">
                {ch.action} <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Resources */}
      <section className="container mx-auto px-4 max-w-5xl mb-20">
        <h2 className="text-2xl font-bold text-white mb-6">Quick Resources</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {resources.map((r, i) => (
            <motion.a
              key={r.title}
              href={r.href}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-5 rounded-2xl bg-gradient-to-br ${r.color} border hover:scale-[1.02] transition-all group`}
            >
              <div className="text-zinc-300 mb-3 group-hover:text-white transition-colors">{r.icon}</div>
              <div className="font-semibold text-white text-sm mb-1">{r.title}</div>
              <div className="text-zinc-500 text-xs">{r.desc}</div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 max-w-4xl mb-24">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Frequently Asked Questions</h2>
          <p className="text-zinc-500">Everything you need to know about CalMeet.</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                activeCategory === cat
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="text-center py-16 text-zinc-600">
            <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>No results for &ldquo;{search}&rdquo;</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredFaqs.map(section => (
              <div key={section.category}>
                <div className="flex items-center gap-2 text-zinc-400 text-sm font-semibold mb-3 uppercase tracking-widest">
                  {section.icon}
                  {section.category}
                </div>
                <div className="space-y-2">
                  {section.items.map(item => (
                    <FAQItem key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 max-w-3xl mb-24">
        <div className="relative p-10 rounded-3xl bg-gradient-to-br from-violet-900/40 to-purple-900/20 border border-violet-500/20 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent pointer-events-none" />
          <CheckCircle2 className="h-10 w-10 text-violet-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Still need help?</h2>
          <p className="text-zinc-400 mb-6">Our team is online and ready to assist you right now.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-full font-semibold transition-colors flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Chat with Support
            </button>
            <a href="mailto:support@calmeet.com" className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full font-semibold transition-colors flex items-center gap-2 border border-zinc-700">
              <Mail className="h-4 w-4" /> support@calmeet.com
            </a>
          </div>
        </div>
      </section>

      {/* Footer note */}
      <div className="text-center text-zinc-600 text-xs pb-10">
        <Clock className="h-3 w-3 inline mr-1" />
        Support hours: 24/7 via chat · Mon–Fri 9am–6pm IST via phone
      </div>
    </div>
  );
}
