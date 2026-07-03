"use client";

import { Navbar } from "@/components/landing/navbar";
import { motion } from "framer-motion";
import { Zap, Video, Phone, MessageSquare, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InstantMeetingsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        {/* Hero */}
        <section className="container mx-auto px-4 mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Zap className="h-3.5 w-3.5 fill-current" /> Instant Meetings
            </div>
            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter italic">
              SPEED IS THE <br/> <span className="text-yellow-500 underline decoration-yellow-500/20">NEW CURRENCY.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              Why wait? Launch a meeting room instantly from your dashboard or via a unique permanent link. 
              Zero friction, maximum velocity.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="h-16 px-10 rounded-full text-lg font-bold bg-yellow-500 hover:bg-yellow-600 text-black">
                Launch Instant Room
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 rounded-full text-lg font-bold border-yellow-500/20">
                Copy Personal Link
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Feature Grid */}
        <section className="container mx-auto px-4 mb-32">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Video className="h-6 w-6" />, title: "One-Click Video", desc: "No passcodes, no waiting rooms. Just instant face-to-face connection." },
              { icon: <Phone className="h-6 w-6" />, title: "Voice Only Mode", desc: "For when you just need a quick audio sync without the camera pressure." },
              { icon: <MessageSquare className="h-6 w-6" />, title: "Active Chat", desc: "Share files and links in real-time during your instant session." }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[3rem] bg-zinc-50 dark:bg-zinc-900 border hover:border-yellow-500/30 transition-colors group"
              >
                <div className="mb-6 p-4 bg-yellow-500/10 w-fit rounded-2xl text-yellow-500 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 bg-yellow-500 text-black">
          <div className="container mx-auto px-4">
             <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-black mb-16 italic tracking-tighter">THE 3-SECOND FLOW.</h2>
                <div className="grid md:grid-cols-3 gap-12">
                   {[
                     { step: "01", text: "Click the 'Instant' button in your dashboard or browser extension." },
                     { step: "02", text: "A unique, secure room is generated immediately." },
                     { step: "03", text: "Invite link is auto-copied to your clipboard. Send and talk." }
                   ].map(item => (
                     <div key={item.step} className="space-y-4">
                        <div className="text-8xl font-black opacity-10">{item.step}</div>
                        <p className="font-bold text-lg leading-tight">{item.text}</p>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-32 container mx-auto px-4 max-w-5xl text-center">
           <h2 className="text-4xl font-bold mb-16 italic">Perfect for...</h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Ad-hoc team huddles",
                "Quick customer support issues",
                "Impromptu sales demos",
                "Virtual office 'knock-knocks'",
                "Social coffee chats",
                "Late-night brainstorming"
              ].map(text => (
                <div key={text} className="flex items-center gap-4 p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border text-left">
                   <div className="h-6 w-6 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-black" />
                   </div>
                   <span className="font-bold">{text}</span>
                </div>
              ))}
           </div>
        </section>
      </main>

      <footer className="py-12 border-t bg-zinc-50 dark:bg-zinc-950 mt-24">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CalMeet Inc. Lightning fast.
        </div>
      </footer>
    </div>
  );
}
