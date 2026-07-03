"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createWorkflow(data: {
  name: string;
  trigger: string;
  action: string;
  isPremium: boolean;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  const workflow = await prisma.workflow.create({
    data: {
      userId,
      name: data.name,
      trigger: data.trigger,
      action: data.action,
      isActive: true,
      isPremium: data.isPremium,
    }
  });

  revalidatePath("/dashboard/workflows");
  return workflow;
}

export async function toggleWorkflowStatus(id: string, currentStatus: boolean) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  await prisma.workflow.update({
    where: { id, userId },
    data: { isActive: !currentStatus }
  });

  revalidatePath("/dashboard/workflows");
}

export async function deleteWorkflow(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  await prisma.workflow.delete({
    where: { id, userId }
  });

  revalidatePath("/dashboard/workflows");
}

export async function updateWorkflow(id: string, data: {
  name: string;
  trigger: string;
  action: string;
  isPremium: boolean;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  await prisma.workflow.update({
    where: { id, userId },
    data: {
      name: data.name,
      trigger: data.trigger,
      action: data.action,
      isPremium: data.isPremium,
    }
  });

  revalidatePath("/dashboard/workflows");
}

