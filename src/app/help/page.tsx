"use client";

import { useState } from "react";
import { 
  BookOpen, 
  Video, 
  CreditCard, 
  Globe, 
  Users, 
  Code, 
  HelpCircle, 
  ChevronRight, 
  Search,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

interface GuideArticle {
  id: string;
  category: string;
  title: string;
  description: string;
  content: string[];
}

const GUIDES: GuideArticle[] = [
  {
    id: "getting-started",
    category: "General",
    title: "Quick Start: Scheduling Your First Meeting",
    description: "Learn how to configure your public username, timezone, and generate booking links.",
    content: [
      "1. Navigate to Settings and claim your unique personal username (e.g. calmeet.app/alex).",
      "2. Set your primary timezone. CalMeet automatically converts time slots to your guests' local timezones, including Daylight Saving Time adjustments.",
      "3. Go to Availability and customize your weekly working hours and buffers.",
      "4. Share your public profile link or individual event links via email, Slack, or website embed.",
    ],
  },
  {
    id: "video-integrations",
    category: "Integrations",
    title: "Connecting Google Meet, Zoom, and Native Video",
    description: "Automate dynamic meeting link generation for every scheduled appointment.",
    content: [
      "• Google Meet: Connect your Google Calendar in Settings > Integrations. Every confirmed booking automatically generates a unique Google Meet video room.",
      "• Zoom: Authorize the CalMeet Zoom app to automatically spin up password-protected Zoom meetings upon confirmation.",
      "• CalMeet Native Video: Use built-in web-based video rooms without needing third-party meeting accounts.",
    ],
  },
  {
    id: "paid-bookings",
    category: "Billing & Payments",
    title: "Accepting Paid Bookings with Razorpay",
    description: "Charge clients up-front for consultations, coaching, or specialized sessions.",
    content: [
      "1. Upgrade to a Pro, Organization, or Enterprise plan.",
      "2. When creating or editing an Event Type, enable 'Requires Payment'.",
      "3. Set your price and currency (INR or USD).",
      "4. When a guest selects a slot, CalMeet initiates a secure checkout. The booking remains pending until payment signature is verified on the server via HMAC-SHA256.",
    ],
  },
  {
    id: "team-scheduling",
    category: "Teams",
    title: "Shared Availability & Round-Robin Routing",
    description: "Distribute incoming sales demos, client support, or team interviews seamlessly.",
    content: [
      "• Round-Robin Scheduling: CalMeet evaluates all assigned team members, checks individual calendar conflicts, and assigns the meeting to the teammate with the least active bookings.",
      "• Collective Availability: Only offers time slots where all required team members are simultaneously available.",
      "• Team Roles: Assign Owner, Admin, and Member roles to control member invitations, event templates, and team billing.",
    ],
  },
  {
    id: "accessibility",
    category: "Accessibility",
    title: "Keyboard Shortcuts & WCAG Accessibility",
    description: "Accessible scheduling designed for all users, assistive technologies, and mobile screens.",
    content: [
      "• Tab / Shift+Tab: Navigate between month controls, date cells, time slots, and guest fields.",
      "• Enter / Space: Select dates and confirm time slots.",
      "• Screen Reader Optimization: All interactive buttons include explicit ARIA labels and live status regions.",
      "• High Contrast & Mobile Targets: Touch targets meet the 44x44px minimum standard for effortless mobile booking.",
    ],
  },
];

export default function HelpCenterPage() {
  const [search, setSearch] = useState("");
  const [selectedGuide, setSelectedGuide] = useState<GuideArticle>(GUIDES[0]);

  const filteredGuides = GUIDES.filter(
    (g) =>
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase()) ||
      g.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">C</span>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                CalMeet Help Center & Documentation
              </h1>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Guides, best practices, integration tutorials, and customer assistance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/support">
              <Button size="sm" variant="outline" className="text-xs font-semibold gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" />
                Contact Support
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="text-xs font-semibold">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search guides (e.g. Zoom, timezone, Razorpay, round-robin)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 text-xs"
          />
        </div>

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Guides List */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-2">Guides & Articles</h2>
            {filteredGuides.map((guide) => (
              <button
                key={guide.id}
                onClick={() => setSelectedGuide(guide)}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedGuide.id === guide.id
                    ? "border-primary bg-primary/5 text-primary font-bold shadow-2xs"
                    : "border-zinc-200 dark:border-zinc-800 bg-card hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                }`}
              >
                <div>
                  <span className="text-[10px] font-semibold uppercase text-zinc-400 block">{guide.category}</span>
                  <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 block">{guide.title}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-400 shrink-0" />
              </button>
            ))}
          </div>

          {/* Guide Reader */}
          <div className="md:col-span-2">
            <Card className="border-zinc-200 dark:border-zinc-800 shadow-2xs p-6 space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {selectedGuide.category}
                </span>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
                  {selectedGuide.title}
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {selectedGuide.description}
                </p>
              </div>

              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-3">
                {selectedGuide.content.map((paragraph, idx) => (
                  <p key={idx} className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                <span>Still have questions?</span>
                <Link href="/support" className="text-primary hover:underline font-semibold flex items-center gap-1">
                  Ask our engineering team <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
