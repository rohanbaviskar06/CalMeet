import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { TrustedBy } from "@/components/landing/trusted-by";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Benefits } from "@/components/landing/benefits";
import { Integrations } from "@/components/landing/integrations";
import { FAQ } from "@/components/landing/faq";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <TrustedBy />
        <Features />
        <HowItWorks />
        <Benefits />
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
              Join thousands of professionals who save hours every week with MeetMe.
              Setup takes less than 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="h-14 px-10 text-base rounded-full shadow-lg">
                  Get Started for Free
                </Button>
              </Link>
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

      {/* Footer */}
      <footer className="py-12 border-t bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2 font-bold text-xl">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">M</div>
              <span>MeetMe</span>
            </div>

            <div className="flex gap-8 text-sm text-muted-foreground font-medium">
              <Link href="#" className="hover:text-primary">Privacy Policy</Link>
              <Link href="#" className="hover:text-primary">Terms of Service</Link>
              <Link href="#" className="hover:text-primary">Contact</Link>
            </div>

            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MeetMe Inc. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
