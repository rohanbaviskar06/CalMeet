import { cn } from "@/lib/utils";
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
  const isDemo = decodedUsername.toLowerCase() === "preview-user" || decodedUsername.toLowerCase() === "demo";

  let user: any = null;
  let eventType: any = null;
  let availability: any[] = [];
  let bookings: any[] = [];
  let isWhiteLabeled = false;

  if (isDemo) {
    user = {
      id: "demo-user-id",
      name: "Alex User",
      username: "preview-user",
      image: null,
      timezone: "Asia/Kolkata",
      bio: "Product Specialist at CalMeet. This is an interactive demo of our frictionless booking experience.",
      plan: "PRO",
      hideWatermark: false,
    };

    eventType = {
      id: "demo-review-meeting",
      title: slug === "review-meeting" ? "Product Review & Strategy" : slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      slug: slug,
      duration: 15,
      description: "Experience the attendee scheduling workflow firsthand — pick a date and time to see how CalMeet confirms meetings with zero friction.",
      videoCallProvider: "GOOGLE_MEET",
      requiresPayment: false,
      price: null,
      currency: "INR",
      isActive: true,
      userId: "demo-user-id",
    };

    // Standard Monday to Friday working hours (9:00 AM - 5:00 PM)
    availability = [1, 2, 3, 4, 5].map((dayOfWeek) => ({
      dayOfWeek,
      startTime: "09:00",
      endTime: "17:00",
    }));

    bookings = [];
  } else {
    try {
      user = await prisma.user.findFirst({
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
    } catch (e) {
      console.warn("Database user lookup error:", e);
    }

    if (!user) {
      notFound();
    }

    isWhiteLabeled = user.hideWatermark && user.plan !== "FREE";

    try {
      eventType = await prisma.eventType.findUnique({
        where: {
          userId_slug: {
            userId: user.id,
            slug: slug
          }
        }
      });
    } catch (e) {
      console.warn("Database eventType lookup error:", e);
    }
  }

  if (eventType && eventType.isActive) {
    if (!isDemo) {
      // Increment views using Prisma ORM
      await prisma.eventType.update({
        where: { id: eventType.id },
        data: { views: { increment: 1 } }
      }).catch(() => {});

      availability = await prisma.availability.findMany({
        where: { userId: user.id }
      }).catch(() => []);

      bookings = await prisma.booking.findMany({
        where: { 
          eventTypeId: eventType.id,
          status: "CONFIRMED"
        },
        select: {
          startTime: true,
          endTime: true,
        }
      }).catch(() => []);
    }

    return (
      <div className={cn(
        "min-h-screen flex flex-col items-center justify-center bg-[#0c0c0c] text-white",
        !isEmbed && "p-2 sm:p-6 lg:p-10"
      )}>
        <div className={cn("w-full", !isEmbed && "max-w-5xl lg:max-w-[1060px]")}>
          {isDemo && !isEmbed && (
            <div className="mb-4 text-center px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span><strong>Interactive Sample Booking</strong> — Select any available slot to test the attendee confirmation workflow.</span>
              </span>
              <a href="/signup" className="text-[11px] font-semibold text-primary hover:underline whitespace-nowrap">
                Create Your Own Link →
              </a>
            </div>
          )}
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
                CalMeet.app
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
