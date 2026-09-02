"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { 
  Building2, 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  Server, 
  CheckCircle2, 
  ArrowRight,
  Code2,
  Globe
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Enterprise SSO & SAML",
    description: "Enforce Single Sign-On via Okta, Google Workspace, Azure AD, or custom SAML 2.0 with automated directory provisioning (SCIM).",
    icon: KeyRound,
  },
  {
    title: "Custom Domain White-Labeling",
    description: "Host all booking pages on your own domain (e.g. meet.yourcompany.com) with 100% CalMeet brand removal.",
    icon: Globe,
  },
  {
    title: "Role-Based Access & Audit Logs",
    description: "Granular administrative privileges, departmental workspaces, and centralized security audit logs for all scheduling activity.",
    icon: ShieldCheck,
  },
  {
    title: "Dedicated APIs & Custom SLAs",
    description: "High-rate-limit REST APIs, signed webhooks with guaranteed delivery, 99.99% uptime SLA, and dedicated engineering support.",
    icon: Code2,
  },
];

export default function OrganizationsSolutionPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-6">
            <Link href="/solutions" className="hover:text-zinc-600 dark:hover:text-zinc-200">Solutions</Link>
            <span>/</span>
            <span className="text-zinc-800 dark:text-zinc-200 font-medium">Organizations</span>
          </div>

          {/* Hero Header */}
          <div className="mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold mb-3 border border-zinc-200 dark:border-zinc-700">
              <Building2 className="h-3.5 w-3.5" />
              <span>For Enterprise & Scale</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Enterprise-grade scheduling with complete control
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mb-6">
              Empower thousands of employees with standardized scheduling workflows while maintaining strict data governance, security compliance, and custom branding.
            </p>
            <div className="flex gap-3">
              <Button render={<Link href="/enterprise" />} size="sm" className="h-9 px-4 text-xs font-semibold">
                Contact Enterprise Sales <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
              <Button render={<Link href="/security" />} variant="outline" size="sm" className="h-9 px-4 text-xs font-semibold border-zinc-200 dark:border-zinc-800">
                Security & Compliance
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
              Enterprise Security & Governance
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "SSO / SAML 2.0 & SCIM directory sync",
                "Custom domain white-labeling",
                "GDPR, CCPA & SOC 2 compliant architecture",
                "Centralized audit logs & activity tracking",
                "Dedicated Customer Success Manager",
                "99.99% Uptime Service Level Agreement (SLA)",
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
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">Need a custom enterprise agreement?</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Our enterprise team can provide customized DPAs, SLAs, and security reviews.</div>
            </div>
            <Button render={<Link href="/enterprise" />} size="sm" className="h-9 px-4 text-xs font-semibold">
              Talk to Enterprise
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
