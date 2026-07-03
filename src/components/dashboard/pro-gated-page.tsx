"use client";

import { usePricingModal } from "@/components/dashboard/pricing-modal";
import { Lock, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProGatedPageProps {
  title: string;
  description: string;
  features: string[];
}

export function ProGatedPage({ title, description, features }: ProGatedPageProps) {
  const { openPricingModal } = usePricingModal();

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <Card className="relative w-full max-w-2xl overflow-hidden border border-zinc-200/80 bg-white/70 shadow-2xl backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/70 p-8 text-center rounded-3xl">
        {/* Abstract background blobs */}
        <div className="absolute -left-16 -top-16 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-16 -bottom-16 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />

        <CardContent className="space-y-6 pt-6 relative z-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary animate-pulse">
            <Lock className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
              <Sparkles className="h-3 w-3" /> Premium Feature
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Unlock {title}
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              {description}
            </p>
          </div>

          <div className="mx-auto max-w-sm rounded-2xl border border-zinc-150/60 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 p-5 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">Included with Pro:</h4>
            <ul className="space-y-2.5">
              {features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2">
            <Button
              onClick={openPricingModal}
              className="h-11 px-8 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold shadow-md hover:shadow-lg active:scale-98 transition-all"
            >
              View Pricing Options
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
