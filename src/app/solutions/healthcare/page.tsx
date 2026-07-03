"use client";

import { Navbar } from "@/components/landing/navbar";
import { Stethoscope, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HealthcarePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <section className="container mx-auto px-4 max-w-4xl text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-600 border border-blue-500/20">
            <Stethoscope className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 italic font-serif">CalMeet for Healthcare</h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Patient-first scheduling. Secure, compliant, and easy to use for both providers and patients.
          </p>
          <div className="flex justify-center gap-4">
             <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700 px-10 text-white">Book a Demo</Button>
             <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-200 text-sm font-bold uppercase tracking-tight">
                <ShieldCheck className="h-4 w-4" /> HIPAA Compliant
             </div>
          </div>
          
          <div className="mt-24 grid md:grid-cols-2 gap-12 text-left">
             <div>
                <h4 className="text-2xl font-bold mb-6 italic">Secure Patient Intake</h4>
                <p className="text-muted-foreground leading-relaxed mb-6">Collect necessary patient info securely at the time of booking. Ensure your providers have everything they need before the appointment starts.</p>
                <ul className="space-y-4">
                   <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-blue-600" /> End-to-end encryption</li>
                   <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-blue-600" /> BAA available</li>
                   <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-blue-600" /> Data residency controls</li>
                </ul>
             </div>
             <div className="bg-blue-50 rounded-3xl p-8 border border-blue-100 flex items-center justify-center">
                <div className="text-center">
                   <div className="text-5xl font-bold text-blue-700 mb-2">35%</div>
                   <p className="text-blue-900 font-medium italic">Reduction in no-shows with automated reminders.</p>
                </div>
             </div>
          </div>
        </section>
      </main>
      <footer className="py-12 border-t bg-muted/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CalMeet Inc. Healthcare Solutions.
        </div>
      </footer>
    </div>
  );
}
