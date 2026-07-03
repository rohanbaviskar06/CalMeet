"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { disconnectAccount } from "@/app/actions/integrations";
import { toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DisconnectAccountButtonProps {
  provider: string;
  providerName: string;
}

export function DisconnectAccountButton({ provider, providerName }: DisconnectAccountButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      const result = await disconnectAccount(provider);
      if (result.success) {
        toast.success(`${providerName} integration disconnected successfully.`);
        setIsOpen(false);
      } else {
        toast.error(`Failed to disconnect ${providerName}.`);
      }
    } catch {
      toast.error(`Failed to disconnect ${providerName}.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="w-full text-destructive hover:text-destructive hover:bg-destructive/5"
        onClick={() => setIsOpen(true)}
        disabled={isLoading}
      >
        Disconnect
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold">Disconnect {providerName}</DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Revoke app permissions</p>
              </div>
            </div>
            <DialogDescription className="text-sm leading-relaxed pt-2">
              Are you sure you want to disconnect your <strong>{providerName}</strong> integration? This will stop syncing meetings and features instantly.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
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
