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
import { connectSlack, disconnectSlack } from "@/app/actions/integrations";
import { toast } from "sonner";
import { Loader2, Link2, AlertCircle, CheckCircle2, Clipboard } from "lucide-react";

export function ConnectSlackButton({ isConnected }: { isConnected: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [error, setError] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);

  const isValidUrl = webhookUrl.startsWith("https://hooks.slack.com/");

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
      setError("Must start with https://hooks.slack.com/");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const result = await connectSlack(webhookUrl.trim());
      if (result.error) {
        setError(result.error);
      } else {
        toast.success("Slack connected! You'll now get booking notifications.");
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
      const result = await disconnectSlack();
      if (result.success) {
        toast.success("Slack disconnected.");
        setConfirmOpen(false);
      }
    } catch {
      toast.error("Failed to disconnect Slack.");
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
                  <DialogTitle className="text-base font-semibold">Disconnect Slack</DialogTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">Revoke app permissions</p>
                </div>
              </div>
              <DialogDescription className="text-sm leading-relaxed pt-2">
                Are you sure you want to disconnect your <strong>Slack notifications</strong>? You will no longer receive updates in your channel.
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
        <Link2 className="mr-2 h-4 w-4" />
        Connect Slack
      </Button>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); setWebhookUrl(""); setError(""); }}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            {/* Slack logo + header */}
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4A154B] shadow-md">
                {/* Slack "#" icon */}
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                  <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="white"/>
                </svg>
              </div>
              <div>
                <DialogTitle className="text-base font-semibold">Connect Slack</DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Webhook notifications</p>
              </div>
            </div>

            <DialogDescription className="text-sm leading-relaxed">
              Paste your Slack Incoming Webhook URL below. You'll get a notification
              in your channel every time a new booking is made.
            </DialogDescription>
          </DialogHeader>

          {/* How to get URL hint */}
          <div className="rounded-lg border border-dashed border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Where to find your Webhook URL:</p>
            <ol className="list-decimal list-inside space-y-0.5">
              <li>Go to <span className="font-mono bg-background px-1 rounded">api.slack.com/apps</span></li>
              <li>Select your app → <strong>Incoming Webhooks</strong></li>
              <li>Click <strong>Add New Webhook to Workspace</strong></li>
              <li>Copy the generated URL</li>
            </ol>
          </div>

          {/* Input */}
          <div className="space-y-2">
            <Label htmlFor="slack-webhook-url" className="text-sm font-medium">
              Webhook URL
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="slack-webhook-url"
                  placeholder="https://hooks.slack.com/services/..."
                  value={webhookUrl}
                  onChange={(e) => {
                    setWebhookUrl(e.target.value);
                    setError("");
                  }}
                  className={`pr-9 font-mono text-xs ${error ? "border-destructive focus-visible:ring-destructive/30" : isValidUrl && webhookUrl ? "border-green-500 focus-visible:ring-green-500/30" : ""}`}
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
              className="sm:ml-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting…
                </>
              ) : (
                <>
                  <Link2 className="mr-2 h-4 w-4" />
                  Connect Slack
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
