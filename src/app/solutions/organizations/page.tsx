"use client";

import { Navbar } from "@/components/landing/navbar";
import { motion } from "framer-motion";
import { Network, Shield, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrganizationsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <section className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary border border-primary/20">
              <Network className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight italic font-serif underline decoration-primary/20">For Organizations</h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Advanced controls and centralized management for large-scale operations.
            </p>
            <Button size="lg" className="rounded-full px-12">Contact Sales</Button>
          </motion.div>

          <div className="mt-32 grid md:grid-cols-3 gap-8">
             <div className="p-8 rounded-[2rem] bg-secondary/10 border text-left">
                <Shield className="h-8 w-8 mb-6 text-primary" />
                <h4 className="text-xl font-bold mb-4">Granular Permissions</h4>
                <p className="text-sm text-muted-foreground">Manage user access and roles across multiple departments with ease.</p>
             </div>
             <div className="p-8 rounded-[2rem] bg-secondary/10 border text-left">
                <BarChart3 className="h-8 w-8 mb-6 text-primary" />
                <h4 className="text-xl font-bold mb-4">Deep Analytics</h4>
                <p className="text-sm text-muted-foreground">Monitor scheduling volume and team performance with real-time dashboards.</p>
             </div>
             <div className="p-8 rounded-[2rem] bg-secondary/10 border text-left">
                <Network className="h-8 w-8 mb-6 text-primary" />
                <h4 className="text-xl font-bold mb-4">Directory Sync</h4>
                <p className="text-sm text-muted-foreground">Automatically sync with your HRIS or Identity Provider (Okta, Azure AD).</p>
             </div>
          </div>
        </section>
      </main>
      <footer className="py-12 border-t bg-muted/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MeetMe Inc. Org Management.
        </div>
      </footer>
    </div>
  );
}
