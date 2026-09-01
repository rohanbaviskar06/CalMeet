"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createRoutingForm(data: { name: string, slug: string, questions: any, routes: any }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const userId = (session.user as any).id;

  const baseSlug = data.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  let slug = baseSlug;

  const existing = await prisma.routingForm.findFirst({
    where: { userId, slug }
  });

  if (existing) {
    slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
  }

  await prisma.routingForm.create({
    data: {
      userId,
      name: data.name,
      slug: slug,
      questions: JSON.stringify(data.questions),
      routes: JSON.stringify(data.routes),
    }
  });

  revalidatePath("/dashboard/routing");
  return { success: true };
}

export async function updateRoutingForm(id: string, data: { name: string, slug: string, questions: any, routes: any }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const userId = (session.user as any).id;

  const baseSlug = data.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  let slug = baseSlug;

  const existing = await prisma.routingForm.findFirst({
    where: { userId, slug, NOT: { id } }
  });

  if (existing) {
    slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
  }

  await prisma.routingForm.update({
    where: { id, userId },
    data: {
      name: data.name,
      slug: slug,
      questions: JSON.stringify(data.questions),
      routes: JSON.stringify(data.routes),
    }
  });

  revalidatePath("/dashboard/routing");
  return { success: true };
}

export async function toggleRoutingFormStatus(id: string, isActive: boolean) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const userId = (session.user as any).id;

  await prisma.routingForm.update({
    where: { id, userId },
    data: { isActive: !isActive }
  });

  revalidatePath("/dashboard/routing");
  return { success: true };
}

export async function deleteRoutingForm(id: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const userId = (session.user as any).id;

  await prisma.routingForm.delete({
    where: { id, userId }
  });

  revalidatePath("/dashboard/routing");
  return { success: true };
}

export async function duplicateRoutingForm(id: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const userId = (session.user as any).id;

  const original = await prisma.routingForm.findUnique({
    where: { id, userId }
  });

  if (!original) {
    throw new Error("Routing form not found");
  }

  const newSlug = `${original.slug}-copy-${Math.floor(Math.random() * 1000)}`;

  const created = await prisma.routingForm.create({
    data: {
      userId,
      name: `${original.name} (Copy)`,
      slug: newSlug,
      questions: original.questions,
      routes: original.routes,
      isActive: true,
    }
  });

  revalidatePath("/dashboard/routing");
  return { success: true, form: created };
}

