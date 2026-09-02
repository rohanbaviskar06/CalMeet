"use client";

import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { TrustedBy } from "@/components/landing/trusted-by";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { DashboardDemo } from "@/components/landing/dashboard-demo";
import { MobileDemo } from "@/components/landing/mobile-demo";
import { Benefits } from "@/components/landing/benefits";
import { Integrations } from "@/components/landing/integrations";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export default function Home() {
  const { status } = useSession();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0c0c0c] text-zinc-900 dark:text-zinc-100">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <TrustedBy />
        <Features />
        <HowItWorks />
        <DashboardDemo />
        <Benefits />
        <MobileDemo />
        <Integrations />
        <FAQ />

        {/* Final CTA Section */}
        <section className="py-24 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/60 relative overflow-hidden">
          <div className="container mx-auto px-4 text-center max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold mb-4 border border-zinc-200 dark:border-zinc-700">
              <Sparkles className="h-3.5 w-3.5 text-zinc-500" />
              <span>Get started in under 2 minutes</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
              Ready to take control of <br />
              <span className="text-zinc-400 dark:text-zinc-500">your calendar?</span>
            </h2>

            <p className="text-base text-zinc-600 dark:text-zinc-400 mb-8 max-w-xl mx-auto leading-relaxed">
              Join thousands of founders, sales teams, and professionals who save hours every week with CalMeet.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {status === "loading" ? (
                <div className="w-48 h-11 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-lg" />
              ) : status === "authenticated" ? (
                <Button render={<Link href="/dashboard" />} size="lg" className="h-11 px-6 text-sm font-semibold rounded-lg">
                  Go to Dashboard <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              ) : (
                <Button render={<Link href="/signup" />} size="lg" className="h-11 px-6 text-sm font-semibold rounded-lg">
                  Get Started for Free <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              )}
              <Button render={<Link href="/pricing" />} variant="outline" size="lg" className="h-11 px-6 text-sm font-semibold rounded-lg border-zinc-200 dark:border-zinc-800">
                View Pricing
              </Button>
            </div>

            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-5">
              No credit card required · Free forever plan · Cancel anytime
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
