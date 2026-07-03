import { cn } from "@/lib/utils";
import { 
  Card, 
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/booking/booking-form";
import { RoutingQuestionnaire } from "@/components/routing/routing-questionnaire";

export const dynamic = "force-dynamic";

export default async function BookingPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ username: string, slug: string }>,
  searchParams: Promise<{ embed?: string }>
}) {
  const { username, slug } = await params;
  const { embed } = await searchParams;
  const isEmbed = embed === "true";

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      timezone: true,
      bio: true,
      hideWatermark: true,
    }
  });

  if (!user) {
    notFound();
  }

  const eventType = await prisma.eventType.findUnique({
    where: {
      userId_slug: {
        userId: user.id,
        slug: slug
      }
    }
  });

  if (eventType && eventType.isActive) {
    // Increment views using Prisma ORM
    await prisma.eventType.update({
      where: { id: eventType.id },
      data: { views: { increment: 1 } }
    });

    const availability = await prisma.availability.findMany({
      where: { userId: user.id }
    });

    const bookings = await prisma.booking.findMany({
      where: { 
        eventTypeId: eventType.id,
        status: "CONFIRMED"
      },
      select: {
        startTime: true,
        endTime: true,
      }
    });

    return (
      <div className={cn(
        "min-h-screen flex items-center justify-center",
        !isEmbed && "bg-muted/30 p-4"
      )}>
        <div className={cn("w-full", !isEmbed && "max-w-6xl")}>
          <Card className={cn(
            "shadow-2xl border-none overflow-hidden",
            isEmbed && "shadow-none rounded-none"
          )}>
            <BookingForm 
              user={user as any} 
              eventType={eventType} 
              availability={availability}
              bookings={bookings}
            />
          </Card>
          
          {/* Watermark (Hidden if watermark is disabled by admin) */}
          {!user.hideWatermark && (
            <div className="mt-8 text-center text-muted-foreground text-sm flex items-center justify-center gap-2">
              <span>Powered by</span>
              <div className="flex items-center gap-1 font-bold text-foreground">
                 <div className="w-5 h-5 rounded bg-primary flex items-center justify-center text-[10px] text-primary-foreground">M</div>
                 CalMeet
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Check if it's a Routing Form
  const routingForm = await prisma.routingForm.findUnique({
    where: {
      userId_slug: {
        userId: user.id,
        slug: slug
      }
    }
  });

  if (!routingForm || !routingForm.isActive) {
    notFound();
  }

  // Increment views using Prisma ORM
  await prisma.routingForm.update({
    where: { id: routingForm.id },
    data: { views: { increment: 1 } }
  });

  const serializedForm = {
    ...routingForm,
    questions: JSON.parse(routingForm.questions || "[]"),
    routes: JSON.parse(routingForm.routes || "[]")
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <RoutingQuestionnaire routingForm={serializedForm} username={username} hideWatermark={user.hideWatermark} />
    </div>
  );
}
