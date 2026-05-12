"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-secondary text-secondary-foreground border">
            The next generation of scheduling
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Scheduling simplified <br />
            <span className="text-muted-foreground">for modern teams.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10">
            MeetMe helps you connect with people when it matters. Automate your meetings,
            sync your calendars, and reclaim your time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8 text-base gap-2">
                Get Started for Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                View Live Demo
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Free forever plan
            </div>
          </div>
        </motion.div>

        {/* Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          <div className="relative rounded-2xl border bg-card shadow-2xl overflow-hidden aspect-[16/10]">
            <div className="absolute inset-0 bg-gradient-to-tr from-background via-transparent to-background/50" />
            <div className="p-4 border-b bg-muted/50 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive/20 border border-destructive/30" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30" />
            </div>
            <div className="p-8 h-full flex gap-8">
              {/* Sidebar Mock */}
              <div className="w-48 flex flex-col gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-8 w-full bg-muted rounded-md animate-pulse" />
                ))}
              </div>
              {/* Content Mock */}
              <div className="flex-1 grid grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-40 w-full bg-muted/50 border rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
