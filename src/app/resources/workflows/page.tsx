"use client";

import { Navbar } from "@/components/landing/navbar";
import { motion } from "framer-motion";
import { Network, Zap, Bell, Mail, MessageSquare, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WorkflowsPage() {
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Network className="h-3.5 w-3.5" /> Workflows
            </div>
            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter italic">
              AUTOMATE THE <br/> <span className="text-orange-500 underline decoration-orange-500/20">UNIMPORTANT.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              Set your scheduling on autopilot with custom workflows. Handle reminders, 
              follow-ups, and notifications without lifting a finger.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="h-16 px-10 rounded-full text-lg font-bold bg-orange-500 hover:bg-orange-600 text-white">
                Create First Workflow
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 rounded-full text-lg font-bold border-orange-500/20">
                View Templates
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Workflow Logic Builder Visual */}
        <section className="container mx-auto px-4 mb-32 max-w-5xl">
           <div className="bg-zinc-50 dark:bg-zinc-900 border rounded-[4rem] p-12 md:p-20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5">
                 <Zap className="h-64 w-64 rotate-12" />
              </div>
              <div className="relative space-y-12">
                 <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="p-6 bg-white dark:bg-zinc-800 rounded-3xl border shadow-xl flex items-center gap-4 w-full md:w-fit">
                       <div className="p-3 bg-orange-500 text-white rounded-xl"><Bell className="h-6 w-6" /></div>
                       <div>
                          <div className="text-[10px] text-muted-foreground uppercase font-bold">Trigger</div>
                          <div className="font-bold">New Booking Confirmed</div>
                       </div>
                    </div>
                    <ArrowRight className="hidden md:block h-8 w-8 text-orange-500 animate-pulse" />
                    <div className="p-6 bg-white dark:bg-zinc-800 rounded-3xl border shadow-xl flex items-center gap-4 w-full md:w-fit">
                       <div className="p-3 bg-blue-500 text-white rounded-xl"><Mail className="h-6 w-6" /></div>
                       <div>
                          <div className="text-[10px] text-muted-foreground uppercase font-bold">Action</div>
                          <div className="font-bold">Send Confirmation Email</div>
                       </div>
                    </div>
                    <ArrowRight className="hidden md:block h-8 w-8 text-orange-500 animate-pulse" />
                    <div className="p-6 bg-white dark:bg-zinc-800 rounded-3xl border shadow-xl flex items-center gap-4 w-full md:w-fit border-orange-500/50 scale-105">
                       <div className="p-3 bg-emerald-500 text-white rounded-xl"><MessageSquare className="h-6 w-6" /></div>
                       <div>
                          <div className="text-[10px] text-muted-foreground uppercase font-bold">Action</div>
                          <div className="font-bold">Slack Notification</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Feature Grid */}
        <section className="container mx-auto px-4 mb-32">
           <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Smart Reminders", desc: "Reduce no-shows with multi-channel reminders (Email, SMS, WhatsApp)." },
                { title: "Post-Event Surveys", desc: "Automatically send feedback forms or follow-up materials after a meeting ends." },
                { title: "Team Routing", desc: "Instantly notify the right team member based on custom routing logic." }
              ].map((item, i) => (
                <div key={item.title} className="p-10 rounded-[3rem] border bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-900 transition-all">
                   <h3 className="text-2xl font-bold mb-4 italic tracking-tight">{item.title}</h3>
                   <p className="text-muted-foreground leading-relaxed text-sm">{item.desc}</p>
                </div>
              ))}
           </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 mt-32 text-center">
           <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold mb-6 italic">Save 10+ hours a week.</h2>
              <p className="text-muted-foreground text-lg mb-10">
                 Stop doing the repetitive work. Build your first workflow in under 
                 5 minutes and let CalMeet handle the rest.
              </p>
              <Button size="lg" className="rounded-full px-12 h-16 font-bold bg-orange-600 hover:bg-orange-700 text-lg">
                 Start Automating
              </Button>
           </div>
        </section>
      </main>

      <footer className="py-12 border-t bg-zinc-50 dark:bg-zinc-950 mt-24">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CalMeet Inc. Total automation.
        </div>
      </footer>
    </div>
  );
}
