"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  X, 
  Sparkles, 
  Users, 
  Building2, 
  ShieldCheck, 
  Zap, 
  Calendar, 
  ChevronDown, 
  HelpCircle, 
  ArrowRight,
  Shield,
  Layers,
  Sliders,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface PlanTier {
  id: string;
  name: string;
  badge?: string;
  description: string;
  monthlyPrice: number | string;
  annualPrice: number | string;
  priceSuffix: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
  popular?: boolean;
  isEnterprise?: boolean;
}

const plans: PlanTier[] = [
  {
    id: "free",
    name: "Individuals",
    description: "For solo professionals, freelancers, and individuals managing their personal schedules.",
    monthlyPrice: "$0",
    annualPrice: "$0",
    priceSuffix: "/ forever",
    features: [
      "Unlimited Event Types & Bookings",
      "Google Calendar & Conflict Check",
      "Google Meet, Zoom & Cal Video",
      "Standard Email Confirmations",
      "Embeddable Booking Widgets",
      "Accept Payments (Razorpay / Stripe)",
      "Standard CalMeet Watermark"
    ],
    ctaText: "Get Started Free",
    ctaHref: "/signup",
    popular: false
  },
  {
    id: "teams",
    name: "Teams",
    badge: "Most Popular",
    description: "For startups and fast-moving teams who need shared scheduling, automated reminders, and routing.",
    monthlyPrice: "$15",
    annualPrice: "$12",
    priceSuffix: "/ user / month",
    features: [
      "Everything in Individuals, plus:",
      "Collective & Round-Robin Scheduling",
      "1 Team with Unlimited Invitations",
      "Remove CalMeet Watermark (White-label)",
      "Automated Workflows (SMS & Email Reminders)",
      "Smart Routing Forms with Conditional Logic",
      "Advanced Analytics (Heatmap & Conversion)",
      "Developer Webhooks & API Keys",
      "Priority Email Support"
    ],
    ctaText: "Start 14-Day Free Trial",
    ctaHref: "/signup?plan=teams",
    popular: true
  },
  {
    id: "organizations",
    name: "Organizations",
    badge: "For Scaling Companies",
    description: "For scaling companies requiring centralized management, subdomains, and multiple departments.",
    monthlyPrice: "$35",
    annualPrice: "$28",
    priceSuffix: "/ user / month",
    features: [
      "Everything in Teams, plus:",
      "Unlimited Sub-Teams & Departments",
      "Company Subdomain (e.g. company.calmeet.com)",
      "SAML SSO & SCIM Directory Sync",
      "Role-Based Access Control (RBAC)",
      "CRM Routing & Weighted Distribution",
      "Audit Logs & Security Compliance",
      "24/7 Priority SLA Support"
    ],
    ctaText: "Get Started with Org",
    ctaHref: "/signup?plan=organizations",
    popular: false
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations with strict security, custom infrastructure, and dedicated compliance requirements.",
    monthlyPrice: "Custom",
    annualPrice: "Custom",
    priceSuffix: "tailored quote",
    features: [
      "Everything in Organizations, plus:",
      "Dedicated Account Manager & CSM",
      "99.99% Uptime SLA Guarantee",
      "SOC2 Type II, HIPAA BAA & GDPR Pack",
      "Private Cloud & Self-Hosting Options",
      "Custom Invoicing, PO & Master Service Agreement",
      "Dedicated Slack Connect Channel"
    ],
    ctaText: "Contact Enterprise Sales",
    ctaHref: "/enterprise",
    popular: false,
    isEnterprise: true
  }
];

interface ComparisonCategory {
  name: string;
  features: {
    title: string;
    description?: string;
    free: string | boolean;
    teams: string | boolean;
    org: string | boolean;
    enterprise: string | boolean;
  }[];
}

