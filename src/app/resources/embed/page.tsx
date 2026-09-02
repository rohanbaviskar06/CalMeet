"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { 
  Code2, 
  Layout, 
  MousePointer2, 
  ExternalLink, 
  Copy, 
  Check, 
  CheckCircle2, 
  ArrowRight,
  Laptop,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

export default function EmbedPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [username, setUsername] = useState("alex");
  const [slug, setSlug] = useState("15min");

  const iframeCode = `<iframe 
  src="https://calmeet.com/${username}/${slug}?embed=true" 
  width="100%" 
  height="700px" 
  frameborder="0"
  style="border-radius: 16px; overflow: hidden;"
></iframe>`;

  const copyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-6">
            <Link href="/resources" className="hover:text-zinc-600 dark:hover:text-zinc-200">Resources</Link>
            <span>/</span>
            <span className="text-zinc-800 dark:text-zinc-200 font-medium">Embed Widget</span>
          </div>

          {/* Hero */}
          <div className="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold mb-3 border border-zinc-200 dark:border-zinc-700">
              <Code2 className="h-3.5 w-3.5" />
              <span>Website Embeds & Widgets</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Embed CalMeet directly on your website
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mb-6">
              Add responsive inline booking calendars, popup modals, or floating booking buttons to any website, React app, or Notion doc.
            </p>
          </div>

          {/* Generator Box */}
          <div className="mb-10 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
                Embed Code Generator
              </span>
              <Button
                onClick={() => copyCode(iframeCode, "iframe")}
                size="sm"
                className="h-7 px-3 text-xs"
              >
                {copied === "iframe" ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                {copied === "iframe" ? "Copied!" : "Copy Code"}
              </Button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 block">Your Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 block">Event Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>
              </div>

              <pre className="p-4 rounded-lg bg-zinc-900 text-zinc-100 font-mono text-xs overflow-x-auto border border-zinc-800">
                {iframeCode}
              </pre>
            </div>
          </div>

          {/* 3 Embed Variants */}
          <div className="grid sm:grid-cols-3 gap-3 mb-10">
            {[
              {
                title: "Inline Frame",
                desc: "Renders full booking calendar directly within your landing page.",
                icon: Layout,
              },
              {
                title: "Popup Modal",
                desc: "Opens the calendar in a focused lightbox when clicking a button.",
                icon: ExternalLink,
              },
              {
                title: "Floating Button",
                desc: "Sticky bottom-right badge that triggers booking from any page.",
                icon: MousePointer2,
              },
            ].map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-2">
                  <div className="w-7 h-7 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{v.title}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Framework Guides */}
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide mb-2">
              React & Next.js Quick Example
            </h3>
            <pre className="p-3 rounded-lg bg-zinc-900 text-zinc-100 font-mono text-xs overflow-x-auto border border-zinc-800">
              {`export function BookingWidget() {
  return (
    <iframe
      src="https://calmeet.com/alex/15min?embed=true"
      className="w-full h-[700px] rounded-2xl border border-zinc-800"
    />
  );
}`}
            </pre>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
