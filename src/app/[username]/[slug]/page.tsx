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

  const decodedUsername = decodeURIComponent(username).trim();

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: { equals: decodedUsername, mode: "insensitive" } },
        { email: { equals: `${decodedUsername}@gmail.com`, mode: "insensitive" } },
        { email: { startsWith: `${decodedUsername}@`, mode: "insensitive" } },
        { id: decodedUsername },
      ],
    },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      timezone: true,
      bio: true,
      plan: true,
      hideWatermark: true,
    }
  });

  if (!user) {
    notFound();
  }


  const isWhiteLabeled = user.hideWatermark && user.plan !== "FREE";

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
        "min-h-screen flex flex-col items-center justify-center bg-[#0c0c0c] text-white",
        !isEmbed && "p-2 sm:p-6 lg:p-10"
      )}>
        <div className={cn("w-full", !isEmbed && "max-w-5xl lg:max-w-[1060px]")}>
          <div className={cn(
            "border border-zinc-800/90 bg-[#111111] shadow-2xl rounded-2xl overflow-hidden",
            isEmbed && "border-none rounded-none bg-transparent shadow-none"
          )}>
            <BookingForm 
              user={user as any} 
              eventType={eventType} 
              availability={availability}
              bookings={bookings}
            />
          </div>
          
          {/* Cal.com style Watermark */}
          {!isWhiteLabeled && !isEmbed && (
            <div className="mt-8 text-center">
              <a 
                href="/" 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors inline-block"
              >
                CalMeet.com
              </a>
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