const comparisonData: ComparisonCategory[] = [
  {
    name: "Core Scheduling",
    features: [
      { title: "Monthly Bookings", free: "Unlimited", teams: "Unlimited", org: "Unlimited", enterprise: "Unlimited" },
      { title: "Active Event Types", free: "Unlimited", teams: "Unlimited", org: "Unlimited", enterprise: "Unlimited" },
      { title: "Calendar Sync (Google/Outlook)", free: true, teams: true, org: true, enterprise: true },
      { title: "Conferencing (Meet, Zoom, Cal Video)", free: true, teams: true, org: true, enterprise: true },
      { title: "Payment Collection (Stripe/Razorpay)", free: true, teams: true, org: true, enterprise: true },
      { title: "Embed Widgets (Inline, Popup, Button)", free: true, teams: true, org: true, enterprise: true },
      { title: "Out of Office & Away Redirect", free: true, teams: true, org: true, enterprise: true }
    ]
  },
  {
    name: "Team Collaboration",
    features: [
      { title: "Team Scheduling & Seats", free: "Solo (1 seat)", teams: "Unlimited Seats", org: "Unlimited Seats", enterprise: "Unlimited Seats" },
      { title: "Round-Robin Scheduling", free: false, teams: true, org: true, enterprise: true },
      { title: "Collective Group Scheduling", free: false, teams: true, org: true, enterprise: true },
      { title: "Multi-Department Sub-Teams", free: false, teams: "1 Team", org: "Unlimited Sub-Teams", enterprise: "Unlimited Sub-Teams" },
      { title: "Admin & Member Role Hierarchy", free: false, teams: true, org: true, enterprise: true }
    ]
  },
  {
    name: "Automations & Workflows",
    features: [
      { title: "Automated Email & SMS Reminders", free: false, teams: true, org: true, enterprise: true },
      { title: "Post-Meeting Follow-up Triggers", free: false, teams: true, org: true, enterprise: true },
      { title: "Routing Forms with Conditional Logic", free: false, teams: true, org: true, enterprise: true },
      { title: "Developer Webhooks", free: false, teams: true, org: true, enterprise: true },
      { title: "API Keys & Custom Scripts", free: false, teams: true, org: true, enterprise: true }
    ]
  },
  {
    name: "Customization & Branding",
    features: [
      { title: "Remove CalMeet Watermark", free: false, teams: true, org: true, enterprise: true },
      { title: "Custom Brand Accent Color", free: true, teams: true, org: true, enterprise: true },
      { title: "Company Subdomain (company.calmeet.com)", free: false, teams: false, org: true, enterprise: true },
      { title: "Custom CNAME Domain", free: false, teams: false, org: true, enterprise: true },
      { title: "Custom Email Notification Templates", free: false, teams: true, org: true, enterprise: true }
    ]
  },
  {
    name: "Security, Governance & Support",
    features: [
      { title: "SAML Single Sign-On (SSO)", free: false, teams: false, org: true, enterprise: true },
      { title: "SCIM User Provisioning", free: false, teams: false, org: true, enterprise: true },
      { title: "Role-Based Access Control (RBAC)", free: false, teams: false, org: true, enterprise: true },
      { title: "Audit Logs & Activity Trail", free: false, teams: false, org: true, enterprise: true },
      { title: "Dedicated SLA Uptime Guarantee", free: false, teams: false, org: "99.9%", enterprise: "99.99% Guaranteed" },
      { title: "Support Level", free: "Community", teams: "Priority Email", org: "24/7 Priority", enterprise: "Dedicated Slack & CSM" }
    ]
  }
];

