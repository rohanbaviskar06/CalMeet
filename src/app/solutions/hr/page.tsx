"use client";

import { Navbar } from "@/components/landing/navbar";
import { HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HRPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <section className="container mx-auto px-4 max-w-4xl text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-6 text-pink-600 border border-pink-500/20">
            <HeartHandshake className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 italic font-serif">CalMeet for HR</h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Simplify internal scheduling. From performance reviews to benefits enrollment, manage your team&apos;s time with empathy.
          </p>
          <Button size="lg" className="rounded-full bg-pink-600 hover:bg-pink-700 px-10">Modernize Your HR</Button>
          
          <div className="mt-24 p-12 rounded-[3rem] bg-pink-50/50 border border-pink-100 text-left">
             <h4 className="text-2xl font-bold mb-6">Internal coordination made easy</h4>
             <p className="text-muted-foreground mb-8 text-lg">Remove the friction from employee meetings. Allow team members to book time for feedback, mentoring, or policy reviews without the calendar Tetris.</p>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white border rounded-xl text-center font-bold text-sm">Onboarding</div>
                <div className="p-4 bg-white border rounded-xl text-center font-bold text-sm">Reviews</div>
                <div className="p-4 bg-white border rounded-xl text-center font-bold text-sm">Mentoring</div>
                <div className="p-4 bg-white border rounded-xl text-center font-bold text-sm">Benefits</div>
             </div>
          </div>
        </section>
      </main>
      <footer className="py-12 border-t bg-muted/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CalMeet Inc. People Operations.
        </div>
      </footer>
    </div>
  );
}
