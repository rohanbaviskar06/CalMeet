"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Sparkles, CheckCircle2 } from "lucide-react";

const POPULAR_APPS = [
  "Notion", "Airtable", "HubSpot", "Salesforce", "Calendly",
  "Linear", "Jira", "Trello", "Asana", "Monday.com",
  "Stripe", "PayPal", "Twilio", "SendGrid", "Mailchimp",
];

interface RequestIntegrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestIntegrationModal({ open, onOpenChange }: RequestIntegrationModalProps) {
  const [appName, setAppName] = useState("");
  const [useCase, setUseCase] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!appName.trim()) {
      toast.error("Please enter an app name.");
      return;
    }
    setIsSubmitting(true);
    // Simulate sending — in production, wire to an email/DB action
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleClose = (v: boolean) => {
    onOpenChange(v);
    if (!v) {
      // Reset after close animation
      setTimeout(() => {
        setAppName("");
        setUseCase("");
        setEmail("");
        setSubmitted(false);
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        {submitted ? (
          /* Success state */
          <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
            <div className="h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Request received!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Thanks! We'll consider <span className="font-semibold text-foreground">{appName}</span> for a future release.
              </p>
            </div>
            <Button className="mt-2" onClick={() => handleClose(false)}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-1">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-base font-semibold">Request an Integration</DialogTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">We review every request</p>
                </div>
              </div>
              <DialogDescription className="text-sm leading-relaxed">
                Tell us which app you'd like CalMeet to connect with and how you'd use it.
              </DialogDescription>
            </DialogHeader>

            {/* Quick-pick chips */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Popular requests</Label>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_APPS.map((app) => (
                  <button
                    key={app}
                    type="button"
                    onClick={() => setAppName(app)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      appName === app
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/50 text-muted-foreground border-transparent hover:border-border hover:text-foreground"
                    }`}
                  >
                    {app}
                  </button>
                ))}
              </div>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="req-app-name">
                  App name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="req-app-name"
                  placeholder="e.g. Notion, HubSpot, Stripe..."
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="req-use-case">How would you use it?</Label>
                <textarea
                  id="req-use-case"
                  rows={3}
                  placeholder="e.g. Send booking details to a Notion database automatically..."
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-md border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="req-email">Your email (optional — for updates)</Label>
                <Input
                  id="req-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter showCloseButton>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !appName.trim()}
                className="sm:ml-auto gap-2"
              >
                {isSubmitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Submitting…</>
                ) : (
                  <><Sparkles className="h-4 w-4" />Submit Request</>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
