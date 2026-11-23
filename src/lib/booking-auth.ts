import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Resolves the signing secret for guest tokens.
 * Enforces explicit secret configuration in production.
 */
function getSigningSecret(): string {
  const secret = process.env.BOOKING_SIGNING_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "BOOKING_SIGNING_SECRET or NEXTAUTH_SECRET must be configured in production environments."
      );
    }
    return "calmeet-secure-booking-token-fallback-key";
  }
  return secret;
}

/**
 * Generate a cryptographically secure HMAC token for a booking guest.
 * Contains booking ID, normalized guest email, and expiration timestamp.
 */
export function generateBookingGuestToken(
  booking: {
    id: string;
    guestEmail: string;
  },
  expiresInDays = 30
): string {
  const secret = getSigningSecret();
  const normalizedEmail = (booking.guestEmail || "").toLowerCase().trim();
  const exp = Math.floor(Date.now() / 1000) + expiresInDays * 24 * 60 * 60;
  const payload = `${booking.id}:${normalizedEmail}:${exp}`;
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${signature}.${exp}`;
}

/**
 * Verify whether a provided guest token matches the booking's expected HMAC token.
 * Validates cryptographic signature, expiry timestamp, and revocation state.
 */
export function verifyBookingGuestToken(
  booking: {
    id: string;
    guestEmail: string;
    status?: string;
    notes?: string | null;
  },
  token?: string | null
): boolean {
  if (!token || typeof token !== "string") return false;

  // Revocation check
  if (
    booking.notes?.includes("[TOKEN_REVOKED]") ||
    booking.notes?.includes("[BOOKING_REVOKED]")
  ) {
    return false;
  }

  const secret = getSigningSecret();
  const normalizedEmail = (booking.guestEmail || "").toLowerCase().trim();

  // Modern format: signature.exp
  if (token.includes(".")) {
    const [signature, expStr] = token.split(".");
    const exp = parseInt(expStr, 10);
    if (isNaN(exp)) return false;

    // Check expiration
    if (Math.floor(Date.now() / 1000) > exp) {
      return false;
    }

    const payload = `${booking.id}:${normalizedEmail}:${exp}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    if (signature.length !== expectedSignature.length) return false;

    try {
      return crypto.timingSafeEqual(
        Buffer.from(signature, "utf-8"),
        Buffer.from(expectedSignature, "utf-8")
      );
    } catch {
      return false;
    }
  }

  // Legacy format without exp (backward compatibility)
  const legacyPayload = `${booking.id}:${normalizedEmail}`;
  const legacyExpected = crypto
    .createHmac("sha256", secret)
    .update(legacyPayload)
    .digest("hex");

  if (token.length !== legacyExpected.length) return false;

  try {
    return crypto.timingSafeEqual(
      Buffer.from(token, "utf-8"),
      Buffer.from(legacyExpected, "utf-8")
    );
  } catch {
    return false;
  }
}

export interface BookingAccessResult {
  authorized: boolean;
  role?: "HOST" | "GUEST";
  reason?: string;
}

/**
 * Verify access to view, cancel, reschedule, or enter video room for a booking.
 * Allowed if:
 * 1. Logged in user is the host (userId === booking.userId or booking.eventType.userId).
 * 2. Logged in user has matching guest email.
 * 3. A valid cryptographically signed guest management token is provided in the request.
 */
export async function verifyBookingAccess(
  booking: {
    id: string;
    guestEmail: string;
    userId?: string | null;
    eventType?: { userId?: string | null } | null;
    status?: string;
    notes?: string | null;
  },
  token?: string | null
): Promise<BookingAccessResult> {
  // 1. Account authorization via session
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;
    if (user) {
      const hostId = booking.eventType?.userId || booking.userId;
      if (user.id && hostId && user.id === hostId) {
        return { authorized: true, role: "HOST" };
      }

      const userEmail = (user.email || "").toLowerCase().trim();
      const guestEmail = (booking.guestEmail || "").toLowerCase().trim();
      if (userEmail && guestEmail && userEmail === guestEmail) {
        return { authorized: true, role: "GUEST" };
      }
    }
  } catch (sessionErr) {
    console.error("Session check error in verifyBookingAccess:", sessionErr);
  }

  // 2. Guest token authorization
  if (token && verifyBookingGuestToken(booking, token)) {
    return { authorized: true, role: "GUEST" };
  }

  return {
    authorized: false,
    reason:
      "Access denied. A valid secure guest link or account authorization is required to access this booking.",
  };
}
