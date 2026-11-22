/**
 * Admin authorization check utilities for CalMeet.
 */
export function isUserAdmin(email?: string | null): boolean {
  if (!email) return false;
  const adminEmailsEnv = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "rbgaming116@gmail.com";
  const adminEmails = adminEmailsEnv
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return adminEmails.includes(email.toLowerCase());
}
