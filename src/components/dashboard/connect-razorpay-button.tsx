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
import { connectRazorpay, disconnectRazorpay } from "@/app/actions/integrations";
import { toast } from "sonner";
import { Loader2, AlertCircle, ShieldCheck } from "lucide-react";

export function ConnectRazorpayButton({ isConnected }: { isConnected: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [keyId, setKeyId] = useState("");
  const [keySecret, setKeySecret] = useState("");
  const [error, setError] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConnect = async () => {
    if (!keyId.trim() || !keySecret.trim()) {
      setError("Both Key ID and Key Secret are required.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const result = await connectRazorpay(keyId.trim(), keySecret.trim());
      if (result.error) {
        setError(result.error);
      } else {
        toast.success("Razorpay connected! You can now charge for bookings.");
        setOpen(false);
        setKeyId("");
        setKeySecret("");
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
      const result = await disconnectRazorpay();
      if (result.success) {
        toast.success("Razorpay disconnected.");
        setConfirmOpen(false);
      }
    } catch {
      toast.error("Failed to disconnect Razorpay.");
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
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle>Disconnect Razorpay</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to disconnect Razorpay?
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="py-3 text-sm text-muted-foreground">
              You will no longer be able to accept payments for your booking events. Existing paid event types will fail to book until you reconnect or disable payments on them.
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="ghost"
                onClick={() => setConfirmOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDisconnect}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Disconnect
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setOpen(true)}
      >
        Connect
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle>Connect Razorpay</DialogTitle>
                <DialogDescription>
                  Enter your Razorpay API Credentials to accept payments.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="keyId">Key ID</Label>
              <Input
                id="keyId"
                placeholder="rzp_test_..."
                value={keyId}
                onChange={(e) => setKeyId(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keySecret">Key Secret</Label>
              <Input
                id="keySecret"
                type="password"
                placeholder="••••••••••••••••"
                value={keySecret}
                onChange={(e) => setKeySecret(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/5 p-3 rounded-lg border border-destructive/10">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg border">
              Make sure to configure your API keys from the Razorpay Dashboard (Settings &gt; API Keys). We recommend starting with Test Mode keys.
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleConnect} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Connect Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
