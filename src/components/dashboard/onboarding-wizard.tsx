"use client";

import { useState } from "react";
import { CheckCircle2, Circle, ArrowRight, X, Sparkles, Calendar, Clock, CalendarCheck2, Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { completeOnboardingAction } from "@/app/actions/onboarding";
import { toast } from "sonner";
import Link from "next/link";

interface OnboardingWizardProps {
  user: {
    username?: string | null;
    timezone?: string | null;
    completedOnboarding?: boolean;
  };
  eventTypesCount: number;
  bookingsCount: number;
  hasConnectedCalendar?: boolean;
  hasAvailability?: boolean;
}

export function OnboardingWizard({ 
  user, 
  eventTypesCount, 
  bookingsCount,
  hasConnectedCalendar = false,
  hasAvailability = true,
}: OnboardingWizardProps) {
  const [dismissed, setDismissed] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (user.completedOnboarding || dismissed) {
    return null;
  }

  const steps = [
    {
      title: "Create an event type",
      desc: "Customize duration, location (Google Meet or Zoom), and booking questions",
      done: eventTypesCount > 0,
      href: "/dashboard/event-types/new",
      icon: Calendar,
      actionText: eventTypesCount > 0 ? "Manage" : "Create event",
    },
    {
      title: "Set your availability",
      desc: "Define your weekly working hours, buffer times, and date overrides",
      done: hasAvailability,
      href: "/dashboard/availability",
      icon: Clock,
      actionText: "Configure",
    },
    {
      title: "Connect your calendar",
      desc: "Sync Google Calendar to prevent conflicts and avoid double bookings",
      done: hasConnectedCalendar,
      href: "/dashboard/integrations",
      icon: CalendarCheck2,
      actionText: hasConnectedCalendar ? "Connected" : "Connect",
    },
    {
      title: "Share your booking link",
      desc: user.username ? `calmeet.app/${user.username}` : "Share your link to receive your first booking",
      done: bookingsCount > 0,
      href: user.username ? `/${user.username}` : "/dashboard/settings",
      icon: Share2,
      actionText: bookingsCount > 0 ? "Bookings active" : "View link",
      isShareStep: true,
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  const handleCopyShareLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (user.username) {
      const url = `${window.location.origin}/${user.username}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      toast.success("Public booking link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2500);
    } else {
      toast.info("Please set your username in settings first.");
    }
  };

  const handleDismiss = async () => {
    setIsCompleting(true);
    try {
      await completeOnboardingAction();
      toast.success("Onboarding checklist completed! Welcome to CalMeet.");
      setDismissed(true);
    } catch {
      setDismissed(true);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5 dark:bg-primary/10 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Welcome to CalMeet! Let's get you set up ({progressPercent}% complete)
            </h2>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
              Complete these steps to activate your scheduling flow and share your booking link.
            </p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          disabled={isCompleting}
          aria-label="Dismiss onboarding checklist"
          className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1 cursor-pointer transition-colors"
          title="Dismiss Onboarding"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Steps List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between group ${
                step.done
                  ? "border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/10"
                  : "border-zinc-200 dark:border-zinc-800 bg-card hover:border-primary/40"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
                    <span className="text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400">Step {idx + 1}</span>
                  </div>
                  {step.done ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-zinc-400" />
                  )}
                </div>
                <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{step.title}</h3>
                <p className="text-[10px] text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">{step.desc}</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-[11px] font-semibold">
                <Link 
                  href={step.href} 
                  className="inline-flex items-center gap-1 text-primary hover:underline underline-offset-2"
                >
                  <span>{step.actionText}</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>

                {step.isShareStep && user.username && (
                  <button
                    onClick={handleCopyShareLink}
                    type="button"
                    aria-label="Copy booking link"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[10px] font-medium transition cursor-pointer"
                  >
                    {copiedLink ? <Check className="h-2.5 w-2.5 text-emerald-500" /> : <Copy className="h-2.5 w-2.5" />}
                    <span>{copiedLink ? "Copied" : "Copy"}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
