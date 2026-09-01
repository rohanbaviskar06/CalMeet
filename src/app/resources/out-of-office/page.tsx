"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { motion } from "framer-motion";
import { Moon, Calendar, Zap, Bell, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OutOfOfficePage() {
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
            <div className="p-6 rounded-full bg-indigo-500/10 text-indigo-500">
              <Moon className="h-12 w-12" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            Protect your <span className="text-indigo-500 italic">personal time.</span>
          </motion.h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Our Out of Office tool automatically handles your scheduling while you&apos;re away. 
            No more manual adjustments or double bookings.
          </p>
          <Link href="/dashboard/settings?tab=out-of-office">
            <Button size="lg" className="h-16 px-10 rounded-full text-lg font-bold bg-indigo-600 hover:bg-indigo-700 cursor-pointer">
              Set Your Vacation Dates
            </Button>
          </Link>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 mb-32 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-zinc-50 dark:bg-zinc-900 p-10 rounded-[3rem] border">
              <div className="mb-6 p-4 bg-indigo-500/10 w-fit rounded-2xl text-indigo-500">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Blocking</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect your personal and work calendars. When you add a &apos;Vacation&apos; event, 
                CalMeet instantly blocks all your event types across all accounts.
              </p>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900 p-10 rounded-[3rem] border">
              <div className="mb-6 p-4 bg-indigo-500/10 w-fit rounded-2xl text-indigo-500">
                <Bell className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Auto-Notifications</h3>
              <p className="text-muted-foreground leading-relaxed">
                Automatically notify anyone who tries to book with you or has an existing 
                meeting during your time off. Customizable templates included.
              </p>
            </div>
          </div>
        </section>

        {/* Visual Showcase */}
        <section className="py-24 bg-zinc-950 text-white overflow-hidden">
          <div className="container mx-auto px-4">
             <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="relative">
                   <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-[120px]" />
                   <div className="relative bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem]">
                      <div className="space-y-6">
                         {[
                           { label: "Status", value: "Away", color: "text-indigo-400" },
                           { label: "Duration", value: "May 12 - May 19", color: "text-white" },
                           { label: "Handling", value: "Block all bookings", color: "text-white" }
                         ].map(item => (
                           <div key={item.label} className="flex justify-between items-center border-b border-zinc-800 pb-4">
                              <span className="text-zinc-500 font-medium">{item.label}</span>
                              <span className={`font-bold ${item.color}`}>{item.value}</span>
                           </div>
                         ))}
                      </div>
                      <div className="mt-8 p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-xs text-indigo-300">
                         &quot;Hi there! I&apos;m currently out of the office and will return on May 20th. 
                         All scheduling is temporarily disabled.&quot;
                      </div>
                   </div>
                </div>
                <div>
                   <h2 className="text-4xl font-bold mb-8 italic font-serif leading-tight">Peace of mind, <br/>guaranteed.</h2>
                   <div className="space-y-6">
                      {[
                        "Zero configuration required",
                        "Syncs across all linked calendars",
                        "Custom response messages",
                        "Emergency bypass links available"
                      ].map(text => (
                        <div key={text} className="flex items-center gap-3">
                           <CheckCircle2 className="h-5 w-5 text-indigo-400" />
                           <span className="font-bold">{text}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 mt-32 text-center">
           <div className="max-w-2xl mx-auto bg-zinc-50 dark:bg-zinc-900 border p-16 rounded-[4rem]">
              <h2 className="text-3xl font-bold mb-6 italic">Ready for your break?</h2>
              <p className="text-muted-foreground mb-10 leading-relaxed">
                 Start protecting your time today. It takes less than 30 seconds to set up 
                 your first out-of-office block.
              </p>
              <Link href="/dashboard/settings?tab=out-of-office">
                <Button size="lg" className="rounded-full px-12 h-14 font-bold bg-indigo-600 hover:bg-indigo-700 cursor-pointer">
                   Get Started
                </Button>
              </Link>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
