"use client";

import { Navbar } from "@/components/landing/navbar";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EducationPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <section className="container mx-auto px-4 max-w-4xl text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 text-indigo-600 border border-indigo-500/20">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 italic font-serif">MeetMe for Education</h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Empower students and faculty. Simplify office hours, advising sessions, and parent-teacher conferences.
          </p>
          <Button size="lg" className="rounded-full bg-indigo-600 hover:bg-indigo-700 px-10 text-white">Scale Your Learning</Button>
          
          <div className="mt-24 grid md:grid-cols-3 gap-8 text-left">
             <div className="p-8 rounded-2xl border bg-card hover:border-indigo-300 transition-colors">
                <h4 className="font-bold mb-3">Office Hours</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Let students book dedicated slots without the email clutter.</p>
             </div>
             <div className="p-8 rounded-2xl border bg-card hover:border-indigo-300 transition-colors">
                <h4 className="font-bold mb-3">Academic Advising</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Coordinate sessions with multiple staff members easily.</p>
             </div>
             <div className="p-8 rounded-2xl border bg-card hover:border-indigo-300 transition-colors">
                <h4 className="font-bold mb-3">Admissions</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Automate campus tours and prospective student interviews.</p>
             </div>
          </div>
        </section>
      </main>
      <footer className="py-12 border-t bg-muted/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MeetMe Inc. Educational Excellence.
        </div>
      </footer>
    </div>
  );
}
