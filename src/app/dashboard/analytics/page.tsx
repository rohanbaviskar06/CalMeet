import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, Users, CalendarDays, MousePointerClick, ArrowUpRight, ArrowDownRight, Zap } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  // Fetch data using raw SQL to bypass stale Prisma Client types
  const eventTypes: any[] = await prisma.$queryRaw`
    SELECT id, title, slug, views, (SELECT COUNT(*) FROM Booking WHERE eventTypeId = EventType.id) as bookingCount 
    FROM EventType 
    WHERE userId = ${userId}
  `;

  const routingForms: any[] = await prisma.$queryRaw`
    SELECT id, name, views FROM RoutingForm WHERE userId = ${userId}
  `;

  // Fetch recent bookings for the activity feed and trend
  const rawBookings: any[] = await prisma.$queryRaw`
    SELECT B.*, ET.title as eventTypeTitle
    FROM Booking B
    JOIN EventType ET ON B.eventTypeId = ET.id
    WHERE ET.userId = ${userId}
    ORDER BY B.createdAt DESC
    LIMIT 50
  `;

  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  let totalBookingsThisMonth = 0;
  let totalBookingsLastMonth = 0;
  let totalBookingsAllTime = rawBookings.length;
  let totalViews = 0;
  
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
    
    const count = rawBookings.filter(b => {
      const bDate = new Date(b.createdAt);
      return bDate >= dayStart && bDate <= dayEnd;
    }).length;

    return {
      label: format(date, "MMM d"),
      value: count
    };
  });

  const maxTrendValue = Math.max(...trendData.map(d => d.value), 1);

  // Aggregates
  eventTypes.forEach(type => {
    totalViews += Number(type.views || 0);
  });
  routingForms.forEach(form => {
    totalViews += Number(form.views || 0);
  });

  rawBookings.forEach(b => {
    const bDate = new Date(b.createdAt);
    if (bDate >= currentMonthStart) totalBookingsThisMonth++;
    else if (bDate >= lastMonthStart && bDate < currentMonthStart) totalBookingsLastMonth++;
  });

  const bookingsGrowth = totalBookingsLastMonth === 0 
    ? (totalBookingsThisMonth > 0 ? 100 : 0)
    : Math.round(((totalBookingsThisMonth - totalBookingsLastMonth) / totalBookingsLastMonth) * 100);

  const conversionRate = totalViews === 0 ? 0 : Math.round((totalBookingsAllTime / totalViews) * 100);
  const recentActivity = rawBookings.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Insights</h1>
          <p className="text-muted-foreground">Track how your scheduling links are performing in real-time.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold border border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          Live
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meetings This Month</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookingsThisMonth}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              {bookingsGrowth >= 0 ? (
                <span className="text-emerald-500 flex items-center font-medium"><ArrowUpRight className="h-3 w-3 mr-0.5" /> +{bookingsGrowth}%</span>
              ) : (
                <span className="text-destructive flex items-center font-medium"><ArrowDownRight className="h-3 w-3 mr-0.5" /> {bookingsGrowth}%</span>
              )}
              {" "}from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Real-Time Page Views</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total unique visits to your links
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Visitors who completed a booking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total All-Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookingsAllTime}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Meetings scheduled via MeetMe
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Area */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Booking Trend Graph */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Booking Trend</CardTitle>
            <CardDescription>Meetings scheduled over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] flex items-end gap-2 pt-4">
             {trendData.map((d, i) => {
               const height = (d.value / maxTrendValue) * 100;
               return (
                 <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                   <div className="relative w-full flex flex-col items-center justify-end h-full">
                      <div className="w-full bg-primary/20 group-hover:bg-primary transition-colors rounded-t-sm" style={{ height: `${height}%` }} />
                   </div>
                   <span className="text-[10px] text-muted-foreground">{d.label}</span>
                 </div>
               );
             })}
          </CardContent>
        </Card>

        {/* Most Popular Event Types */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Popular Event Types</CardTitle>
            <CardDescription>
              Which meeting links are getting the most traction.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {eventTypes.length === 0 ? (
               <div className="text-center py-8 text-muted-foreground text-sm italic">No data available yet.</div>
            ) : (
              <div className="space-y-4">
                {eventTypes.slice(0, 5).map((type, i) => {
                  const percentage = totalBookingsAllTime === 0 ? 0 : Math.round((Number(type.bookingCount) / totalBookingsAllTime) * 100);
                  const colors = ["bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500", "bg-pink-500"];
                  const barColor = colors[i % colors.length];
                  
                  return (
                    <div key={type.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium truncate max-w-[150px]">{type.title}</span>
                        <span className="text-muted-foreground">{percentage}%</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${barColor} rounded-full transition-all`} 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest bookings and incoming requests.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm italic">No recent activity.</div>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      {activity.guestName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.guestName}</p>
                      <p className="text-xs text-muted-foreground truncate">{activity.eventTypeTitle}</p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                       <p>{format(new Date(activity.createdAt), "MMM d")}</p>
                       <p>{format(new Date(activity.createdAt), "h:mm a")}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900 rounded-lg">
                <h4 className="font-semibold text-emerald-800 dark:text-emerald-400 text-sm">Great Conversion!</h4>
                <p className="text-xs text-emerald-700/80 dark:text-emerald-500 mt-1 leading-relaxed">
                  Your conversion rate is {conversionRate}%. That's highly efficient for a scheduling page.
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-400 text-sm">Pro Tip</h4>
                <p className="text-xs text-blue-700/80 dark:text-blue-500 mt-1 leading-relaxed">
                  Share your link in your email signature to organically boost page views and meetings.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
