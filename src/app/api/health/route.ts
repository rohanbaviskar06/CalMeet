import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "CONNECTED";
  let dbLatencyMs = 0;

  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbStart;
  } catch (error: any) {
    dbStatus = "DISCONNECTED";
    console.error("[HEALTHCHECK] Database ping failed:", error?.message);
  }

  const memory = process.memoryUsage();
  const uptime = process.uptime();
  const isHealthy = dbStatus === "CONNECTED";

  const responsePayload = {
    status: isHealthy ? "HEALTHY" : "DEGRADED",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(uptime),
    database: {
      status: dbStatus,
      latencyMs: dbLatencyMs,
    },
    system: {
      memoryRssMb: Math.round(memory.rss / (1024 * 1024)),
      memoryHeapUsedMb: Math.round(memory.heapUsed / (1024 * 1024)),
      nodeVersion: process.version,
    },
  };

  return NextResponse.json(responsePayload, {
    status: isHealthy ? 200 : 503,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
