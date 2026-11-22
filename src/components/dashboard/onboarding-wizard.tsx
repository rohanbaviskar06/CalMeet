"use client";

import { useState } from "react";
import { CheckCircle2, Circle, ArrowRight, X, Sparkles, Calendar, Clock, Globe, Share2 } from "lucide-react";
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
}

export function OnboardingWizard({ user, eventTypesCount, bookingsCount }: OnboardingWizardProps) {
  const [dismissed, setDismissed] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  if (user.completedOnboarding || dismissed) {
    return null;
  }

  const steps = [
    {
      title: "Set your profile & timezone",
      desc: user.timezone ? `Configured as ${user.timezone}` : "Ensure guests book in your accurate timezone",
      done: Boolean(user.timezone && user.timezone !== "UTC"),
      href: "/dashboard/settings",
      icon: Globe,
    },
    {
      title: "Define working availability",
      desc: "Set the days and hours you are available for calls",
      done: true, // Default availability is seeded upon account creation
      href: "/dashboard/availability",
      icon: Clock,
    },
    {
      title: "Create your first event type",
      desc: "Customize duration, location (Google Meet, Zoom), and description",
      done: eventTypesCount > 0,
      href: "/dashboard/event-types",
      icon: Calendar,
    },
    {
      title: "Share your booking link",
      desc: "Receive your first meeting booking from a client or teammate",
      done: bookingsCount > 0,
      href: user.username ? `/${user.username}` : "/dashboard",
      icon: Share2,
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  const handleDismiss = async () => {
    setIsCompleting(true);
    try {
      await completeOnboardingAction();
      toast.success("Onboarding completed! Welcome to CalMeet.");
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
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Complete these steps to activate your scheduling flow and share your booking link.
            </p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          disabled={isCompleting}
          className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1 cursor-pointer"
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
            <Link
              key={idx}
              href={step.href}
              className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                step.done
                  ? "border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/10"
                  : "border-zinc-200 dark:border-zinc-800 bg-card hover:border-primary/40"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="text-[10px] font-bold uppercase text-zinc-400">Step {idx + 1}</span>
                  </div>
                  {step.done ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-zinc-400" />
                  )}
                </div>
                <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{step.title}</h3>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-2">{step.desc}</p>
              </div>

              <div className="mt-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-[11px] font-medium text-primary">
                <span>{step.done ? "Review" : "Complete"}</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
