"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronRight, Loader2, GitMerge } from "lucide-react";
import { useRouter } from "next/navigation";

export function RoutingQuestionnaire({ routingForm, username }: { routingForm: any, username: string }) {
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
      <Card className="shadow-xl border-none">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
            <GitMerge className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">{routingForm.name}</CardTitle>
            <CardDescription>Please answer a few questions to help us route you to the right calendar.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {routingForm.questions.map((q: any) => (
              <div key={q.id} className="space-y-4">
                <Label className="text-base font-semibold">{q.text}</Label>
                
                {q.type === 'select' ? (
                  <div className="grid gap-3">
                    {q.options.map((opt: string, i: number) => (
                      <label 
                        key={i} 
                        className="flex items-center space-x-3 border p-4 rounded-xl hover:bg-primary/5 hover:border-primary/30 transition-all cursor-pointer group"
                      >
                        <input 
                          type="radio" 
                          name={`q-${q.id}`} 
                          value={opt} 
                          required
                          onChange={(e) => handleAnswer(q.id, e.target.value)}
                          className="w-4 h-4 text-primary bg-background border-muted focus:ring-primary focus:ring-offset-background"
                        />
                        <span className="text-sm font-medium group-hover:text-primary transition-colors">{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <Input 
                    placeholder="Type your answer..." 
                    onChange={(e) => handleAnswer(q.id, e.target.value)}
                    required
                  />
                )}
              </div>
            ))}

            <Button type="submit" className="w-full h-12 text-lg font-semibold gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Routing you...
                </>
              ) : (
                <>
                  Find a Time <ChevronRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="mt-8 text-center text-muted-foreground text-sm flex items-center justify-center gap-2">
        <span>Powered by</span>
        <div className="flex items-center gap-1 font-bold text-foreground">
          <div className="w-5 h-5 rounded bg-primary flex items-center justify-center text-[10px] text-primary-foreground">M</div>
          MeetMe
        </div>
      </div>
    </div>
  );
}
