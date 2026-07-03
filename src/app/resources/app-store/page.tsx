"use client";

import { Navbar } from "@/components/landing/navbar";
import { motion } from "framer-motion";
import { Search, Zap, LayoutGrid, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const apps = [
  { name: "Google Calendar", category: "Calendar", logo: "/logos/google-calendar.svg", status: "Installed" },
  { name: "Outlook Calendar", category: "Calendar", logo: "/logos/outlook.png", status: "Connect" },
  { name: "Zoom", category: "Video", logo: "/logos/zoom.svg", status: "Installed" },
  { name: "Google Meet", category: "Video", logo: "/logos/google-meet.svg", status: "Installed" },
  { name: "Slack", category: "Notifications", logo: "/logos/slack.svg", status: "Connect" },
  { name: "Zapier", category: "Automation", logo: "/logos/zapier.svg", status: "Connect" },
  { name: "Stripe", category: "Payments", logo: "/logos/stripe.png", status: "Connect" },
  { name: "Salesforce", category: "CRM", logo: "/logos/teams.png", status: "Coming Soon" },
  { name: "HubSpot", category: "CRM", logo: "/logos/teams.png", status: "Coming Soon" },
];

export default function AppStorePage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        {/* Header */}
        <section className="container mx-auto px-4 mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <LayoutGrid className="h-3 w-3" /> App Store
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight italic font-serif">
              Extend your <span className="text-primary">workflow.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Connect CalMeet with the tools you use every day. 
              Calendars, video conferencing, CRM, and more.
            </p>
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search for an integration..." 
                className="h-14 pl-12 rounded-2xl border-primary/20 bg-white dark:bg-zinc-900 shadow-xl shadow-primary/5 text-lg"
              />
            </div>
          </motion.div>
        </section>

        {/* Categories Section */}
        <section className="container mx-auto px-4 mb-12">
          <div className="flex flex-wrap gap-2 justify-center">
            {["All Apps", "Calendar", "Video", "CRM", "Notifications", "Automation", "Payments"].map((cat, i) => (
              <Button key={cat} variant={i === 0 ? "default" : "outline"} className="rounded-full px-6">
                {cat}
              </Button>
            ))}
          </div>
        </section>

        {/* App Grid */}
        <section className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app, i) => (
              <motion.div
                key={app.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-zinc-900 border rounded-[2rem] p-6 hover:shadow-2xl transition-all group"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border flex items-center justify-center p-3">
                    <img src={app.logo} alt={app.name} className="w-full h-full object-contain" />
                  </div>
                  {app.status === "Installed" ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      {app.status}
                    </div>
                  ) : (
                    <Button variant="secondary" size="sm" className="rounded-full px-4 h-8 text-xs font-bold" disabled={app.status === "Coming Soon"}>
                      {app.status}
                    </Button>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-1">{app.name}</h3>
                <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-bold">{app.category}</p>
                <div className="flex items-center justify-between text-sm pt-6 border-t">
                  <span className="text-muted-foreground">View details</span>
                  <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 mt-32">
          <div className="bg-primary text-primary-foreground rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center">
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6 italic font-serif">Missing something?</h2>
              <p className="text-xl text-primary-foreground/80 mb-10 max-w-xl mx-auto">
                Our developers are working around the clock to add new integrations. 
                Tell us what you&apos;d like to see next.
              </p>
              <Button variant="secondary" size="lg" className="rounded-full px-10 h-14 text-lg font-bold">Request an App</Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CalMeet App Store. Built with love.
        </div>
      </footer>
    </div>
  );
}
