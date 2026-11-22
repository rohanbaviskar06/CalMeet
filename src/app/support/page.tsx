"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { submitSupportTicket } from "@/app/actions/support";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle2, 
  HelpCircle, 
  LifeBuoy, 
  Mail, 
  Clock, 
  Loader2,
  Building2,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Link from "next/link";

function SupportFormContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "";

  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [category, setCategory] = useState<any>(
    topic === "enterprise-sales" ? "TEAMS" : topic === "billing" ? "BILLING" : "BOOKING"
  );
  const [priority, setPriority] = useState<any>(topic === "enterprise-sales" ? "NORMAL" : "NORMAL");
  const [subject, setSubject] = useState(
    topic === "enterprise-sales" ? "Enterprise Sales & Pilot Inquiry" : ""
  );
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketResult, setTicketResult] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.name && !name) setName(session.user.name);
    if (session?.user?.email && !email) setEmail(session.user.email);
  }, [session, name, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      toast.error("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitSupportTicket({
        name,
        email,
        category,
        priority,
        subject,
        message,
      });

      if (res.success && res.ticketId) {
        toast.success("Support ticket submitted!");
        setTicketResult(res.ticketId);
      } else {
        toast.error("Failed to submit ticket. Please try again.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {ticketResult ? (
        <Card className="border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/10 p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl">Ticket Received: {ticketResult}</CardTitle>
          <CardDescription className="text-xs max-w-sm mx-auto">
            We have dispatched your request to our engineering team. You will receive an email update at <strong>{email}</strong> within 24 business hours.
          </CardDescription>
          <div className="pt-4 flex justify-center gap-3">
            <Button size="sm" onClick={() => setTicketResult(null)} variant="outline" className="text-xs">
              Submit Another Request
            </Button>
            <Link href="/dashboard">
              <Button size="sm" className="text-xs">Back to Dashboard</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-2xs">
          <CardHeader>
            <div className="flex items-center gap-2">
              <LifeBuoy className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Contact Technical & Sales Support</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Facing an issue with your scheduling link, calendar conflicts, or enterprise licensing? Submit a ticket below or reach out via direct email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Your Name *</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    required
                    className="h-9 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Email Address *</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    required
                    className="h-9 text-xs mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Category</Label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mt-1 cursor-pointer"
                  >
                    <option value="BOOKING">Booking & Calendar Sync</option>
                    <option value="BILLING">Billing, Invoices & Upgrades</option>
                    <option value="INTEGRATIONS">Google Meet / Zoom / Webhooks</option>
                    <option value="TEAMS">Team Roles & Round-Robin / Enterprise</option>
                    <option value="BUG">Bug or Error Alert</option>
                    <option value="OTHER">Other Inquiries</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Priority</Label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mt-1 cursor-pointer"
                  >
                    <option value="LOW">Low (General Inquiry)</option>
                    <option value="NORMAL">Normal (Standard Assistance)</option>
                    <option value="URGENT">Urgent (Meeting Blocked / Live Disruption)</option>
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-xs">Subject *</Label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief description of the problem or request"
                  required
                  className="h-9 text-xs mt-1"
                />
              </div>

              <div>
                <Label className="text-xs">Details & Steps to Reproduce *</Label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please include any relevant URLs, error messages, or details..."
                  rows={4}
                  required
                  className="text-xs mt-1"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Business hours: Mon–Fri, 9 AM – 6 PM IST (Response within 24h)
                </span>
                <Button type="submit" disabled={isSubmitting} size="sm" className="h-9 px-5 text-xs font-semibold w-full sm:w-auto">
                  {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
                  Submit Ticket
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Direct Contact & Support Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
          <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100">
            <Mail className="h-4 w-4 text-primary" /> Direct Email Support
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
            Prefer direct email? Send your inquiry straight to our inbox.
          </p>
          <a href="mailto:support@calmeet.app" className="text-xs font-semibold text-primary hover:underline">
            support@calmeet.app
          </a>
        </div>

        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
          <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100">
            <Building2 className="h-4 w-4 text-primary" /> Enterprise & Sales
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
            Inquiring about multi-team pilots, custom contracts, or SOC2 reports?
          </p>
          <a href="mailto:sales@calmeet.app" className="text-xs font-semibold text-primary hover:underline">
            sales@calmeet.app
          </a>
        </div>
      </div>
    </div>
  );
}

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-5">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-zinc-900 dark:text-zinc-100">
            <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-black">C</span>
            CalMeet Support
          </Link>
          <Link href="/resources/help-docs" className="text-xs text-primary hover:underline font-semibold flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" /> Documentation
          </Link>
        </div>

        <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading support portal...</div>}>
          <SupportFormContent />
        </Suspense>
      </div>
    </div>
  );
}
