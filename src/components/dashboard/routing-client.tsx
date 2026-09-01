"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import { 
  GitMerge, 
  Plus, 
  ArrowRight, 
  MoreVertical, 
  HelpCircle, 
  Link as LinkIcon, 
  Filter, 
  CheckCircle2, 
  Trash2, 
  Loader2, 
  Copy, 
  Edit2, 
  ExternalLink,
  Sparkles,
  ArrowLeft,
  Sliders,
  Eye,
  Check,
  Code2,
  Share2,
  FileQuestion,
  Layers,
  ArrowUpRight
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { 
  createRoutingForm, 
  updateRoutingForm, 
  toggleRoutingFormStatus,
  deleteRoutingForm,
  duplicateRoutingForm 
} from "@/app/actions/routing";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  text: string;
  description?: string;
  type: "select" | "text" | "email" | "number";
  options: string[];
  required?: boolean;
}

interface RouteRule {
  id: string;
  questionId?: string;
  condition: string;
  targetType: "event" | "external";
  eventTypeId: string;
  externalUrl?: string;
  isFallback: boolean;
}

interface RoutingClientProps {
  initialForms: any[];
  eventTypes: Array<{ id: string; title: string; duration?: number; slug?: string }>;
  baseUrl: string;
  username: string;
}

const TEMPLATES = [
  {
    title: "Sales Lead Qualification",
    desc: "Route high-value enterprise leads to your senior team and smaller accounts to self-serve discovery.",
    questions: [
      { id: "q1", text: "What is your company size?", type: "select" as const, options: ["1-50 employees", "51-250 employees", "250+ employees (Enterprise)"], required: true },
      { id: "q2", text: "What is your estimated annual budget?", type: "select" as const, options: ["Under $10,000", "$10,000 - $50,000", "$50,000+"], required: true }
    ],
    rules: (eventTypes: any[]) => [
      { id: "r1", condition: "250+ employees (Enterprise)", targetType: "event" as const, eventTypeId: eventTypes[0]?.id || "", isFallback: false },
      { id: "r2", condition: "$50,000+", targetType: "event" as const, eventTypeId: eventTypes[0]?.id || "", isFallback: false },
      { id: "r3", condition: "fallback", targetType: "event" as const, eventTypeId: eventTypes[eventTypes.length > 1 ? 1 : 0]?.id || "", isFallback: true }
    ]
  },
  {
    title: "Support & Issue Routing",
    desc: "Direct urgent enterprise issues to priority triage and general inquiries to standard support.",
    questions: [
      { id: "q1", text: "What issue are you experiencing?", type: "select" as const, options: ["Billing & Invoicing", "Technical / Bug Report", "API & Developer Integration"], required: true },
      { id: "q2", text: "Urgency Level", type: "select" as const, options: ["Urgent (System Down)", "Moderate", "General Inquiry"], required: true }
    ],
    rules: (eventTypes: any[]) => [
      { id: "r1", condition: "Urgent (System Down)", targetType: "event" as const, eventTypeId: eventTypes[0]?.id || "", isFallback: false },
      { id: "r2", condition: "fallback", targetType: "event" as const, eventTypeId: eventTypes[eventTypes.length > 1 ? 1 : 0]?.id || "", isFallback: true }
    ]
  },
  {
    title: "Recruiting Candidate Screening",
    desc: "Route engineering candidates to technical interviewers and product candidates to hiring managers.",
    questions: [
      { id: "q1", text: "Which role are you applying for?", type: "select" as const, options: ["Software Engineering", "Product Design", "Marketing & Growth", "Sales"], required: true },
      { id: "q2", text: "Years of Experience", type: "select" as const, options: ["0-2 years", "3-5 years", "6+ years"], required: true }
    ],
    rules: (eventTypes: any[]) => [
      { id: "r1", condition: "Software Engineering", targetType: "event" as const, eventTypeId: eventTypes[0]?.id || "", isFallback: false },
      { id: "r2", condition: "fallback", targetType: "event" as const, eventTypeId: eventTypes[eventTypes.length > 1 ? 1 : 0]?.id || "", isFallback: true }
    ]
  }
];

