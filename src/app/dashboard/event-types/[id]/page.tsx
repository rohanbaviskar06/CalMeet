import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { EventTypeForm } from "@/components/dashboard/event-type-form";

export default async function EditEventTypePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;

  const eventType = await prisma.eventType.findUnique({
    where: { 
      id: id,
      userId: (session.user as any).id
    }
  });

  if (!eventType) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Event Type</h1>
        <p className="text-muted-foreground">Update your meeting type settings.</p>
      </div>

      <EventTypeForm initialData={eventType} />
    </div>
  );
}
