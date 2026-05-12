"use client";

import { motion } from "framer-motion";

const companies = [
  { name: "Stripe", logo: "S" },
  { name: "Notion", logo: "N" },
  { name: "Linear", logo: "L" },
  { name: "Vercel", logo: "V" },
  { name: "Figma", logo: "F" },
  { name: "Loom", logo: "Lo" },
  { name: "Intercom", logo: "I" },
  { name: "Atlassian", logo: "A" },
];

// Duplicate for seamless marquee loop
const doubled = [...companies, ...companies];

export function TrustedBy() {
  return (
    <section className="py-14 border-y bg-muted/20 overflow-hidden">
      <div className="container mx-auto px-4 mb-8 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Trusted by teams at world-class companies
        </p>
      </div>

      {/* Marquee */}
      <div className="relative w-full flex overflow-hidden">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

        <motion.div
          className="flex gap-8 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            duration: 30,
          }}
        >
          {doubled.map((company, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 px-5 py-3 rounded-xl border bg-card flex-shrink-0 hover:shadow-sm transition-shadow"
            >
              <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                {company.logo}
              </div>
              <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
                {company.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
