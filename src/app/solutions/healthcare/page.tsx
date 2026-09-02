"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { 
  Stethoscope, 
  ShieldCheck, 
  Clock, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Lock,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Patient Intake & Health Questionnaires",
    description: "Collect symptoms, emergency contact details, and medical history confidentially during the appointment booking flow.",
    icon: Stethoscope,
  },
  {
    title: "Confidential Video Consultations",
    description: "Launch private, encrypted 1-on-1 telehealth video sessions with Google Meet or Zoom automatically generated on confirmation.",
    icon: Lock,
  },
  {
    title: "Patient Care Buffers & Cool-downs",
    description: "Protect clinical documentation time by enforcing 15-minute buffers between patient consultations and setting daily patient limits.",
    icon: Clock,
  },
  {
    title: "Upfront Consultation Payments",
    description: "Accept consultation fees upfront via Razorpay or Stripe to reduce cancellations and secure clinical bookings.",
    icon: CreditCard,
  },
];

export default function HealthcareSolutionPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-6">
            <Link href="/solutions" className="hover:text-zinc-600 dark:hover:text-zinc-200">Solutions</Link>
            <span>/</span>
            <span className="text-zinc-800 dark:text-zinc-200 font-medium">Healthcare</span>
          </div>

          {/* Hero Header */}
          <div className="mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold mb-3 border border-zinc-200 dark:border-zinc-700">
              <Stethoscope className="h-3.5 w-3.5" />
              <span>For Doctors, Therapists & Telehealth Clinics</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Confidential, patient-first scheduling for healthcare
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mb-6">
              Deliver a secure and professional appointment booking experience. Screen patients, protect clinical note-taking time, and eliminate appointment delays.
            </p>
            <div className="flex gap-3">
              <Button render={<Link href="/signup" />} size="sm" className="h-9 px-4 text-xs font-semibold">
                Start Free Trial <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
              <Button render={<Link href="/pricing" />} variant="outline" size="sm" className="h-9 px-4 text-xs font-semibold border-zinc-200 dark:border-zinc-800">
                View Pricing
              </Button>
            </div>
          </div>

          {/* 4 Feature Cards */}
          <div className="grid sm:grid-cols-2 gap-3 mb-12">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-2"
                >
                  <div className="w-7 h-7 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{f.title}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>

          {/* Checklist Box */}
          <div className="mb-12 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 p-6 shadow-2xs">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide mb-4">
              Healthcare & Telehealth Standards
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "TLS 1.3 encrypted data in transit + AES-256 at rest",
                "Custom patient intake & symptoms questionnaire",
                "Automatic video consultation link generation",
                "Upfront consultation fee collection",
                "Automated reminder sequences to reduce patient no-shows",
                "Custom buffer times between patient sessions",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">Ready to modernize your clinic’s appointment booking?</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Setup your practice’s scheduling in under 2 minutes.</div>
            </div>
            <Button render={<Link href="/signup" />} size="sm" className="h-9 px-4 text-xs font-semibold">
              Get Started Free
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
