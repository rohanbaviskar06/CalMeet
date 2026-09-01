import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { EventTypeList } from "@/components/dashboard/event-type-client";

export const metadata = {
  title: "Event Types | CalMeet",
  description: "Configure different events for people to book on your calendar",
};

export default async function EventTypesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  let user = null;
  try {
    user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      include: {
        eventTypes: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  } catch (error) {
    console.error("EventTypesPage error:", error);
  }

  if (!user) {
    user = {
      username: session.user.email?.split("@")[0] || "user",
      eventTypes: [],
    } as any;
  }

  return (
    <div className="max-w-5xl mx-auto py-2">
      <EventTypeList 
        initialEventTypes={user.eventTypes || []} 
        username={user.username || session.user.email?.split("@")[0] || "user"} 
      />
    </div>
  );
}
