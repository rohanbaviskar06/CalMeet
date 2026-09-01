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

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: {
      availability: true,
      teamMemberships: {
        include: {
          team: true
        }
      }
    }
  });

  const userTimezone = user?.timezone || "Asia/Kolkata";

  return (
    <div className="max-w-5xl mx-auto py-2">
      <AvailabilityForm 
        user={user}
        initialAvailability={user?.availability || []} 
        initialTimezone={userTimezone} 
      />
    </div>
  );
}
