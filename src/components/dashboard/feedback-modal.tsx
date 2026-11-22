"use client";

import { useState } from "react";
import { MessageSquarePlus, Star, Sparkles, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { submitCustomerFeedback } from "@/app/actions/feedback";
import { toast } from "sonner";

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState<any>("SCHEDULING");
  const [feedback, setFeedback] = useState("");
  const [desiredFeature, setDesiredFeature] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      toast.error("Please provide your feedback.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitCustomerFeedback({
        rating,
        category,
        feedback,
        desiredFeature: desiredFeature.trim() || undefined,
      });
      if (res.success) {
        toast.success(res.message);
        setFeedback("");
        setDesiredFeature("");
        setIsOpen(false);
      }
    } catch {
      toast.error("Failed to submit feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="ghost"
        size="sm"
        className="h-8 text-xs font-medium gap-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        title="Share your feedback"
      >
        <MessageSquarePlus className="h-3.5 w-3.5" />
        Feedback
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 relative">
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Help Us Improve CalMeet</h3>
                  <p className="text-[11px] text-zinc-500">Your ideas and feedback directly drive our product updates.</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Star Rating */}
              <div>
                <Label className="text-xs">How is your scheduling experience?</Label>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer text-zinc-300 dark:text-zinc-700 hover:text-amber-400 transition"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          star <= rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-zinc-300 dark:text-zinc-700"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-zinc-500 ml-2">
                    {rating === 5 ? "Loved it!" : rating === 4 ? "Great" : rating === 3 ? "Okay" : "Needs work"}
                  </span>
                </div>
              </div>

              <div>
                <Label className="text-xs">Category</Label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-8 rounded-md border border-input bg-transparent px-2.5 py-1 text-xs shadow-2xs mt-1"
                >
                  <option value="SCHEDULING">Core Scheduling & Calendar</option>
                  <option value="INTEGRATIONS">Google Meet / Zoom / Calendar Sync</option>
                  <option value="BILLING">Billing & Paid Bookings</option>
                  <option value="TEAMS">Team Roles & Round-Robin</option>
                  <option value="PERFORMANCE">Speed & Mobile Accessibility</option>
                  <option value="OTHER">Other Suggestions</option>
                </select>
              </div>

              <div>
                <Label className="text-xs">What can we do better? *</Label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us what you liked or what caused friction..."
                  rows={3}
                  required
                  className="text-xs mt-1"
                />
              </div>

              <div>
                <Label className="text-xs">What feature would you like next? (Optional)</Label>
                <Input
                  value={desiredFeature}
                  onChange={(e) => setDesiredFeature(e.target.value)}
                  placeholder="e.g. WhatsApp reminders, Outlook 365 sync"
                  className="h-8 text-xs mt-1"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} size="sm" className="h-8 px-4 text-xs font-semibold">
                  {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                  Send Feedback
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
