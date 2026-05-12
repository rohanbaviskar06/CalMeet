import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { RoutingClient } from "@/components/dashboard/routing-client";

export default async function RoutingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const forms = await prisma.routingForm.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: "desc" }
  });

  const eventTypes = await prisma.eventType.findMany({
    where: { userId: (session.user as any).id },
    select: { id: true, title: true }
  });

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const user = await prisma.user.findUnique({ 
    where: { id: (session.user as any).id }, 
    select: { username: true } 
  });

  const serializedForms = forms.map(f => ({
    ...f,
    questions: JSON.parse(f.questions || "[]"),
    routes: JSON.parse(f.routes || "[]"),
    link: `${baseUrl}/${user?.username || (session.user as any).id}/${f.slug}`
  }));

  return (
    <div className="max-w-6xl mx-auto">
      <RoutingClient initialForms={serializedForms} eventTypes={eventTypes} baseUrl={`${baseUrl}/${user?.username || (session.user as any).id}`} />
    </div>
  );
}
