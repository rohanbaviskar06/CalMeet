"use client";

import { Navbar } from "@/components/landing/navbar";
import { Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SalesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <section className="container mx-auto px-4 max-w-4xl text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-6 text-yellow-600 border border-yellow-500/20">
            <Zap className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 italic font-serif">MeetMe for Sales</h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Speed to lead is everything. Make it effortless for prospects to book a meeting right when their interest is highest.
          </p>
          <Button size="lg" className="rounded-full bg-yellow-600 hover:bg-yellow-700 px-10">Boost Your Pipeline</Button>
          
          <div className="mt-24 grid md:grid-cols-2 gap-8 text-left">
             <div className="p-8 rounded-3xl border bg-card">
                <h4 className="text-xl font-bold mb-4">Instant Lead Routing</h4>
                <p className="text-muted-foreground text-sm">Routes leads to the right AE based on territory, size, or industry automatically.</p>
             </div>
             <div className="p-8 rounded-3xl border bg-card">
                <h4 className="text-xl font-bold mb-4">CRM Power Sync</h4>
                <p className="text-muted-foreground text-sm">Automatically log meetings and prospect data directly into Salesforce or HubSpot.</p>
             </div>
          </div>
        </section>
      </main>
      <footer className="py-12 border-t bg-muted/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MeetMe Inc. Sales Velocity.
        </div>
      </footer>
    </div>
  );
}
