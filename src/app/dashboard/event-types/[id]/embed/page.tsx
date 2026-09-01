import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { EmbedClient } from "@/components/dashboard/embed-client";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Embed Event Type | CalMeet",
  description: "Embed your booking schedule onto websites, apps, and emails",
};

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
          username: true,
        },
      },
    },
  });

  if (!eventType) {
    notFound();
  }

  if (eventType.userId !== (session.user as any).id) {
    redirect("/dashboard/event-types");
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const username = eventType.user.username || "user";
  const bookingUrl = `${baseUrl}/${username}/${eventType.slug}`;

  return (
    <div className="w-full space-y-5">
      {/* Clean Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div className="space-y-1">
          <Link
            href="/dashboard/event-types"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Event Types</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Embed: {eventType.title}
            </h1>
            <span className="text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-full">
              {eventType.duration} mins
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Choose how you want to add this booking calendar to your website or email.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors shadow-2xs"
          >
            <span>Preview Link</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      <EmbedClient 
        bookingUrl={bookingUrl} 
        eventTitle={eventType.title} 
        duration={eventType.duration}
        username={username}
      />
    </div>
  );
}
