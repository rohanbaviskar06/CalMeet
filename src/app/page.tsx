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

export default function Home() {
  const { status } = useSession();

  return (
    <div className="flex flex-col min-h-screen">
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
        <section className="py-28 border-t bg-muted/20 relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

          <div className="container mx-auto px-4 text-center relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
              Get started today
            </p>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Ready to simplify <br />
              <span className="text-primary">your scheduling?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of professionals who save hours every week with CalMeet.
              Setup takes less than 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {status === "loading" ? (
                <div className="w-56 h-14 bg-muted animate-pulse rounded-full" />
              ) : status === "authenticated" ? (
                <Link href="/dashboard">
                  <Button size="lg" className="h-14 px-10 text-base rounded-full shadow-lg">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/signup">
                  <Button size="lg" className="h-14 px-10 text-base rounded-full shadow-lg">
                    Get Started for Free
                  </Button>
                </Link>
              )}
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="h-14 px-10 text-base rounded-full">
                  View Pricing
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-5">
              No credit card required · Free forever plan · Cancel anytime
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
