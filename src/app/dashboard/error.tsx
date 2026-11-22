"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, LifeBuoy } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[DASHBOARD_ERROR]", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
        <AlertCircle className="h-6 w-6" />
      </div>

      <div className="space-y-1 max-w-md">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Something went wrong loading this page
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          An unexpected error occurred. You can retry the operation or reach out to our technical support team.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button onClick={() => reset()} size="sm" variant="outline" className="h-8 text-xs font-semibold gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" /> Try Again
        </Button>
        <Link href="/support">
          <Button size="sm" className="h-8 text-xs font-semibold gap-1.5">
            <LifeBuoy className="h-3.5 w-3.5" /> Contact Support
          </Button>
        </Link>
      </div>
    </div>
  );
}
