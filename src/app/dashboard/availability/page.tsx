import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AvailabilityForm } from "@/components/dashboard/availability-client";

export default async function AvailabilityPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  const [user, configRecord] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        availability: true,
        teamMemberships: {
          include: {
            team: true,
          },
        },
      },
    }),
    prisma.integration.findFirst({
      where: { userId, type: "availability_config" },
    }),
  ]);

  const userTimezone = user?.timezone || "Asia/Kolkata";
  const config = configRecord?.credentials && typeof configRecord.credentials === "object"
    ? (configRecord.credentials as any)
    : null;

  return (
    <div className="max-w-5xl mx-auto py-2">
      <AvailabilityForm 
        user={user}
        initialAvailability={user?.availability || []} 
        initialTimezone={userTimezone} 
        initialOverrides={config?.overrides || []}
        initialSchedules={config?.schedules || []}
        initialActiveScheduleId={config?.activeScheduleId || "default"}
      />
    </div>
  );
}
