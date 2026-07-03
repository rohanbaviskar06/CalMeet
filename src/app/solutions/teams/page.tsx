"use client";

import { Navbar } from "@/components/landing/navbar";
import { motion } from "framer-motion";
import { Users, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TeamsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <section className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary border border-primary/20">
              <Users className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 italic font-serif">CalMeet for Teams</h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Collaborative scheduling for groups of all sizes. Scale your team&apos;s output without the coordination headache.
            </p>
            <Link href="/signup">
              <Button size="lg" className="rounded-full px-10 h-14 text-lg font-bold">Start Team Trial</Button>
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 mt-24">
            <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10">
              <h3 className="text-2xl font-bold mb-4 italic">Round Robin Scheduling</h3>
              <p className="text-muted-foreground mb-6">Automatically distribute meetings across your team based on availability or weighted logic.</p>
              <ul className="space-y-3 font-medium">
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary" /> Equal distribution</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary" /> Prioritize top performers</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary" /> Regional routing</li>
              </ul>
            </div>
            <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10">
              <h3 className="text-2xl font-bold mb-4 italic">Collective Availability</h3>
              <p className="text-muted-foreground mb-6">Book time only when everyone on the team is free. Perfect for sales demos and panel interviews.</p>
              <ul className="space-y-3 font-medium">
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary" /> Multi-calendar sync</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary" /> Co-host support</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary" /> Auto-invites for all</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-12 border-t bg-muted/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CalMeet Inc. Team Solutions.
        </div>
      </footer>
    </div>
  );
}
