import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

export default async function RedirectPage({
  params,
  searchParams
}: {
  params: Promise<{ username: string }>,
  searchParams: Promise<{ id?: string }>
}) {
  const { username } = await params;
  const { id } = await searchParams;

  if (!id) {
    notFound();
  }

  const eventType = await prisma.eventType.findUnique({
    where: { id }
  });

  if (!eventType) {
    notFound();
  }

  redirect(`/${username}/${eventType.slug}`);
}
