import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Users, 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MeetingActions, ShareLinkBox } from "@/components/dashboard/dashboard-client";
import { format } from "date-fns";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: {
      accounts: true,
      bookings: {
        where: {
          startTime: { gte: new Date() }
        },
        include: {
          eventType: true
        },
        orderBy: {
          startTime: "asc"
        },
        take: 5
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  // Calculate stats
  const totalBookingsCount = await prisma.booking.count({
    where: { eventType: { userId: user.id } }
  });

  const upcomingBookingsCount = await prisma.booking.count({
    where: { 
      eventType: { userId: user.id },
      startTime: { gte: new Date() }
    }
  });

  const allBookings = await prisma.booking.findMany({
    where: { eventType: { userId: user.id } },
    include: { eventType: true }
  });

  const avgDuration = allBookings.length > 0
    ? Math.round(allBookings.reduce((acc, b) => acc + b.eventType.duration, 0) / allBookings.length)
    : 0;

  const stats = [
    { title: "Total Bookings", value: totalBookingsCount.toString(), icon: Users, change: "All time" },
    { title: "Upcoming", value: upcomingBookingsCount.toString(), icon: Calendar, change: "Next 7 days" },
    { title: "Avg. Duration", value: `${avgDuration}m`, icon: Clock, change: "Per meeting" },
  ];

  const googleIntegration = user.accounts.find(a => a.provider === "google");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name?.split(' ')[0] || 'User'}</h1>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your schedule today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-primary font-medium">{stat.change}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Meetings */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Meetings</CardTitle>
              <CardDescription>Your schedule for the next few days.</CardDescription>
            </div>
            <Button variant="outline" size="sm" render={<a href="/dashboard/bookings" />} nativeButton={false}>
                View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.bookings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    <p>No upcoming meetings found.</p>
                </div>
              ) : (
                user.bookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{booking.eventType.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {booking.guestName} • {format(booking.startTime, "MMM d, h:mm a")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px] uppercase">
                        {booking.meetLink ? "Google Meet" : "Offline"}
                      </Badge>
                      <MeetingActions id={booking.id} meetLink={booking.meetLink} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Share your link</CardTitle>
              <CardDescription>Copy your public booking link to share with others.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ShareLinkBox username={user.username || user.id} />
              <div className="flex gap-2">
                <Button className="flex-1" render={<a href="/dashboard/event-types" />} nativeButton={false}>
                    Create Event Type
                </Button>
                <Button variant="outline" className="flex-1" render={<a href="/dashboard/settings" />} nativeButton={false}>
                    Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Calendar Sync</CardTitle>
              <CardDescription>
                {googleIntegration 
                  ? "Your calendar is currently synced with Google." 
                  : "Connect your calendar to sync your availability."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {googleIntegration ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                      <span className="text-red-600 font-bold">G</span>
                  </div>
                  <div className="flex-1">
                      <p className="text-sm font-medium">{user.email}</p>
                      <p className="text-xs text-muted-foreground">Syncing active</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Active</Badge>
                </div>
              ) : (
                <Button variant="outline" className="w-full gap-2" render={<a href="/dashboard/integrations" />} nativeButton={false}>
                    Connect Calendar
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
