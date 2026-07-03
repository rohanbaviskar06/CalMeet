"use client";

import { Navbar } from "@/components/landing/navbar";
import { motion } from "framer-motion";
import { FileText, Search, BookOpen, MessageCircle, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = [
  { title: "Getting Started", count: 12, icon: <Zap className="h-5 w-5" /> },
  { title: "Account & Settings", count: 8, icon: <User className="h-5 w-5" /> },
  { title: "Integrations", count: 24, icon: <LayoutGrid className="h-5 w-5" /> },
  { title: "Billing & Plans", count: 5, icon: <CreditCard className="h-5 w-5" /> },
  { title: "Team Management", count: 15, icon: <Users className="h-5 w-5" /> },
  { title: "Developers & API", count: 18, icon: <Code2 className="h-5 w-5" /> },
];

import { Zap, User, LayoutGrid, CreditCard, Users, Code2 } from "lucide-react";

export default function HelpDocsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        {/* Hero */}
        <section className="container mx-auto px-4 mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <BookOpen className="h-3 w-3" /> Help Center
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight italic font-serif">
              How can we <span className="text-primary underline decoration-primary/20">help you?</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Find guides, video tutorials, and answers to common questions about CalMeet.
            </p>
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
              <Input 
                placeholder="Search the help center..." 
                className="h-16 pl-14 rounded-[2rem] border-primary/20 bg-white dark:bg-zinc-900 shadow-2xl shadow-primary/5 text-lg"
              />
            </div>
          </motion.div>
        </section>

        {/* Categories Grid */}
        <section className="container mx-auto px-4 max-w-6xl mb-32">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border hover:shadow-xl transition-all cursor-pointer group"
                >
                   <div className="mb-6 p-4 bg-primary/5 w-fit rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      {cat.icon}
                   </div>
                   <h3 className="text-xl font-bold mb-2">{cat.title}</h3>
                   <p className="text-sm text-muted-foreground mb-6">{cat.count} articles</p>
                   <div className="flex items-center text-primary font-bold text-sm group-hover:translate-x-2 transition-transform">
                      Explore <ArrowRight className="ml-2 h-4 w-4" />
                   </div>
                </motion.div>
              ))}
           </div>
        </section>

        {/* Featured Video */}
        <section className="container mx-auto px-4 mb-32">
           <div className="max-w-5xl mx-auto bg-zinc-900 text-white rounded-[3rem] overflow-hidden">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                 <div className="p-12 md:p-20">
                    <h2 className="text-3xl font-bold mb-6 italic">Watch \u0026 Learn.</h2>
                    <p className="text-zinc-400 mb-8 leading-relaxed">
                       New to CalMeet? Our 5-minute Quick Start guide covers everything 
                       you need to know to set up your first event type.
                    </p>
                    <Button size="lg" className="rounded-full px-8 font-bold">
                       View All Tutorials
                    </Button>
                 </div>
                 <div className="relative aspect-video md:aspect-square bg-zinc-800 flex items-center justify-center group cursor-pointer">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform" />
                    <div className="relative h-20 w-20 rounded-full bg-white text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                       <Play className="h-8 w-8 fill-current" />
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Support CTA */}
        <section className="container mx-auto px-4 text-center">
           <div className="max-w-2xl mx-auto">
              <div className="mb-8 flex justify-center">
                 <div className="p-4 rounded-3xl bg-primary/10 text-primary">
                    <MessageCircle className="h-10 w-10" />
                 </div>
              </div>
              <h2 className="text-3xl font-bold mb-4 italic">Still need help?</h2>
              <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                 Can&apos;t find what you&apos;re looking for? Our support team is 
                 available via live chat or email to help you out.
              </p>
              <div className="flex justify-center gap-4">
                 <Button size="lg" className="rounded-full px-10 h-14 font-bold">
                    Start Live Chat
                 </Button>
                 <Button size="lg" variant="outline" className="rounded-full px-10 h-14 font-bold">
                    Email Support
                 </Button>
              </div>
           </div>
        </section>
      </main>

      <footer className="py-12 border-t bg-white dark:bg-zinc-950 mt-24">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CalMeet Inc. Knowledge Base.
        </div>
      </footer>
    </div>
  );
}
