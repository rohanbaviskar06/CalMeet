import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertCircle } from "lucide-react";
import { MeetingActions } from "@/components/dashboard/dashboard-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const bookings = await prisma.booking.findMany({
    where: {
      eventType: {
        userId: (session.user as any).id
      }
    },
    include: {
      eventType: true
    },
    orderBy: {
      startTime: "desc"
    }
  });

  const now = new Date();

  const upcomingBookings = bookings.filter(b => new Date(b.startTime) >= now && b.status !== "CANCELLED");
  const pastBookings = bookings.filter(b => new Date(b.startTime) < now && b.status !== "CANCELLED");
  const canceledBookings = bookings.filter(b => b.status === "CANCELLED");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <p className="text-muted-foreground">Manage your meetings and schedule.</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-6 grid w-full md:w-auto grid-cols-2 md:inline-grid md:grid-cols-4 h-auto p-1 bg-muted/50 rounded-xl">
          <TabsTrigger value="upcoming" className="rounded-lg py-2">Upcoming</TabsTrigger>
          <TabsTrigger value="past" className="rounded-lg py-2">Past</TabsTrigger>
          <TabsTrigger value="canceled" className="rounded-lg py-2">Canceled</TabsTrigger>
          <TabsTrigger value="all" className="rounded-lg py-2">All Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 focus-visible:outline-none">
          {upcomingBookings.length === 0 ? (
            <EmptyState message="No upcoming bookings." />
          ) : (
            upcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 focus-visible:outline-none">
          {pastBookings.length === 0 ? (
            <EmptyState message="No past bookings." />
          ) : (
            pastBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>

        <TabsContent value="canceled" className="space-y-4 focus-visible:outline-none">
          {canceledBookings.length === 0 ? (
            <EmptyState message="No canceled bookings." />
          ) : (
            canceledBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4 focus-visible:outline-none">
          {bookings.length === 0 ? (
            <EmptyState message="No bookings found." />
          ) : (
            bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card className="border-dashed border-2 bg-transparent shadow-none">
      <CardContent className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-2">
        <AlertCircle className="h-8 w-8 opacity-20" />
        <p>{message}</p>
      </CardContent>
    </Card>
  );
}

function BookingCard({ booking }: { booking: any }) {
  const isCanceled = booking.status === "CANCELLED";
  const isPast = new Date(booking.startTime) < new Date();
  
  return (
    <Card className={`hover:bg-muted/30 transition-colors ${isCanceled ? 'opacity-60 border-destructive/20' : ''} ${isPast && !isCanceled ? 'opacity-75' : ''}`}>
      <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isCanceled ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">{booking.eventType.title}</h4>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5">
                <span className="text-xs font-medium">{booking.guestName}</span>
                <span className="text-muted-foreground hidden sm:inline">•</span>
                <span className="text-xs text-muted-foreground">{format(new Date(booking.startTime), "MMM d, yyyy • h:mm a")}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {isCanceled ? (
            <Badge variant="destructive" className="text-[10px] uppercase">Canceled</Badge>
          ) : (
            <Badge variant={!isPast ? "secondary" : "outline"} className="text-[10px] uppercase">
              {booking.status}
            </Badge>
          )}
          {!isCanceled && <MeetingActions id={booking.id} meetLink={booking.meetLink} />}
        </div>
      </CardContent>
    </Card>
  );
}
