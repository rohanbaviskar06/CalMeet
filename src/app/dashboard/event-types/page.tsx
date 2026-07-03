import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Plus, 
  Clock, 
  ExternalLink,
} from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { EventTypeActions, CopyLinkButton } from "@/components/dashboard/event-type-client";
import Link from "next/link";

const cleanDescription = (html: string | null) => {
  if (!html) return "No description provided.";
  const clean = html
    .replace(/<\/p>/g, " ")
    .replace(/<br\s*\/?>/g, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  
  if (clean.length > 90) {
    return clean.slice(0, 87) + "...";
  }
  return clean || "No description provided.";
};

export default async function EventTypesPage() {
  // Fetch session and data in parallel where possible
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: {
      eventTypes: {
        orderBy: {
          createdAt: "desc"
        },
        include: {
          user: {
            select: {
              username: true
            }
          }
        }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-cyan-500"
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Types</h1>
          <p className="text-muted-foreground">Create and manage your meeting types.</p>
        </div>
        <Button className="gap-2 self-start sm:self-auto" render={<Link href="/dashboard/event-types/new" />} nativeButton={false}>
            <Plus className="h-4 w-4" /> Create New
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {user.eventTypes.map((event, index) => (
          <Card key={event.id} className={cn("group transition-all", !event.isActive && "opacity-60")}>
            <CardHeader className="relative pb-4">
              <EventTypeActions event={event} />
              <div className={cn("w-12 h-2 rounded-full mb-4", colors[index % colors.length])} />
              <CardTitle className="text-xl">{event.title}</CardTitle>
              <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                {cleanDescription(event.description)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {event.duration}m
                </div>
                <div className="flex items-center gap-1.5">
                  <ExternalLink className="h-4 w-4" />
                  /{event.slug}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t flex items-center justify-between">
              <CopyLinkButton 
                username={user.username || user.id} 
                slug={event.slug} 
              />
              <Button variant="outline" size="sm" render={<Link href={`/dashboard/event-types/${event.id}`} />} nativeButton={false}>
                Edit Details
              </Button>
            </CardFooter>
          </Card>
        ))}

        {/* Empty State / Create Card */}
        <Link href="/dashboard/event-types/new" className="h-full min-h-[240px] rounded-2xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/30 transition-all flex flex-col items-center justify-center gap-4 group text-left">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors mx-auto">
                <Plus className="h-6 w-6" />
            </div>
            <div className="text-center">
                <p className="font-semibold">Add New Event Type</p>
                <p className="text-sm text-muted-foreground">Create a new booking page</p>
            </div>
        </Link>
      </div>
    </div>
  );
}
