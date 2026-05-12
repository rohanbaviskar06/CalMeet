"use client";

import { Navbar } from "@/components/landing/navbar";
import { motion } from "framer-motion";
import { 
  Code2, 
  Layout, 
  MousePointer2, 
  ExternalLink, 
  CheckCircle2,
  ArrowRight,
  Terminal,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const embedTypes = [
  {
    title: "Inline Embed",
    description: "Seamlessly integrate the booking flow into your website's content.",
    icon: <Layout className="h-6 w-6" />,
    features: ["Responsive design", "Fits any container", "Clean white-label look"]
  },
  {
    title: "Floating Button",
    description: "Add a consistent 'Book Now' button that follows your users.",
    icon: <MousePointer2 className="h-6 w-6" />,
    features: ["Corner positioning", "Custom colors", "Always accessible"]
  },
  {
    title: "Popup Trigger",
    description: "Trigger the booking modal from any existing link or button.",
    icon: <ExternalLink className="h-6 w-6" />,
    features: ["Lightweight script", "Custom CSS support", "Zero layout shift"]
  }
];

export default function EmbedDocumentationPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        {/* Hero */}
        <section className="container mx-auto px-4 mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <Code2 className="h-3 w-3" /> Embeddable Scheduling
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight italic font-serif">
              Add MeetMe to <span className="text-primary underline decoration-primary/20">your site.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Powerful, lightweight, and fully customizable embed options for every type of website.
            </p>
            <div className="flex justify-center gap-4">
               <Link href="/dashboard/event-types">
                 <Button size="lg" className="rounded-full px-8">Get Your Embed Code</Button>
               </Link>
               <Button size="lg" variant="outline" className="rounded-full px-8">View API Docs</Button>
            </div>
          </motion.div>
        </section>

        {/* Embed Options Grid */}
        <section className="container mx-auto px-4 mb-32">
          <div className="grid md:grid-cols-3 gap-8">
            {embedTypes.map((type, i) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[2.5rem] border bg-card hover:shadow-xl transition-all"
              >
                <div className="mb-6 p-4 bg-primary/5 w-fit rounded-2xl text-primary">{type.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{type.title}</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed text-sm">{type.description}</p>
                <ul className="space-y-3 mb-8">
                  {type.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs font-semibold">
                      <CheckCircle2 className="h-3 w-3 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
                <Button variant="ghost" className="p-0 hover:bg-transparent group text-primary font-bold text-sm">
                  Documentation <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Technical Specs */}
        <section className="bg-slate-950 text-white py-24 overflow-hidden">
          <div className="container mx-auto px-4">
             <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                   <h2 className="text-3xl font-bold mb-8 italic font-serif">High Performance \u0026 Security</h2>
                   <div className="space-y-8">
                      <div className="flex gap-4">
                         <Terminal className="h-6 w-6 text-primary flex-shrink-0" />
                         <div>
                            <h4 className="font-bold mb-1">Optimized Loading</h4>
                            <p className="text-slate-400 text-sm">Our embed script is less than 5kb and uses modern techniques to avoid blocking your site&apos;s main thread.</p>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0" />
                         <div>
                            <h4 className="font-bold mb-1">CORS \u0026 CSP Friendly</h4>
                            <p className="text-slate-400 text-sm">Pre-configured to work with common security policies. Support for Subresource Integrity (SRI).</p>
                         </div>
                      </div>
                   </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative">
                   <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
                   <div className="font-mono text-sm text-slate-400">
                      <div className="mb-4 text-primary">// Simple implementation</div>
                      <div className="space-y-1">
                         <div>\u003cscript src=&quot;https://meetme.inc/embed.js&quot;\u003e\u003c/script\u003e</div>
                         <div>\u003cscript\u003e</div>
                         <div className="pl-4">MeetMe.showPopup(&apos;https://meetme.inc/alex/demo&apos;);</div>
                         <div>\u003c/script\u003e</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Custom Styling */}
        <section className="container mx-auto px-4 mt-32 text-center">
           <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Fully Brandable</h2>
              <p className="text-muted-foreground text-lg mb-12">
                 Pass custom styles via the query parameters or use our CSS overrides to make the embed feel like it was built by you.
              </p>
              <div className="flex justify-center gap-4 grayscale opacity-50">
                 <div className="font-bold text-2xl uppercase tracking-tighter italic">Styles v2.0</div>
                 <div className="font-bold text-2xl uppercase tracking-tighter italic">Dynamic Themes</div>
                 <div className="font-bold text-2xl uppercase tracking-tighter italic">Custom CSS</div>
              </div>
           </div>
        </section>
      </main>

      <footer className="py-12 border-t bg-muted/50 mt-24">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MeetMe Inc. For the web.
        </div>
      </footer>
    </div>
  );
}
