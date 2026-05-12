import { prisma } from "@/lib/prisma"; // Updated client
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AvailabilityForm } from "@/components/dashboard/availability-client";

export default async function AvailabilityPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const timezoneResult = await prisma.$queryRaw<any[]>`SELECT timezone FROM User WHERE id = ${(session.user as any).id}`;
  const userTimezone = timezoneResult[0]?.timezone || "UTC";

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: {
      availability: true
    }
  });

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Availability</h1>
        <p className="text-muted-foreground">Set your default working hours and days of the week.</p>
      </div>

      <AvailabilityForm 
        initialAvailability={user?.availability || []} 
        initialTimezone={userTimezone} 
      />
    </div>
  );
}
