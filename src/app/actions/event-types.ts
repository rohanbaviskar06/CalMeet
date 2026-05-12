"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleEventTypeStatus(id: string, currentStatus: boolean) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;
  await prisma.eventType.update({
    where: { 
      id,
      userId: userId // Security: ensure user owns the event type
    },
    data: { isActive: !currentStatus }
  });

  revalidatePath("/dashboard/event-types");
}

export async function deleteEventType(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;
  await prisma.eventType.delete({
    where: { 
      id,
      userId: userId 
    }
  });

  revalidatePath("/dashboard/event-types");
}

export async function createEventType(data: { title: string, description: string, duration: number, videoCallProvider?: string, slug?: string }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const userId = (session.user as any).id;

  let finalSlug = "";
  if (data.slug) {
    finalSlug = data.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  } else {
    const baseSlug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    finalSlug = `${baseSlug}-${Math.floor(Math.random() * 1000)}`;
  }

  // Ensure unique slug for this user
  const existing = await prisma.eventType.findFirst({
    where: { userId, slug: finalSlug }
  });

  if (existing) {
    finalSlug = `${finalSlug}-${Math.floor(Math.random() * 1000)}`;
  }

  // Use raw SQL to bypass client sync issues with videoCallProvider
  await prisma.$executeRaw`
    INSERT INTO EventType (id, userId, title, description, slug, duration, videoCallProvider, isActive, createdAt, updatedAt)
    VALUES (
      ${Math.random().toString(36).substring(2)}, 
      ${userId}, 
      ${data.title}, 
      ${data.description}, 
      ${finalSlug}, 
      ${data.duration}, 
      ${data.videoCallProvider || "GOOGLE_MEET"},
      1,
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    )
  `;

  revalidatePath("/dashboard/event-types");
  return { success: true };
}

export async function updateEventType(id: string, data: { title: string, description: string, duration: number, videoCallProvider?: string, slug?: string }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const userId = (session.user as any).id;

  let slugUpdate = "";
  if (data.slug) {
    let finalSlug = data.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // Ensure unique slug for this user
    const existing = await prisma.eventType.findFirst({
      where: { userId, slug: finalSlug, NOT: { id } }
    });

    if (existing) {
      finalSlug = `${finalSlug}-${Math.floor(Math.random() * 1000)}`;
    }
    
    // Use raw SQL to bypass client sync issues with videoCallProvider
    await prisma.$executeRaw`
      UPDATE EventType 
      SET 
        title = ${data.title}, 
        description = ${data.description}, 
        duration = ${data.duration}, 
        videoCallProvider = ${data.videoCallProvider},
        slug = ${finalSlug},
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = ${id} AND userId = ${userId}
    `;
  } else {
    // Use raw SQL to bypass client sync issues with videoCallProvider
    await prisma.$executeRaw`
      UPDATE EventType 
      SET 
        title = ${data.title}, 
        description = ${data.description}, 
        duration = ${data.duration}, 
        videoCallProvider = ${data.videoCallProvider},
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = ${id} AND userId = ${userId}
    `;
  }

  revalidatePath("/dashboard/event-types");
  return { success: true };
}
