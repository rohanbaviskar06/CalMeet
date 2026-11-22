import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Generate a cryptographically secure HMAC token for a booking guest.
 * Derived from the booking ID, guest email, and application secret.
 */
export function generateBookingGuestToken(booking: {
  id: string;
  guestEmail: string;
}): string {
  const secret = process.env.NEXTAUTH_SECRET || "calmeet-secure-booking-token-fallback-key";
  const normalizedEmail = (booking.guestEmail || "").toLowerCase().trim();
  const payload = `${booking.id}:${normalizedEmail}`;
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

/**
 * Verify whether a provided guest token matches the booking's expected HMAC token.
 */
export function verifyBookingGuestToken(
  booking: { id: string; guestEmail: string },
  token?: string | null
): boolean {
  if (!token || typeof token !== "string") return false;
  
  const expectedToken = generateBookingGuestToken(booking);
  if (token.length !== expectedToken.length) return false;

  try {
    return crypto.timingSafeEqual(
      Buffer.from(token, "utf-8"),
      Buffer.from(expectedToken, "utf-8")
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
 * Verify access to view, cancel, or reschedule a booking.
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
    reason: "Access denied. A valid secure guest link or account authorization is required to manage this booking.",
  };
}
