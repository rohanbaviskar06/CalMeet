"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { motion } from "framer-motion";
import { 
  Code2, 
  Layout, 
  MousePointer2, 
  ExternalLink, 
  CheckCircle2,
  ArrowRight,
  Terminal,
  ShieldCheck,
  Sparkles,
  Layers,
  Palette,
  Laptop
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

const embedTypes = [
  {
    title: "Inline Embed",
    description: "Seamlessly integrate the booking flow directly into your website's main body content.",
    icon: <Layout className="h-6 w-6" />,
    features: ["Responsive design", "Adapts to container sizes", "Minimalist layout shifts"]
  },
  {
    title: "Floating Button",
    description: "Add a consistent, floating 'Book Meeting' call-to-action that follows your visitors.",
    icon: <MousePointer2 className="h-6 w-6" />,
    features: ["Adjustable screen alignment", "Tailored brand colors", "Interactive hover animation"]
  },
  {
    title: "Popup Trigger Modal",
    description: "Trigger the CalMeet schedule form as a popup lightbox from any existing button.",
    icon: <ExternalLink className="h-6 w-6" />,
    features: ["Lightweight script (less than 5kb)", "Zero custom setup required", "Smooth overlay animations"]
  }
];

const codeSamples = {
  javascript: `<!-- Add to document body -->
<script src="https://calmeet.com/embed.js" async defer></script>
<script>
  window.onload = function() {
    CalMeet.initInline({
      element: '#calmeet-booking-frame',
      url: 'https://calmeet.com/johndoe/quick-meet'
    });
  }
</script>`,
  html: `<!-- Booking Frame Container -->
<div 
  id="calmeet-booking-frame" 
  style="min-width: 320px; height: 700px; width: 100%; border: none;"
></div>`,
  react: `import { useEffect } from 'react';

export default function BookingEmbed() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://calmeet.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // @ts-ignore
      window.CalMeet?.initInline({
        element: '#booking-frame',
        url: 'https://calmeet.com/johndoe/quick-meet'
      });
    };
  }, []);

  return <div id="booking-frame" className="w-full min-h-[700px]" />;
}`
};

export default function EmbedDocumentationPage() {
  const [activeTab, setActiveTab] = useState<"javascript" | "html" | "react">("javascript");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 md:pt-32 bg-background relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[10%] left-[-15%] w-[50%] h-[40%] bg-primary/5 rounded-full blur-[140px]" />
          <div className="absolute bottom-[20%] right-[-15%] w-[45%] h-[45%] bg-violet-500/5 rounded-full blur-[140px]" />
        </div>

        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-20 md:mb-28 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 mb-6 text-xs font-bold rounded-full bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider">
              <Code2 className="h-3.5 w-3.5" /> Integrate Anywhere
            </span>
            <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] text-zinc-900 dark:text-zinc-100">
              Embed CalMeet on <br />
              <span className="bg-gradient-to-r from-primary via-violet-500 to-indigo-600 bg-clip-text text-transparent">Any Website</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              Automate your scheduling directly within your product or marketing site.
              CalMeet embeds load instantly, match your styles, and work on any platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard/event-types" className="w-full sm:w-auto">
                <Button size="lg" className="h-12 px-8 text-base rounded-full shadow-lg hover:shadow-primary/25 transition-all w-full">
                  Get Embed Code <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="h-12 px-8 text-base rounded-full bg-background/50 backdrop-blur-sm w-full sm:w-auto">
                View Developer Docs
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Interactive Code Demo Grid */}
        <section className="container mx-auto px-4 mb-24 md:mb-36 relative z-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Tech Left */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
              <div className="inline-flex items-center gap-1 text-xs font-bold text-primary uppercase tracking-widest">
                <Sparkles className="h-3.5 w-3.5" /> Simple Integration
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Five lines of code. <br />Infinite possibilities.
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Choose your preferred styling framework. Just copy-paste the snippet into your codebase to initiate custom scheduling flows, lightboxes, or native widgets.
              </p>
              
              <div className="space-y-4 pt-4 border-t">
                {[
                  { icon: <Terminal className="h-4 w-4" />, title: "Ultra Lightweight", desc: "Less than 5kb bundle size, optimized to minimize PageSpeed impact." },
                  { icon: <ShieldCheck className="h-4 w-4" />, title: "CSP Compliant", desc: "Safe configuration pre-aligned for strict Content Security Policies." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary h-fit shrink-0">{item.icon}</div>
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-150">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Blocks Right */}
            <div className="lg:col-span-7 rounded-3xl border bg-zinc-950 text-zinc-100 shadow-2xl p-6 md:p-8 flex flex-col relative overflow-hidden">
              <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-primary/10 rounded-full blur-[70px] pointer-events-none" />
              
              {/* Tab Selector */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/35" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/35" />
                  <span className="w-3 h-3 rounded-full bg-green-500/35" />
                </div>
                <div className="flex bg-zinc-900 p-1 rounded-xl">
                  {Object.keys(codeSamples).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveTab(lang as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                        activeTab === lang 
                          ? "bg-zinc-800 text-white shadow-sm" 
                          : "text-zinc-400 hover:text-zinc-100"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Panel */}
              <pre className="font-mono text-xs md:text-sm text-zinc-300 overflow-x-auto leading-relaxed flex-1 whitespace-pre max-w-full">
                <code>{codeSamples[activeTab]}</code>
              </pre>
            </div>

          </div>
        </section>

        {/* Embed Types Grid */}
        <section className="container mx-auto px-4 mb-24 md:mb-36 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-5">
              Formats for every layout
            </h2>
            <p className="text-muted-foreground text-lg">
              Deliver a premium booking workflow styled specifically to fit your product requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {embedTypes.map((type, i) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative bg-card border hover:border-primary/30 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="mb-6 p-4 bg-primary/10 text-primary w-fit rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  {type.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{type.title}</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed text-sm">{type.description}</p>
                
                <ul className="space-y-3 mb-8 border-t pt-6">
                  {type.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" /> 
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Highlight */}
        <section className="border-t bg-muted/20 py-24 md:py-32 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none">
            <div className="absolute w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] top-10 left-10" />
            <div className="absolute w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] bottom-10 right-10" />
          </div>

          <div className="container mx-auto px-4 max-w-5xl text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-16">
              Features built for speed
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: <Laptop className="h-6 w-6" />, title: "Full Responsiveness", desc: "Embed layouts automatically reflow to look stunning on mobile, tablet, and desktop viewports." },
                { icon: <Palette className="h-6 w-6" />, title: "Seamless Theming", desc: "Easily pass query parameters or stylesheet overrides to match CalMeet layouts with your brand colors." },
                { icon: <Layers className="h-6 w-6" />, title: "Zero Layout Shift", desc: "Components load asynchronously without causing sudden page shifts, keeping your site's SEO scores safe." }
              ].map((item, idx) => (
                <div key={idx} className="space-y-4 p-6 bg-background/50 border rounded-2xl backdrop-blur-sm">
                  <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">{item.icon}</div>
                  <h4 className="font-bold text-base">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
