"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus, MessageCircle } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "Is CalMeet really free to start?",
    answer:
      "Yes — CalMeet's free plan includes unlimited one-on-one event types, your personal booking link, and Google/Outlook calendar sync. No credit card required. Upgrade to Pro when you need advanced features like team scheduling, payments, or custom branding.",
  },
  {
    question: "How does the calendar sync work?",
    answer:
      "CalMeet connects to your Google or Outlook calendar via OAuth (no passwords stored). It reads your busy times in real-time to prevent double bookings, and writes new meetings back to your calendar automatically when someone books.",
  },
  {
    question: "Can I accept payments before a meeting?",
    answer:
      "Yes. Connect Stripe to your account and add a price to any event type. CalMeet will collect payment during the booking flow — the meeting is only confirmed once payment succeeds. Great for consultants, coaches, and service providers.",
  },
  {
    question: "What happens when someone books a meeting with me?",
    answer:
      "Both you and your guest receive an instant email confirmation with all the meeting details. If you use Google Meet or Zoom, a unique video link is auto-generated and included in the invite. Your calendar is updated automatically.",
  },
  {
    question: "Can I customize my booking page?",
    answer:
      "On the Pro plan, yes. You can set a custom URL (yourbrand.calmeet.app), upload a logo, choose brand colors, and add a profile photo. Your booking page will look like a natural extension of your brand.",
  },
  {
    question: "Does CalMeet work for teams?",
    answer:
      "Absolutely. CalMeet for Teams supports round-robin scheduling, collective availability, and shared team pages. You can route incoming bookings to the right team member automatically based on load or availability.",
  },
  {
    question: "How do I embed CalMeet on my website?",
    answer:
      "Go to any event type, click 'Share', and choose 'Embed'. You'll get a snippet of HTML you can paste into your site. Options include an inline calendar, a floating button, or a popup — all responsive and fully branded.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_1.8fr] gap-16 items-start">
          {/* Left — sticky header */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-28 space-y-6"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                FAQ
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                Questions we <br /> hear all the time
              </h2>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                Everything you need to know before you get started. Can't find your answer?
              </p>
            </div>

            {/* Contact support card */}
            <div className="p-5 rounded-2xl border bg-muted/30 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-sm">Still have questions?</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Our team is online and happy to help within minutes.
                </p>
              </div>
              <Link
                href="/solutions/support"
                className="inline-block text-xs font-bold text-primary hover:underline underline-offset-4"
              >
                Chat with support →
              </Link>
            </div>
          </motion.div>

          {/* Right — accordion */}
          <div className="space-y-2">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen ? "bg-card shadow-md border-primary/20" : "bg-transparent hover:bg-muted/30"
                  }`}
                >
                  <button
                    onClick={() => toggle(index)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className={`font-semibold text-sm leading-snug transition-colors ${isOpen ? "text-primary" : ""}`}>
                      {faq.question}
                    </span>
                    <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      {isOpen ? (
                        <Minus className="h-3.5 w-3.5" />
                      ) : (
                        <Plus className="h-3.5 w-3.5" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-5 pb-5">
                          <div className="border-t border-border/50 pt-4">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
