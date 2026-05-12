"use client";

import { Navbar } from "@/components/landing/navbar";
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
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Security & Compliance",
    description: "SOC2 Type II, GDPR, and HIPAA compliance. Advanced SSO/SAML integrations.",
    icon: <ShieldCheck className="h-6 w-6" />
  },
  {
    title: "Admin Controls",
    description: "Centralized billing, user management, and organization-wide scheduling policies.",
    icon: <Settings className="h-6 w-6" />
  },
  {
    title: "Dedicated Support",
    description: "24/7 priority support with a dedicated customer success manager.",
    icon: <Headphones className="h-6 w-6" />
  }
];

export default function EnterprisePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        {/* Premium Hero Section */}
        <section className="container mx-auto px-4 mb-24">
          <div className="max-w-4xl mx-auto">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-center"
             >
                <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">
                   MeetMe for Enterprise
                </div>
                <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
                  Scheduling infrastructure <br />
                  <span className="text-muted-foreground font-serif italic">built for scale.</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                  The most secure, scalable, and customizable scheduling platform for large organizations.
                </p>
                <Button size="lg" className="rounded-full px-10 h-14 text-lg font-bold">Contact Sales</Button>
             </motion.div>
          </div>
        </section>

        {/* Logo Cloud / Trust */}
        <section className="container mx-auto px-4 mb-32">
           <p className="text-center text-sm font-bold text-muted-foreground uppercase tracking-widest mb-12">Trusted by global leaders</p>
           <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
              {/* Using icons as placeholders for logos */}
              <div className="flex items-center gap-2 font-bold text-2xl"><Building2 className="h-8 w-8" /> Acme Corp</div>
              <div className="flex items-center gap-2 font-bold text-2xl"><Database className="h-8 w-8" /> TechFlow</div>
              <div className="flex items-center gap-2 font-bold text-2xl"><Zap className="h-8 w-8" /> GlobalSync</div>
              <div className="flex items-center gap-2 font-bold text-2xl"><Lock className="h-8 w-8" /> SecureNet</div>
           </div>
        </section>

        {/* Enterprise Features */}
        <section className="bg-secondary/20 py-32 border-y">
           <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-12">
                 {features.map((f, i) => (
                   <div key={i} className="p-8 rounded-3xl bg-background border shadow-sm">
                      <div className="mb-6 p-3 bg-primary/10 w-fit rounded-2xl text-primary">{f.icon}</div>
                      <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Custom Requirements CTA */}
        <section className="container mx-auto px-4 mt-32 text-center">
           <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-8 italic font-serif underline decoration-primary/30">Have specific requirements?</h2>
              <p className="text-xl text-muted-foreground mb-12">
                We offer custom contracts, white-labeling, and dedicated infrastructure for high-volume needs.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <Button size="lg" className="rounded-full px-8">Schedule a Demo</Button>
                 <Button size="lg" variant="outline" className="rounded-full px-8">Review Security Docs</Button>
              </div>
           </div>
        </section>
      </main>

      <footer className="py-12 border-t bg-muted/50 mt-24">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MeetMe Inc. Enterprise Solutions.
        </div>
      </footer>
    </div>
  );
}
