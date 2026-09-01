"use client";

import React, { createContext, useContext, useState, useTransition } from "react";
import { X, Check, ShieldAlert, Sparkles, Loader2, Users, Building2, ShieldCheck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { setUserPlan, PlanType } from "@/app/actions/plan";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PricingModalContextType {
  isOpen: boolean;
  openPricingModal: () => void;
  closePricingModal: () => void;
}

const PricingModalContext = createContext<PricingModalContextType | undefined>(undefined);

export function usePricingModal() {
  const context = useContext(PricingModalContext);
  if (!context) {
    throw new Error("usePricingModal must be used within a PricingModalProvider");
  }
  return context;
}

export function PricingModalProvider({ 
  children,
  currentPlan = "FREE"
}: { 
  children: React.ReactNode;
  currentPlan?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const openPricingModal = () => setIsOpen(true);
  const closePricingModal = () => setIsOpen(false);

  const handleSelectPlan = async (targetPlan: PlanType) => {
    startTransition(async () => {
      try {
        const res = await setUserPlan(targetPlan);
        if (res.success) {
          toast.success(`Sandbox: Active plan switched to ${targetPlan}!`);
          setIsOpen(false);
          window.location.reload();
        }
      } catch (err: any) {
        toast.error(err.message || "Something went wrong changing plan.");
      }
    });
  };

  const modalPlans = [
    {
      id: "FREE" as PlanType,
      name: "Individuals",
      price: "$0",
      suffix: "/ forever",
      desc: "For solo professionals & freelancers.",
      features: [
        "Unlimited bookings & event types",
        "Google & Outlook Calendar sync",
        "Google Meet, Zoom & Cal Video",
        "Standard CalMeet watermark"
      ],
      buttonLabel: "Select Free",
      isPopular: false
    },
    {
      id: "PRO" as PlanType,
      name: "Teams",
      price: "$12",
      suffix: "/ user / mo",
      desc: "For collaborative teams & startups.",
      features: [
        "Collective & Round-robin routing",
        "1 Team with unlimited invites",
        "Remove CalMeet watermark",
        "Automated SMS/Email workflows",
        "Dynamic routing forms",
        "Advanced booking analytics",
        "Webhooks & developer API keys"
      ],
      buttonLabel: "Switch to Teams",
      isPopular: true
    },
    {
      id: "ORGANIZATION" as PlanType,
      name: "Organizations",
      price: "$28",
      suffix: "/ user / mo",
      desc: "For scaling multi-team companies.",
      features: [
        "Everything in Teams, plus:",
        "Unlimited sub-teams & departments",
        "Company subdomain (company.calmeet.com)",
        "SAML SSO & SCIM directory sync",
        "Role-Based Access Control (RBAC)",
        "CRM routing & weighted distribution",
        "24/7 Priority SLA support"
      ],
      buttonLabel: "Switch to Org",
      isPopular: false
    },
    {
      id: "ENTERPRISE" as PlanType,
      name: "Enterprise",
      price: "Custom",
      suffix: "tailored",
      desc: "For high security & custom compliance.",
      features: [
        "Everything in Organizations, plus:",
        "Dedicated CSM & onboarding engineer",
        "99.99% Uptime SLA guarantee",
        "SOC2 & HIPAA BAA compliance",
        "Dedicated Slack Connect channel"
      ],
      buttonLabel: "Select Enterprise",
      isPopular: false
    }
  ];

  return (
    <PricingModalContext.Provider value={{ isOpen, openPricingModal, closePricingModal }}>
      {children}

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePricingModal}
              className="absolute inset-0 bg-background/60 backdrop-blur-md dark:bg-black/75"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: "spring", duration: 0.45 }}
              className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-2xl backdrop-blur-2xl dark:border-zinc-800 dark:bg-zinc-950 md:p-8"
            >
              {/* Close Button */}
              <button
                onClick={closePricingModal}
                className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Developer Sandbox Plan Quick-Switcher */}
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3.5 text-xs text-amber-700 dark:text-amber-300">
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="h-4 w-4 shrink-0 animate-pulse text-amber-600 dark:text-amber-400" />
                  <div>
                    <span className="font-bold">Sandbox Plan Simulator:</span> Test feature-gating restrictions. Current plan is <strong className="uppercase font-mono bg-amber-500/20 px-2 py-0.5 rounded text-amber-900 dark:text-amber-200">{currentPlan}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(["FREE", "PRO", "ORGANIZATION", "ENTERPRISE"] as PlanType[]).map((p) => (
                    <Button
                      key={p}
                      size="sm"
                      variant={currentPlan === p ? "default" : "outline"}
                      onClick={() => handleSelectPlan(p)}
                      disabled={isPending || currentPlan === p}
                      className={cn(
                        "h-7 text-[10px] px-2.5 font-bold uppercase",
                        currentPlan === p && "bg-amber-600 hover:bg-amber-700 text-white border-transparent"
                      )}
                    >
                      {isPending && currentPlan === p && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                      {p === "PRO" ? "Teams" : p === "ORGANIZATION" ? "Org" : p}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Title & Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary mb-3">
                  <Sparkles className="h-3 w-3" /> Compare CalMeet Plans
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                  Upgrade your scheduling power
                </h2>
                <p className="mt-1.5 text-xs md:text-sm text-muted-foreground max-w-xl mx-auto">
                  Unlock automated reminders, round-robin team scheduling, smart routing forms, and white-label branding.
                </p>
              </div>

              {/* Grid of Plans */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {modalPlans.map((plan) => {
                  const isCurrent = currentPlan === plan.id;
                  return (
                    <div 
                      key={plan.id}
                      className={cn(
                        "flex flex-col rounded-2xl border p-5 transition-all relative overflow-hidden",
                        plan.isPopular 
                          ? "border-primary shadow-lg bg-primary/[0.02] dark:bg-primary/[0.04] ring-1 ring-primary/30" 
                          : "border-border bg-card/60",
                        isCurrent && "ring-2 ring-emerald-500/50 border-emerald-500/40"
                      )}
                    >
                      {plan.isPopular && (
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[8px] font-extrabold px-2.5 py-0.5 rounded-bl-lg uppercase tracking-wide">
                          Popular
                        </div>
                      )}
                      {isCurrent && (
                        <div className="absolute top-0 left-0 bg-emerald-500 text-white text-[8px] font-extrabold px-2.5 py-0.5 rounded-br-lg uppercase tracking-wide">
                          Active Plan
                        </div>
                      )}

                      <div className="pt-2">
                        <h3 className="text-base font-bold text-foreground">{plan.name}</h3>
                        <div className="mt-2 flex items-baseline">
                          <span className="text-2xl font-extrabold text-foreground">{plan.price}</span>
                          <span className="ml-1 text-[10px] text-muted-foreground">{plan.suffix}</span>
                        </div>
                        <p className="mt-1 text-[11px] text-muted-foreground min-h-[30px]">{plan.desc}</p>
                      </div>

                      <div className="w-full h-px bg-border/60 my-4" />

                      <ul className="space-y-2 flex-1 text-[11px]">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{feat}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        size="sm"
                        variant={isCurrent ? "outline" : plan.isPopular ? "default" : "outline"}
                        disabled={isPending || isCurrent}
                        onClick={() => handleSelectPlan(plan.id)}
                        className={cn(
                          "w-full mt-5 h-9 text-xs font-bold rounded-xl",
                          isCurrent && "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 pointer-events-none"
                        )}
                      >
                        {isPending ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin mx-auto" />
                        ) : isCurrent ? (
                          "Current Plan"
                        ) : (
                          plan.buttonLabel
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Support / Info */}
              <div className="mt-6 pt-4 border-t border-border/60 text-center text-[11px] text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
                <span>Want to see full feature comparison matrix?</span>
                <Link href="/pricing" target="_blank" className="text-primary hover:underline font-semibold inline-flex items-center gap-1">
                  View full pricing table <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PricingModalContext.Provider>
  );
}
