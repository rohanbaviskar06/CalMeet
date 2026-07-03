"use client";

import React, { createContext, useContext, useState, useTransition } from "react";
import { X, Check, ShieldAlert, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { upgradeToPro, downgradeToFree } from "@/app/actions/plan";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

  const handleUpgrade = async () => {
    startTransition(async () => {
      try {
        const res = await upgradeToPro();
        if (res.success) {
          toast.success("Successfully upgraded to Pro! Welcome to CalMeet Premium!");
          setIsOpen(false);
          // Hard reload or route refresh will be performed by router / revalidation
          window.location.reload();
        }
      } catch (err: any) {
        toast.error(err.message || "Something went wrong during upgrade.");
      }
    });
  };

  const handleDowngrade = async () => {
    startTransition(async () => {
      try {
        const res = await downgradeToFree();
        if (res.success) {
          toast.success("Sandbox simulation: Plan set back to FREE.");
          setIsOpen(false);
          window.location.reload();
        }
      } catch (err: any) {
        toast.error(err.message || "Something went wrong during downgrade.");
      }
    });
  };

  return (
    <PricingModalContext.Provider value={{ isOpen, openPricingModal, closePricingModal }}>
      {children}

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with modern glassmorphism blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePricingModal}
              className="absolute inset-0 bg-background/40 backdrop-blur-md dark:bg-black/60"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-zinc-200/80 bg-white/80 p-6 shadow-2xl backdrop-blur-xl dark:border-zinc-800/85 dark:bg-zinc-950/80 md:p-8"
            >
              {/* Close Button */}
              <button
                onClick={closePricingModal}
                className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-zinc-950 dark:hover:text-zinc-55 hover:scale-105 active:scale-95 transition-all"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Sandbox Plan Switcher for Ease of Testing */}
              <div className="mb-6 flex items-center gap-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-600 dark:text-amber-400">
                <ShieldAlert className="h-4 w-4 shrink-0 animate-pulse" />
                <div className="flex-1">
                  <span className="font-semibold">Developer Sandbox:</span> Toggle your plan instantly to test feature-gating restrictions. Current plan is <strong className="uppercase">{currentPlan}</strong>.
                </div>
                <div className="flex items-center gap-2">
                  {currentPlan === "PRO" ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleDowngrade} 
                      disabled={isPending}
                      className="h-7 text-[10px] bg-white border-amber-500/40 text-amber-700 hover:bg-amber-50 dark:bg-zinc-900"
                    >
                      {isPending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                      Reset to Free
                    </Button>
                  ) : (
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={handleUpgrade} 
                      disabled={isPending}
                      className="h-7 text-[10px] bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      {isPending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                      Simulate Pro Plan
                    </Button>
                  )}
                </div>
              </div>

              {/* Title & Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary mb-3">
                  <Sparkles className="h-3 w-3" /> Upgrade to Premium
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl text-zinc-900 dark:text-white">
                  Unlock all premium tools
                </h2>
                <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
                  Take control of your scheduling with automated workflows, smart routing forms, and full-funnel business analytics.
                </p>
              </div>

              {/* Grid of Plans */}
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                
                {/* Current Free Plan / Context */}
                <div className="flex flex-col rounded-2xl border border-zinc-150 dark:border-zinc-850 p-6 bg-zinc-50/50 dark:bg-zinc-900/30">
                  <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">Free Starter</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">$0</span>
                    <span className="ml-1 text-xs text-muted-foreground">/ forever</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">For simple scheduling and getting started.</p>
                  
                  <ul className="mt-6 space-y-3 flex-1">
                    {[
                      "1 Active Event Type",
                      "Unlimited bookings",
                      "Google Calendar Sync",
                      "Basic customize styles",
                    ].map((feat) => (
                      <li key={feat} className="flex items-center gap-2.5 text-xs">
                        <Check className="h-4 w-4 text-zinc-400 shrink-0" />
                        <span className="text-zinc-600 dark:text-zinc-350">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <Button variant="outline" className="w-full mt-6 bg-transparent pointer-events-none text-muted-foreground border-dashed">
                    {currentPlan === "FREE" ? "Current Plan" : "Basic Access"}
                  </Button>
                </div>

                {/* Gated Pro Tier */}
                <div className="flex flex-col rounded-2xl border-2 border-primary p-6 bg-white dark:bg-zinc-900 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[9px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wide">
                    Locked Premium Features
                  </div>
                  
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    Pro Plan <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Recommended</span>
                  </h3>
                  
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">$12</span>
                    <span className="ml-1 text-xs text-muted-foreground">/ month</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Designed for high performance scheduling automation.</p>

                  <ul className="mt-6 space-y-3 flex-1">
                    {[
                      "Unlimited Event Types & Bookings",
                      "Custom Workflow Automations (Zap)",
                      "Dynamic Routing Forms & Rep Router",
                      "Detailed Booking & Conversion Analytics",
                      "All Premium Integrations (Zoom, Webex)",
                      "Custom Domain & White labeling Branding",
                    ].map((feat) => (
                      <li key={feat} className="flex items-center gap-2.5 text-xs font-medium">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-zinc-800 dark:text-zinc-100">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    variant="default"
                    onClick={handleUpgrade}
                    disabled={isPending}
                    className="w-full mt-6 h-11 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold shadow-md hover:shadow-lg active:scale-98 transition-all"
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2 justify-center">
                        <Loader2 className="h-4 w-4 animate-spin" /> Upgrading...
                      </span>
                    ) : (
                      currentPlan === "PRO" ? "You Have Pro Access" : "Upgrade to Pro Plan"
                    )}
                  </Button>
                </div>

              </div>

              {/* Bottom Support / Info */}
              <div className="mt-8 text-center text-[10px] text-muted-foreground">
                All upgrades are fully sandbox-simulated. Need custom features or SSO for team coordination? <span className="text-primary cursor-pointer hover:underline" onClick={() => toast.info("Contacting team sales simulator...")}>Contact Enterprise Sales</span>.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PricingModalContext.Provider>
  );
}
