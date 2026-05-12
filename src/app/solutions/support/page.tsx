"use client";

import { Navbar } from "@/components/landing/navbar";
import { Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SupportPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <section className="container mx-auto px-4 max-w-4xl text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 text-green-600 border border-green-500/20">
            <Headphones className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 italic font-serif">MeetMe for Support</h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Delight your customers with instant support. Resolve issues faster by letting customers book technical sessions with the right expert.
          </p>
          <Button size="lg" className="rounded-full bg-green-600 hover:bg-green-700 px-10 text-white">Elevate Your CS</Button>
          
          <div className="mt-24 bg-secondary/10 p-12 rounded-[2rem] border border-secondary text-left flex flex-col md:flex-row gap-12 items-center">
             <div className="flex-1">
                <h4 className="text-2xl font-bold mb-4">Reduce Time-to-Resolution</h4>
                <p className="text-muted-foreground leading-relaxed">Don&apos;t wait for a ticket to be updated. Let customers jump on a call immediately when a complex issue arises.</p>
             </div>
             <div className="flex-1 space-y-4 font-bold text-sm">
                <div className="p-4 bg-background border rounded-lg">High-priority Routing</div>
                <div className="p-4 bg-background border rounded-lg">Team Hand-offs</div>
                <div className="p-4 bg-background border rounded-lg">SLA-backed Scheduling</div>
             </div>
          </div>
        </section>
      </main>
      <footer className="py-12 border-t bg-muted/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MeetMe Inc. Customer Success.
        </div>
      </footer>
    </div>
  );
}
