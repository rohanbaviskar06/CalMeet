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
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  ShieldCheck,
  Zap,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

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
      path: "/api/v1/me",
      title: "Get User Profile & Stats",
      description: "Retrieve authenticated account details, timezone, plan, and booking counts.",
      curl: `curl -X GET "https://calmeet.com/api/v1/me" \\
  -H "Authorization: Bearer cal_live_your_api_key"`,
      node: `const res = await fetch("https://calmeet.com/api/v1/me", {
  headers: { "Authorization": "Bearer cal_live_your_api_key" }
});
const { data } = await res.json();
console.log(data);`,
      python: `import requests

res = requests.get(
    "https://calmeet.com/api/v1/me",
    headers={"Authorization": "Bearer cal_live_your_api_key"}
)
print(res.json())`,
      response: `{
  "success": true,
  "data": {
    "id": "usr_12345",
    "name": "Alex User",
    "email": "alex@example.com",
    "username": "alex",
    "timezone": "Asia/Kolkata",
    "plan": "PRO",
    "stats": {
      "totalEventTypes": 3,
      "totalBookings": 15,
      "totalWebhooks": 1
    }
  }
}`
    },
    {
      method: "GET",
      path: "/api/v1/event-types",
      title: "List Event Types",
      description: "Retrieve all active scheduling event types configured on your account.",
      curl: `curl -X GET "https://calmeet.com/api/v1/event-types" \\
  -H "Authorization: Bearer cal_live_your_api_key"`,
      node: `const res = await fetch("https://calmeet.com/api/v1/event-types", {
  headers: { "Authorization": "Bearer cal_live_your_api_key" }
});
const { data } = await res.json();
console.log(data);`,
      python: `import requests

res = requests.get(
    "https://calmeet.com/api/v1/event-types",
    headers={"Authorization": "Bearer cal_live_your_api_key"}
)
print(res.json())`,
      response: `{
  "success": true,
  "data": [
    {
      "id": "cmtjqad2x0001jl04fwf00clq",
      "title": "15 Min Meeting",
      "slug": "15min",
      "duration": 15,
      "bookingUrl": "https://calmeet.com/alex/15min",
      "isActive": true
    }
  ]
}`
    },
    {
      method: "POST",
      path: "/api/v1/bookings",
      title: "Create a Programmatic Booking",
      description: "Create and confirm a booking slot on behalf of a guest programmatically.",
      curl: `curl -X POST "https://calmeet.com/api/v1/bookings" \\
  -H "Authorization: Bearer cal_live_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "eventTypeId": "cmtjqad2x0001jl04fwf00clq",
    "guestName": "Jane Doe",
    "guestEmail": "jane@example.com",
    "startTime": "2026-09-04T10:00:00.000Z",
    "notes": "Discussing enterprise integration."
  }'`,
      node: `const res = await fetch("https://calmeet.com/api/v1/bookings", {
  method: "POST",
  headers: {
    "Authorization": "Bearer cal_live_your_api_key",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    eventTypeId: "cmtjqad2x0001jl04fwf00clq",
    guestName: "Jane Doe",
    guestEmail: "jane@example.com",
    startTime: "2026-09-04T10:00:00.000Z"
  })
});
const data = await res.json();`,
      python: `import requests

payload = {
    "eventTypeId": "cmtjqad2x0001jl04fwf00clq",
    "guestName": "Jane Doe",
    "guestEmail": "jane@example.com",
    "startTime": "2026-09-04T10:00:00.000Z"
}
res = requests.post(
    "https://calmeet.com/api/v1/bookings",
    headers={"Authorization": "Bearer cal_live_your_api_key"},
    json=payload
)
print(res.json())`,
      response: `{
  "success": true,
  "data": {
    "id": "cmtjrxxtd000n567k9owd2rcc",
    "guestName": "Jane Doe",
    "guestEmail": "jane@example.com",
    "startTime": "2026-09-04T10:00:00.000Z",
    "endTime": "2026-09-04T10:15:00.000Z",
    "status": "CONFIRMED"
  }
}`
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-6">
            <Link href="/resources" className="hover:text-zinc-600 dark:hover:text-zinc-200">Resources</Link>
            <span>/</span>
            <span className="text-zinc-800 dark:text-zinc-200 font-medium">REST API Reference</span>
          </div>

          {/* Hero */}
          <div className="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold mb-3 border border-zinc-200 dark:border-zinc-700">
              <Code2 className="h-3.5 w-3.5" />
              <span>v1 REST API Documentation</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              CalMeet Developer API Reference
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mb-6">
              Build custom scheduling integrations, automate bookings from your internal CRM, and sync event types with standard HTTP REST calls.
            </p>
            <div className="flex gap-3">
              <Button render={<Link href="/dashboard/settings?tab=api-keys" />} size="sm" className="h-9 px-4 text-xs font-semibold">
                <Key className="h-3.5 w-3.5 mr-1.5" /> Get API Keys
              </Button>
              <Button render={<Link href="/resources/webhooks" />} variant="outline" size="sm" className="h-9 px-4 text-xs font-semibold border-zinc-200 dark:border-zinc-800">
                Webhook Docs
              </Button>
            </div>
          </div>

          {/* Authentication Banner */}
          <div className="mb-10 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
              <h2 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
                Authentication
              </h2>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Include your secret key in the <code className="font-mono text-zinc-900 dark:text-zinc-100 bg-zinc-200/60 dark:bg-zinc-800 px-1 py-0.5 rounded">Authorization</code> header with the <code className="font-mono text-zinc-900 dark:text-zinc-100 bg-zinc-200/60 dark:bg-zinc-800 px-1 py-0.5 rounded">Bearer</code> prefix.
            </p>
            <pre className="p-3 rounded-lg bg-zinc-900 text-zinc-100 font-mono text-xs overflow-x-auto border border-zinc-800">
              {`Authorization: Bearer cal_live_ef97697bb74f...`}
            </pre>
          </div>

          {/* Language Selector */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
              Endpoints
            </h2>
            <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs">
              {(["curl", "node", "python"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`px-2.5 py-1 rounded-md font-medium text-xs transition-colors uppercase ${
                    activeLang === lang
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Endpoints List */}
          <div className="space-y-6 mb-12">
            {endpoints.map((ep, idx) => (
              <div
                key={ep.path + ep.method}
                className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-2xs overflow-hidden"
              >
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-zinc-50/50 dark:bg-zinc-900/50">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold">
                      {ep.method}
                    </span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{ep.path}</span>
                  </div>
                  <span className="text-xs text-zinc-500 font-medium">{ep.title}</span>
                </div>

                <div className="p-5 space-y-4">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">{ep.description}</p>

                  {/* Code Request Block */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-semibold text-zinc-400 uppercase">Request ({activeLang})</span>
                      <button
                        onClick={() => copySnippet(ep[activeLang], `${idx}-${activeLang}`)}
                        className="text-[11px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1"
                      >
                        {copiedKey === `${idx}-${activeLang}` ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                        Copy
                      </button>
                    </div>
                    <pre className="p-3.5 rounded-lg bg-zinc-900 text-zinc-100 font-mono text-xs overflow-x-auto border border-zinc-800">
                      {ep[activeLang]}
                    </pre>
                  </div>

                  {/* Response Block */}
                  <div>
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase mb-1.5 block">Response (200 OK)</span>
                    <pre className="p-3.5 rounded-lg bg-zinc-900 text-zinc-100 font-mono text-xs overflow-x-auto border border-zinc-800 text-emerald-400">
                      {ep.response}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">Ready to start building?</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Generate your API key in your dashboard in 1 click.</div>
            </div>
            <Button render={<Link href="/dashboard/settings?tab=api-keys" />} size="sm" className="h-9 px-4 text-xs font-semibold">
              Generate API Key
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
