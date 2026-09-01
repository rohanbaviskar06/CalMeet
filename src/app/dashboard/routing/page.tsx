import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { RoutingClient } from "@/components/dashboard/routing-client";
import { ProGatedPage } from "@/components/dashboard/pro-gated-page";

export default async function RoutingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({ 
    where: { id: (session.user as any).id }, 
    select: { username: true, plan: true } 
  });

  const isPaidPlan = user?.plan && user.plan !== "FREE";

  if (!isPaidPlan) {
    return (
      <ProGatedPage 
        title="Routing Forms" 
        description="Qualify and routing incoming leads to the right team members or booking links based on form responses."
        features={[
          "Custom form builder for qualification questions",
          "Advanced round-robin rep distribution",
          "Ownership-rules lookup for CRM syncing",
          "Redirect logic based on multi-select answers"
        ]}
      />
    );
  }

  const forms = await prisma.routingForm.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: "desc" }
  });

  const eventTypes = await prisma.eventType.findMany({
    where: { userId: (session.user as any).id },
    select: { id: true, title: true, duration: true, slug: true }
  });

  const username = user?.username || session.user.email?.split("@")[0] || (session.user as any).id;
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const serializedForms = forms.map(f => ({
    ...f,
    questions: JSON.parse(f.questions || "[]"),
    routes: JSON.parse(f.routes || "[]"),
    link: `/${username}/${f.slug}`
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <RoutingClient 
        initialForms={serializedForms} 
        eventTypes={eventTypes} 
        username={username}
        baseUrl={`${baseUrl}/${username}`} 
      />
    </div>
  );
}

