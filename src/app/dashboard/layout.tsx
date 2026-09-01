import { cache } from "react";
import { AppSidebar } from "@/components/dashboard/sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { UserNav } from "@/components/dashboard/user-nav";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PricingModalProvider } from "@/components/dashboard/pricing-modal";
import { NotificationBell } from "@/components/dashboard/notification-bell";

const getCachedUser = cache(async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
      completedOnboarding: true,
      _count: {
        select: { eventTypes: true },
      },
    },
  });
});

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  let dbUser = null;
  try {
    dbUser = await getCachedUser(session.user.id);
  } catch (error) {
    console.error("Dashboard layout db fetch error:", error);
  }

  // Only show onboarding for brand new users (has not completed onboarding and has 0 event types)
  if (dbUser && !dbUser.completedOnboarding && dbUser._count.eventTypes === 0) {
    redirect("/onboarding");
  }

  const plan = dbUser?.plan || "FREE";
  session.user.plan = plan;

  return (
    <PricingModalProvider currentPlan={plan}>
      <SidebarProvider>
        <div className="flex h-screen bg-background w-full overflow-hidden">
          <AppSidebar user={session.user} plan={plan} />
          <SidebarInset className="flex flex-col w-full max-w-full overflow-x-hidden h-screen max-h-screen bg-background">
            {/* Mobile Header (Bell + UserNav only on mobile) */}
            <header className="flex md:hidden items-center justify-between px-6 py-3.5 border-b bg-background/60 backdrop-blur-lg sticky top-0 z-40 border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 font-semibold text-sm shadow-sm">
                  M
                </div>
                <span className="font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                  CalMeet
                </span>
              </div>
              <div className="flex items-center gap-3">
                <NotificationBell />
                <UserNav user={session.user} />
              </div>
            </header>

            <main className="flex-1 px-4 md:px-8 py-4 md:py-6 pb-24 md:pb-6 overflow-y-auto">
              <div className="max-w-6xl mx-auto w-full">{children}</div>
            </main>
            <MobileNav plan={plan} />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </PricingModalProvider>
  );
}
