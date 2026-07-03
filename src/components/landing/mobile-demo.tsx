"use client";

import { motion } from "framer-motion";
import { 
  Calendar, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Globe, 
  Smartphone 
} from "lucide-react";

export function MobileDemo() {
  return (
    <section className="py-24 bg-muted/20 border-t border-b overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <Smartphone className="h-3.5 w-3.5" />
              Mobile First
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Booking made easy <br />
              <span className="text-muted-foreground">on any device.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              CalMeet is optimized for mobile, ensuring your clients have a seamless 
              experience whether they are on their phone, tablet, or desktop.
            </p>
            
            <div className="space-y-4">
              {[
                "Automatic timezone detection",
                "One-tap calendar integration",
                "Native feel on mobile browsers",
                "Optimized for slow connections"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            {/* Phone Frame */}
            <div className="relative w-[300px] h-[600px] bg-zinc-900 rounded-[3rem] border-[8px] border-zinc-800 shadow-2xl overflow-hidden">
              {/* The User's Requested Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-background via-transparent to-background/50 pointer-events-none z-20 opacity-40" />
              
              {/* Camera Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-2xl z-30" />

              {/* Mobile Content */}
              <div className="h-full bg-background flex flex-col">
                <div className="pt-10 px-6 pb-4 border-b">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">AJ</div>
                    <div>
                      <div className="text-[10px] font-bold text-muted-foreground leading-none">Alex Johnson</div>
                      <div className="text-xs font-bold leading-none mt-1">Intro Call</div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold">Select a Date</h3>
                    <div className="flex gap-1">
                      <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Mini Calendar */}
                  <div className="grid grid-cols-7 gap-1 mb-8">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                      <div key={i} className="h-6 flex items-center justify-center text-[8px] font-bold text-muted-foreground">{d}</div>
                    ))}
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div key={i} className={`h-8 rounded-lg flex items-center justify-center text-[10px] font-medium ${i + 1 === 18 ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                        {i + 1}
                      </div>
                    ))}
                  </div>

                  <h3 className="font-bold mb-4">Select a Time</h3>
                  <div className="space-y-2">
                    {["9:00 AM", "10:30 AM", "1:00 PM"].map(t => (
                      <div key={t} className={`p-3 rounded-xl border text-center font-bold text-xs ${t === "10:30 AM" ? "border-primary bg-primary/5 text-primary" : "bg-card"}`}>
                        {t}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <Globe className="h-3 w-3" />
                      <span>Indian Standard Time (IST)</span>
                    </div>
                    <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold text-xs shadow-lg shadow-primary/20">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
