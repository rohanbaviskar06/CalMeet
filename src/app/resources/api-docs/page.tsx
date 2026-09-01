"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { 
  Code2, 
  Key, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  Zap, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Layers,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ApiDocsPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState<"curl" | "node" | "python">("curl");

  const copySnippet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    toast.success("Code snippet copied!");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const endpoints = [
    {
      method: "GET",
      path: "/api/v1/event-types",
      title: "List Event Types",
      description: "Retrieve all active scheduling event types for your account.",
      curl: `curl -X GET "https://api.calmeet.app/v1/event-types" \\
  -H "Authorization: Bearer cal_live_your_api_key"`,
      node: `import { CalMeet } from "@calmeet/sdk";

const calmeet = new CalMeet({ apiKey: "cal_live_your_api_key" });
const eventTypes = await calmeet.eventTypes.list();
console.log(eventTypes);`,
      python: `import requests

headers = {"Authorization": "Bearer cal_live_your_api_key"}
response = requests.get("https://api.calmeet.app/v1/event-types", headers=headers)
print(response.json())`,
      response: `{
  "data": [
    {
      "id": "evt_15min",
      "title": "15 Min Meeting",
      "slug": "15min",
      "duration": 15,
      "isActive": true
    }
  ]
}`
    },
    {
      method: "GET",
      path: "/api/v1/bookings",
      title: "List Bookings",
      description: "Get a list of upcoming, past, and canceled bookings with attendee information.",
      curl: `curl -X GET "https://api.calmeet.app/v1/bookings?status=CONFIRMED" \\
  -H "Authorization: Bearer cal_live_your_api_key"`,
      node: `const bookings = await calmeet.bookings.list({ status: "CONFIRMED" });
console.log(bookings);`,
      python: `response = requests.get(
    "https://api.calmeet.app/v1/bookings", 
    headers=headers, 
    params={"status": "CONFIRMED"}
)
print(response.json())`,
      response: `{
  "data": [
    {
      "id": "bk_987654",
      "eventTitle": "Product Demo",
      "guestName": "Alex Mercer",
      "guestEmail": "alex@company.com",
      "startTime": "2026-09-15T14:00:00Z",
      "endTime": "2026-09-15T14:30:00Z",
      "status": "CONFIRMED"
    }
  ]
}`
    },
    {
      method: "POST",
      path: "/api/v1/bookings",
      title: "Create Booking",
      description: "Programmatically schedule a meeting for an attendee on an available slot.",
      curl: `curl -X POST "https://api.calmeet.app/v1/bookings" \\
  -H "Authorization: Bearer cal_live_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "eventTypeId": "evt_15min",
    "guestName": "Sarah Connor",
    "guestEmail": "sarah@cyberdyne.com",
    "startTime": "2026-09-20T10:00:00Z",
    "endTime": "2026-09-20T10:15:00Z"
  }'`,
      node: `const booking = await calmeet.bookings.create({
  eventTypeId: "evt_15min",
  guestName: "Sarah Connor",
  guestEmail: "sarah@cyberdyne.com",
  startTime: "2026-09-20T10:00:00Z",
  endTime: "2026-09-20T10:15:00Z"
});`,
      python: `payload = {
    "eventTypeId": "evt_15min",
    "guestName": "Sarah Connor",
    "guestEmail": "sarah@cyberdyne.com",
    "startTime": "2026-09-20T10:00:00Z",
    "endTime": "2026-09-20T10:15:00Z"
}
response = requests.post("https://api.calmeet.app/v1/bookings", headers=headers, json=payload)`,
      response: `{
  "success": true,
  "booking": {
    "id": "bk_112233",
    "status": "CONFIRMED",
    "meetLink": "https://meet.google.com/abc-defg-hij"
  }
}`
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50/60 dark:bg-[#0c0c0e] text-foreground">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-28 pb-20 space-y-12">
        {/* Header Hero */}
        <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 sm:p-12 shadow-2xs space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary bg-primary/5 border border-primary/20 w-fit px-3 py-1 rounded-full">
            <Code2 className="h-3.5 w-3.5" />
            <span>Developer Platform</span>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h1 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              CalMeet REST API & Webhooks
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Programmatically create bookings, sync calendars, fetch availability slots, and trigger real-time webhooks in your own applications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/dashboard/settings?tab=api-keys">
              <Button className="h-10 px-5 text-xs font-semibold rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-2xs gap-2">
                <Key className="h-4 w-4" /> Get Your API Key
              </Button>
            </Link>
            <Link href="/resources/webhooks">
              <Button variant="outline" className="h-10 px-5 text-xs font-semibold rounded-xl border-zinc-200 dark:border-zinc-800 gap-2">
                <Zap className="h-4 w-4" /> Webhook Guides
              </Button>
            </Link>
          </div>
        </div>

        {/* Authentication Card */}
        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-800">
              <Key className="h-4 w-4" />
            </div>
            <h2 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Authentication
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            All API requests must include your personal secret key in the <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-xs text-zinc-900 dark:text-zinc-100">Authorization</code> HTTP header as a Bearer token:
          </p>

          <div className="relative p-4 rounded-xl bg-zinc-900 dark:bg-zinc-900/90 text-zinc-100 font-mono text-xs overflow-x-auto border border-zinc-800">
            <code>Authorization: Bearer cal_live_8f7b2a9e4c1d6e3f</code>
            <button
              onClick={() => copySnippet("Authorization: Bearer cal_live_8f7b2a9e4c1d6e3f", "auth")}
              className="absolute right-3 top-3 p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 transition-colors"
            >
              {copiedKey === "auth" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Endpoints Documentation */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Core Endpoints
            </h2>

            {/* Language Selector */}
            <div className="inline-flex p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold">
              {(["curl", "node", "python"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={cn(
                    "px-3 py-1 rounded-lg uppercase text-[10px] tracking-wider transition-all",
                    activeLang === lang
                      ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs"
                      : "text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {endpoints.map((ep, idx) => (
              <div 
                key={ep.path + ep.method}
                className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 shadow-2xs space-y-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className={cn(
                      "px-2 py-0.5 rounded-md font-mono text-[10px] font-bold",
                      ep.method === "GET" && "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
                      ep.method === "POST" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    )}>
                      {ep.method}
                    </span>
                    <code className="font-mono text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {ep.path}
                    </code>
                  </div>
                  <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                    {ep.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {ep.description}
                  </p>
                </div>

                {/* Code Request & Response Tabs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Request */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-1">
                      <span>Request Example ({activeLang})</span>
                    </div>
                    <div className="relative p-4 rounded-xl bg-zinc-950 text-zinc-200 font-mono text-xs overflow-x-auto border border-zinc-800 min-h-[140px]">
                      <pre><code>{ep[activeLang]}</code></pre>
                      <button
                        onClick={() => copySnippet(ep[activeLang], `req-${idx}`)}
                        className="absolute right-3 top-3 p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 transition-colors"
                      >
                        {copiedKey === `req-${idx}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Response */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-1">
                      <span>200 OK Response</span>
                    </div>
                    <div className="relative p-4 rounded-xl bg-zinc-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-zinc-800 min-h-[140px]">
                      <pre><code>{ep.response}</code></pre>
                      <button
                        onClick={() => copySnippet(ep.response, `res-${idx}`)}
                        className="absolute right-3 top-3 p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 transition-colors"
                      >
                        {copiedKey === `res-${idx}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
