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

  const id = Math.random().toString(36).substring(2, 11);
  const now = new Date().toISOString();

  await prisma.$executeRaw`
    INSERT INTO "Workflow" ("id", "userId", "name", "trigger", "action", "isActive", "isPremium", "createdAt", "updatedAt")
    VALUES (${id}, ${userId}, ${data.name}, ${data.trigger}, ${data.action}, 1, ${data.isPremium ? 1 : 0}, ${now}, ${now})
  `;

  revalidatePath("/dashboard/workflows");
  return { id, ...data, isActive: true, createdAt: now, updatedAt: now };
}

export async function toggleWorkflowStatus(id: string, currentStatus: boolean) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  await prisma.$executeRaw`
    UPDATE "Workflow" 
    SET "isActive" = ${currentStatus ? 0 : 1}, "updatedAt" = ${new Date().toISOString()}
    WHERE "id" = ${id} AND "userId" = ${userId}
  `;

  revalidatePath("/dashboard/workflows");
}

export async function deleteWorkflow(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  await prisma.$executeRaw`
    DELETE FROM "Workflow" 
    WHERE "id" = ${id} AND "userId" = ${userId}
  `;

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

  await prisma.$executeRaw`
    UPDATE "Workflow" 
    SET "name" = ${data.name}, "trigger" = ${data.trigger}, "action" = ${data.action}, "isPremium" = ${data.isPremium ? 1 : 0}, "updatedAt" = ${new Date().toISOString()}
    WHERE "id" = ${id} AND "userId" = ${userId}
  `;

  revalidatePath("/dashboard/workflows");
}

