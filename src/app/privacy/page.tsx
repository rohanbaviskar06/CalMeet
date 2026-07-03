"use client";

import { Navbar } from "@/components/landing/navbar";
import { motion } from "framer-motion";
import { Eye, Shield, Lock, Clock } from "lucide-react";

export default function PrivacyPage() {
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight italic font-serif">Privacy <span className="text-primary">Policy.</span></h1>
            <div className="flex items-center gap-6 text-sm text-muted-foreground border-b pb-8">
               <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Last Updated: May 12, 2024
               </div>
               <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" /> GDPR \u0026 CCPA Compliant
               </div>
            </div>
          </motion.div>

          <div className="prose prose-zinc dark:prose-invert max-w-none">
             <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-[2.5rem] border mb-12">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                   <Eye className="h-5 w-5 text-primary" /> Our Privacy Promise
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                   We believe privacy is a fundamental human right. We never sell your data, 
                   we only collect what is strictly necessary to provide our services, 
                   and we are transparent about how your data is used.
                </p>
             </div>

             <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">1. Data We Collect</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                   We collect information you provide directly to us when you create an account, 
                   sync your calendar, or communicate with us. This includes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                   <li>Account information (Name, Email, Password)</li>
                   <li>Calendar data (Free/Busy times, Event titles)</li>
                   <li>Booking details (Invitee names, meeting notes)</li>
                   <li>Payment information (Processed via Stripe)</li>
                </ul>
             </section>

             <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">2. How We Use Your Data</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                   Your data is primarily used to provide and improve the CalMeet scheduling service. 
                   Specifically, we use it to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                   <li>Check your availability and prevent double bookings</li>
                   <li>Send meeting confirmations and reminders</li>
                   <li>Process your subscriptions and payments</li>
                   <li>Analyze service performance and debug issues</li>
                </ul>
             </section>

             <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">3. Data Sharing</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                   We do not sell your personal data. We only share data with trusted third-party 
                   service providers (like AWS for hosting and Stripe for payments) who help 
                   us deliver our services.
                </p>
             </section>

             <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">4. Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                   Depending on your location, you may have the right to access, correct, or 
                   delete your personal data. You can exercise these rights through your 
                   account settings or by contacting our privacy team.
                </p>
             </section>

             <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">5. Security</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                   We implement industry-standard security measures to protect your data, 
                   including encryption at rest and in transit. For more details, visit our 
                   dedicated <a href="/security" className="text-primary hover:underline">Security Page</a>.
                </p>
             </section>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t bg-zinc-50 dark:bg-zinc-950 mt-24">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CalMeet Privacy Team.
        </div>
      </footer>
    </div>
  );
}
