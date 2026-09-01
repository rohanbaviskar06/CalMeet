import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { WorkflowsClient } from "@/components/dashboard/workflows-client";
import { prisma } from "@/lib/prisma";
import { ProGatedPage } from "@/components/dashboard/pro-gated-page";

export default async function WorkflowsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: { plan: true }
  });

  const isPaidPlan = user?.plan && user.plan !== "FREE";

  if (!isPaidPlan) {
    return (
      <ProGatedPage 
        title="Workflows" 
        description="Automate your entire scheduling process. Send SMS notifications, pre-meeting emails, and custom follow-up notifications."
        features={[
          "Auto-reminder emails and SMS messages to reduce no-shows",
          "Post-meeting feedback request triggers",
          "Custom WhatsApp and Slack integration hooks",
          "Rule-based scheduling escalation paths"
        ]}
      />
    );
  }

  const workflows = await prisma.workflow.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-6xl mx-auto">
      <WorkflowsClient initialWorkflows={workflows} />
    </div>
  );
}
