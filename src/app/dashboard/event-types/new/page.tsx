import { EventTypeForm } from "@/components/dashboard/event-type-form";

export default function NewEventTypePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Event Type</h1>
        <p className="text-muted-foreground">Add a new type of meeting to your scheduling page.</p>
      </div>

      <EventTypeForm />
    </div>
  );
}
