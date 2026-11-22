"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Users, 
  BarChart3, 
  Lock, 
  Zap, 
  Headphones,
  CheckCircle2,
  Building2,
  Settings,
  Database,
  Calendar,
  Video,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  {
    title: "Security & Cloud Compliance",
    description: "Built on SOC2 and HIPAA-compliant cloud infrastructure (AWS, Supabase, Google Cloud) with SHA-256 hashed API keys and encrypted secrets.",
    icon: <ShieldCheck className="h-6 w-6" />
  },
  {
    title: "Centralized Admin Controls",
    description: "Role-based team access (Owner, Admin, Member), centralized organization billing, member limits, and domain-level scheduling policies.",
    icon: <Settings className="h-6 w-6" />
  },
  {
    title: "Priority Engineering Support",
    description: "Direct access to technical engineers, custom integration onboarding, and dedicated business-hours SLA for peace of mind.",
    icon: <Headphones className="h-6 w-6" />
  }
];

export default function EnterprisePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        {/* Premium Hero Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="max-w-4xl mx-auto">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-center"
             >
                <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">
                   CalMeet for Enterprise
                </div>
                <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
                  Scheduling infrastructure <br />
                  <span className="text-muted-foreground font-serif italic">built for scale.</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                  High-reliability calendar sync, round-robin distribution, and enterprise governance designed for high-performing teams.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" className="rounded-full px-10 h-14 text-base font-bold shadow-lg" render={<Link href="/support?topic=enterprise-sales" />}>
                    Contact Sales
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base font-semibold" render={<Link href="/preview-user/review-meeting" />}>
                    Try Interactive Demo
                  </Button>
                </div>
             </motion.div>
          </div>
        </section>

        {/* Integration Architecture / Standards */}
        <section className="container mx-auto px-4 mb-28">
           <p className="text-center text-xs font-bold text-muted-foreground uppercase tracking-widest mb-8">
             Seamlessly connects with your existing workplace stack
           </p>
           <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl border bg-card/50 flex flex-col items-center justify-center text-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                <span className="text-sm font-semibold">Google Calendar</span>
                <span className="text-[11px] text-muted-foreground">Two-way real-time sync</span>
              </div>
              <div className="p-4 rounded-2xl border bg-card/50 flex flex-col items-center justify-center text-center gap-2">
                <Video className="h-6 w-6 text-primary" />
                <span className="text-sm font-semibold">Google Meet & Zoom</span>
                <span className="text-[11px] text-muted-foreground">Auto-generated links</span>
              </div>
              <div className="p-4 rounded-2xl border bg-card/50 flex flex-col items-center justify-center text-center gap-2">
                <Lock className="h-6 w-6 text-primary" />
                <span className="text-sm font-semibold">Compliant Cloud</span>
                <span className="text-[11px] text-muted-foreground">AWS & Supabase hosted</span>
              </div>
              <div className="p-4 rounded-2xl border bg-card/50 flex flex-col items-center justify-center text-center gap-2">
                <Zap className="h-6 w-6 text-primary" />
                <span className="text-sm font-semibold">Webhooks & API</span>
                <span className="text-[11px] text-muted-foreground">Signed HMAC payload dispatch</span>
              </div>
           </div>
        </section>

        {/* Enterprise Features */}
        <section className="bg-secondary/20 py-24 border-y">
           <div className="container mx-auto px-4">
              <div className="text-center max-w-2xl mx-auto mb-16">
                 <h2 className="text-3xl font-bold tracking-tight mb-4">Enterprise-grade capabilities out of the box</h2>
                 <p className="text-muted-foreground text-sm">
                   Give your administrators complete visibility while keeping booking effortless for your prospects and candidates.
                 </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                 {features.map((f, i) => (
                   <div key={i} className="p-8 rounded-3xl bg-background border shadow-xs">
                      <div className="mb-6 p-3 bg-primary/10 w-fit rounded-2xl text-primary">{f.icon}</div>
                      <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Custom Requirements CTA */}
        <section className="container mx-auto px-4 mt-24 text-center">
           <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight">Need a custom contract or high-volume plan?</h2>
              <p className="text-lg text-muted-foreground mb-10">
                We offer custom seat plans, invoicing via ACH/wire, dedicated database instances, and tailored SLAs.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <Button size="lg" className="rounded-full px-8" render={<Link href="/preview-user/review-meeting" />}>
                   Schedule a Demo
                 </Button>
                 <Button size="lg" variant="outline" className="rounded-full px-8" render={<Link href="/security" />}>
                   Review Security Architecture
                 </Button>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
