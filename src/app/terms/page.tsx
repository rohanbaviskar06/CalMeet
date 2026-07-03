"use client";

import { Navbar } from "@/components/landing/navbar";
import { motion } from "framer-motion";
import { FileText, ShieldCheck, Scale, Clock } from "lucide-react";

export default function TermsPage() {
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight italic font-serif">Terms of <span className="text-primary">Service.</span></h1>
            <div className="flex items-center gap-6 text-sm text-muted-foreground border-b pb-8">
               <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Last Updated: May 12, 2024
               </div>
               <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> Secure & Compliant
               </div>
            </div>
          </motion.div>

          <div className="prose prose-zinc dark:prose-invert max-w-none">
             <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-[2.5rem] border mb-12">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                   <Scale className="h-5 w-5 text-primary" /> The TL;DR (Simplified)
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                   <li>• You own your data and your brand.</li>
                   <li>• Don&apos;t use CalMeet for illegal activities or spam.</li>
                   <li>• We promise a 99.9% uptime for our services.</li>
                   <li>• You can cancel your subscription at any time.</li>
                </ul>
             </div>

             <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                   By accessing or using the CalMeet platform, you agree to be bound by these Terms of Service 
                   and all applicable laws and regulations. If you do not agree with any of these terms, 
                   you are prohibited from using or accessing this site.
                </p>
             </section>

             <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">2. Use License</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                   Permission is granted to temporarily download one copy of the materials on CalMeet&apos;s 
                   website for personal, non-commercial transitory viewing only. This is the grant of 
                   a license, not a transfer of title.
                </p>
             </section>

             <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">3. User Obligations</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                   You are responsible for maintaining the confidentiality of your account and password. 
                   You agree to notify us immediately of any unauthorized use of your account. CalMeet 
                   is not liable for any loss that you may incur as a result of someone else using your 
                   password or account.
                </p>
             </section>

             <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">4. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                   The service and its original content, features, and functionality are and will remain 
                   the exclusive property of CalMeet and its licensors. Our trademarks and trade dress 
                   may not be used in connection with any product or service without our prior written consent.
                </p>
             </section>

             <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">5. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                   In no event shall CalMeet, nor its directors, employees, partners, agents, suppliers, 
                   or affiliates, be liable for any indirect, incidental, special, consequential or 
                   punitive damages, including without limitation, loss of profits, data, use, goodwill, 
                   or other intangible losses.
                </p>
             </section>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t bg-zinc-50 dark:bg-zinc-950 mt-24">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CalMeet Legal Department.
        </div>
      </footer>
    </div>
  );
}
