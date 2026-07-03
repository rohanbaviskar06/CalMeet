"use client";

import { Navbar } from "@/components/landing/navbar";
import { motion } from "framer-motion";
import { User, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function IndividualsPage() {
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
              <User className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 italic font-serif">CalMeet for Individuals</h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Simplify your personal scheduling. No more back-and-forth emails. Just one link to rule them all.
            </p>
            <Link href="/signup">
              <Button size="lg" className="rounded-full px-10 h-14 text-lg">Start for Free</Button>
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 mt-24">
            <div className="p-8 rounded-3xl bg-secondary/30 border">
              <h3 className="text-2xl font-bold mb-4">Your personal brand</h3>
              <p className="text-muted-foreground mb-6">Create a beautiful, personalized booking page that reflects your professional identity.</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="h-4 w-4 text-primary" /> Custom URL</li>
                <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="h-4 w-4 text-primary" /> Personalized theme</li>
                <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="h-4 w-4 text-primary" /> Profile photo & bio</li>
              </ul>
            </div>
            <div className="p-8 rounded-3xl bg-secondary/30 border">
              <h3 className="text-2xl font-bold mb-4">Total control</h3>
              <p className="text-muted-foreground mb-6">Set your availability exactly how you want it. Protect your deep work time.</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="h-4 w-4 text-primary" /> Buffer times</li>
                <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="h-4 w-4 text-primary" /> Minimum notice period</li>
                <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="h-4 w-4 text-primary" /> Daily booking limits</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-12 border-t bg-muted/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CalMeet Inc. Personal Edition.
        </div>
      </footer>
    </div>
  );
}
