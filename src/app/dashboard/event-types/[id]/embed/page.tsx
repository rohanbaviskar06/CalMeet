import { Navbar } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { EmbedClient } from "@/components/dashboard/embed-client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function EmbedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const eventType = await prisma.eventType.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          username: true
        }
      }
    }
  });

  if (!eventType) {
    notFound();
  }

  if (eventType.userId !== (session.user as any).id) {
    redirect("/dashboard/event-types");
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const bookingUrl = `${baseUrl}/${eventType.user.username}/${eventType.slug}`;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <Link href="/dashboard/event-types" className="text-sm font-medium text-primary flex items-center gap-1 mb-4 hover:underline">
          <ChevronLeft className="h-4 w-4" /> Back to Event Types
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Embed {eventType.title}</h1>
        <p className="text-muted-foreground text-lg">Choose how you want to add this event type to your website.</p>
      </div>

      <EmbedClient bookingUrl={bookingUrl} eventTitle={eventType.title} />
    </div>
  );
}
