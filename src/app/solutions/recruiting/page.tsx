"use client";

import { Navbar } from "@/components/landing/navbar";
import { motion } from "framer-motion";
import { Search, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RecruitingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <section className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary border border-primary/20">
              <Search className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 italic font-serif">MeetMe for Recruiting</h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Hire top talent faster. Automate your interview scheduling and keep candidates engaged throughout the process.
            </p>
            <Button size="lg" className="rounded-full px-10 h-14 text-lg">See Recruiting Features</Button>
          </motion.div>

          <div className="grid gap-12 mt-24">
            <div className="flex flex-col md:flex-row items-center gap-12 p-10 rounded-[3rem] bg-secondary/20 border">
               <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-6 italic">Seamless ATS Integrations</h3>
                  <p className="text-muted-foreground mb-8 text-lg">
                    Connect MeetMe with your Applicant Tracking System to keep candidate data synced and interview notes centralized.
                  </p>
                  <Button variant="outline" className="rounded-full">View Integrations</Button>
               </div>
               <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="h-32 bg-background border rounded-2xl flex items-center justify-center font-bold">Greenhouse</div>
                  <div className="h-32 bg-background border rounded-2xl flex items-center justify-center font-bold">Lever</div>
                  <div className="h-32 bg-background border rounded-2xl flex items-center justify-center font-bold">Workday</div>
                  <div className="h-32 bg-background border rounded-2xl flex items-center justify-center font-bold">BambooHR</div>
               </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-12 border-t bg-muted/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MeetMe Inc. Recruitment Solutions.
        </div>
      </footer>
    </div>
  );
}
