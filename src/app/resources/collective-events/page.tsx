"use client";

import { Navbar } from "@/components/landing/navbar";
import { motion } from "framer-motion";
import { Users, Calendar, ArrowRight, UserPlus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CollectiveEventsPage() {
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
            <div className="p-6 rounded-full bg-emerald-500/10 text-emerald-500">
              <Users className="h-12 w-12" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            Schedule for the <span className="text-emerald-500 italic">whole team.</span>
          </motion.h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Only show times when everyone is available. Perfect for panel interviews, 
            group demos, and multi-host webinars.
          </p>
          <Button size="lg" className="h-16 px-10 rounded-full text-lg font-bold bg-emerald-600 hover:bg-emerald-700">
            Create Collective Event
          </Button>
        </section>

        {/* Feature Sections */}
        <section className="container mx-auto px-4 mb-32 max-w-6xl">
           <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
              <div>
                 <h2 className="text-3xl font-bold mb-6 italic">Pool your availability.</h2>
                 <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                    Select multiple team members and CalMeet will only offer time slots 
                    where every selected participant is free. No more back-and-forth emails 
                    trying to coordinate four different calendars.
                 </p>
                 <div className="space-y-4">
                    {[
                      "Real-time calendar sync for all hosts",
                      "Automated buffer time between meetings",
                      "Individual time zone handling",
                      "Customizable minimum notice periods"
                    ].map(text => (
                      <div key={text} className="flex items-center gap-3 font-bold text-sm">
                         <div className="h-2 w-2 rounded-full bg-emerald-500" />
                         {text}
                      </div>
                    ))}
                 </div>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900 border rounded-[3rem] p-12 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Calendar className="h-48 w-48" />
                 </div>
                 <div className="relative space-y-6">
                    <div className="p-4 bg-white dark:bg-zinc-800 rounded-2xl border shadow-sm">
                       <div className="font-bold mb-1">Panel Interview</div>
                       <div className="text-xs text-muted-foreground">Hosts: Alex, Sarah, Mike</div>
                    </div>
                    <div className="p-4 bg-white dark:bg-zinc-800 rounded-2xl border shadow-sm scale-105 translate-x-4 border-emerald-500/50">
                       <div className="font-bold mb-1">Founders Demo</div>
                       <div className="text-xs text-muted-foreground">Hosts: Jane, Tom</div>
                    </div>
                    <div className="p-4 bg-white dark:bg-zinc-800 rounded-2xl border shadow-sm">
                       <div className="font-bold mb-1">Tech Support Sync</div>
                       <div className="text-xs text-muted-foreground">Hosts: Support Team</div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: <UserPlus className="h-6 w-6" />, title: "Flexible Hosts", desc: "Easily swap hosts in and out of active event types as your team evolves." },
                { icon: <ShieldCheck className="h-6 w-6" />, title: "Load Balancing", desc: "Ensure meetings are distributed fairly among your team members." },
                { icon: <Users className="h-6 w-6" />, title: "Group Invites", desc: "Participants receive one invite that includes all host details automatically." }
              ].map((item, i) => (
                <div key={item.title} className="p-8 rounded-[2rem] border bg-zinc-50/50 dark:bg-zinc-900/50">
                   <div className="mb-6 p-4 bg-emerald-500/10 w-fit rounded-2xl text-emerald-500">{item.icon}</div>
                   <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                   <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
           </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 mt-32 text-center">
           <div className="max-w-3xl mx-auto bg-emerald-600 text-white p-16 md:p-24 rounded-[4rem] relative overflow-hidden">
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
              <h2 className="text-4xl font-bold mb-8 italic">Better together.</h2>
              <p className="text-xl text-emerald-100 mb-12">
                 Join thousands of teams using collective events to streamline their multi-host scheduling.
              </p>
              <Button size="lg" variant="secondary" className="rounded-full px-12 h-16 font-bold text-lg">
                 Start Team Scheduling
              </Button>
           </div>
        </section>
      </main>

      <footer className="py-12 border-t bg-zinc-50 dark:bg-zinc-950 mt-24">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CalMeet Inc. Collaboration first.
        </div>
      </footer>
    </div>
  );
}
