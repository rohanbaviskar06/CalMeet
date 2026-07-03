"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronRight, Loader2, GitMerge } from "lucide-react";
import { useRouter } from "next/navigation";

export function RoutingQuestionnaire({ routingForm, username, hideWatermark }: { routingForm: any, username: string, hideWatermark?: boolean }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Evaluate logic
    // For now, we search for a matching route based on the answers
    const questions = routingForm.questions || [];
    const routes = routingForm.routes || [];

    let targetEventTypeId = "";

    // Simple matching: check if any answer matches a route condition
    for (const route of routes) {
      if (route.isFallback) continue;
      
      const hasMatch = Object.values(answers).includes(route.condition);
      if (hasMatch) {
        targetEventTypeId = route.eventTypeId;
        break;
      }
    }

    // Use fallback if no match found
    if (!targetEventTypeId) {
      const fallbackRoute = routes.find((r: any) => r.isFallback);
      targetEventTypeId = fallbackRoute?.eventTypeId || "";
    }

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Redirect to the event type page
    if (targetEventTypeId) {
      // We need to find the slug for the event type ID
      // For this prototype, we'll assume the parent passed some info or we just redirect to a path
      // Real implementation would fetch the slug from the ID
      // To keep it simple, I'll redirect to /[username]?et=[id] or similar if I don't have the slug
      // But we probably want the actual slug.
      // Let's assume we can use a redirect action or we passed the slugs map.
      router.push(`/${username}/redirect?id=${targetEventTypeId}`);
    } else {
      setIsSubmitting(false);
      alert("No matching route found for your answers.");
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 py-12">
      <Card className="shadow-lg border border-zinc-200/50 dark:border-zinc-900/50 bg-white dark:bg-zinc-950/40 rounded-2xl overflow-hidden">
        <CardHeader className="text-center space-y-4 p-6">
          <div className="mx-auto w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-650 dark:text-zinc-400 mb-1 border border-zinc-150 dark:border-zinc-800">
            <GitMerge className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{routingForm.name}</CardTitle>
            <CardDescription className="text-xs text-zinc-450 dark:text-zinc-500">Please answer a few questions to help us route you to the right calendar.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {routingForm.questions.map((q: any) => (
              <div key={q.id} className="space-y-3">
                <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{q.text}</Label>
                
                {q.type === 'select' ? (
                  <div className="grid gap-2">
                    {q.options.map((opt: string, i: number) => (
                      <label 
                        key={i} 
                        className="flex items-center space-x-3 border border-zinc-200/60 dark:border-zinc-850 p-3.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-800 transition-all cursor-pointer group"
                      >
                        <input 
                          type="radio" 
                          name={`q-${q.id}`} 
                          value={opt} 
                          required
                          onChange={(e) => handleAnswer(q.id, e.target.value)}
                          className="w-4 h-4 text-primary bg-background border-zinc-300 focus:ring-primary focus:ring-offset-background"
                        />
                        <span className="text-sm font-normal text-zinc-650 dark:text-zinc-350 group-hover:text-primary transition-colors">{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <Input 
                    placeholder="Type your answer..." 
                    onChange={(e) => handleAnswer(q.id, e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-background text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                  />
                )}
              </div>
            ))}

            <Button type="submit" className="w-full h-11 text-sm font-medium gap-2 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-xl" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Routing you...
                </>
              ) : (
                <>
                  Find a Time <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {!hideWatermark && (
        <div className="mt-8 text-center text-zinc-400 dark:text-zinc-500 text-xs flex items-center justify-center gap-2">
          <span>Powered by</span>
          <div className="flex items-center gap-1.5 font-medium text-zinc-900 dark:text-zinc-100">
            <div className="w-5 h-5 rounded bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-[10px] text-white dark:text-zinc-900 font-semibold shadow-sm">M</div>
            CalMeet
          </div>
        </div>
      )}
    </div>
  );
}
