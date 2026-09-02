"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ExternalLink, ShieldCheck, Check } from "lucide-react";
import { connectICloudCalendar, disconnectICloudCalendar } from "@/app/actions/caldav";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ConnectICloudModalProps {
  isConnected?: boolean;
}

export function ConnectICloudModal({ isConnected = false }: ConnectICloudModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appleId, setAppleId] = useState("");
  const [appPassword, setAppPassword] = useState("");

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appleId.trim() || !appPassword.trim()) {
      toast.error("Please provide both your Apple ID and App-Specific Password.");
      return;
    }

    setLoading(true);
    try {
      const res = await connectICloudCalendar({
        appleId: appleId.trim(),
        appPassword: appPassword.trim(),
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.message || "Connected to Apple iCloud Calendar!");
        setOpen(false);
        setAppleId("");
        setAppPassword("");
        router.refresh();
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred while connecting.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      const res = await disconnectICloudCalendar();
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Disconnected Apple iCloud Calendar.");
        router.refresh();
      }
    } catch {
      toast.error("Failed to disconnect.");
    } finally {
      setLoading(false);
    }
  };

  if (isConnected) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled={loading}
        onClick={handleDisconnect}
        className="h-8 px-3 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 hover:border-red-200 dark:hover:border-red-800"
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
        Disconnect
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 px-3 text-xs font-semibold">
          Connect
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xl">
        <DialogHeader className="space-y-1.5">
          <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100 mb-1">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.87-.9.04-2 .6-2.65 1.35-.58.65-1.08 1.72-.94 2.76 1.01.08 2.05-.49 2.67-1.24z" />
            </svg>
          </div>
          <DialogTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            Connect Apple iCloud Calendar
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
            Sync your Apple Calendar via secure CalDAV protocol.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleConnect} className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Apple ID Email
            </Label>
            <Input
              type="email"
              required
              placeholder="name@icloud.com"
              value={appleId}
              onChange={(e) => setAppleId(e.target.value)}
              className="h-9 text-xs bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              App-Specific Password
            </Label>
            <Input
              type="password"
              required
              placeholder="xxxx-xxxx-xxxx-xxxx"
              value={appPassword}
              onChange={(e) => setAppPassword(e.target.value)}
              className="h-9 text-xs bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 font-mono"
            />
          </div>

          <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 text-[11px] text-zinc-500 dark:text-zinc-400 space-y-1.5">
            <div className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" /> How to generate App-Specific Password:
            </div>
            <ol className="list-decimal list-inside space-y-1 text-zinc-600 dark:text-zinc-400">
              <li>Sign in to <a href="https://appleid.apple.com" target="_blank" rel="noreferrer" className="underline text-zinc-900 dark:text-zinc-100 inline-flex items-center gap-0.5">appleid.apple.com <ExternalLink className="w-2.5 h-2.5" /></a></li>
              <li>Under <strong>Sign-In and Security</strong>, click <strong>App-Specific Passwords</strong>.</li>
              <li>Generate a password named <code>CalMeet</code> and paste it above.</li>
            </ol>
          </div>

          <DialogFooter className="gap-2 pt-2 sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="h-9 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="h-9 px-4 text-xs font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Connecting...
                </>
              ) : (
                "Save & Connect"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
