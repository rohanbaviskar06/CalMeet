import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = new PrismaClient({
  log: ["query"],
});
// Re-saving to trigger reload with new client location
