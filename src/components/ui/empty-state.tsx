import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 space-y-4",
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 shadow-2xs">
        <Icon className="h-6 w-6 stroke-[1.75]" />
      </div>

      <div className="space-y-1 max-w-sm">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{title}</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{description}</p>
      </div>

      {actionLabel && (actionHref || onAction) && (
        <div className="pt-2">
          {actionHref ? (
            <Link href={actionHref}>
              <Button size="sm" className="h-8 px-4 text-xs font-semibold">
                {actionLabel}
              </Button>
            </Link>
          ) : (
            <Button size="sm" onClick={onAction} className="h-8 px-4 text-xs font-semibold">
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
