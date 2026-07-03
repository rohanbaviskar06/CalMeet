import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Users, 
  CreditCard,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MeetingActions, ShareLinkBox } from "@/components/dashboard/dashboard-client";
import { RealtimeDashboardListener } from "@/components/dashboard/realtime-dashboard";
import { format } from "date-fns";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch data in parallel to reduce load time
  const [user, totalBookingsCount, upcomingBookingsCount, recentBookings, paidBookings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: (session.user as any).id },
      include: {
        accounts: true,
        bookings: {
          where: { 
            startTime: { gte: new Date() },
            status: "CONFIRMED"
          },
          include: { eventType: true },
          orderBy: { startTime: "asc" },
          take: 5
        }
      }
    }),
    prisma.booking.count({
      where: { 
        eventType: { userId: (session.user as any).id },
        status: "CONFIRMED"
      }
    }),
    prisma.booking.count({
      where: { 
        eventType: { userId: (session.user as any).id },
        startTime: { gte: new Date() },
        status: "CONFIRMED"
      }
    }),
    prisma.booking.findMany({
      where: { 
        eventType: { userId: (session.user as any).id },
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0) - 7 * 24 * 60 * 60 * 1000) },
        status: "CONFIRMED"
      },
      include: { eventType: true }
    }),
    prisma.booking.findMany({
      where: {
        eventType: { 
          userId: (session.user as any).id,
          requiresPayment: true
        },
        status: "CONFIRMED",
        paymentStatus: "PAID"
      },
      include: {
        eventType: {
          select: {
            price: true,
            currency: true
          }
        }
      }
    })
  ]);
  
  if (!user) {
    redirect("/login");
  }

  // Calculate avg duration from all event types (more efficient than all bookings)
  const eventTypes = await prisma.eventType.findMany({
    where: { userId: user.id },
    select: { duration: true }
  });

  const avgDuration = eventTypes.length > 0
    ? Math.round(eventTypes.reduce((acc, et) => acc + et.duration, 0) / eventTypes.length)
    : 0;

  // Calculate total payments collected
  let totalINR = 0;
  let totalUSD = 0;
  paidBookings.forEach(booking => {
    const price = booking.eventType.price || 0;
    if (booking.eventType.currency === "INR") {
      totalINR += price;
    } else {
      totalUSD += price;
    }
  });

  let earningsLabel = "₹0";
  if (totalINR > 0 && totalUSD > 0) {
    earningsLabel = `₹${totalINR} + $${totalUSD}`;
  } else if (totalUSD > 0) {
    earningsLabel = `$${totalUSD}`;
  } else {
    earningsLabel = `₹${totalINR}`;
  }

  const stats = [
    { title: "Total Bookings", value: totalBookingsCount.toString(), icon: Users, change: "All time" },
    { title: "Upcoming", value: upcomingBookingsCount.toString(), icon: Calendar, change: "Next 7 days" },
    { title: "Avg. Duration", value: `${avgDuration}m`, icon: Clock, change: "Per meeting" },
    { title: "Payments Collected", value: earningsLabel, icon: CreditCard, change: "All time earnings" },
  ];

  // Calculate trend data for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    return d;
  }).reverse();

  const trendData = last7Days.map(date => {
    const dayStart = date;
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    
    const count = recentBookings.filter(b => {
      const bDate = new Date(b.createdAt);
      return bDate >= dayStart && bDate <= dayEnd;
    }).length;

    return {
      label: format(date, "MMM d"),
      value: count
    };
  });

  const maxTrendValue = Math.max(...trendData.map(d => d.value), 1);

  const googleIntegration = user.accounts.find(a => a.provider === "google");

  return (
    <div className="space-y-6 max-w-full">
      <RealtimeDashboardListener />
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-background p-8 border">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">{user.name?.split(' ')[0] || 'User'}</span> 👋
          </h1>
          <p className="text-muted-foreground mt-2">Here's what's happening with your schedule today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat, i) => {
            const colors = ["text-blue-500 bg-blue-500/10", "text-emerald-500 bg-emerald-500/10", "text-violet-500 bg-violet-500/10"];
            return (
              <Card key={stat.title} className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-xl ${colors[i % colors.length]}`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-primary font-medium">{stat.change}</span>
                  </p>
                </CardContent>
              </Card>
            )
          })}

        <Link href="/dashboard/analytics" className="block cursor-pointer">
          <Card className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300 hover:border-primary/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Booking Trend</CardTitle>
                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Last 7 days</p>
            </CardHeader>
            <CardContent className="h-[100px] flex flex-col justify-end px-4 pb-3">
               {maxTrendValue === 1 && trendData.every(d => d.value === 0) ? (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground/50 border-2 border-dashed border-muted rounded-lg">
                    No data yet
                  </div>
               ) : (
                 <div className="w-full h-full flex flex-col justify-end">
                   <div className="flex items-end gap-2 h-[65px] w-full">
                     {trendData.map((d, i) => {
                       const height = (d.value / maxTrendValue) * 100;
                       return (
                         <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative" title={`${d.label}: ${d.value}`}>
                            {d.value > 0 && (
                              <span className="absolute -top-5 text-[9px] font-bold bg-background text-primary border border-zinc-150 dark:border-zinc-850 px-1 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none select-none z-10">
                                {d.value}
                              </span>
                            )}
                            <div 
                              className="w-full bg-gradient-to-t from-primary/30 to-primary group-hover:from-primary group-hover:to-violet-500 transition-all duration-300 rounded-t-md relative overflow-hidden" 
                              style={{ height: `${Math.max(height, 8)}%` }}
                            >
                              {d.value > 0 && (
                                <div className="absolute inset-0 bg-white/10 dark:bg-white/5 animate-pulse" />
                              )}
                            </div>
                         </div>
                       );
                     })}
                   </div>
                   <div className="flex justify-between w-full mt-2 text-[8px] font-semibold text-muted-foreground/80 tracking-wider select-none px-0.5">
                     {trendData.map((d, i) => (
                       <span key={i} className="flex-1 text-center truncate">
                         {d.label.split(" ")[1]}
                       </span>
                     ))}
                   </div>
                 </div>
               )}
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Meetings */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Meetings</CardTitle>
              <CardDescription>Your schedule for the next few days.</CardDescription>
            </div>
            <Button variant="outline" size="sm" render={<Link href="/dashboard/bookings" />} nativeButton={false}>
                View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.bookings.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-muted/50 bg-muted/10">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">No upcoming meetings</p>
                    <p className="text-xs text-muted-foreground mt-1 mb-4">Your schedule is completely clear.</p>
                    <Button variant="outline" size="sm" render={<Link href="/dashboard/event-types" />} nativeButton={false}>
                      Share an Event Type
                    </Button>
                </div>
              ) : (
                user.bookings.map((booking) => (
                  <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 sm:gap-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm truncate">{booking.eventType.title}</h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {booking.guestName} • {new Intl.DateTimeFormat("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                            timeZone: user.timezone || "UTC"
                          }).format(booking.startTime)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 w-full sm:w-auto">
                      <Badge variant="secondary" className="text-[10px] uppercase">
                        {booking.meetLink?.includes('/meet/') ? '🎥 CalMeet' : booking.meetLink ? 'Google Meet' : 'Offline'}
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
                <Button className="flex-1" render={<Link href="/dashboard/event-types" />} nativeButton={false}>
                    Create Event Type
                </Button>
                <Button variant="outline" className="flex-1" render={<Link href="/dashboard/settings" />} nativeButton={false}>
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
                <Button variant="outline" className="w-full gap-2" render={<Link href="/dashboard/integrations" />} nativeButton={false}>
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
