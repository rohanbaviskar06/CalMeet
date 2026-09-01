import { google } from "googleapis";
import { prisma } from "./prisma";

export function getGoogleOAuthClient(accountId?: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/callback/google`
  );

  if (accountId) {
    oauth2Client.on("tokens", async (tokens) => {
      try {
        await prisma.account.update({
          where: { id: accountId },
          data: {
            access_token: tokens.access_token,
            ...(tokens.refresh_token ? { refresh_token: tokens.refresh_token } : {}),
            ...(tokens.expiry_date ? { expires_at: Math.floor(tokens.expiry_date / 1000) } : {}),
          },
        });
      } catch (err) {
        console.error("Failed to update refreshed Google OAuth tokens:", err);
      }
    });
  }

  return oauth2Client;
}

export async function getGoogleCalendarClient(
  accessToken: string,
  refreshToken?: string,
  accountId?: string
) {
  const oauth2Client = getGoogleOAuthClient(accountId);
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  return google.calendar({ version: "v3", auth: oauth2Client });
}
