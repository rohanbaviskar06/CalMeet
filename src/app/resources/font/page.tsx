"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Type, Download, Copy, Check, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

export default function FontPage() {
  const [copied, setCopied] = useState(false);
  const [previewText, setPreviewText] = useState("CalMeet: Scheduling for modern teams");
  const [fontSize, setFontSize] = useState(32);

  const copyFontCSS = () => {
    navigator.clipboard.writeText(`font-family: var(--font-cal-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <span className="text-zinc-800 dark:text-zinc-200 font-medium">Typography</span>
          </div>

          {/* Hero */}
          <div className="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold mb-3 border border-zinc-200 dark:border-zinc-700">
              <Type className="h-3.5 w-3.5" />
              <span>Design System & Brand Assets</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              CalMeet Brand Typography
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mb-6">
              A geometric, highly legible variable typeface designed for modern scheduling interfaces, dashboards, and calendar grids.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={copyFontCSS} size="sm" className="h-9 px-4 text-xs font-semibold">
                {copied ? <Check className="h-3.5 w-3.5 mr-1.5" /> : <Copy className="h-3.5 w-3.5 mr-1.5" />}
                {copied ? "Copied CSS!" : "Copy Font Family CSS"}
              </Button>
            </div>
          </div>

          {/* Interactive Font Sandbox */}
          <div className="mb-10 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50/50 dark:bg-zinc-900/50">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
                Interactive Type Tester
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-400">{fontSize}px</span>
                <input
                  type="range"
                  min="16"
                  max="64"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-28 accent-zinc-900 dark:accent-zinc-100"
                />
              </div>
            </div>

            <div className="p-6 space-y-4">
              <input
                type="text"
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 pb-2 text-xs text-zinc-500 placeholder-zinc-400 focus:outline-none"
                placeholder="Type something to preview..."
              />
              <div
                style={{ fontSize: `${fontSize}px` }}
                className="font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight py-4 break-words"
              >
                {previewText || "CalMeet Variable Sans"}
              </div>
            </div>
          </div>

          {/* Weight Matrix */}
          <div className="mb-10 space-y-3">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
              Weight Scale
            </h2>
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-2xs divide-y divide-zinc-200 dark:divide-zinc-800">
              {[
                { weight: "Regular (400)", fontClass: "font-normal", sample: "15-minute quick discovery call" },
                { weight: "Medium (500)", fontClass: "font-medium", sample: "Guaranteed real-time availability" },
                { weight: "Semibold (600)", fontClass: "font-semibold", sample: "Book confirmed consultation" },
                { weight: "Bold (700)", fontClass: "font-bold", sample: "Next-generation scheduling" },
              ].map((w) => (
                <div key={w.weight} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-mono text-zinc-400 shrink-0 sm:w-36">{w.weight}</span>
                  <span className={`text-base text-zinc-900 dark:text-zinc-100 ${w.fontClass}`}>{w.sample}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Integration Guide */}
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide mb-2">
              Next.js Font Integration
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              CalMeet uses `cal-sans` alongside `Inter` for optimal performance with zero layout shifts.
            </p>
            <pre className="p-3 rounded-lg bg-zinc-900 text-zinc-100 font-mono text-xs overflow-x-auto border border-zinc-800">
              {`import localFont from "next/font/local";

export const calSans = localFont({
  src: "../fonts/CalSans-SemiBold.woff2",
  variable: "--font-cal-sans",
});`}
            </pre>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
