"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { motion } from "framer-motion";
import { Code2, Terminal, Cpu, Database, ArrowRight, GitBranch, Book, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DevelopersPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black text-foreground">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        {/* Hero */}
        <section className="container mx-auto px-4 mb-24">
           <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                  <Code2 className="h-3 w-3" /> Developer Hub
                </div>
                <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter">
                   BUILD THE <br/> <span className="text-primary italic">FUTURE</span> OF MEETINGS.
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed">
                   Comprehensive REST APIs, HMAC webhooks, and lightweight embed snippets to integrate CalMeet deep into your 
                   own product ecosystem.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="h-16 px-10 rounded-full text-lg font-bold" render={<Link href="/resources/api-docs" />}>
                    Read API Docs
                  </Button>
                  <Button size="lg" variant="outline" className="h-16 px-10 rounded-full text-lg font-bold border-primary/20" render={<Link href="/resources/webhooks" />}>
                    <Zap className="mr-2 h-5 w-5" /> Webhooks Guide
                  </Button>
                </div>
              </motion.div>
           </div>
        </section>

        {/* Feature Grid */}
        <section className="container mx-auto px-4 mb-32">
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: <Terminal className="h-5 w-5" />, title: "REST API", desc: "Full CRUD access to your event types, bookings, and availability endpoints." },
                { icon: <Zap className="h-5 w-5" />, title: "HMAC Webhooks", desc: "Real-time signed JSON event notifications with SHA-256 signatures." },
                { icon: <Book className="h-5 w-5" />, title: "Embed Snippets", desc: "Drop-in iframe and responsive web components for React, Next.js, and HTML." },
                { icon: <Database className="h-5 w-5" />, title: "OAuth & Sync", desc: "Google Calendar bi-directional busy-time verification and Google Meet / Zoom links." }
              ].map((item, i) => (
                <div key={item.title} className="p-8 rounded-[2rem] border bg-zinc-50/50 dark:bg-zinc-900/50 hover:border-primary/30 transition-all group">
                   <div className="mb-6 p-4 bg-primary/5 w-fit rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">{item.icon}</div>
                   <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                   <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Code Sample */}
        <section className="py-24 bg-zinc-950 text-white overflow-hidden">
           <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                 <div>
                    <h2 className="text-4xl font-bold mb-8 italic tracking-tight">Simple. Powerful. <br/>Scalable.</h2>
                    <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                       Our API is designed around REST principles and returns JSON-encoded 
                       responses. We use standard HTTP response codes, bearer token authentication, 
                       and robust error payloads.
                    </p>
                    <Link href="/resources/api-docs" className="inline-flex items-center text-primary font-bold gap-2 cursor-pointer group">
                       API Reference <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                    </Link>
                 </div>
                 <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 font-mono text-sm shadow-2xl relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                       <Code2 className="h-32 w-32" />
                    </div>
                    <div className="space-y-1">
                       <div className="text-zinc-500"># Get authenticated user profile & bookings</div>
                       <div className="text-emerald-400">curl <span className="text-zinc-300">--request GET \\</span></div>
                       <div className="text-zinc-300 pl-4">--url https://calmeet.app/api/v1/me \\</div>
                       <div className="text-zinc-300 pl-4">--header <span className="text-emerald-400">&apos;Authorization: Bearer cal_live_your_api_key&apos;</span></div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 mt-32 text-center">
           <div className="max-w-2xl mx-auto bg-zinc-50 dark:bg-zinc-900 border p-16 rounded-[4rem]">
              <h2 className="text-3xl font-bold mb-6 italic tracking-tight">Ready to start building?</h2>
              <p className="text-muted-foreground mb-10 leading-relaxed">
                 Generate your secure API key in your dashboard and make your first request in seconds.
              </p>
              <Button size="lg" className="rounded-full px-12 h-16 font-bold text-lg" render={<Link href="/dashboard/settings?tab=api-keys" />}>
                 Get API Key
              </Button>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
