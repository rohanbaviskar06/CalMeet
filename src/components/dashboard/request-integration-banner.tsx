"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RequestIntegrationModal } from "./request-integration-modal";
import { Sparkles } from "lucide-react";

export function RequestIntegrationBanner() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900 text-white mt-12">
        {/* Glow blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/25 blur-[120px] rounded-full -mr-24 -mt-24 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/20 blur-[80px] rounded-full -ml-16 -mb-16 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 p-8">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">We're always improving</span>
            </div>
            <h3 className="text-2xl font-bold">Missing an integration?</h3>
            <p className="text-zinc-400 text-sm max-w-md leading-relaxed">
              We review every request. Tell us which app you'd like CalMeet to connect with — we'll prioritize based on demand.
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-1">
              {["Notion", "HubSpot", "Stripe", "Airtable"].map((app) => (
                <span key={app} className="px-2.5 py-0.5 rounded-full bg-white/10 text-xs text-zinc-300">
                  {app}
                </span>
              ))}
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-xs text-zinc-300">+ more</span>
            </div>
          </div>

          <Button
            onClick={() => setOpen(true)}
            className="bg-white text-black hover:bg-zinc-100 rounded-full px-8 font-bold gap-2 shrink-0 shadow-xl"
          >
            <Sparkles className="h-4 w-4" />
            Request Integration
          </Button>
        </div>
      </div>

      <RequestIntegrationModal open={open} onOpenChange={setOpen} />
    </>
  );
}
