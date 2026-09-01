"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { motion } from "framer-motion";
import { Type, Download, Copy, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function FontPage() {
  const [copied, setCopied] = useState(false);

  const copyFontName = () => {
    navigator.clipboard.writeText("CalMeet Sans");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      <Navbar />
      <main className="flex-grow pt-32">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex justify-center"
            >
              <div className="p-4 rounded-3xl bg-primary/10 text-primary">
                <Type className="h-10 w-10" />
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-8xl font-black tracking-tighter mb-8 italic"
            >
              CALMEET <span className="text-primary underline decoration-primary/20">SANS</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              A variable typeface designed for modern scheduling. Optimized for clarity, 
              legibility, and a premium aesthetic across all platforms.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button size="lg" className="h-16 px-10 rounded-full text-lg font-bold">
                <Download className="mr-2 h-5 w-5" /> Download OTF
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-16 px-10 rounded-full text-lg font-bold"
                onClick={copyFontName}
              >
                {copied ? <Check className="mr-2 h-5 w-5 text-green-500" /> : <Copy className="mr-2 h-5 w-5" />}
                {copied ? "Copied!" : "Copy Font Name"}
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Specimen Section */}
        <section className="py-24 bg-zinc-50 dark:bg-zinc-950 border-y overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-12">
              <div className="border-b pb-8">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Thin 100</div>
                <div className="text-6xl md:text-8xl font-thin tracking-tight">The quick brown fox jumps over the lazy dog</div>
              </div>
              <div className="border-b pb-8">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Regular 400</div>
                <div className="text-6xl md:text-8xl font-normal tracking-tight">The quick brown fox jumps over the lazy dog</div>
              </div>
              <div className="border-b pb-8 text-primary">
                <div className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-4">Bold 700 Italic</div>
                <div className="text-6xl md:text-8xl font-bold italic tracking-tight">The quick brown fox jumps over the lazy dog</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Black 900</div>
                <div className="text-6xl md:text-8xl font-black tracking-tighter">The quick brown fox jumps over the lazy dog</div>
              </div>
            </div>
          </div>
        </section>

        {/* Details Section */}
        <section className="py-32 container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8 italic tracking-tight">Designed for <br/>Human Connection</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                CalMeet Sans was born from the need for a typeface that feels both professional and approachable. 
                With open apertures and a tall x-height, it maintains exceptional legibility at small sizes 
                within complex dashboards, while its bold weights create a striking presence in marketing materials.
              </p>
              <ul className="space-y-4">
                {["Variable weight axes", "Optimized for screen readability", "Full Latin extended character set", "Mathematical & tabular symbols"].map((item) => (
                  <li key={item} className="flex items-center gap-3 font-bold text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/10 rounded-[3rem] -rotate-3 scale-105 transition-transform group-hover:rotate-0" />
              <div className="relative bg-white dark:bg-zinc-900 border rounded-[3rem] p-12 shadow-2xl">
                <div className="grid grid-cols-2 gap-8 text-center">
                  <div>
                    <div className="text-5xl font-black mb-2">Aa</div>
                    <div className="text-xs text-muted-foreground">Oversized Caps</div>
                  </div>
                  <div>
                    <div className="text-5xl font-black mb-2">123</div>
                    <div className="text-xs text-muted-foreground">Tabular Lining</div>
                  </div>
                  <div>
                    <div className="text-5xl font-black mb-2">&%</div>
                    <div className="text-xs text-muted-foreground">Symbols</div>
                  </div>
                  <div>
                    <div className="text-5xl font-black mb-2">→</div>
                    <div className="text-xs text-muted-foreground">Arrows</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 mb-32">
          <div className="bg-zinc-900 text-white rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Type className="h-64 w-64 rotate-12" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 relative z-10 italic">Ready to use CalMeet Sans?</h2>
            <p className="text-xl text-zinc-400 mb-12 max-w-xl mx-auto relative z-10">
              Free for personal and commercial use under the CalMeet Open Font License.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Button size="lg" className="h-16 px-10 rounded-full font-bold bg-white text-black hover:bg-zinc-200">
                Download Now
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 rounded-full font-bold border-zinc-700 hover:bg-zinc-800">
                View License
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

