"use client";

import { Navbar } from "@/components/landing/navbar";
import { motion } from "framer-motion";
import { CreditCard, Shield, Zap, DollarSign, CheckCircle, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        {/* Hero */}
        <section className="container mx-auto px-4 mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
              <CreditCard className="h-3.5 w-3.5" /> Paid Appointments
            </div>
            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter italic">
              GET PAID <br/> <span className="text-blue-500 underline decoration-blue-500/20">FOR YOUR TIME.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              Accept payments directly through your booking flow. Connect with Stripe 
              to secure your revenue and reduce no-shows.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="h-16 px-10 rounded-full text-lg font-bold bg-blue-600 hover:bg-blue-700">
                Connect Stripe
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 rounded-full text-lg font-bold border-blue-500/20">
                View Pricing
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Integration Showcase */}
        <section className="container mx-auto px-4 mb-32">
           <div className="bg-zinc-50 dark:bg-zinc-900 border rounded-[4rem] p-8 md:p-20">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                 <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-[100px]" />
                    <div className="relative space-y-4">
                       <div className="p-8 bg-white dark:bg-zinc-800 rounded-[2.5rem] border shadow-2xl">
                          <div className="flex justify-between items-center mb-10">
                             <div className="h-12 w-12 rounded-xl bg-blue-500 flex items-center justify-center text-white">
                                <DollarSign className="h-6 w-6" />
                             </div>
                             <div className="text-right">
                                <div className="text-2xl font-black">$150.00</div>
                                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Session Fee</div>
                             </div>
                          </div>
                          <div className="space-y-4">
                             <div className="h-10 w-full bg-zinc-100 dark:bg-zinc-700 rounded-lg animate-pulse" />
                             <div className="h-10 w-full bg-zinc-100 dark:bg-zinc-700 rounded-lg animate-pulse" />
                             <Button className="w-full h-12 rounded-xl bg-blue-600 font-bold">Pay & Book Now</Button>
                          </div>
                       </div>
                    </div>
                 </div>
                 <div>
                    <h2 className="text-4xl font-bold mb-8 italic tracking-tight">Seamless checkout, <br/>zero friction.</h2>
                    <div className="space-y-8">
                       {[
                         { title: "Reduce No-Shows", desc: "Requiring payment upfront ensures that clients are committed to the meeting time.", icon: <Zap className="h-5 w-5" /> },
                         { title: "Secure Transactions", desc: "All payments are processed securely through Stripe with industry-standard encryption.", icon: <Shield className="h-5 w-5" /> },
                         { title: "Instant Payouts", desc: "Revenue is transferred directly to your bank account on your preferred schedule.", icon: <ArrowUpRight className="h-5 w-5" /> }
                       ].map(item => (
                         <div key={item.title} className="flex gap-4">
                            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 h-fit">
                               {item.icon}
                            </div>
                            <div>
                               <h4 className="font-bold mb-1">{item.title}</h4>
                               <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-zinc-950 text-white border-y border-zinc-800">
           <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                 {[
                   { title: "Global Payments", desc: "Accept 135+ currencies from customers all over the world." },
                   { title: "Automated Invoicing", desc: "CalMeet handles receipt generation and email confirmations automatically." },
                   { title: "Refund Management", desc: "Cancel meetings and issue refunds directly from your dashboard." }
                 ].map(benefit => (
                   <div key={benefit.title} className="space-y-4">
                      <div className="h-1 w-12 bg-blue-500" />
                      <h3 className="text-xl font-bold">{benefit.title}</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">{benefit.desc}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 mt-32 text-center">
           <div className="max-w-2xl mx-auto py-16">
              <h2 className="text-4xl font-bold mb-6 italic">Stop chasing invoices.</h2>
              <p className="text-muted-foreground text-lg mb-10">
                 Connect your Stripe account in minutes and start monetizing your expertise 
                 with every booking.
              </p>
              <Button size="lg" className="rounded-full px-12 h-16 font-bold bg-blue-600 hover:bg-blue-700 text-lg">
                 Get Started for Free
              </Button>
           </div>
        </section>
      </main>

      <footer className="py-12 border-t bg-zinc-50 dark:bg-zinc-950 mt-24">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CalMeet Inc. Secure transactions.
        </div>
      </footer>
    </div>
  );
}