export function RoutingClient({ initialForms, eventTypes, baseUrl, username }: RoutingClientProps) {
  const [forms, setForms] = useState(initialForms);
  const [isCreating, setIsCreating] = useState(false);
  const [editingFormId, setEditingFormId] = useState<string | null>(null);
  const [newFormName, setNewFormName] = useState("Sales Qualification Form");
  const [newFormSlug, setNewFormSlug] = useState("sales-qualification");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [builderTab, setBuilderTab] = useState<"builder" | "preview">("builder");

  // Embed Modal State
  const [embedModalForm, setEmbedModalForm] = useState<any | null>(null);

  // Form Builder State
  const [questions, setQuestions] = useState<Question[]>([
    { id: "1", text: "What is your company size?", type: "select", options: ["1-50", "51-250", "250+ (Enterprise)"], required: true }
  ]);
  const [routes, setRoutes] = useState<RouteRule[]>([
    { id: "1", condition: "250+ (Enterprise)", targetType: "event", eventTypeId: eventTypes[0]?.id || "", isFallback: false },
    { id: "2", condition: "fallback", targetType: "event", eventTypeId: eventTypes[eventTypes.length > 1 ? 1 : 0]?.id || "", isFallback: true }
  ]);

  // Preview Simulator State
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, string>>({});
  const [previewResult, setPreviewResult] = useState<string | null>(null);

  const toggleForm = async (id: string, currentStatus: boolean) => {
    setForms(forms.map(f => f.id === id ? { ...f, isActive: !currentStatus } : f));
    try {
      await toggleRoutingFormStatus(id, currentStatus);
      toast.success(`Routing Form ${!currentStatus ? 'enabled' : 'disabled'}`);
    } catch {
      toast.error("Failed to update status");
      setForms(forms.map(f => f.id === id ? { ...f, isActive: currentStatus } : f));
    }
  };

  const handleDeleteForm = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteRoutingForm(id);
      setForms(forms.filter(f => f.id !== id));
      toast.success(`"${name}" deleted.`);
    } catch {
      toast.error("Failed to delete form");
    }
  };

  const handleDuplicateForm = async (id: string) => {
    try {
      const res = await duplicateRoutingForm(id);
      if (res.success && res.form) {
        const newForm = {
          ...res.form,
          questions: JSON.parse(res.form.questions || "[]"),
          routes: JSON.parse(res.form.routes || "[]"),
          link: `/${username}/${res.form.slug}`
        };
        setForms([newForm, ...forms]);
        toast.success("Routing form duplicated successfully!");
      }
    } catch {
      toast.error("Failed to duplicate form");
    }
  };

  const handleSave = async () => {
    if (!newFormName.trim()) {
      toast.error("Please provide a name for the form");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingFormId) {
        await updateRoutingForm(editingFormId, {
          name: newFormName,
          slug: newFormSlug,
          questions,
          routes
        });
        toast.success("Routing Form updated successfully!");
        setForms(forms.map(f => f.id === editingFormId ? { 
          ...f, 
          name: newFormName, 
          slug: newFormSlug, 
          questions, 
          routes,
          link: `/${username}/${newFormSlug}`
        } : f));
      } else {
        await createRoutingForm({
          name: newFormName,
          slug: newFormSlug,
          questions,
          routes
        });
        toast.success("Routing Form created!");
        window.location.reload();
      }
      setIsCreating(false);
      setEditingFormId(null);
    } catch (e: any) {
      toast.error(e.message || "Failed to save form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyTemplate = (template: typeof TEMPLATES[0]) => {
    setNewFormName(template.title);
    setNewFormSlug(template.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    setQuestions(template.questions);
    setRoutes(template.rules(eventTypes));
    setIsCreating(true);
    toast.success(`Loaded "${template.title}" template!`);
  };

  const runPreviewSimulation = () => {
    let matchedEventTypeId = "";
    for (const r of routes) {
      if (r.isFallback) continue;
      const matched = Object.values(previewAnswers).some(val => val === r.condition);
      if (matched) {
        matchedEventTypeId = r.eventTypeId;
        break;
      }
    }
    if (!matchedEventTypeId) {
      const fallback = routes.find(r => r.isFallback);
      matchedEventTypeId = fallback?.eventTypeId || "";
    }

    const matchedEvent = eventTypes.find(et => et.id === matchedEventTypeId);
    setPreviewResult(matchedEvent ? `${matchedEvent.title} (${matchedEvent.duration || 30}m call)` : "Fallback Calendar");
  };

  // -------------------------------------------------------------
  // BUILDER VIEW
  // -------------------------------------------------------------
  if (isCreating) {
    const selectQuestions = questions.filter(q => q.type === "select");
    const allSelectOptions = Array.from(new Set(selectQuestions.flatMap(q => q.options)));

    return (
      <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-200">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-card shadow-sm">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setIsCreating(false);
                setEditingFormId(null);
              }}
              className="h-9 px-3 gap-1.5 text-xs rounded-xl"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <div>
              <input 
                type="text" 
                value={newFormName}
                onChange={(e) => {
                  setNewFormName(e.target.value);
                  if (!editingFormId) {
                    setNewFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                  }
                }}
                className="text-lg sm:text-xl font-bold bg-transparent border-b border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-primary outline-none transition-colors w-full" 
                placeholder="Form Name (e.g. Sales Qualification)"
              />
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono mt-0.5">
                <span>/{username}/</span>
                <input 
                  type="text"
                  value={newFormSlug}
                  onChange={(e) => setNewFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}
                  className="bg-transparent border-b border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold focus:border-primary outline-none min-w-[120px]"
                  placeholder="form-slug"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1 border border-zinc-200 dark:border-zinc-700">
              <button
                onClick={() => setBuilderTab("builder")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  builderTab === "builder" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Sliders className="h-3.5 w-3.5 inline mr-1.5" />
                Builder
              </button>
              <button
                onClick={() => {
                  setBuilderTab("preview");
                  runPreviewSimulation();
                }}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  builderTab === "preview" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Eye className="h-3.5 w-3.5 inline mr-1.5" />
                Live Preview
              </button>
            </div>

            <Button 
              size="sm" 
              onClick={handleSave} 
              disabled={isSubmitting}
              className="h-9 px-5 text-xs font-bold rounded-xl gap-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{editingFormId ? "Update Form" : "Save & Publish"}</span>
            </Button>
          </div>
        </div>

        {builderTab === "builder" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Step 1: Form Questions Column (6 Cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-card space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Qualification Questions</h2>
                      <p className="text-[11px] text-zinc-400">Ask invitees questions to qualify them.</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {questions.length} Question{questions.length === 1 ? "" : "s"}
                  </Badge>
                </div>

                <div className="space-y-4">
                  {questions.map((q, qIndex) => (
                    <div 
                      key={q.id} 
                      className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                          Question {qIndex + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          <select
                            value={q.type}
                            onChange={(e) => {
                              const updatedType = e.target.value as Question["type"];
                              setQuestions(questions.map(item => item.id === q.id ? { 
                                ...item, 
                                type: updatedType,
                                options: updatedType === "select" && item.options.length === 0 ? ["Option 1"] : item.options 
                              } : item));
                            }}
                            className="h-7 px-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-background text-[11px] font-medium"
                          >
                            <option value="select">Dropdown / Single Select</option>
                            <option value="text">Text Input</option>
                            <option value="email">Email Address</option>
                            <option value="number">Number</option>
                          </select>
                          {questions.length > 1 && (
                            <button
                              onClick={() => setQuestions(questions.filter(item => item.id !== q.id))}
                              className="p-1 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                              title="Delete Question"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <Input
                        value={q.text}
                        onChange={(e) => setQuestions(questions.map(item => item.id === q.id ? { ...item, text: e.target.value } : item))}
                        placeholder="e.g. What is your company size?"
                        className="h-9 text-xs font-medium"
                      />

                      {q.type === "select" && (
                        <div className="space-y-2 pt-1 pl-2 border-l-2 border-primary/20">
                          <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Select Options</Label>
                          {q.options.map((opt, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-primary/40 shrink-0" />
                              <Input
                                value={opt}
                                onChange={(e) => {
                                  const updatedOpts = [...q.options];
                                  updatedOpts[optIndex] = e.target.value;
                                  setQuestions(questions.map(item => item.id === q.id ? { ...item, options: updatedOpts } : item));
                                }}
                                className="h-8 text-xs"
                                placeholder={`Option ${optIndex + 1}`}
                              />
                              {q.options.length > 1 && (
                                <button
                                  onClick={() => {
                                    const updatedOpts = q.options.filter((_, idx) => idx !== optIndex);
                                    setQuestions(questions.map(item => item.id === q.id ? { ...item, options: updatedOpts } : item));
                                  }}
                                  className="text-zinc-400 hover:text-red-500 p-1 text-sm cursor-pointer"
                                >
                                  &times;
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const updatedOpts = [...q.options, `Option ${q.options.length + 1}`];
                              setQuestions(questions.map(item => item.id === q.id ? { ...item, options: updatedOpts } : item));
                            }}
                            className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                          >
                            <Plus className="h-3 w-3" /> Add another option
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setQuestions([
                      ...questions,
                      { id: Math.random().toString(), text: "New Question", type: "select", options: ["Option 1", "Option 2"], required: true }
                    ])}
                    className="w-full h-9 text-xs border-dashed gap-1.5 rounded-xl text-zinc-600 dark:text-zinc-400 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Question
                  </Button>
                </div>
              </div>
            </div>

            {/* Step 2: Routing Logic Column (6 Cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-card space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Routing Logic Rules</h2>
                      <p className="text-[11px] text-zinc-400">Map answers to specific calendars or booking types.</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {routes.length} Rule{routes.length === 1 ? "" : "s"}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {routes.map((rule) => (
                    <div 
                      key={rule.id}
                      className={cn(
                        "p-4 rounded-xl border space-y-3 relative group transition-all",
                        rule.isFallback 
                          ? "bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800" 
                          : "bg-primary/5 border-primary/20 dark:border-primary/30"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                          <Filter className="h-3.5 w-3.5 text-primary" />
                          {rule.isFallback ? (
                            <span className="uppercase text-[10px] tracking-wider text-muted-foreground">Default Fallback (All other answers)</span>
                          ) : (
                            <span>IF Answer Equals:</span>
                          )}
                        </div>

                        {!rule.isFallback && (
                          <button
                            onClick={() => setRoutes(routes.filter(r => r.id !== rule.id))}
                            className="p-1 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Delete Route"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      {!rule.isFallback && (
                        <div>
                          {allSelectOptions.length > 0 ? (
                            <select
                              value={rule.condition}
                              onChange={(e) => setRoutes(routes.map(r => r.id === rule.id ? { ...r, condition: e.target.value } : r))}
                              className="w-full h-8 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-background text-xs font-semibold"
                            >
                              <option value="">Select matching answer...</option>
                              {allSelectOptions.map((opt, i) => (
                                <option key={i} value={opt}>"{opt}"</option>
                              ))}
                            </select>
                          ) : (
                            <Input
                              value={rule.condition}
                              onChange={(e) => setRoutes(routes.map(r => r.id === rule.id ? { ...r, condition: e.target.value } : r))}
                              placeholder="Condition keyword"
                              className="h-8 text-xs"
                            />
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-1 border-t border-zinc-200/60 dark:border-zinc-800">
                        <ArrowRight className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                        <div className="flex-1">
                          <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Route to Event Type</Label>
                          <select
                            value={rule.eventTypeId}
                            onChange={(e) => setRoutes(routes.map(r => r.id === rule.id ? { ...r, eventTypeId: e.target.value } : r))}
                            className="w-full h-8 px-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-background text-xs"
                          >
                            <option value="">Select destination event type...</option>
                            {eventTypes.map((et) => (
                              <option key={et.id} value={et.id}>
                                {et.title} ({et.duration || 30} mins)
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const firstOpt = allSelectOptions[0] || "";
                      setRoutes([
                        { id: Math.random().toString(), condition: firstOpt, targetType: "event", eventTypeId: eventTypes[0]?.id || "", isFallback: false },
                        ...routes
                      ]);
                    }}
                    className="w-full h-9 text-xs border-dashed gap-1.5 rounded-xl text-zinc-600 dark:text-zinc-400 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Conditional Route
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Live Interactive Preview */
          <div className="max-w-lg mx-auto p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-card shadow-lg space-y-6">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center font-bold">
                <GitMerge className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{newFormName}</h3>
              <p className="text-xs text-zinc-400">Interactive live test: answer questions below to verify routing destination.</p>
            </div>

            <div className="space-y-4">
              {questions.map((q) => (
                <div key={q.id} className="space-y-2">
                  <Label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{q.text}</Label>
                  {q.type === "select" ? (
                    <div className="grid gap-2">
                      {q.options.map((opt, i) => (
                        <label 
                          key={i} 
                          className={cn(
                            "flex items-center gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-all",
                            previewAnswers[q.id] === opt 
                              ? "border-primary bg-primary/5 text-primary font-bold shadow-xs" 
                              : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                          )}
                        >
                          <input 
                            type="radio" 
                            name={`preview-${q.id}`} 
                            checked={previewAnswers[q.id] === opt} 
                            onChange={() => {
                              const updated = { ...previewAnswers, [q.id]: opt };
                              setPreviewAnswers(updated);
                            }}
                            className="w-3.5 h-3.5 text-primary"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <Input 
                      placeholder="Type your response..." 
                      className="h-9 text-xs"
                      onChange={(e) => setPreviewAnswers({ ...previewAnswers, [q.id]: e.target.value })}
                    />
                  )}
                </div>
              ))}

              <Button 
                onClick={runPreviewSimulation}
                className="w-full h-10 text-xs font-bold rounded-xl gap-2 mt-4 cursor-pointer"
              >
                <span>Test Route Destination</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>

              {previewResult && (
                <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 text-center space-y-1.5 animate-in fade-in">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">Routed Calendar Destination</span>
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>{previewResult}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // LIST OVERVIEW VIEW
  // -------------------------------------------------------------
  return (
    <>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Routing Forms
            </h1>
            <Badge variant="outline" className="text-[10px] font-bold text-primary bg-primary/5 border-primary/20 uppercase">
              Pro Feature
            </Badge>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Qualify incoming respondents and route them automatically to the right meeting link or teammate.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsInfoOpen(true)}
            className="h-9 px-3 gap-1 text-xs rounded-xl border-zinc-200 dark:border-zinc-800 cursor-pointer"
          >
            <HelpCircle className="h-3.5 w-3.5 text-zinc-400" />
            <span>How it works</span>
          </Button>

          <Button
            onClick={() => {
              setEditingFormId(null);
              setNewFormName("Sales Lead Qualification");
              setNewFormSlug("sales-lead-qualification");
              setQuestions([
                { id: "1", text: "What is your company size?", type: "select", options: ["1-50", "51-250", "250+ (Enterprise)"], required: true }
              ]);
              setRoutes([
                { id: "1", condition: "250+ (Enterprise)", targetType: "event", eventTypeId: eventTypes[0]?.id || "", isFallback: false },
                { id: "2", condition: "fallback", targetType: "event", eventTypeId: eventTypes[eventTypes.length > 1 ? 1 : 0]?.id || "", isFallback: true }
              ]);
              setIsCreating(true);
            }}
            size="sm"
            className="h-9 px-4 text-xs font-bold gap-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Form</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-card space-y-1 shadow-2xs">
          <span className="text-[11px] font-medium text-zinc-500">Total Routing Forms</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{forms.length}</div>
        </div>
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-card space-y-1 shadow-2xs">
          <span className="text-[11px] font-medium text-zinc-500">Active Forms</span>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {forms.filter(f => f.isActive).length}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-card space-y-1 shadow-2xs">
          <span className="text-[11px] font-medium text-zinc-500">Total Leads Screened</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {forms.reduce((acc, f) => acc + (f.views || 0), 0)}
          </div>
        </div>
      </div>

      {/* Routing Forms List */}
      <div className="space-y-3">
        {forms.length === 0 ? (
          <div className="p-8 sm:p-12 text-center rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center font-bold">
              <GitMerge className="h-6 w-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">No routing forms yet</h3>
              <p className="text-xs text-zinc-500">
                Create your first routing form or pick a starter template to automatically qualify and assign inbound meetings.
              </p>
            </div>

            {/* Template Starters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl mx-auto pt-2 text-left">
              {TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => applyTemplate(tmpl)}
                  className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-card hover:border-primary/40 hover:shadow-md transition-all space-y-2 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors">
                      {tmpl.title}
                    </span>
                    <Sparkles className="h-3.5 w-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">
                    {tmpl.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          forms.map((form) => {
            const formUrl = `/${username}/${form.slug}`;
            return (
              <div 
                key={form.id}
                className={cn(
                  "p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-card shadow-2xs transition-all hover:border-zinc-300 dark:hover:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                  !form.isActive && "opacity-75 bg-zinc-50/50 dark:bg-zinc-900/30"
                )}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                    form.isActive ? "bg-primary/10 text-primary" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                  )}>
                    <GitMerge className="h-5 w-5" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{form.name}</h3>
                      <span className="text-[11px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md truncate max-w-[220px]">
                        {formUrl}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-zinc-400">
                      <span>{form.questions?.length || 0} Questions</span>
                      <span>•</span>
                      <span>{form.routes?.length || 0} Logic Rules</span>
                      <span>•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">{form.views || 0} Views</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const fullUrl = `${window.location.origin}${formUrl}`;
                      navigator.clipboard.writeText(fullUrl);
                      toast.success("Routing form link copied to clipboard!");
                    }}
                    className="h-8 px-2.5 text-xs rounded-lg gap-1 border-zinc-200 dark:border-zinc-800 cursor-pointer"
                    title="Copy Form Link"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span className="hidden md:inline">Copy Link</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    render={
                      <a 
                        href={formUrl}
                        target="_blank" 
                        rel="noopener noreferrer" 
                      />
                    }
                    className="h-8 px-2.5 text-xs rounded-lg gap-1 border-zinc-200 dark:border-zinc-800 cursor-pointer"
                    title="Test Form in New Tab"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span className="hidden md:inline">Preview</span>
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditingFormId(form.id);
                      setNewFormName(form.name);
                      setNewFormSlug(form.slug);
                      setQuestions(form.questions || []);
                      setRoutes(form.routes || []);
                      setIsCreating(true);
                    }}
                    className="h-8 px-3 text-xs font-semibold rounded-lg gap-1.5 cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </Button>

                  <div className="h-6 w-px bg-zinc-200 dark:border-zinc-800 mx-1" />

                  <Switch
                    checked={form.isActive}
                    onCheckedChange={() => toggleForm(form.id, form.isActive)}
                    className="scale-85"
                  />

                  <DropdownMenu>
                    <DropdownMenuTrigger render={
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    } />
                    <DropdownMenuContent align="end" className="w-48 rounded-xl text-xs">
                      <DropdownMenuItem 
                        onClick={() => handleDuplicateForm(form.id)}
                        className="gap-2 py-2 cursor-pointer"
                      >
                        <Copy className="h-3.5 w-3.5 text-zinc-500" />
                        <span>Duplicate Form</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem 
                        onClick={() => setEmbedModalForm(form)}
                        className="gap-2 py-2 cursor-pointer"
                      >
                        <Code2 className="h-3.5 w-3.5 text-zinc-500" />
                        <span>Embed on Website</span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem 
                        onClick={() => handleDeleteForm(form.id, form.name)}
                        className="gap-2 py-2 text-destructive focus:text-destructive cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete Form</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* How it Works Modal */}
      <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <GitMerge className="h-5 w-5 text-primary" /> How Routing Forms Work
            </DialogTitle>
            <DialogDescription className="text-xs">
              Automate lead qualification and calendar routing in 3 easy steps.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 text-xs">
            <div className="flex gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">1</div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Ask Qualifying Questions</h4>
                <p className="text-zinc-500 mt-0.5">Collect company size, project budget, region, or department.</p>
              </div>
            </div>

            <div className="flex gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">2</div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Set Conditional Rules</h4>
                <p className="text-zinc-500 mt-0.5">Map specific answer options to tailored event types (e.g. Enterprise 30m vs Discovery 15m).</p>
              </div>
            </div>

            <div className="flex gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">3</div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Share or Embed Anywhere</h4>
                <p className="text-zinc-500 mt-0.5">Use your direct link or embed the questionnaire directly on your landing page.</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full text-xs font-bold rounded-xl cursor-pointer" onClick={() => setIsInfoOpen(false)}>
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Embed Modal */}
      <Dialog open={!!embedModalForm} onOpenChange={() => setEmbedModalForm(null)}>
        <DialogContent className="sm:max-w-[540px] rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" /> Embed Routing Form
            </DialogTitle>
            <DialogDescription className="text-xs">
              Embed "{embedModalForm?.name}" on your website or landing page.
            </DialogDescription>
          </DialogHeader>

          {embedModalForm && (
            <div className="space-y-4 py-2 text-xs">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">iFrame Embed Code</Label>
                <div className="relative">
                  <pre className="p-3 bg-zinc-900 text-zinc-100 rounded-xl text-[11px] font-mono overflow-x-auto">
                    {`<iframe\n  src="${typeof window !== "undefined" ? window.location.origin : "https://calmeet.app"}/${username}/${embedModalForm.slug}?embed=true"\n  width="100%"\n  height="650px"\n  frameborder="0"\n  style="border-radius:16px;border:none;"\n></iframe>`}
                  </pre>
                  <Button
                    size="sm"
                    onClick={() => {
                      const code = `<iframe src="${window.location.origin}/${username}/${embedModalForm.slug}?embed=true" width="100%" height="650px" frameborder="0" style="border-radius:16px;border:none;"></iframe>`;
                      navigator.clipboard.writeText(code);
                      toast.success("Embed code copied!");
                    }}
                    className="absolute top-2 right-2 h-7 text-[10px] px-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg cursor-pointer"
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" className="w-full text-xs font-bold rounded-xl cursor-pointer" onClick={() => setEmbedModalForm(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
