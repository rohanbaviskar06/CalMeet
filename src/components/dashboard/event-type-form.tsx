"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createEventType, updateEventType } from "@/app/actions/event-types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { RichTextEditor } from "./rich-text-editor";

export function EventTypeForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState(initialData?.description || "");
  const [requiresPayment, setRequiresPayment] = useState(initialData?.requiresPayment || false);
  const [price, setPrice] = useState(initialData?.price || "");
  const [currency, setCurrency] = useState(initialData?.currency || "INR");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string | undefined,
      description: description,
      duration: parseInt(formData.get("duration") as string),
      videoCallProvider: formData.get("videoCallProvider") as string,
      requiresPayment,
      price: requiresPayment ? parseFloat(price) : null,
      currency: requiresPayment ? currency : "INR",
    };

    try {
      if (initialData) {
        await updateEventType(initialData.id, data);
        toast.success("Event type updated!");
      } else {
        await createEventType(data);
        toast.success("Event type created!");
      }
      router.push("/dashboard/event-types");
      router.refresh();
    } catch (error) {
      toast.error(initialData ? "Failed to update" : "Failed to create");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Event Type" : "Event Details"}</CardTitle>
        <CardDescription>
          {initialData ? "Modify your existing meeting type." : "Configure how this meeting type will appear and work."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title *</label>
            <input 
              name="title"
              type="text" 
              defaultValue={initialData?.title}
              placeholder="e.g. 15 Minute Meeting" 
              className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Custom URL (Optional)</label>
            <div className="flex items-center">
              <span className="px-3 py-2 bg-muted text-muted-foreground border border-r-0 rounded-l-lg text-sm select-none">
                calmeet.app/you/
              </span>
              <input 
                name="slug"
                type="text" 
                defaultValue={initialData?.slug}
                placeholder="e.g. 15min" 
                className="w-full px-4 py-2 rounded-r-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            <p className="text-xs text-muted-foreground">Leave empty to auto-generate from the title.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <RichTextEditor 
              content={description}
              onChange={setDescription}
              placeholder="What is this meeting about?"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Duration (minutes) *</label>
            <select 
              name="duration"
              defaultValue={initialData?.duration || "15"}
              className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              required
            >
              <option value="15">15 mins</option>
              <option value="30">30 mins</option>
              <option value="45">45 mins</option>
              <option value="60">60 mins</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Location / Video Call *</label>
            <select 
              name="videoCallProvider"
              defaultValue={initialData?.videoCallProvider || "CALMEET"}
              className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              required
            >
              <option value="CALMEET">🎥 CalMeet (Built-in — no setup needed)</option>
              <option value="GOOGLE_MEET">Google Meet</option>
              <option value="ZOOM">Zoom Meeting</option>
            </select>
            <p className="text-xs text-muted-foreground">CalMeet uses a built-in video room — no external account required.</p>
          </div>

          {/* Payment Settings */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Require Payment</label>
                <p className="text-xs text-muted-foreground">Charge guests before they can book this event type.</p>
              </div>
              <input
                type="checkbox"
                checked={requiresPayment}
                onChange={(e) => setRequiresPayment(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </div>

            {requiresPayment && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price *</label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    required={requiresPayment}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Currency *</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    required={requiresPayment}
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Save Changes" : "Create Event Type"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
