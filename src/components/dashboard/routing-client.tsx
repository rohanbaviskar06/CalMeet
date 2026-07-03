"use client";

import { useState } from "react";
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
  Trash
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { createRoutingForm, updateRoutingForm, toggleRoutingFormStatus } from "@/app/actions/routing";

export function RoutingClient({ initialForms, eventTypes, baseUrl }: { initialForms: any[], eventTypes: any[], baseUrl: string }) {
  const [forms, setForms] = useState(initialForms);
  const [isCreating, setIsCreating] = useState(false);
  const [editingFormId, setEditingFormId] = useState<string | null>(null);
  const [newFormName, setNewFormName] = useState("My New Routing Form");
  const [newFormSlug, setNewFormSlug] = useState("my-new-routing-form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);


  const [questions, setQuestions] = useState<any[]>([
    { id: "1", text: "What is your company size?", type: "select", options: ["1-50", "51-250", "250+"] }
  ]);
  const [routes, setRoutes] = useState<any[]>([
    { id: "1", condition: "250+", eventTypeId: eventTypes[0]?.id || "", isFallback: false },
    { id: "2", condition: "fallback", eventTypeId: eventTypes[eventTypes.length > 1 ? 1 : 0]?.id || "", isFallback: true }
  ]);

  const toggleForm = async (id: string, currentStatus: boolean) => {
    // optimistic update
    setForms(forms.map(f => f.id === id ? { ...f, isActive: !currentStatus } : f));
    try {
      await toggleRoutingFormStatus(id, currentStatus);
      toast.success(`Routing Form ${!currentStatus ? 'enabled' : 'disabled'}`);
    } catch (e) {
      toast.error("Failed to update status");
      setForms(forms.map(f => f.id === id ? { ...f, isActive: currentStatus } : f));
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      if (editingFormId) {
        await updateRoutingForm(editingFormId, {
          name: newFormName,
          slug: newFormSlug,
          questions,
          routes
        });
        toast.success("Routing Form updated!");
        
        setForms(forms.map(f => f.id === editingFormId ? { ...f, name: newFormName, slug: newFormSlug, questions, routes } : f));
      } else {
        await createRoutingForm({
          name: newFormName,
          slug: newFormSlug,
          questions,
          routes
        });
        toast.success("Routing Form saved!");
        // Reload page to get actual IDs, or just mock it for now
        window.location.reload();
      }
      setIsCreating(false);
      setEditingFormId(null);
      setNewFormName("My New Routing Form");
    } catch (e) {
      toast.error("Failed to save form");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCreating) {
    return (
      <div className="max-w-4xl mx-auto animation-fade-in space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => {
            setIsCreating(false);
            setEditingFormId(null);
          }}>Back</Button>
          <div className="flex-1">
            <input 
              type="text" 
              value={newFormName}
              onChange={(e) => {
                setNewFormName(e.target.value);
                // Also auto-generate slug if it's a new form and user hasn't edited slug yet
                if (!editingFormId) {
                  setNewFormSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
                }
              }}
              className="text-2xl font-semibold bg-transparent border-b border-transparent hover:border-border focus:border-border outline-none transition-colors w-full mb-2" 
              placeholder="Form Name"
            />
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-xl border border-dashed border-primary/20 max-w-fit">
              <LinkIcon className="h-4 w-4" />
              <span>{baseUrl}/routing/</span>
              <input 
                type="text"
                value={newFormSlug}
                onChange={(e) => setNewFormSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''))}
                className="bg-transparent border-b border-primary/30 focus:border-primary outline-none font-semibold text-primary min-w-[100px]"
                placeholder="custom-url"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 px-1">This will be the public link for your routing form.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Step 1: Form Questions */}
          <Card className="border-primary/20 shadow-md flex flex-col">
            <CardHeader className="bg-muted/30 pb-4 border-b">
              <div className="flex items-center gap-2">
                <div className="bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <CardTitle className="text-lg">Form Questions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6 flex-1 overflow-visible">
              <div className="space-y-4">
                {questions.map((q, i) => (
                  <div key={q.id} className="p-4 border rounded-xl bg-card space-y-3 relative group">
                    <button 
                      className="absolute -right-2 -top-2 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setQuestions(questions.filter(x => x.id !== q.id))}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm">Question {i + 1}</span>
                      <select 
                        className="text-xs p-1 border rounded"
                        value={q.type}
                        onChange={(e) => setQuestions(questions.map(x => x.id === q.id ? { ...x, type: e.target.value } : x))}
                      >
                        <option value="select">Single Select</option>
                        <option value="text">Text Input</option>
                      </select>
                    </div>
                    <input 
                      type="text" 
                      value={q.text} 
                      onChange={(e) => setQuestions(questions.map(x => x.id === q.id ? { ...x, text: e.target.value } : x))}
                      placeholder="e.g. What is your company size?" 
                      className="w-full text-sm p-2 border rounded-md bg-muted/50 outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                    />
                    
                    {q.type === 'select' && (
                      <div className="space-y-2 pl-4 border-l-2 border-muted mt-2">
                        {q.options.map((opt: string, optIndex: number) => (
                          <div key={optIndex} className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 rounded-full border border-muted-foreground flex-shrink-0" />
                            <input 
                              type="text" 
                              value={opt} 
                              onChange={(e) => {
                                const newOpts = [...q.options];
                                newOpts[optIndex] = e.target.value;
                                setQuestions(questions.map(x => x.id === q.id ? { ...x, options: newOpts } : x));
                              }}
                              className="w-full text-sm p-1 border-b border-transparent hover:border-border focus:border-border outline-none bg-transparent"
                            />
                            <button onClick={() => {
                                const newOpts = q.options.filter((_: any, idx: number) => idx !== optIndex);
                                setQuestions(questions.map(x => x.id === q.id ? { ...x, options: newOpts } : x));
                              }} className="text-muted-foreground hover:text-destructive p-1">
                              &times;
                            </button>
                          </div>
                        ))}
                        <button 
                          className="text-xs text-primary hover:underline"
                          onClick={() => {
                            const newOpts = [...q.options, "New Option"];
                            setQuestions(questions.map(x => x.id === q.id ? { ...x, options: newOpts } : x));
                          }}
                        >
                          + Add option
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <Button 
                  variant="outline" 
                  className="w-full border-dashed gap-2"
                  onClick={() => {
                    setQuestions([...questions, { id: Math.random().toString(), text: "New Question", type: "select", options: ["Option 1"] }]);
                  }}
                >
                  <Plus className="h-4 w-4" /> Add Question
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Routing Logic */}
          <Card className="border-primary/20 shadow-md flex flex-col">
             <CardHeader className="bg-muted/30 pb-4 border-b">
              <div className="flex items-center gap-2">
                <div className="bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <CardTitle className="text-lg">Routing Logic</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6 flex-1 overflow-visible">
              <div className="space-y-4">
                 
                 {routes.map((route, idx) => (
                   <div key={route.id} className={`p-4 border rounded-xl space-y-4 relative group ${route.isFallback ? 'bg-muted/10' : 'border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20'}`}>
                      {!route.isFallback && (
                        <button 
                          className="absolute -right-2 -top-2 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setRoutes(routes.filter(r => r.id !== route.id))}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                      
                      <div className={`flex items-center gap-2 text-sm font-medium ${route.isFallback ? '' : 'text-blue-800 dark:text-blue-400'}`}>
                        <Filter className="h-4 w-4" /> 
                        {route.isFallback ? (
                          "FALLBACK (All other answers)"
                        ) : (
                          <div className="flex items-center gap-2">
                            IF answer is 
                            <select 
                              className="p-1 border rounded bg-background text-foreground ml-1"
                              value={route.condition}
                              onChange={(e) => setRoutes(routes.map(r => r.id === route.id ? { ...r, condition: e.target.value } : r))}
                            >
                              {questions.filter(q => q.type === 'select').flatMap(q => q.options).map((opt, i) => (
                                <option key={i} value={opt}>"{opt}"</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                      
                      <div className={`flex items-center gap-3 pl-6 border-l-2 ${route.isFallback ? 'border-muted' : 'border-blue-200 dark:border-blue-800'}`}>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1 p-3 bg-background border rounded-lg shadow-sm flex flex-col gap-2">
                           <span className="text-xs font-semibold text-muted-foreground uppercase">Route to:</span>
                           <select 
                              className="w-full p-2 border rounded text-sm bg-background"
                              value={route.eventTypeId}
                              onChange={(e) => setRoutes(routes.map(r => r.id === route.id ? { ...r, eventTypeId: e.target.value } : r))}
                            >
                              <option value="">Select an Event Type...</option>
                              {eventTypes.map(et => (
                                <option key={et.id} value={et.id}>{et.title} ({et.duration}m)</option>
                              ))}
                            </select>
                        </div>
                      </div>
                   </div>
                 ))}

                 <Button 
                  variant="outline" 
                  className="w-full border-dashed gap-2"
                  onClick={() => setRoutes([{ id: Math.random().toString(), condition: "", eventTypeId: "", isFallback: false }, ...routes])}
                 >
                  <GitMerge className="h-4 w-4" /> Add Route
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4 border-t sticky bottom-4">
           <Button size="lg" className="px-8 shadow-xl" onClick={handleSave} disabled={isSubmitting}>
             {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
             {editingFormId ? "Update Form" : "Save Form"}
           </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Routing Forms</h1>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={() => setIsInfoOpen(true)}
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-muted-foreground mt-1">Screen and qualify invitees before they pick a time.</p>
        </div>
        <Button onClick={() => {
          setEditingFormId(null);
          setNewFormName("My New Routing Form");
          setNewFormSlug("my-new-routing-form");
          setQuestions([{ id: "1", text: "What is your company size?", type: "select", options: ["1-50", "51-250", "250+"] }]);
          setRoutes([
            { id: "1", condition: "250+", eventTypeId: eventTypes[0]?.id || "", isFallback: false },
            { id: "2", condition: "fallback", eventTypeId: eventTypes[eventTypes.length > 1 ? 1 : 0]?.id || "", isFallback: true }
          ]);
          setIsCreating(true);
        }} className="gap-2 shadow-sm rounded-full px-6 w-full sm:w-auto justify-center">
          <Plus className="h-4 w-4" /> Create Form
        </Button>
      </div>

      <div className="space-y-3">
        {forms.length === 0 && (
           <div className="py-12 text-center text-muted-foreground bg-muted/20 rounded-[2rem] border border-dashed">
             No routing forms created yet. Click "Create Form" to start.
           </div>
        )}
        
        {forms.map((form) => (
          <div 
            key={form.id} 
            className={`group flex items-center gap-4 p-5 rounded-[2rem] bg-white dark:bg-zinc-900 border border-muted/50 transition-all hover:shadow-lg hover:border-primary/20 ${!form.isActive ? 'opacity-70 grayscale-[0.3]' : ''}`}
          >
            {/* Icon */}
            <div className={`p-4 rounded-2xl ${form.isActive ? 'bg-primary/10 text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]' : 'bg-muted text-muted-foreground'}`}>
              <GitMerge className="h-6 w-6" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-semibold tracking-tight">{form.name}</h3>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full truncate max-w-[200px]">
                  <LinkIcon className="h-3 w-3" /> {form.link}
                </div>
              </div>
              
              {/* Stats & Metadata Row */}
              <div className="flex items-center gap-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                   <HelpCircle className="h-3.5 w-3.5" /> {form.questions?.length || 0} Questions
                </div>
                <div className="flex items-center gap-1.5">
                   <GitMerge className="h-3.5 w-3.5" /> {form.routes?.length || 0} Routes
                </div>
                <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded-full">
                   <CheckCircle2 className="h-3.5 w-3.5" /> {form.views || 0} Views
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pr-2">
              <Button 
                variant="secondary" 
                size="sm" 
                className="hidden md:flex rounded-xl font-bold h-9 px-4 gap-2"
                onClick={() => {
                  setEditingFormId(form.id);
                  setNewFormName(form.name);
                  setNewFormSlug(form.slug);
                  setQuestions(form.questions || []);
                  setRoutes(form.routes || []);
                  setIsCreating(true);
                }}
              >
                Edit Logic <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <div className="w-[1px] h-8 bg-muted mx-1 hidden md:block" />
              <Switch 
                checked={form.isActive} 
                onCheckedChange={() => toggleForm(form.id, form.isActive)} 
              />
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:bg-muted" />}>
                   <MoreVertical className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-2xl min-w-[160px]">
                  <DropdownMenuItem className="gap-2 rounded-xl py-2 font-medium" onClick={() => {
                    setEditingFormId(form.id);
                    setNewFormName(form.name);
                    setNewFormSlug(form.slug);
                    setQuestions(form.questions || []);
                    setRoutes(form.routes || []);
                    setIsCreating(true);
                  }}>
                    <Edit2 className="h-4 w-4" /> Edit Form
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 rounded-xl py-2 font-medium" onClick={() => {
                    const newForm = { ...form, id: Math.random().toString(), name: `${form.name} (Copy)` };
                    setForms([...forms, newForm]);
                    toast.success("Form duplicated locally");
                  }}>
                    <Copy className="h-4 w-4" /> Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 rounded-xl py-2 font-medium text-destructive focus:text-destructive" onClick={() => {
                     // In a real app, you'd call a server action here
                     setForms(forms.filter(f => f.id !== form.id));
                     toast.success("Form deleted");
                  }}>
                    <Trash className="h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}

        {/* Compact Add Button */}
        <button 
          onClick={() => {
            setEditingFormId(null);
            setNewFormName("My New Routing Form");
            setQuestions([{ id: "1", text: "What is your company size?", type: "select", options: ["1-50", "51-250", "250+"] }]);
            setRoutes([
              { id: "1", condition: "250+", eventTypeId: eventTypes[0]?.id || "", isFallback: false },
              { id: "2", condition: "fallback", eventTypeId: eventTypes[eventTypes.length > 1 ? 1 : 0]?.id || "", isFallback: true }
            ]);
            setIsCreating(true);
          }}
          className="w-full p-6 rounded-[2rem] border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-3 group text-muted-foreground hover:text-primary"
        >
          <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
          <span className="font-bold text-sm uppercase tracking-widest">Create New Routing Form</span>
        </button>
      </div>

      <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-[2rem] p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <GitMerge className="h-5 w-5 text-primary" /> How Routing Forms Work
            </DialogTitle>
            <DialogDescription className="font-medium text-xs uppercase tracking-widest">
              Learn how to screen and route your invitees
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 space-y-4">
            <div className="relative w-full h-[200px] rounded-xl overflow-hidden border bg-zinc-950">
              <img
                src="/routing_illustration.png"
                alt="Routing Forms Illustration"
                className="object-cover w-full h-full"
              />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Routing Forms let you ask questions when booking a meeting. Depending on their answers, users are routed automatically to different meeting types or custom links.
            </p>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</div>
                <div>
                  <h4 className="text-sm font-semibold">Define Questions</h4>
                  <p className="text-xs text-muted-foreground">Add qualifying questions such as size, region, or requirement using dropdown single-select options or text inputs.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</div>
                <div>
                  <h4 className="text-sm font-semibold">Establish Routing Logic</h4>
                  <p className="text-xs text-muted-foreground">Set up routing paths. For example, IF company size is "250+", THEN redirect to your premium "Enterprise Demo" booking page.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</div>
                <div>
                  <h4 className="text-sm font-semibold">Set Up a Fallback Route</h4>
                  <p className="text-xs text-muted-foreground">Configure where all other respondents go if they don't match your criteria (e.g. standard 15-min discovery call).</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full sm:w-auto font-bold rounded-xl" onClick={() => setIsInfoOpen(false)}>
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
