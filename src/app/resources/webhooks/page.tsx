"use client";

import { Navbar } from "@/components/landing/navbar";
import { motion } from "framer-motion";
import { Webhook, Terminal, Shield, Zap, ArrowRight, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function WebhooksPage() {
  const [copied, setCopied] = useState(false);
  const samplePayload = `{
  "event": "booking.created",
  "created_at": "2024-05-12T14:30:00Z",
  "payload": {
    "booking_id": "bk_12345",
    "event_type": "15-minute-sync",
    "invitee": {
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
}`;

  const copyPayload = () => {
    navigator.clipboard.writeText(samplePayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            <div className="p-6 rounded-full bg-violet-500/10 text-violet-500">
              <Webhook className="h-12 w-12" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            Real-time <span className="text-violet-500 italic">event data.</span>
          </motion.h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Get notified instantly when events happen in your CalMeet account. 
            Connect your own applications and build custom integrations.
          </p>
          <Button size="lg" className="h-16 px-10 rounded-full text-lg font-bold bg-violet-600 hover:bg-violet-700">
            Create Webhook Endpoint
          </Button>
        </section>

        {/* Technical Details */}
        <section className="container mx-auto px-4 mb-32 max-w-6xl">
           <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-zinc-950 rounded-[3rem] p-8 md:p-12 text-white relative group">
                 <div className="absolute top-8 right-8 cursor-pointer text-zinc-500 hover:text-white transition-colors" onClick={copyPayload}>
                    {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                 </div>
                 <div className="flex items-center gap-2 mb-8 border-b border-zinc-800 pb-4">
                    <Terminal className="h-4 w-4 text-violet-500" />
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold">Sample Payload</span>
                 </div>
                 <pre className="font-mono text-sm text-zinc-300 leading-relaxed overflow-x-auto">
                    <code>{samplePayload}</code>
                 </pre>
              </div>
              <div>
                 <h2 className="text-3xl font-bold mb-8 italic">Built for Developers.</h2>
                 <div className="space-y-10">
                    {[
                      { icon: <Shield className="h-6 w-6" />, title: "Secure Signing", desc: "Verify every payload with HMAC signatures to ensure it came from us." },
                      { icon: <Zap className="h-6 w-6" />, title: "Instant Delivery", desc: "99.9% of our webhooks are delivered in less than 200ms." },
                      { icon: <ArrowRight className="h-6 w-6" />, title: "Retries Included", desc: "If your server is down, we'll retry delivery for up to 24 hours." }
                    ].map(item => (
                      <div key={item.title} className="flex gap-4">
                         <div className="p-3 rounded-xl bg-violet-500/10 text-violet-500 h-fit">
                            {item.icon}
                         </div>
                         <div>
                            <h4 className="font-bold mb-1">{item.title}</h4>
                            <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 mt-32 text-center">
           <div className="max-w-2xl mx-auto py-16 border-y">
              <h2 className="text-3xl font-bold mb-6 italic">Ready to integrate?</h2>
              <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                 Check out our full technical documentation for a complete list of 
                 supported events and security practices.
              </p>
              <div className="flex justify-center gap-4">
                 <Button size="lg" className="rounded-full px-10 h-14 font-bold bg-violet-600 hover:bg-violet-700">
                    Explore API Docs
                 </Button>
                 <Button size="lg" variant="outline" className="rounded-full px-10 h-14 font-bold">
                    View FAQ
                 </Button>
              </div>
           </div>
        </section>
      </main>

      <footer className="py-12 border-t bg-zinc-50 dark:bg-zinc-950 mt-24">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CalMeet Inc. For developers.
        </div>
      </footer>
    </div>
  );
}
