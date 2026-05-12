import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { WorkflowsClient } from "@/components/dashboard/workflows-client";
import { prisma } from "@/lib/prisma";

export default async function WorkflowsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const workflows = await prisma.$queryRaw`
    SELECT * FROM "Workflow" 
    WHERE "userId" = ${(session.user as any).id} 
    ORDER BY "createdAt" DESC
  ` as any[];

  return (
    <div className="max-w-6xl mx-auto">
      <WorkflowsClient initialWorkflows={workflows} />
    </div>
  );
}
