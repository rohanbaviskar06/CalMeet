import crypto from "crypto";
import { prisma } from "./prisma";

export interface AuthenticatedApiUser {
  id: string;
  name: string | null;
  email: string | null;
  username: string | null;
  timezone: string | null;
  plan: string;
}

export async function authenticateApiKey(
  req: Request
): Promise<{ user: AuthenticatedApiUser } | { errorResponse: Response }> {
  const authHeader = req.headers.get("authorization") || req.headers.get("x-api-key");

  let apiKeyString = "";
  if (authHeader?.startsWith("Bearer ")) {
    apiKeyString = authHeader.slice(7).trim();
  } else if (authHeader) {
    apiKeyString = authHeader.trim();
  }

  if (!apiKeyString) {
    return {
      errorResponse: new Response(
        JSON.stringify({
          error: "Unauthorized",
          message: "Missing API Key. Include 'Authorization: Bearer <your_api_key>' in your request headers.",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      ),
    };
  }

  try {
    const hashedKey = crypto.createHash("sha256").update(apiKeyString).digest("hex");

    // 1. Check for SHA-256 hashed key in database
    let keyRecord = await (prisma as any).apiKey.findUnique({
      where: { key: hashedKey },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            timezone: true,
            plan: true,
          },
        },
      },
    });

    // 2. Safe migration path: Fall back to legacy plaintext key check
    if (!keyRecord) {
      keyRecord = await (prisma as any).apiKey.findUnique({
        where: { key: apiKeyString },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              username: true,
              timezone: true,
              plan: true,
            },
          },
        },
      });

      // Auto-migrate legacy key to secure hashed format
      if (keyRecord) {
        (prisma as any).apiKey
          .update({
            where: { id: keyRecord.id },
            data: { key: hashedKey, lastUsed: new Date() },
          })
          .catch((e: unknown) => console.error("Error migrating legacy API key to hash:", e));
      }
    } else {
      // Update lastUsed asynchronously
      (prisma as any).apiKey
        .update({
          where: { id: keyRecord.id },
          data: { lastUsed: new Date() },
        })
        .catch((e: unknown) => console.error("Error updating API key lastUsed:", e));
    }

    if (!keyRecord || !keyRecord.user) {
      return {
        errorResponse: new Response(
          JSON.stringify({
            error: "Unauthorized",
            message: "Invalid or revoked API Key.",
          }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          }
        ),
      };
    }

    return { user: keyRecord.user };
  } catch (err: any) {
    console.error("API authentication database error:", err);
    return {
      errorResponse: new Response(
        JSON.stringify({
          error: "Internal Server Error",
          message: "Failed to authenticate request.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      ),
    };
  }
}
