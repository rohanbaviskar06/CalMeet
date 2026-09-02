"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { CreditCard, ShieldCheck, DollarSign, CheckCircle2, ArrowRight, Sparkles, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  {
    title: "Upfront Consultation Payments",
    description: "Require payments before meeting slots are confirmed. Slash client no-show rates to virtually zero.",
    icon: CreditCard,
  },
  {
    title: "Razorpay & Stripe Gateways",
    description: "Accept payments globally in USD, EUR, GBP via Stripe, or in INR via UPI, NetBanking, and RuPay cards via Razorpay.",
    icon: Globe,
  },
  {
    title: "Automated Refunds & Invoicing",
    description: "Automatic receipt generation and one-click refund processing if meetings are canceled within your allowed policy window.",
    icon: DollarSign,
  },
  {
    title: "Secure PCI-DSS Compliant Checkout",
    description: "All payment credentials are processed directly through certified PCI-DSS Level 1 compliant processors — zero card data touches your servers.",
    icon: Lock,
  },
];

export default function PaymentsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-6">
            <Link href="/resources" className="hover:text-zinc-600 dark:hover:text-zinc-200">Resources</Link>
            <span>/</span>
            <span className="text-zinc-800 dark:text-zinc-200 font-medium">Payments</span>
          </div>

          {/* Hero */}
          <div className="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold mb-3 border border-zinc-200 dark:border-zinc-700">
              <CreditCard className="h-3.5 w-3.5" />
              <span>Paid Bookings & Consultations</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Monetize your time with integrated payments
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mb-6">
              Charge for consultations, legal advice, coaching, and expert sessions upfront. Connect Razorpay or Stripe in minutes.
            </p>
            <div className="flex gap-3">
              <Button render={<Link href="/signup" />} size="sm" className="h-9 px-4 text-xs font-semibold">
                Start Accepting Payments <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>

          {/* 4 Feature Cards */}
          <div className="grid sm:grid-cols-2 gap-3 mb-12">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-2"
                >
                  <div className="w-7 h-7 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{f.title}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>

          {/* Checklist Box */}
          <div className="mb-12 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 p-6 shadow-2xs">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide mb-4">
              Payment Gateway Features
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Custom pricing per event type (INR / USD)",
                "Instant UPI, Card, NetBanking & International support",
                "Automated booking confirmation on payment success",
                "Custom cancellation and refund windows",
                "Real-time revenue tracking in dashboard analytics",
                "Zero hidden transaction platform fees",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">Ready to charge for your expertise?</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Connect your Razorpay or Stripe account in Settings to get started.</div>
            </div>
            <Button render={<Link href="/signup" />} size="sm" className="h-9 px-4 text-xs font-semibold">
              Get Started Free
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
