import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  CreditCard,
  Link2,
  ExternalLink,
  ChevronRight,
  Plus,
  CheckCircle2,
  CalendarDays,
  Sparkles
} from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MeetingActions, ShareLinkBox, DashboardHeaderActions } from "@/components/dashboard/dashboard-client";
import { RealtimeDashboardListener } from "@/components/dashboard/realtime-dashboard";
import { format } from "date-fns";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  // Fetch data in parallel
  const [user, totalBookingsCount, upcomingBookings, eventTypes, paidBookings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: true,
      }
    }),
    prisma.booking.count({
      where: { 
        eventType: { userId },
        status: "CONFIRMED"
      }
    }),
    prisma.booking.findMany({
      where: { 
        eventType: { userId },
        startTime: { gte: new Date() },
        status: "CONFIRMED"
      },
      include: { eventType: true },
      orderBy: { startTime: "asc" },
      take: 5
    }),
    prisma.eventType.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 4
    }),
    prisma.booking.findMany({
      where: {
        eventType: { userId, requiresPayment: true },
        status: "CONFIRMED",
        paymentStatus: "PAID"
      },
      include: {
        eventType: {
          select: { price: true, currency: true }
        }
      }
    })
  ]);

  if (!user) {
    redirect("/login");
  }

  const username = user.username || user.email?.split("@")[0] || "user";

  const avgDuration = eventTypes.length > 0
    ? Math.round(eventTypes.reduce((acc, et) => acc + et.duration, 0) / eventTypes.length)
    : 0;

  // Earnings calculation
  let totalINR = 0;
  let totalUSD = 0;
  paidBookings.forEach(booking => {
    const price = booking.eventType?.price || 0;
    if (booking.eventType?.currency === "INR") {
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
  } else if (totalINR > 0) {
    earningsLabel = `₹${totalINR}`;
  }

  const stats = [
    { title: "Total Bookings", value: totalBookingsCount.toString(), desc: "All time scheduled", icon: Users },
    { title: "Upcoming", value: upcomingBookings.length.toString(), desc: "In your queue", icon: CalendarIcon },
    { title: "Avg. Duration", value: `${avgDuration || 30}m`, desc: "Per event type", icon: Clock },
    { title: "Revenue", value: earningsLabel, desc: "Collected earnings", icon: CreditCard },
  ];

  const googleIntegration = user.accounts?.find(a => a.provider === "google");

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      <RealtimeDashboardListener />

      {/* Clean Modern Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Welcome back, {user.name?.split(" ")[0] || "there"}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Here's an overview of your schedule and booking activity today.
          </p>
        </div>

        <DashboardHeaderActions username={username} />
      </div>

      {/* Minimal 4-Column Stat Cards (Cal.com style) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-card hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {stat.title}
                </span>
                <div className="w-6 h-6 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {stat.value}
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {stat.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Primary Column: Upcoming Meetings (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-card shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Upcoming Meetings</h2>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Your scheduled calls for the coming days.</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                render={<Link href="/dashboard/bookings" />}
                className="h-7 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                View all bookings →
              </Button>
            </div>

            <div className="p-4">
              {upcomingBookings.length === 0 ? (
                <div className="text-center py-10 px-4 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/20 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 mx-auto flex items-center justify-center text-zinc-400">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">No upcoming meetings</h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Your schedule is completely clear.</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    render={<Link href="/dashboard/event-types" />}
                    className="h-7 text-xs border-zinc-200 dark:border-zinc-800"
                  >
                    Share an Event Link
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                            {booking.guestName}
                          </span>
                          <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-full font-medium">
                            {booking.eventType?.title || "Meeting"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(booking.startTime), "EEE, MMM d · h:mm a")}
                          </span>
                          <span>({booking.eventType?.duration || 30} mins)</span>
                        </div>
                      </div>

                      <MeetingActions id={booking.id} meetLink={booking.meetLink} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Links & Connections (1 col) */}
        <div className="space-y-4">
          {/* Share Link Card */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-card p-4 shadow-2xs space-y-3">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Share your public link
              </h2>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Copy your profile link to share with clients or embed on social media.
              </p>
            </div>

            <ShareLinkBox username={username} />
          </div>

          {/* Active Event Types Preview */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-card p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Event Types ({eventTypes.length})
              </h2>
              <Link
                href="/dashboard/event-types"
                className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                Manage →
              </Link>
            </div>

            <div className="space-y-2">
              {eventTypes.map((et) => (
                <Link
                  key={et.id}
                  href={`/dashboard/event-types`}
                  className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/30 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors flex items-center justify-between text-xs group"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 block truncate group-hover:text-zinc-600 dark:group-hover:text-zinc-200">
                      {et.title}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      /{username}/{et.slug} · {et.duration}m
                    </span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Google Calendar Sync Card */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-card p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Calendar Sync
              </h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="h-2.5 w-2.5" />
                Connected
              </span>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/30 text-xs">
              <div className="w-7 h-7 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs">
                📅
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-medium text-zinc-900 dark:text-zinc-100 block truncate">
                  {user.email}
                </span>
                <span className="text-[10px] text-zinc-400">
                  Google Calendar 2-way sync
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
