"use client";

import { Navbar } from "@/components/landing/navbar";
import { motion } from "framer-motion";
import { Link as LinkIcon, Share2, Users, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Footer } from "@/components/landing/footer";
import Link from "next/link";

export default function DynamicGroupLinksPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        {/* Hero */}
        <section className="container mx-auto px-4 mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 flex justify-center"
          >
            <div className="p-6 rounded-full bg-rose-500/10 text-rose-500">
              <LinkIcon className="h-12 w-12" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            Links that adapt <br/> <span className="text-rose-500 italic">on the fly.</span>
          </motion.h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Create powerful, short-lived links for specific groups, events, or campaigns. 
            Full control over who books and when.
          </p>
          <Link href="/dashboard/event-types">
            <Button size="lg" className="h-16 px-10 rounded-full text-lg font-bold bg-rose-600 hover:bg-rose-700">
              Create Dynamic Link
            </Button>
          </Link>
        </section>

        {/* Feature Grid */}
        <section className="container mx-auto px-4 mb-32 max-w-6xl">
           <div className="grid md:grid-cols-2 gap-8 mb-24">
              <div className="p-12 rounded-[3rem] bg-rose-500/5 border border-rose-500/10">
                 <h3 className="text-2xl font-bold mb-6 italic">One-time usage.</h3>
                 <p className="text-muted-foreground leading-relaxed mb-8">
                    Generate links that expire after a single use. Perfect for high-value 
                    consultations or exclusive interviews where you don&apos;t want your 
                    permanent link shared.
                 </p>
                 <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border flex items-center gap-4 text-xs font-mono text-muted-foreground">
                    <span className="flex-grow truncate">calmeet.app/alex/private-291</span>
                    <Button variant="ghost" size="sm" className="h-8">Copy</Button>
                 </div>
              </div>
              <div className="p-12 rounded-[3rem] bg-rose-500/5 border border-rose-500/10">
                 <h3 className="text-2xl font-bold mb-6 italic">Member pooling.</h3>
                 <p className="text-muted-foreground leading-relaxed mb-8">
                    Create a link that routes to any available member of a specific group. 
                    Ideal for support queues or sales inquiries where anyone can help.
                 </p>
                 <div className="flex -space-x-4">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-12 w-12 rounded-full border-4 border-white dark:border-black bg-zinc-200 dark:bg-zinc-800" />
                    ))}
                 </div>
              </div>
           </div>

           <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: <Share2 className="h-5 w-5" />, title: "Smart Routing", desc: "Route bookings based on logic, availability, or round-robin distribution." },
                { icon: <Users className="h-5 w-5" />, title: "Group Control", desc: "Manage permissions and availability for entire teams via a single URL." },
                { icon: <Shield className="h-5 w-5" />, title: "Secure Access", desc: "Protect your links with passwords or domain-level restrictions." }
              ].map(item => (
                <div key={item.title} className="p-8 rounded-[2rem] border bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                   <div className="mb-4 p-3 bg-rose-500/10 w-fit rounded-xl text-rose-500">{item.icon}</div>
                   <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                   <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
           </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 mt-32 text-center">
           <div className="max-w-3xl mx-auto py-16 border-t">
              <h2 className="text-3xl font-bold mb-6 italic">Ready to share?</h2>
              <p className="text-muted-foreground text-lg mb-10">
                 Start creating dynamic links and take total control over your schedule.
              </p>
              <div className="flex justify-center gap-4">
                 <Link href="/signup">
                   <Button size="lg" className="rounded-full px-10 h-14 font-bold bg-rose-600 hover:bg-rose-700">
                      Get Started
                   </Button>
                 </Link>
                 <Link href="/resources/help-docs">
                   <Button size="lg" variant="outline" className="rounded-full px-10 h-14 font-bold">
                      View Docs
                   </Button>
                 </Link>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
