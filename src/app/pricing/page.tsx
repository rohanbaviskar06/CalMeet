"use client";

import { cn } from "@/lib/utils";
import { Navbar } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "For individuals just getting started.",
    features: [
      "1 Event Type",
      "Unlimited Bookings",
      "Google Calendar Sync",
      "Email Notifications",
      "Basic Customization"
    ],
    buttonText: "Get Started",
    popular: false
  },
  {
    name: "Pro",
    price: "$12",
    description: "For professionals who need more power.",
    features: [
      "Unlimited Event Types",
      "Custom Branding",
      "All Integrations (Zoom, etc.)",
      "Advanced Availability",
      "Booking Analytics",
      "Priority Support"
    ],
    buttonText: "Start 14-day Trial",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For teams and organizations.",
    features: [
      "Team Management",
      "SSO & Security",
      "White-labeling",
      "Custom Contracts",
      "Dedicated Support",
      "API Access"
    ],
    buttonText: "Contact Sales",
    popular: false
  }
];

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the plan that&apos;s right for you. All plans include unlimited bookings.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={cn(
                  "h-full flex flex-col relative overflow-hidden",
                  plan.popular && "border-primary shadow-xl scale-105 z-10"
                )}>
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                      {plan.price !== "Custom" && <span className="ml-1 text-muted-foreground">/month</span>}
                    </div>
                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-8">
                    <Link href="/signup" className="w-full">
                      <Button 
                        variant={plan.popular ? "default" : "outline"} 
                        className="w-full h-12 text-base"
                      >
                        {plan.buttonText}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <section className="mt-32 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-bold mb-2">Can I cancel my subscription?</h4>
                <p className="text-muted-foreground">Yes, you can cancel your subscription at any time. You&apos;ll continue to have access until the end of your billing period.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-2">What happens when my trial ends?</h4>
                <p className="text-muted-foreground">After your 14-day trial of the Pro plan, you&apos;ll be moved to the Free plan unless you choose to subscribe.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-2">Do you offer discounts for non-profits?</h4>
                <p className="text-muted-foreground">Yes! We offer a 50% discount for registered non-profits and educational institutions. Contact our support team to learn more.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <footer className="py-12 border-t bg-muted/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CalMeet Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
