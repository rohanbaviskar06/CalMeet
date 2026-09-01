"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Mail, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  ChevronRight, 
  Save,
  ArrowLeft,
  X,
  Sparkles,
  Link2,
  ChevronDown,
  HelpCircle,
  Clock,
  Send,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";
import { 
  createWorkflow, 
  toggleWorkflowStatus, 
  deleteWorkflow as deleteWorkflowAction, 
  updateWorkflow 
} from "@/app/actions/workflows";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface WorkflowsClientProps {
  initialWorkflows: any[];
}

const templateVariables = [
  { label: "Event Name", value: "{EVENT_NAME}" },
  { label: "Event Date & Time", value: "{EVENT_DATE_ddd, MMM D, YYYY h:mma}" },
  { label: "Event End Time", value: "{EVENT_END_TIME}" },
  { label: "Timezone", value: "{TIMEZONE}" },
  { label: "Attendee Name", value: "{ATTENDEE}" },
  { label: "Organizer Name", value: "{ORGANIZER}" },
  { label: "Location", value: "{LOCATION}" },
  { label: "Meeting URL", value: "{MEETING_URL}" },
];

export function WorkflowsClient({ initialWorkflows }: WorkflowsClientProps) {
  const [workflows, setWorkflows] = useState(initialWorkflows);
  const [activeWorkflow, setActiveWorkflow] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeDrawerTab, setActiveDrawerTab] = useState<"trigger" | "action">("action");
  const [isSaving, setIsSaving] = useState(false);

  const subjectInputRef = useRef<HTMLInputElement>(null);
  const bodyTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [lastFocusedField, setLastFocusedField] = useState<"subject" | "body">("subject");

  const startNewWorkflow = () => {
    const newWf = {
      id: "temp-" + Date.now(),
      name: "Reminder Email",
      trigger: "Before event starts",
      action: "Send email to attendees",
      offsetValue: 1,
      offsetUnit: "hours",
      senderName: "CalMeet",
      messageTemplate: "Reminder",
      subject: "Reminder: {EVENT_NAME} - {EVENT_DATE_ddd, MMM D, YYYY h:mma}",
      body: "Hi {ATTENDEE},\n\nThis is a reminder about your upcoming event.\n\nEvent: {EVENT_NAME}\n\nDate & time: {EVENT_DATE_ddd, MMM D, YYYY h:mma} - {EVENT_END_TIME}\n({TIMEZONE})\n\nLocation: {LOCATION}\nMeeting Link: {MEETING_URL}",
      isActive: true,
      includeCalendarEvent: true,
    };
    setActiveWorkflow(newWf);
    setActiveDrawerTab("action");
  };

  const handleToggle = async (wf: any) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === wf.id ? { ...w, isActive: !w.isActive } : w))
    );
    try {
      await toggleWorkflowStatus(wf.id, wf.isActive);
      toast.success(`Workflow ${!wf.isActive ? "enabled" : "disabled"}`);
    } catch {
      toast.error("Failed to update status");
      setWorkflows((prev) =>
        prev.map((w) => (w.id === wf.id ? { ...w, isActive: wf.isActive } : w))
      );
    }
  };

  const handleDelete = async (wfId: string) => {
    if (confirm("Are you sure you want to delete this workflow?")) {
      try {
        await deleteWorkflowAction(wfId);
        setWorkflows((prev) => prev.filter((w) => w.id !== wfId));
        if (activeWorkflow?.id === wfId) setActiveWorkflow(null);
        toast.success("Workflow deleted");
      } catch {
        toast.error("Failed to delete workflow");
      }
    }
  };

  const handleSaveWorkflow = async () => {
    if (!activeWorkflow) return;
    setIsSaving(true);
    try {
      if (activeWorkflow.id.startsWith("temp-")) {
        const res = await createWorkflow({
          name: activeWorkflow.name,
          trigger: activeWorkflow.trigger,
          action: activeWorkflow.action,
          isPremium: false,
        });
        setWorkflows((prev) => [
          ...prev,
          {
            ...activeWorkflow,
            id: res?.id || "wf-" + Date.now(),
          },
        ]);
      } else {
        await updateWorkflow(activeWorkflow.id, {
          name: activeWorkflow.name,
          trigger: activeWorkflow.trigger,
          action: activeWorkflow.action,
          isPremium: false,
        });
        setWorkflows((prev) =>
          prev.map((w) => (w.id === activeWorkflow.id ? activeWorkflow : w))
        );
      }
      toast.success("Workflow saved successfully!");
      setActiveWorkflow(null);
      setIsDrawerOpen(false);
    } catch {
      toast.error("Failed to save workflow");
    } finally {
      setIsSaving(false);
    }
  };

  const insertVariable = (variable: string) => {
    if (!activeWorkflow) return;

    if (lastFocusedField === "subject") {
      const current = activeWorkflow.subject || "";
      const updated = current + " " + variable;
      setActiveWorkflow({ ...activeWorkflow, subject: updated });
    } else {
      const current = activeWorkflow.body || "";
      const updated = current + "\n" + variable;
      setActiveWorkflow({ ...activeWorkflow, body: updated });
    }
    toast.success(`Inserted ${variable}`);
  };

  return (
    <div className="max-w-5xl mx-auto py-2 space-y-6">
      {activeWorkflow ? (
        <div className="space-y-6">
          {/* Builder Top Bar */}
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveWorkflow(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Workflows /</span>
                <input
                  type="text"
                  value={activeWorkflow.name}
                  onChange={(e) =>
                    setActiveWorkflow({ ...activeWorkflow, name: e.target.value })
                  }
                  className="font-bold text-sm bg-transparent border-b border-dashed border-zinc-400 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 px-1 py-0.5 text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveWorkflow(null)}
                className="h-8 text-xs rounded-lg border-zinc-200 dark:border-zinc-800 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveWorkflow}
                disabled={isSaving}
                size="sm"
                className="h-8 px-4 text-xs font-medium gap-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>

          {/* Flowchart Diagram */}
          <div className="relative min-h-[480px] rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 p-8 flex flex-col items-center justify-start overflow-hidden">
            {/* Node 1: Trigger */}
            <div
              onClick={() => {
                setActiveDrawerTab("trigger");
                setIsDrawerOpen(true);
              }}
              className="w-full max-w-md rounded-xl border border-zinc-200 dark:border-zinc-800 bg-card p-4 shadow-sm hover:border-zinc-400 dark:hover:border-zinc-600 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
                      Trigger
                    </span>
                    <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {activeWorkflow.offsetValue || 1} {activeWorkflow.offsetUnit || "hours"} before event
                    </h4>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="mt-2.5 flex items-center gap-2 text-[11px] text-zinc-500">
                <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded font-medium">
                  Active on all booking links
                </span>
              </div>
            </div>

            {/* Connector line */}
            <div className="flex flex-col items-center my-3">
              <div className="w-0.5 h-6 bg-zinc-300 dark:bg-zinc-700" />
              <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-500 shadow-sm text-xs font-bold">
                +
              </div>
              <div className="w-0.5 h-6 bg-zinc-300 dark:bg-zinc-700" />
            </div>

            {/* Node 2: Action */}
            <div
              onClick={() => {
                setActiveDrawerTab("action");
                setIsDrawerOpen(true);
              }}
              className="w-full max-w-md rounded-xl border border-zinc-200 dark:border-zinc-800 bg-card p-4 shadow-sm hover:border-zinc-400 dark:hover:border-zinc-600 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
                      Action
                    </span>
                    <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {activeWorkflow.action || "Send email to attendees"}
                    </h4>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
              </div>

              {/* Template Preview */}
              <div className="mt-3 p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 text-xs space-y-1.5">
                <div className="text-[11px] text-zinc-500">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">Subject: </span>
                  {activeWorkflow.subject}
                </div>
                <div className="text-[11px] text-zinc-400 line-clamp-2 italic">
                  {activeWorkflow.body}
                </div>
              </div>
            </div>
          </div>

          {/* Email Modal Drawer matching Cal.com image exact design */}
          {isDrawerOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end bg-black/60 backdrop-blur-xs p-2 sm:p-0">
              <div className="w-full max-w-lg h-full max-h-[96vh] sm:max-h-full bg-zinc-950 text-zinc-100 border border-zinc-800 rounded-2xl sm:rounded-none sm:border-l sm:border-t-0 sm:border-r-0 sm:border-b-0 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
                <div className="space-y-5">
                  {/* Top Header with Icon */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-zinc-100">
                          {activeDrawerTab === "trigger" ? "Trigger" : "Email"}
                        </h3>
                        <p className="text-xs text-zinc-400">
                          {activeDrawerTab === "trigger" ? "Configure trigger timing" : "Send email to attendees"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {activeDrawerTab === "trigger" ? (
                    /* Trigger Config */
                    <div className="space-y-4 text-xs pt-2">
                      <div className="space-y-1.5">
                        <label className="font-medium text-zinc-300 block">Trigger</label>
                        <select
                          value={activeWorkflow.trigger}
                          onChange={(e) =>
                            setActiveWorkflow({ ...activeWorkflow, trigger: e.target.value })
                          }
                          className="w-full h-10 px-3 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-600"
                        >
                          <option value="Before event starts">Before event starts</option>
                          <option value="After event ends">After event ends</option>
                          <option value="Immediately when booked">Immediately when booked</option>
                          <option value="When canceled">When event is canceled</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="font-medium text-zinc-300 block">How long before event starts?</label>
                          <input
                            type="number"
                            min="1"
                            value={activeWorkflow.offsetValue || 1}
                            onChange={(e) =>
                              setActiveWorkflow({
                                ...activeWorkflow,
                                offsetValue: Number(e.target.value),
                              })
                            }
                            className="w-full h-10 px-3 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-600"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-medium text-zinc-300 block">&nbsp;</label>
                          <select
                            value={activeWorkflow.offsetUnit || "hours"}
                            onChange={(e) =>
                              setActiveWorkflow({
                                ...activeWorkflow,
                                offsetUnit: e.target.value,
                              })
                            }
                            className="w-full h-10 px-3 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-600"
                          >
                            <option value="minutes">minutes</option>
                            <option value="hours">hours</option>
                            <option value="days">days</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <label className="font-medium text-zinc-300 block">Active on booking links</label>
                        <select className="w-full h-10 px-3 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-100 text-xs">
                          <option value="all">Apply to all booking links, including future ones</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    /* Email Step Config */
                    <div className="space-y-4 text-xs pt-1">
                      {/* Action */}
                      <div className="space-y-1.5">
                        <label className="font-medium text-zinc-300 block">Action</label>
                        <select
                          value={activeWorkflow.action}
                          onChange={(e) =>
                            setActiveWorkflow({ ...activeWorkflow, action: e.target.value })
                          }
                          className="w-full h-10 px-3 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-600"
                        >
                          <option value="Send email to attendees">Send email to attendees</option>
                          <option value="Send email to host">Send email to host</option>
                          <option value="Send SMS to invitee">Send SMS to invitee</option>
                          <option value="Webhook">Trigger Webhook</option>
                        </select>
                      </div>

                      {/* Sender name */}
                      <div className="space-y-1.5">
                        <label className="font-medium text-zinc-300 block">Sender name</label>
                        <input
                          type="text"
                          value={activeWorkflow.senderName || "CalMeet"}
                          onChange={(e) =>
                            setActiveWorkflow({ ...activeWorkflow, senderName: e.target.value })
                          }
                          className="w-full h-10 px-3 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-600"
                          placeholder="Your workspace name"
                        />
                      </div>

                      {/* Message template */}
                      <div className="space-y-1.5">
                        <label className="font-medium text-zinc-300 block">Message template</label>
                        <select
                          value={activeWorkflow.messageTemplate || "Reminder"}
                          onChange={(e) =>
                            setActiveWorkflow({ ...activeWorkflow, messageTemplate: e.target.value })
                          }
                          className="w-full h-10 px-3 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-600"
                        >
                          <option value="Reminder">Reminder</option>
                          <option value="Custom">Custom</option>
                          <option value="Follow-up">Follow-up</option>
                          <option value="Confirmation">Confirmation</option>
                        </select>
                      </div>

                      {/* Email subject with Add variable dropdown */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="font-medium text-zinc-300">Email subject</label>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="text-[11px] text-zinc-300 hover:text-white flex items-center gap-1 font-medium bg-zinc-800/80 px-2 py-0.5 rounded-md transition-colors outline-none cursor-pointer">
                              <span>Add variable</span>
                              <ChevronDown className="h-3 w-3" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800 text-zinc-200">
                              {templateVariables.map((v) => (
                                <DropdownMenuItem
                                  key={v.value}
                                  onClick={() => insertVariable(v.value)}
                                  className="text-xs cursor-pointer hover:bg-zinc-800 font-mono text-[11px]"
                                >
                                  {v.value}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <input
                          ref={subjectInputRef}
                          type="text"
                          onFocus={() => setLastFocusedField("subject")}
                          value={activeWorkflow.subject || ""}
                          onChange={(e) =>
                            setActiveWorkflow({ ...activeWorkflow, subject: e.target.value })
                          }
                          className="w-full h-10 px-3 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-600"
                        />
                      </div>

                      {/* Email body */}
                      <div className="space-y-1.5">
                        <label className="font-medium text-zinc-300 block">Email body</label>
                        <textarea
                          ref={bodyTextareaRef}
                          rows={7}
                          onFocus={() => setLastFocusedField("body")}
                          value={activeWorkflow.body || ""}
                          onChange={(e) =>
                            setActiveWorkflow({ ...activeWorkflow, body: e.target.value })
                          }
                          className="w-full p-3 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-600 font-sans leading-relaxed"
                        />
                      </div>

                      {/* Include calendar event checkbox */}
                      <div className="flex items-center space-x-2 pt-1">
                        <input
                          type="checkbox"
                          id="include-calendar"
                          checked={activeWorkflow.includeCalendarEvent ?? true}
                          onChange={(e) =>
                            setActiveWorkflow({
                              ...activeWorkflow,
                              includeCalendarEvent: e.target.checked,
                            })
                          }
                          className="rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0 h-4 w-4 accent-white cursor-pointer"
                        />
                        <label
                          htmlFor="include-calendar"
                          className="text-xs font-medium text-zinc-200 cursor-pointer"
                        >
                          Include calendar event
                        </label>
                      </div>

                      {/* Auto-translate banner */}
                      <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-zinc-300">
                            Auto-translate for attendees
                          </span>
                          <span className="text-[9px] bg-purple-500/20 text-purple-300 font-bold px-1.5 py-0.2 rounded uppercase border border-purple-500/30">
                            Orgs
                          </span>
                        </div>
                        <button className="text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1 cursor-pointer">
                          <span>Upgrade</span>
                          <span>→</span>
                        </button>
                      </div>

                      {/* Helper notice */}
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 pt-1">
                        <HelpCircle className="h-3.5 w-3.5" />
                        <span>How do I use booking questions as variables?</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Buttons: Delete Step (left) & Done (right) */}
                <div className="pt-6 border-t border-zinc-800 flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (confirm("Delete this step?")) {
                        setIsDrawerOpen(false);
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 px-3 py-2 rounded-lg hover:bg-red-950/30 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete step</span>
                  </button>

                  <Button
                    onClick={() => setIsDrawerOpen(false)}
                    className="h-9 px-6 text-xs font-semibold rounded-lg bg-white text-zinc-900 hover:bg-zinc-200 cursor-pointer"
                  >
                    Done
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Workflows List View */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Workflows
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                Create workflows to automate notifications and reminders.
              </p>
            </div>

            <Button
              onClick={startNewWorkflow}
              size="sm"
              className="h-9 px-3.5 gap-1.5 rounded-lg text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New</span>
            </Button>
          </div>

          {workflows.length === 0 ? (
            <div className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-14 text-center flex flex-col items-center justify-center bg-zinc-50/40 dark:bg-zinc-900/20">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100">
                No workflows created
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
                Set up automated emails, SMS reminders, and post-meeting follow-ups to save time and reduce no-shows.
              </p>
              <Button
                onClick={startNewWorkflow}
                size="sm"
                className="mt-4 h-9 gap-1.5 rounded-lg text-xs font-medium cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Create Workflow
              </Button>
            </div>
          ) : (
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl divide-y divide-zinc-200 dark:divide-zinc-800 bg-card overflow-hidden shadow-sm">
              {workflows.map((wf) => (
                <div
                  key={wf.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-zinc-50/60 dark:hover:bg-zinc-900/40"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                        {wf.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 flex-wrap">
                      <span className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded text-[11px] font-medium border border-amber-500/20">
                        <Zap className="h-3 w-3" />
                        {wf.trigger || "Triggers 1 hour before event starts"}
                      </span>
                      <span className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-[11px] font-medium">
                        <Link2 className="h-3 w-3" />
                        Active on all booking links
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
                    <Switch
                      checked={wf.isActive}
                      onCheckedChange={() => handleToggle(wf)}
                      className="scale-90 data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-100"
                    />

                    <button
                      onClick={() => {
                        setActiveWorkflow(wf);
                        setIsDrawerOpen(true);
                        setActiveDrawerTab("action");
                      }}
                      title="Edit Workflow"
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(wf.id)}
                      title="Delete Workflow"
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
