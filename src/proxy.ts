import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimiter, RATE_LIMIT_PRESETS } from "@/lib/rate-limit";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  // Rate limiting on sensitive endpoints
  if (pathname.startsWith("/api/auth/callback") || pathname.startsWith("/api/auth/signin")) {
    const limit = rateLimiter.check(`auth:${ip}`, RATE_LIMIT_PRESETS.AUTH.maxRequests, RATE_LIMIT_PRESETS.AUTH.windowMs);
    if (!limit.success) {
      return new NextResponse(
        JSON.stringify({ error: "Too many authentication attempts. Please try again later." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": limit.retryAfter.toString(),
            "X-RateLimit-Limit": limit.limit.toString(),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }
  } else if (pathname.startsWith("/api/v1/")) {
    const authHeader = request.headers.get("authorization") || "";
    const key = authHeader.replace(/^Bearer\s+/i, "") || ip;
    const limit = rateLimiter.check(`api:${key}`, RATE_LIMIT_PRESETS.API.maxRequests, RATE_LIMIT_PRESETS.API.windowMs);
    if (!limit.success) {
      return new NextResponse(
        JSON.stringify({ error: "Rate limit exceeded for API key." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": limit.retryAfter.toString(),
            "X-RateLimit-Limit": limit.limit.toString(),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }
  } else if (pathname.startsWith("/api/cron/")) {
    const limit = rateLimiter.check(`cron:${ip}`, RATE_LIMIT_PRESETS.CRON.maxRequests, RATE_LIMIT_PRESETS.CRON.windowMs);
    if (!limit.success) {
      return new NextResponse(
        JSON.stringify({ error: "Rate limit exceeded for cron endpoints." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": limit.retryAfter.toString(),
          },
        }
      );
    }
  }

  // Dashboard & Admin protection
  const token =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    if (!token && !pathname.startsWith("/admin/login")) {
      const loginUrl = new URL(pathname.startsWith("/admin") ? "/admin/login" : "/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/auth/:path*",
    "/api/v1/:path*",
    "/api/cron/:path*",
  ],
};
