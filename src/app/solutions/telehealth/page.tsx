"use client";

import { Navbar } from "@/components/landing/navbar";
import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TelehealthPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <section className="container mx-auto px-4 max-w-4xl text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-600 border border-purple-500/20">
            <Video className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 italic font-serif">CalMeet for Telehealth</h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Virtual care, simplified. Connect patients with doctors via high-quality video conferencing, integrated directly with your booking flow.
          </p>
          <Button size="lg" className="rounded-full bg-purple-600 hover:bg-purple-700 px-10 text-white shadow-lg shadow-purple-200">Start Virtual Care</Button>
          
          <div className="mt-24 p-8 rounded-3xl border border-purple-100 bg-purple-50/30 text-left">
             <div className="grid md:grid-cols-2 gap-12">
                <div>
                   <h4 className="text-xl font-bold mb-4">Integrated Video</h4>
                   <p className="text-muted-foreground text-sm">No more external links. Patients join sessions directly from your portal or via encrypted SMS links.</p>
                </div>
                <div>
                   <h4 className="text-xl font-bold mb-4">Global Reach</h4>
                   <p className="text-muted-foreground text-sm">Reliable connection quality for patients regardless of their location or bandwidth.</p>
                </div>
             </div>
          </div>
        </section>
      </main>
      <footer className="py-12 border-t bg-muted/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CalMeet Inc. Telehealth Innovation.
        </div>
      </footer>
    </div>
  );
}