const faqs = [
  {
    q: "Can I switch between plans or cancel at any time?",
    a: "Yes, you can upgrade, downgrade, or cancel your subscription at any time directly in your dashboard settings. If you cancel, you will continue to have full access to your plan until the end of your billing cycle."
  },
  {
    q: "How does the 14-day free trial work?",
    a: "When you sign up for Teams or Organizations, you get 14 days of unlimited access to test all premium features with your team. No surprise charges, and you can switch to Free at any time."
  },
  {
    q: "Do you offer discounts for non-profits and educational institutions?",
    a: "Yes! We offer a 50% discount for registered non-profits, open-source projects, and accredited schools. Reach out to our support team to activate your discount."
  },
  {
    q: "Can I invite team members and pay per seat?",
    a: "Absolutely. On the Teams and Organizations plans, you can invite colleagues at any time. Billing is pro-rated automatically so you only pay for the active seats you need."
  },
  {
    q: "How easy is it to migrate from Calendly or Cal.com?",
    a: "Very simple! Once you connect your Google Calendar, your event types and availability sync immediately. You can start sharing CalMeet links in under 2 minutes."
  }
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/10">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-4 py-1 text-xs font-bold text-primary mb-4">
              <Sparkles className="h-3.5 w-3.5" /> Flexible Plans for Individuals and Teams
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
              Simple, transparent pricing <br />
              <span className="text-muted-foreground font-serif italic">built to scale with you.</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Start free with unlimited 1-on-1 scheduling, or upgrade to Teams & Organizations for collaborative routing, automated workflows, and enterprise compliance.
            </p>

            {/* Annual / Monthly Toggle Switch */}
            <div className="mt-8 inline-flex items-center gap-3 bg-muted/60 p-1.5 rounded-full border border-border/80 shadow-inner">
              <button
                onClick={() => setIsAnnual(false)}
                className={cn(
                  "px-5 py-2 rounded-full text-xs font-bold transition-all duration-200",
                  !isAnnual 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={cn(
                  "px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2",
                  isAnnual 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>Annual Billing</span>
                <span className="bg-emerald-400 text-emerald-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24 items-stretch">
            {plans.map((plan, index) => {
              const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="flex"
                >
                  <div className={cn(
                    "flex flex-col w-full relative overflow-hidden transition-all duration-300 rounded-3xl border p-6 bg-card justify-between",
                    plan.popular 
                      ? "border-primary shadow-2xl ring-2 ring-primary/20 scale-102 z-10 bg-primary/[0.01]" 
                      : "border-border hover:border-border/80 hover:shadow-lg"
                  )}>
                    {plan.badge && (
                      <div className={cn(
                        "absolute top-0 right-0 text-[10px] font-extrabold px-3.5 py-1 rounded-bl-xl uppercase tracking-wider",
                        plan.popular ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        {plan.badge}
                      </div>
                    )}

                    <div>
                      {/* Plan Name & Header */}
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                        <div className="mt-3 flex items-baseline">
                          <span className="text-4xl font-extrabold tracking-tight text-foreground">{price}</span>
                          <span className="ml-1.5 text-xs text-muted-foreground font-medium">{plan.priceSuffix}</span>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed min-h-[38px]">
                          {plan.description}
                        </p>
                      </div>

                      {/* Primary CTA Button placed right below price/description */}
                      <div className="mt-5 mb-6">
                        <Link href={plan.ctaHref} className="w-full block">
                          <Button 
                            variant={plan.popular ? "default" : "outline"} 
                            className={cn(
                              "w-full h-11 text-xs font-bold rounded-2xl transition-all shadow-sm",
                              plan.popular && "bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/25"
                            )}
                          >
                            {plan.ctaText}
                          </Button>
                        </Link>
                      </div>

                      {/* Divider */}
                      <div className="w-full h-px bg-border/60 mb-5" />

                      {/* Feature Checklist */}
                      <ul className="space-y-3">
                        {plan.features.map((feature, fIdx) => {
                          const isHeading = feature.includes("plus:");
                          return (
                            <li key={fIdx} className={cn("flex items-start gap-2.5 text-xs", isHeading && "font-bold text-foreground pt-1")}>
                              {!isHeading && (
                                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                              )}
                              <span className={cn(isHeading ? "text-primary text-[11px] uppercase tracking-wider" : "text-muted-foreground")}>
                                {feature}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Full Feature Comparison Matrix Section */}
          <section className="mb-28">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                Compare all features side-by-side
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                Detailed breakdown of every feature, integration, and security standard across all CalMeet tiers.
              </p>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-xl">
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-xs">
                    <th className="py-5 px-6 font-bold w-2/5">Feature Category</th>
                    <th className="py-5 px-4 font-bold text-center w-[15%]">Individuals</th>
                    <th className="py-5 px-4 font-bold text-center w-[15%] text-primary">Teams</th>
                    <th className="py-5 px-4 font-bold text-center w-[15%]">Organizations</th>
                    <th className="py-5 px-4 font-bold text-center w-[15%]">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-xs">
                  {comparisonData.map((category, catIdx) => (
                    <React.Fragment key={catIdx}>
                      <tr className="bg-muted/60">
                        <td colSpan={5} className="py-3 px-6 font-bold uppercase tracking-wider text-[11px] text-foreground">
                          {category.name}
                        </td>
                      </tr>
                      {category.features.map((item, itemIdx) => (
                        <tr key={itemIdx} className="hover:bg-muted/20 transition-colors">
                          <td className="py-3.5 px-6 font-medium text-foreground">
                            <div>{item.title}</div>
                            {item.description && (
                              <div className="text-[10px] text-muted-foreground mt-0.5">{item.description}</div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {renderCellValue(item.free)}
                          </td>
                          <td className="py-3.5 px-4 text-center bg-primary/[0.02]">
                            {renderCellValue(item.teams)}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {renderCellValue(item.org)}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {renderCellValue(item.enterprise)}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="max-w-4xl mx-auto mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold tracking-tight mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground text-sm">
                Have questions about our plans, billing, or features? We're here to help.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div 
                    key={idx}
                    className="border border-border rounded-2xl bg-card overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm hover:text-primary transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform duration-200 text-muted-foreground", isOpen && "rotate-180 text-primary")} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-5 pb-5 text-xs text-muted-foreground leading-relaxed border-t border-border/40 pt-3"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Bottom Conversion CTA */}
          <section className="rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white p-10 md:p-16 text-center relative overflow-hidden border border-zinc-800 shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                Ready to automate your scheduling?
              </h2>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                Join thousands of individuals and teams streamlining their meetings, routing leads, and eliminating booking friction.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-12 px-8 rounded-full font-bold shadow-lg shadow-primary/30">
                    Get Started Free <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
                <Link href="/enterprise" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-full font-bold border-zinc-700 hover:bg-zinc-800 text-white">
                    Talk to Enterprise Sales
                  </Button>
                </Link>
              </div>
            </div>
          </section>

        </div>
      </main>

      <footer className="py-12 border-t bg-muted/40">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} CalMeet Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function renderCellValue(val: string | boolean) {
  if (val === true) {
    return <Check className="h-4 w-4 text-primary mx-auto" />;
  }
  if (val === false) {
    return <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />;
  }
  return <span className="font-semibold text-foreground">{val}</span>;
}
