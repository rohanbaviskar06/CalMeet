"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { 
  Webhook, 
  ShieldCheck, 
  Terminal, 
  Copy, 
  Check, 
  ArrowRight,
  Sparkles,
  Zap,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function WebhooksResourcePage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copySnippet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const payloadSample = `{
  "event": "booking.created",
  "timestamp": "2026-09-02T12:30:00.000Z",
  "data": {
    "id": "cmtjrxxtd000n567k9owd2rcc",
    "eventTypeId": "cmtjqad2x0001jl04fwf00clq",
    "guestName": "Jane Doe",
    "guestEmail": "jane@example.com",
    "startTime": "2026-09-04T10:00:00.000Z",
    "endTime": "2026-09-04T10:15:00.000Z",
    "status": "CONFIRMED",
    "meetLink": "https://meet.google.com/abc-xyz-123"
  }
}`;

  const nodeVerification = `import crypto from "crypto";

export function verifyCalMeetWebhook(payloadString, signatureHeader, secret) {
  // Format: "sha256=<hex_digest>"
  const signature = signatureHeader.replace("sha256=", "").trim();
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(payloadString)
    .digest("hex");

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(hmac));
}`;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-6">
            <Link href="/resources" className="hover:text-zinc-600 dark:hover:text-zinc-200">Resources</Link>
            <span>/</span>
            <span className="text-zinc-800 dark:text-zinc-200 font-medium">Webhooks</span>
          </div>

          {/* Hero */}
          <div className="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold mb-3 border border-zinc-200 dark:border-zinc-700">
              <Webhook className="h-3.5 w-3.5" />
              <span>Real-Time Event Delivery</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              CalMeet Webhooks & Event Listeners
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mb-6">
              Receive instant JSON HTTP POST notifications whenever meetings are scheduled, rescheduled, or canceled, secured by HMAC-SHA256 signatures.
            </p>
            <div className="flex gap-3">
              <Button render={<Link href="/dashboard/settings?tab=webhooks" />} size="sm" className="h-9 px-4 text-xs font-semibold">
                Configure Webhooks in Dashboard
              </Button>
            </div>
          </div>

          {/* Supported Events */}
          <div className="mb-10 space-y-3">
            <h2 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
              Supported Event Types
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { event: "booking.created", desc: "Fires immediately when a guest confirms a new meeting slot." },
                { event: "booking.canceled", desc: "Fires whenever a host or guest cancels an existing booking." },
              ].map((ev) => (
                <div key={ev.event} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-1.5">
                  <div className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded w-fit">
                    {ev.event}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{ev.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Payload */}
          <div className="mb-10 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
                Sample Webhook JSON Payload
              </span>
              <button
                onClick={() => copySnippet(payloadSample, "payload")}
                className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1"
              >
                {copiedKey === "payload" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                Copy JSON
              </button>
            </div>
            <div className="p-4">
              <pre className="p-3.5 rounded-lg bg-zinc-900 text-zinc-100 font-mono text-xs overflow-x-auto border border-zinc-800 text-emerald-400">
                {payloadSample}
              </pre>
            </div>
          </div>

          {/* Security & Verification Code */}
          <div className="mb-10 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
                  Signature Verification (HMAC-SHA256)
                </span>
              </div>
              <button
                onClick={() => copySnippet(nodeVerification, "verify")}
                className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1"
              >
                {copiedKey === "verify" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                Copy Code
              </button>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Every webhook request includes the <code className="font-mono text-zinc-900 dark:text-zinc-100 bg-zinc-200/60 dark:bg-zinc-800 px-1 py-0.5 rounded">X-CalMeet-Signature</code> header.
                Verify it using your unique webhook secret to ensure the payload was not tampered with.
              </p>
              <pre className="p-3.5 rounded-lg bg-zinc-900 text-zinc-100 font-mono text-xs overflow-x-auto border border-zinc-800">
                {nodeVerification}
              </pre>
            </div>
          </div>

          {/* CTA */}
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">Ready to register your webhook endpoint?</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Add your destination URL in Settings → Webhooks.</div>
            </div>
            <Button render={<Link href="/dashboard/settings?tab=webhooks" />} size="sm" className="h-9 px-4 text-xs font-semibold">
              Add Webhook
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
