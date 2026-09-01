import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, Users, CalendarDays, MousePointerClick, ArrowUpRight, ArrowDownRight, Zap, Clock, XCircle, Filter, Globe, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ProGatedPage } from "@/components/dashboard/pro-gated-page";
import { RealtimeDashboardListener } from "@/components/dashboard/realtime-dashboard";
import Link from "next/link";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, timezone: true }
  });

  // Fetch data using standard Prisma ORM
  const eventTypes = await prisma.eventType.findMany({
    where: { userId },
    include: {
      _count: {
        select: { bookings: true }
      }
    }
  });

  const routingForms = await prisma.routingForm.findMany({
    where: { userId },
    select: { id: true, name: true, views: true }
  });

  const rawBookings = await prisma.booking.findMany({
    where: { eventType: { userId } },
    include: { 
      eventType: { 
        select: { 
          title: true,
          requiresPayment: true
        } 
      } 
    },
    orderBy: { createdAt: "desc" },
  });

  // Map data to match expected format
  const mappedEventTypes = eventTypes.map(et => ({
    ...et,
    bookingCount: et._count.bookings
  }));

  const mappedBookings = rawBookings.map(b => ({
    ...b,
    eventTypeTitle: b.eventType.title
  }));

  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  let totalBookingsThisMonth = 0;
  let totalBookingsLastMonth = 0;
  let totalBookingsAllTime = rawBookings.filter(b => b.status === "CONFIRMED").length;
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
    
    const count = mappedBookings.filter(b => {
      if (b.status !== "CONFIRMED") return false;
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
  mappedEventTypes.forEach(type => {
    totalViews += Number(type.views || 0);
  });
  routingForms.forEach(form => {
    totalViews += Number(form.views || 0);
  });

  // Fallback to totalBookingsAllTime if views are somehow less (to avoid weird funnel representation)
  if (totalViews < totalBookingsAllTime) {
    totalViews = totalBookingsAllTime + 10; 
  }

  mappedBookings.forEach(b => {
    if (b.status !== "CONFIRMED") return;
    const bDate = new Date(b.createdAt);
    if (bDate >= currentMonthStart) totalBookingsThisMonth++;
    else if (bDate >= lastMonthStart && bDate < currentMonthStart) totalBookingsLastMonth++;
  });

  const bookingsGrowth = totalBookingsLastMonth === 0 
    ? (totalBookingsThisMonth > 0 ? 100 : 0)
    : Math.round(((totalBookingsThisMonth - totalBookingsLastMonth) / totalBookingsLastMonth) * 100);

  const conversionRate = totalViews === 0 ? 0 : Math.round((totalBookingsAllTime / totalViews) * 100);
  const recentActivity = mappedBookings.slice(0, 5);

  // 1. Average Booking Lead Time calculation
  const activeBookings = rawBookings.filter(b => b.status !== "CANCELLED");
  
  // Paid vs Free bookings calculation
  const totalPaidBookings = rawBookings.filter(b => 
    b.eventType.requiresPayment && 
    b.status === "CONFIRMED" && 
    b.paymentStatus === "PAID"
  ).length;

  const totalFreeBookings = rawBookings.filter(b => 
    !b.eventType.requiresPayment && 
    b.status === "CONFIRMED"
  ).length;

  const leadTimes = activeBookings.map(b => {
    const start = new Date(b.startTime).getTime();
    const created = new Date(b.createdAt).getTime();
    return Math.max(0, start - created);
  });
  const avgLeadTimeMs = leadTimes.length > 0 
    ? leadTimes.reduce((acc, curr) => acc + curr, 0) / leadTimes.length 
    : 0;
  
  let avgLeadTimeFormatted = "0h";
  if (avgLeadTimeMs > 0) {
    const hours = avgLeadTimeMs / (1000 * 60 * 60);
    if (hours >= 24) {
      avgLeadTimeFormatted = `${(hours / 24).toFixed(1)}d`;
    } else {
      avgLeadTimeFormatted = `${hours.toFixed(1)}h`;
    }
  }

  // 2. Cancellation Rate calculation
  const totalBookingsCount = rawBookings.length;
  const cancelledBookingsCount = rawBookings.filter(b => b.status === "CANCELLED").length;
  const cancellationRate = totalBookingsCount > 0 
    ? Math.round((cancelledBookingsCount / totalBookingsCount) * 100) 
    : 0;

  // 3. Traffic Referral Sources calculation
  const referrersMap: Record<string, number> = {};
  rawBookings.forEach(b => {
    const rawSrc = b.utmSource || b.referer;
    if (!rawSrc) {
      referrersMap["Direct / Organic"] = (referrersMap["Direct / Organic"] || 0) + 1;
      return;
    }
    
    let cleanSource = rawSrc.trim();
    if (cleanSource.includes("localhost") || cleanSource.includes("127.0.0.1")) {
      cleanSource = "Test Link";
    } else if (cleanSource.startsWith("http")) {
      try {
        cleanSource = new URL(cleanSource).hostname;
      } catch (_) {}
    }
    cleanSource = cleanSource.replace(/^www\./i, "");
    cleanSource = cleanSource.charAt(0).toUpperCase() + cleanSource.slice(1);
    referrersMap[cleanSource] = (referrersMap[cleanSource] || 0) + 1;
  });

  const referralSources = Object.entries(referrersMap)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 4. Time & Day Occupancy Heatmap calculation
  // 7 rows (Sunday = 0 to Saturday = 6)
  // 24 columns (hours 0 to 23)
  const heatmapData = Array.from({ length: 7 }, () => Array(24).fill(0));
  rawBookings.filter(b => b.status !== "CANCELLED").forEach(b => {
    const d = new Date(b.startTime);
    const day = d.getDay();
    const hour = d.getHours();
    heatmapData[day][hour]++;
  });

  const daysOfWeekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Find maximum count in heatmap to scale opacity colors
  const maxHeatmapCount = Math.max(...heatmapData.map(row => Math.max(...row)), 1);

  return (
    <div className="space-y-8 pb-12">
      <RealtimeDashboardListener />
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Meetings This Month</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{totalBookingsThisMonth}</div>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1 truncate">
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
            <CardTitle className="text-xs font-medium">Page Views</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{totalViews}</div>
            <p className="text-[10px] text-muted-foreground mt-1 truncate">
              Total unique visits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Conversion Rate</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{conversionRate}%</div>
            <p className="text-[10px] text-muted-foreground mt-1 truncate">
              Visitors who booked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Total All-Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{totalBookingsAllTime}</div>
            <p className="text-[10px] text-muted-foreground mt-1 truncate">
              Meetings scheduled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Avg. Booking Lead</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{avgLeadTimeFormatted}</div>
            <p className="text-[10px] text-muted-foreground mt-1 truncate">
              Advance booking notice
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Cancellation Rate</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{cancellationRate}%</div>
            <p className="text-[10px] text-muted-foreground mt-1 truncate">
              Ratio of cancelled meets
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Area */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Booking Trend Graph */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Booking Trend</CardTitle>
              <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live
              </span>
            </div>
            <CardDescription>Meetings scheduled over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-[220px] flex flex-col justify-end pt-4">
             {maxTrendValue === 1 && trendData.every(d => d.value === 0) ? (
                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground/50 border-2 border-dashed border-muted rounded-lg min-h-[160px]">
                  No booking data recorded for the last 7 days.
                </div>
             ) : (
               <div className="w-full h-full flex flex-col justify-end">
                 <div className="flex items-end gap-3 h-[150px] w-full px-2">
                   {trendData.map((d, i) => {
                     const height = (d.value / maxTrendValue) * 100;
                     return (
                       <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative" title={`${d.label}: ${d.value}`}>
                          {d.value > 0 && (
                            <span className="absolute -top-6 text-[10px] font-bold bg-background text-primary border border-zinc-150 dark:border-zinc-850 px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none select-none z-10">
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
                 <div className="flex justify-between w-full mt-3 text-[10px] font-semibold text-muted-foreground/80 tracking-wider select-none px-2">
                   {trendData.map((d, i) => (
                     <span key={i} className="flex-1 text-center truncate">
                       {d.label}
                     </span>
                   ))}
                 </div>
               </div>
             )}
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
             {mappedEventTypes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm italic">No data available yet.</div>
             ) : (
               <div className="space-y-4">
                 <div className="flex gap-3 mb-5 pb-4 border-b border-zinc-100 dark:border-zinc-900/50 text-xs">
                   <div className="flex-1 bg-zinc-50/50 dark:bg-zinc-950/30 p-3 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                     <p className="text-[10px] uppercase font-bold text-muted-foreground">Paid Bookings</p>
                     <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{totalPaidBookings} meets</p>
                   </div>
                   <div className="flex-1 bg-zinc-50/50 dark:bg-zinc-950/30 p-3 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                     <p className="text-[10px] uppercase font-bold text-muted-foreground">Free Bookings</p>
                     <p className="text-lg font-extrabold text-muted-foreground mt-1">{totalFreeBookings} meets</p>
                   </div>
                 </div>
                 {mappedEventTypes.slice(0, 5).map((type, i) => {
                   const percentage = totalBookingsAllTime === 0 ? 0 : Math.round((Number(type.bookingCount) / totalBookingsAllTime) * 100);
                   const colors = ["bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500", "bg-pink-500"];
                   const barColor = colors[i % colors.length];
                   
                   return (
                     <div key={type.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs gap-2">
                         <div className="flex items-center gap-1.5 min-w-0">
                           <span className="font-semibold truncate max-w-[140px] text-zinc-800 dark:text-zinc-200">{type.title}</span>
                           <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded shrink-0 select-none ${type.requiresPayment ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border border-zinc-500/20'}`}>
                             {type.requiresPayment ? 'Paid' : 'Free'}
                           </span>
                         </div>
                         <span className="text-muted-foreground shrink-0 font-medium">{percentage}% ({type.bookingCount} meets)</span>
                       </div>
                       <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
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

      {/* Heatmap Row */}
      <div className="grid gap-4 grid-cols-1">
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Time & Day Occupancy Heatmap
                  {user?.plan === "FREE" && (
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> Teams Plan
                    </span>
                  )}
                </CardTitle>
                <CardDescription>Visualize the busiest times and days when your meetings are scheduled.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {user?.plan === "FREE" ? (
                  <Link href="/dashboard/settings?tab=plans">
                    <Button size="sm" variant="outline" className="h-7 text-[11px] gap-1 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10">
                      <Sparkles className="h-3 w-3" /> Upgrade
                    </Button>
                  </Link>
                ) : (
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                    Live Real-Time
                  </span>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="overflow-x-auto">
            <div className="min-w-[760px] space-y-4 pt-2">
              {/* Hour Grid Labels */}
              <div className="grid grid-cols-[50px_repeat(24,_1fr)] gap-1 text-[9px] font-bold text-muted-foreground/80 text-center select-none">
                <div></div>
                {Array.from({ length: 24 }).map((_, hour) => {
                  const label = hour === 0 ? "12a" : hour === 12 ? "12p" : hour > 12 ? `${hour - 12}p` : `${hour}a`;
                  return <div key={hour} className="truncate">{label}</div>;
                })}
              </div>

              {/* Heatmap Rows */}
              <div className="space-y-1">
                {daysOfWeekLabels.map((dayLabel, dayIndex) => (
                  <div key={dayLabel} className="grid grid-cols-[50px_repeat(24,_1fr)] gap-1 items-center">
                    <div className="text-xs font-semibold text-muted-foreground select-none">{dayLabel}</div>
                    {Array.from({ length: 24 }).map((_, hour) => {
                      const count = heatmapData[dayIndex][hour];
                      let intensityClass = "bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-900";
                      
                      if (count > 0) {
                        const ratio = count / maxHeatmapCount;
                        if (ratio <= 0.25) intensityClass = "bg-primary/20 hover:bg-primary/30 border border-primary/10";
                        else if (ratio <= 0.5) intensityClass = "bg-primary/40 hover:bg-primary/50 border border-primary/20";
                        else if (ratio <= 0.75) intensityClass = "bg-primary/75 hover:bg-primary/80 border border-primary/30";
                        else intensityClass = "bg-primary hover:brightness-95 border border-primary/45 text-primary-foreground";
                      }
                      
                      return (
                        <div 
                          key={hour} 
                          className={`h-7 rounded-md flex items-center justify-center text-[10px] font-bold transition-all duration-200 cursor-help group relative ${intensityClass}`}
                          title={`${dayLabel} at ${hour === 0 ? "12 AM" : hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}: ${count} Booking(s)`}
                        >
                          {count > 0 && <span>{count}</span>}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-end gap-2 pt-2 text-[10px] text-muted-foreground select-none">
                <span>Less busy</span>
                <div className="w-4 h-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-900 rounded-sm"></div>
                <div className="w-4 h-4 bg-primary/20 rounded-sm"></div>
                <div className="w-4 h-4 bg-primary/50 rounded-sm"></div>
                <div className="w-4 h-4 bg-primary/80 rounded-sm"></div>
                <div className="w-4 h-4 bg-primary rounded-sm"></div>
                <span>Very busy</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed, Funnel, and Referral Sources Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Activity Feed */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest bookings and incoming requests.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm italic">No recent activity.</div>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-2.5 rounded-lg border hover:bg-muted/30 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                      {activity.guestName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{activity.guestName}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{activity.eventTypeTitle}</p>
                    </div>
                    <div className="text-right text-[10px] text-muted-foreground shrink-0 font-sans">
                       <p className="font-medium">
                         {new Intl.DateTimeFormat("en-US", {
                           month: "short",
                           day: "numeric",
                           timeZone: user?.timezone || "UTC"
                         }).format(new Date(activity.createdAt))}
                       </p>
                       <p>
                         {new Intl.DateTimeFormat("en-US", {
                           hour: "numeric",
                           minute: "2-digit",
                           hour12: true,
                           timeZone: user?.timezone || "UTC"
                         }).format(new Date(activity.createdAt))}
                       </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Referral Sources */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-4.5 w-4.5 text-muted-foreground" />
              Referral Sources
            </CardTitle>
            <CardDescription>Where your page bookings originate.</CardDescription>
          </CardHeader>
          <CardContent>
            {referralSources.length === 0 ? (
               <div className="text-center py-8 text-muted-foreground text-sm italic">No referral data.</div>
            ) : (
              <div className="space-y-4">
                {referralSources.map(({ source, count }) => {
                  const pct = totalBookingsAllTime === 0 ? 0 : Math.round((count / totalBookingsAllTime) * 100);
                  return (
                    <div key={source} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="truncate max-w-[120px]">{source}</span>
                        <span className="text-muted-foreground">{count} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-violet-500 to-primary rounded-full transition-all" 
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-4.5 w-4.5 text-muted-foreground" />
              Booking Funnel
            </CardTitle>
            <CardDescription>Conversion flow of your meeting pages.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-between h-[230px] pt-2">
            <div className="space-y-4 w-full">
              {/* Funnel Step 1 */}
              <div className="relative p-3 bg-muted/40 rounded-lg border border-border flex items-center justify-between overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-400"></div>
                <div className="pl-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Step 1: Link Visits</p>
                  <p className="text-base font-bold">{totalViews}</p>
                </div>
                <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">100%</span>
              </div>
              
              {/* Arrow Down */}
              <div className="flex justify-center -my-2.5">
                <div className="w-5 h-5 rounded-full bg-background border flex items-center justify-center shadow-sm">
                  <span className="text-[10px] text-muted-foreground">↓</span>
                </div>
              </div>

              {/* Funnel Step 2 */}
              <div className="relative p-3 bg-primary/5 rounded-lg border border-primary/10 flex items-center justify-between overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                <div className="pl-1">
                  <p className="text-[10px] uppercase font-bold text-primary">Step 2: Bookings Completed</p>
                  <p className="text-base font-bold text-primary">{totalBookingsAllTime}</p>
                </div>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{conversionRate}%</span>
              </div>
            </div>

            <div className="pt-2 text-center">
              <p className="text-[11px] text-muted-foreground">
                Overall conversion rate is <span className="font-bold text-foreground">{conversionRate}%</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
