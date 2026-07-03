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
import { connectZapier, disconnectZapier } from "@/app/actions/integrations";
import { toast } from "sonner";
import { Loader2, Link2, AlertCircle, CheckCircle2, Clipboard, Zap } from "lucide-react";

export function ConnectZapierButton({ isConnected }: { isConnected: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [error, setError] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);

  const isValidUrl = webhookUrl.startsWith("https://hooks.zapier.com/");

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setWebhookUrl(text);
      setError("");
    } catch {
      toast.error("Could not read clipboard");
    }
  };

  const handleConnect = async () => {
    if (!webhookUrl.trim()) {
      setError("Webhook URL is required.");
      return;
    }
    if (!isValidUrl) {
      setError("Must start with https://hooks.zapier.com/");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const result = await connectZapier(webhookUrl.trim());
      if (result.error) {
        setError(result.error);
      } else {
        toast.success("Zapier connected! New bookings will trigger your Zap.");
        setOpen(false);
        setWebhookUrl("");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      const result = await disconnectZapier();
      if (result.success) {
        toast.success("Zapier disconnected.");
        setConfirmOpen(false);
      }
    } catch {
      toast.error("Failed to disconnect Zapier.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isConnected) {
    return (
      <>
        <Button
          variant="outline"
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/5"
          onClick={() => setConfirmOpen(true)}
          disabled={isLoading}
        >
          Disconnect
        </Button>

        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent className="sm:max-w-md" showCloseButton>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-base font-semibold">Disconnect Zapier</DialogTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">Revoke app permissions</p>
                </div>
              </div>
              <DialogDescription className="text-sm leading-relaxed pt-2">
                Are you sure you want to disconnect your <strong>Zapier integration</strong>? New bookings will no longer trigger webhooks.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-4 flex gap-2 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setConfirmOpen(false)}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDisconnect}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Disconnecting…
                  </>
                ) : (
                  "Disconnect"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Button className="w-full" onClick={() => setOpen(true)} disabled={isLoading}>
        <Zap className="mr-2 h-4 w-4" />
        Connect Zapier
      </Button>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); setWebhookUrl(""); setError(""); }}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            {/* Zapier branded header */}
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF4A00] shadow-md">
                <Zap className="h-5 w-5 text-white fill-white" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold">Connect Zapier</DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Webhook trigger</p>
              </div>
            </div>

            <DialogDescription className="text-sm leading-relaxed">
              Every time a new booking is created in CalMeet, Zapier will be triggered
              — letting you connect to 6,000+ apps like Gmail, Notion, Airtable, and more.
            </DialogDescription>
          </DialogHeader>

          {/* Step guide */}
          <div className="rounded-lg border border-dashed border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">How to get your Zapier Webhook URL:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Go to <span className="font-mono bg-background px-1 rounded">zapier.com</span> and click <strong>+ Create Zap</strong></li>
              <li>Set <strong>Trigger</strong> → search for <strong>"Webhooks by Zapier"</strong></li>
              <li>Choose <strong>Catch Hook</strong> as the event</li>
              <li>Copy the <strong>Custom Webhook URL</strong> shown</li>
              <li>Paste it below and connect — then finish setting up your Zap actions</li>
            </ol>
          </div>

          {/* What data is sent */}
          <div className="rounded-lg bg-[#FF4A00]/5 border border-[#FF4A00]/20 px-4 py-3 text-xs space-y-1">
            <p className="font-medium text-foreground flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-[#FF4A00]" />
              Data sent to Zapier on each booking:
            </p>
            <p className="text-muted-foreground font-mono">
              guestName, guestEmail, eventTitle, startTime, endTime, meetLink, notes
            </p>
          </div>

          {/* Input */}
          <div className="space-y-2">
            <Label htmlFor="zapier-webhook-url" className="text-sm font-medium">
              Webhook URL
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="zapier-webhook-url"
                  placeholder="https://hooks.zapier.com/hooks/catch/..."
                  value={webhookUrl}
                  onChange={(e) => { setWebhookUrl(e.target.value); setError(""); }}
                  className={`pr-9 font-mono text-xs ${
                    error
                      ? "border-destructive focus-visible:ring-destructive/30"
                      : isValidUrl && webhookUrl
                      ? "border-green-500 focus-visible:ring-green-500/30"
                      : ""
                  }`}
                  onKeyDown={(e) => e.key === "Enter" && handleConnect()}
                />
                {isValidUrl && webhookUrl && (
                  <CheckCircle2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500 pointer-events-none" />
                )}
                {error && (
                  <AlertCircle className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive pointer-events-none" />
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handlePaste}
                title="Paste from clipboard"
                className="shrink-0"
              >
                <Clipboard className="h-4 w-4" />
              </Button>
            </div>
            {error && (
              <p className="flex items-center gap-1.5 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {error}
              </p>
            )}
          </div>

          <DialogFooter showCloseButton>
            <Button
              onClick={handleConnect}
              disabled={isLoading || !webhookUrl.trim()}
              className="sm:ml-auto bg-[#FF4A00] hover:bg-[#e04200] text-white"
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Connecting…</>
              ) : (
                <><Zap className="mr-2 h-4 w-4" />Connect Zapier</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
