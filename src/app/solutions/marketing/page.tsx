"use client";

import { Navbar } from "@/components/landing/navbar";
import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MarketingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <section className="container mx-auto px-4 max-w-4xl text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 text-orange-600 border border-orange-500/20">
            <BarChart3 className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 italic font-serif">MeetMe for Marketing</h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Convert visitors into meetings. Bridge the gap between marketing interest and sales action with high-conversion booking flows.
          </p>
          <Button size="lg" className="rounded-full bg-orange-600 hover:bg-orange-700 px-10 text-white">Optimize Your Funnel</Button>
          
          <div className="mt-24 grid md:grid-cols-2 gap-8 text-left">
             <div className="p-10 rounded-[2.5rem] bg-orange-50 border border-orange-100">
                <h4 className="text-2xl font-bold mb-4">Lead Qualification</h4>
                <p className="text-muted-foreground italic">Use custom forms to qualify leads before they can book. Ensure your team only spends time with the right prospects.</p>
             </div>
             <div className="p-10 rounded-[2.5rem] bg-orange-50 border border-orange-100">
                <h4 className="text-2xl font-bold mb-4">Conversion Tracking</h4>
                <p className="text-muted-foreground italic">Full attribution for every meeting booked. Connect with Google Analytics, Meta Pixel, and more.</p>
             </div>
          </div>
        </section>
      </main>
      <footer className="py-12 border-t bg-muted/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MeetMe Inc. Marketing Analytics.
        </div>
      </footer>
    </div>
  );
}
