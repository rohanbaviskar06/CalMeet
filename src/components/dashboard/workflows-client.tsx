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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Zap, 
  Mail, 
  MessageSquare, 
  Plus, 
  ArrowRight,
  Clock,
  MoreVertical,
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
import { createWorkflow, toggleWorkflowStatus, deleteWorkflow as deleteWorkflowAction, updateWorkflow } from "@/app/actions/workflows";

export function WorkflowsClient({ initialWorkflows }: { initialWorkflows: any[] }) {
  const [workflows, setWorkflows] = useState(initialWorkflows);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleWorkflow = async (id: string, currentStatus: boolean, isPremium: boolean) => {
    if (!currentStatus && isPremium) {
       toast.error("Premium Workflow", {
          description: "This feature requires a Pro plan."
       });
       return;
    }

    // Optimistic update
    setWorkflows(workflows.map(wf => wf.id === id ? { ...wf, isActive: !currentStatus } : wf));
    
    try {
      await toggleWorkflowStatus(id, currentStatus);
      toast.success(`Workflow ${!currentStatus ? 'enabled' : 'disabled'}`);
    } catch (e) {
      toast.error("Failed to update workflow");
      setWorkflows(workflows.map(wf => wf.id === id ? { ...wf, isActive: currentStatus } : wf));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const triggerVal = formData.get("trigger") as string;
    const actionVal = formData.get("action") as string;

    // Helper to get labels (same logic as before)
    const getTriggerLabel = (val: string) => {
      if (val.includes("Before")) return val; // if already a label
      if (val === "before") return "Before event starts";
      if (val === "after") return "After event ends";
      if (val === "booked") return "Immediately when booked";
      return "When event is canceled";
    };

    const getActionLabel = (val: string) => {
      if (val.includes("Send")) return val; // if already a label
      if (val === "email_invitee") return "Send email to invitee";
      if (val === "email_host") return "Send email to host";
      if (val === "sms_invitee") return "Send SMS to invitee";
      return "Trigger Webhook";
    };

    const triggerLabel = getTriggerLabel(triggerVal);
    const actionLabel = getActionLabel(actionVal);
    const isPremium = actionLabel.includes("SMS") || actionLabel.includes("Webhook");

    try {
      if (editingWorkflow) {
        await updateWorkflow(editingWorkflow.id, {
          name,
          trigger: triggerLabel,
          action: actionLabel,
          isPremium
        });
        setWorkflows(workflows.map(wf => wf.id === editingWorkflow.id ? { ...wf, name, trigger: triggerLabel, action: actionLabel, isPremium } : wf));
        toast.success("Workflow updated!");
      } else {
        const newWf = await createWorkflow({
          name,
          trigger: triggerLabel,
          action: actionLabel,
          isPremium
        });
        setWorkflows([newWf, ...workflows]);
        toast.success("Workflow created!");
      }
      setIsDialogOpen(false);
      setEditingWorkflow(null);
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const originalWorkflows = [...workflows];
    setWorkflows(workflows.filter(w => w.id !== id));
    try {
      await deleteWorkflowAction(id);
      toast.success("Workflow deleted");
    } catch (e) {
      toast.error("Failed to delete workflow");
      setWorkflows(originalWorkflows);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
          <p className="text-muted-foreground mt-1">Automate your communications before and after meetings.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2 shadow-sm rounded-full px-6">
          <Plus className="h-4 w-4" /> New Workflow
        </Button>
      </div>

      <div className="space-y-3">
        {workflows.map((workflow) => {
          const isSms = workflow.action.includes("SMS");
          const isWebhook = workflow.action.includes("Webhook");
          const Icon = isSms ? MessageSquare : isWebhook ? Zap : Mail;
          const color = isSms ? "text-violet-500" : isWebhook ? "text-amber-500" : "text-blue-500";
          const bg = isSms ? "bg-violet-50 dark:bg-violet-950/30" : isWebhook ? "bg-amber-50 dark:bg-amber-950/30" : "bg-blue-50 dark:bg-blue-950/30";

          return (
            <div 
              key={workflow.id} 
              className={`group flex items-center gap-4 p-5 rounded-[2rem] bg-white dark:bg-zinc-900 border border-muted/50 transition-all hover:shadow-lg hover:border-primary/20 ${!workflow.isActive ? 'opacity-70 grayscale-[0.3]' : ''}`}
            >
              {/* Icon */}
              <div className={`p-4 rounded-2xl ${bg} transition-transform group-hover:scale-110`}>
                <Icon className={`h-6 w-6 ${color}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-black tracking-tight">{workflow.name}</h3>
                  {workflow.isPremium && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] font-black tracking-widest px-2 py-0">PRO</Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  <div className="flex items-center gap-1.5">
                     <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                     {workflow.trigger}
                  </div>
                  <div className="flex items-center gap-1.5 text-primary/70">
                     <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                     {workflow.action}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pr-2">
                <div className="hidden md:block">
                   <Switch 
                     checked={workflow.isActive} 
                     onCheckedChange={() => toggleWorkflow(workflow.id, workflow.isActive, workflow.isPremium)} 
                   />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:bg-muted" />}>
                     <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-2xl min-w-[160px]">
                    <DropdownMenuItem 
                      className="gap-2 rounded-xl py-2 font-medium"
                      onClick={() => {
                        setEditingWorkflow(workflow);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4" /> Edit Workflow
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 rounded-xl py-2 font-medium" onClick={async () => {
                    try {
                      const newWf = await createWorkflow({
                        name: `${workflow.name} (Copy)`,
                        trigger: workflow.trigger,
                        action: workflow.action,
                        isPremium: workflow.isPremium
                      });
                      setWorkflows([newWf, ...workflows]);
                      toast.success("Workflow duplicated!");
                    } catch (e) {
                      toast.error("Failed to duplicate workflow");
                    }
                  }}>
                      <Copy className="h-4 w-4" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="gap-2 rounded-xl py-2 font-medium text-destructive focus:text-destructive" 
                      onClick={() => handleDelete(workflow.id)}
                    >
                      <Trash className="h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}

        {/* Compact Add Button */}
        <button 
          onClick={() => {
            setEditingWorkflow(null);
            setIsDialogOpen(true);
          }}
          className="w-full p-6 rounded-[2rem] border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-3 group text-muted-foreground hover:text-primary"
        >
          <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
          <span className="font-bold text-sm uppercase tracking-widest">Create Custom Workflow</span>
        </button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setEditingWorkflow(null);
      }}>
        <DialogContent className="sm:max-w-[500px] rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">{editingWorkflow ? "Edit Workflow" : "Create Workflow"}</DialogTitle>
            <DialogDescription className="font-bold uppercase text-[10px] tracking-widest">
              {editingWorkflow ? "Modify your automation" : "Set up a new automated action"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Workflow Name</label>
              <input 
                name="name"
                type="text" 
                defaultValue={editingWorkflow?.name || ""}
                placeholder="e.g. 48hr Reminder" 
                className="w-full px-4 py-3 rounded-2xl border bg-background font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                required
              />
            </div>
            
            <div className="space-y-4 border p-5 rounded-[1.5rem] bg-muted/30">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" /> WHEN (Trigger)
                </label>
                <select 
                  name="trigger" 
                  className="w-full px-4 py-3 rounded-xl border bg-background font-bold outline-none" 
                  defaultValue={editingWorkflow?.trigger || ""}
                  required
                >
                  <option value="">Select a trigger...</option>
                  <option value="before">Before event starts</option>
                  <option value="after">After event ends</option>
                  <option value="booked">Immediately when booked</option>
                  <option value="canceled">When event is canceled</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <Zap className="h-4 w-4" /> DO THIS (Action)
                </label>
                <select 
                  name="action" 
                  className="w-full px-4 py-3 rounded-xl border bg-background font-bold outline-none" 
                  defaultValue={editingWorkflow?.action || ""}
                  required
                >
                  <option value="">Select an action...</option>
                  <option value="email_invitee">Send email to invitee</option>
                  <option value="email_host">Send email to host</option>
                  <option value="sms_invitee">Send SMS to invitee (Pro)</option>
                  <option value="webhook">Trigger Webhook (Pro)</option>
                </select>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl font-bold">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="rounded-xl font-bold px-8">
                {isSubmitting ? "Saving..." : editingWorkflow ? "Update Workflow" : "Create Workflow"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
