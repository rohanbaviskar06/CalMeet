"use client";

import { SessionProvider } from "next-auth/react";

if (typeof window !== "undefined") {
  const originalRelease = Element.prototype.releasePointerCapture;
  Element.prototype.releasePointerCapture = function (pointerId) {
    try {
      originalRelease.call(this, pointerId);
    } catch (err) {
      // Safely ignore NotFoundError when releasePointerCapture is called without an active pointer ID
    }
  };
}

export function NextAuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
