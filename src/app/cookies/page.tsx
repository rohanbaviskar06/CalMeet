"use client";

import { Navbar } from "@/components/landing/navbar";
import { motion } from "framer-motion";
import { Cookie, Clock, Info, Shield } from "lucide-react";

export default function CookiesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <section className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight italic font-serif">Cookie <span className="text-primary">Policy.</span></h1>
            <div className="flex items-center gap-6 text-sm text-muted-foreground border-b pb-8">
               <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Last Updated: May 12, 2024
               </div>
               <div className="flex items-center gap-2">
                  <Cookie className="h-4 w-4" /> Transparent Tracking
               </div>
            </div>
          </motion.div>

          <div className="prose prose-zinc dark:prose-invert max-w-none">
             <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-[2.5rem] border mb-12">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                   <Info className="h-5 w-5 text-primary" /> What are cookies?
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                   Cookies are small text files that are stored on your device when you visit 
                   a website. They help us remember your preferences, keep you logged in, 
                   and understand how you use our service.
                </p>
             </div>

             <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">1. Essential Cookies</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                   These cookies are strictly necessary for the service to function properly. 
                   They include things like:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                   <li>Authentication (keeping you logged in)</li>
                   <li>Security (preventing CSRF attacks)</li>
                   <li>Session management (remembering your booking progress)</li>
                </ul>
             </section>

             <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">2. Analytics Cookies</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                   We use these cookies to understand how people use CalMeet, which features 
                   are most popular, and where we can improve. All data is anonymized 
                   before processing.
                </p>
             </section>

             <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">3. Functional Cookies</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                   These cookies allow us to remember choices you make (like your language 
                   or dark mode preference) to provide a more personalized experience.
                </p>
             </section>

             <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">4. How to Control Cookies</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                   Most web browsers allow you to control cookies through their settings. 
                   However, disabling essential cookies may prevent CalMeet from working 
                   correctly.
                </p>
             </section>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t bg-zinc-50 dark:bg-zinc-950 mt-24">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CalMeet Legal Team.
        </div>
      </footer>
    </div>
  );
}
