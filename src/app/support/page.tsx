"use client";

import { Navbar } from "@/components/landing/navbar";
import { motion } from "framer-motion";
import { Headphones, MessageSquare, Mail, Phone, Calendar, ArrowRight, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SupportPage() {
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
            <div className="p-6 rounded-full bg-primary/10 text-primary">
              <LifeBuoy className="h-12 w-12" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            We&apos;re here to <span className="text-primary italic">help.</span>
          </motion.h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Our world-class support team is available 24/7 to ensure your 
            scheduling experience is seamless and productive.
          </p>
        </section>

        {/* Support Channels */}
        <section className="container mx-auto px-4 mb-32 max-w-6xl">
           <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: <MessageSquare className="h-6 w-6" />, title: "Live Chat", desc: "Average response time: < 2 mins", action: "Start Chat" },
                { icon: <Mail className="h-6 w-6" />, title: "Email Support", desc: "Average response time: < 4 hours", action: "Send Email" },
                { icon: <Phone className="h-6 w-6" />, title: "Phone Support", desc: "Available for Enterprise plans", action: "Call Us" }
              ].map((channel, i) => (
                <div key={channel.title} className="p-10 rounded-[3.5rem] bg-zinc-50 dark:bg-zinc-900 border text-center group">
                   <div className="mb-8 p-6 bg-white dark:bg-zinc-800 w-fit rounded-3xl mx-auto shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                      {channel.icon}
                   </div>
                   <h3 className="text-2xl font-bold mb-2">{channel.title}</h3>
                   <p className="text-sm text-muted-foreground mb-8">{channel.desc}</p>
                   <Button className="w-full rounded-full h-12 font-bold group-hover:scale-105 transition-transform">
                      {channel.action}
                   </Button>
                </div>
              ))}
           </div>
        </section>

        {/* Resources for Support */}
        <section className="py-24 bg-zinc-50 dark:bg-zinc-950 border-y">
           <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                 <h2 className="text-3xl font-bold mb-12 text-center italic">Self-service resources</h2>
                 <div className="grid md:grid-cols-2 gap-6">
                    {[
                      { title: "Knowledge Base", desc: "Detailed guides and documentation for every feature.", link: "/resources/help-docs" },
                      { title: "Video Tutorials", desc: "Visual step-by-step guides for visual learners.", link: "/resources/help-docs" },
                      { title: "Developer Docs", desc: "Technical references for API and integrations.", link: "/developers" },
                      { title: "Community Forum", desc: "Connect with other CalMeet users and share tips.", link: "#" }
                    ].map(res => (
                      <div key={res.title} className="p-8 bg-white dark:bg-zinc-900 border rounded-3xl flex justify-between items-center group cursor-pointer">
                         <div>
                            <h4 className="font-bold mb-1">{res.title}</h4>
                            <p className="text-xs text-muted-foreground">{res.desc}</p>
                         </div>
                         <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* Status Section */}
        <section className="container mx-auto px-4 mt-32 text-center">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-green-500/5 text-green-500 text-sm font-bold mb-12">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              All Systems Operational
           </div>
           <h2 className="text-4xl font-bold mb-6 italic tracking-tight">Need a personal touch?</h2>
           <p className="text-muted-foreground text-lg mb-12 max-w-xl mx-auto">
              Schedule a 1-on-1 support session with one of our specialists 
              to resolve complex issues.
           </p>
           <Button size="lg" className="rounded-full px-12 h-16 font-bold text-lg">
              <Calendar className="mr-2 h-5 w-5" /> Book Support Session
           </Button>
        </section>
      </main>

      <footer className="py-12 border-t bg-zinc-50 dark:bg-zinc-950 mt-24">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CalMeet Inc. Support Hub.
        </div>
      </footer>
    </div>
  );
}
