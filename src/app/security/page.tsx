"use client";

import { Navbar } from "@/components/landing/navbar";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Eye, Server, CheckCircle2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SecurityPage() {
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
            <div className="p-6 rounded-full bg-emerald-500/10 text-emerald-500">
              <ShieldCheck className="h-12 w-12" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            Enterprise-grade <span className="text-emerald-500 italic">security.</span>
          </motion.h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Your trust is our top priority. We use industry-leading security practices 
            to keep your data safe, private, and secure.
          </p>
          <div className="flex justify-center gap-4">
             <Button size="lg" className="h-16 px-10 rounded-full text-lg font-bold bg-emerald-600 hover:bg-emerald-700">
                Download Trust Report
             </Button>
             <Button size="lg" variant="outline" className="h-16 px-10 rounded-full text-lg font-bold border-emerald-500/20">
                Contact Compliance
             </Button>
          </div>
        </section>

        {/* Pillars of Security */}
        <section className="container mx-auto px-4 mb-32">
           <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: <Lock className="h-6 w-6" />, title: "Data Encryption", desc: "All data is encrypted at rest using AES-256 and in transit using TLS 1.3." },
                { icon: <Eye className="h-6 w-6" />, title: "Privacy First", desc: "We are GDPR and CCPA compliant. Your data belongs to you, and we never sell it." },
                { icon: <Server className="h-6 w-6" />, title: "Secure Infrastructure", desc: "Hosted on AWS with multiple availability zones and 99.99% uptime." }
              ].map((item, i) => (
                <div key={item.title} className="p-10 rounded-[3rem] bg-zinc-50 dark:bg-zinc-900 border hover:shadow-xl transition-all">
                   <div className="mb-6 p-4 bg-emerald-500/10 w-fit rounded-2xl text-emerald-500">{item.icon}</div>
                   <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                   <p className="text-muted-foreground leading-relaxed text-sm">{item.desc}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Certifications Section */}
        <section className="py-24 bg-zinc-950 text-white border-y border-zinc-800">
           <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold mb-12 opacity-50 uppercase tracking-widest">Our Certifications \u0026 Compliance</h2>
              <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all">
                 <div className="font-black text-4xl italic">SOC2 TYPE II</div>
                 <div className="font-black text-4xl italic">HIPAA</div>
                 <div className="font-black text-4xl italic">GDPR</div>
                 <div className="font-black text-4xl italic">CCPA</div>
                 <div className="font-black text-4xl italic">ISO 27001</div>
              </div>
           </div>
        </section>

        {/* Specific Features */}
        <section className="container mx-auto px-4 mt-32 max-w-6xl">
           <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                 <h2 className="text-4xl font-bold mb-8 italic tracking-tight">Security features <br/>for your team.</h2>
                 <div className="space-y-6">
                    {[
                      "SAML Single Sign-On (SSO)",
                      "Two-Factor Authentication (2FA)",
                      "SCIM User Provisioning",
                      "Role-Based Access Control (RBAC)",
                      "Audit Logs \u0026 Activity Tracking",
                      "Custom Data Retention Policies"
                    ].map(text => (
                      <div key={text} className="flex items-center gap-3">
                         <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                         <span className="font-bold">{text}</span>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900 border rounded-[4rem] p-12 text-center">
                 <ShieldAlert className="h-20 w-20 text-emerald-500 mx-auto mb-8" />
                 <h3 className="text-2xl font-bold mb-4">Found a vulnerability?</h3>
                 <p className="text-muted-foreground mb-8 leading-relaxed">
                    We take security reports seriously. Please contact our security team 
                    directly if you believe you have found a security issue.
                 </p>
                 <Button className="rounded-full px-8 bg-emerald-600 hover:bg-emerald-700">
                    Report Vulnerability
                 </Button>
              </div>
           </div>
        </section>
      </main>

      <footer className="py-12 border-t bg-zinc-50 dark:bg-zinc-950 mt-24">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CalMeet Inc. Security Operations Center.
        </div>
      </footer>
    </div>
  );
}
