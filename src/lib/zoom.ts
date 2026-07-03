import axios from "axios";
import { prisma } from "./prisma";

export async function createZoomMeeting(userId: string, meetingDetails: {
  summary: string;
  startTime: Date;
  duration: number; // in minutes
}) {
  try {
    const account = await prisma.account.findFirst({
      where: {
        userId,
        provider: "zoom",
      },
    });

    if (!account || !account.access_token) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { timezone: true }
    });

    const response = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic: meetingDetails.summary,
        type: 2, // Scheduled meeting
        start_time: meetingDetails.startTime.toISOString().slice(0, 19),
        duration: meetingDetails.duration,
        timezone: user?.timezone || "UTC",
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: true,
          mute_upon_entry: true,
          waiting_room: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${account.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      id: response.data.id,
      joinUrl: response.data.join_url,
      password: response.data.password,
    };
  } catch (error: any) {
    // If token expired (401), try to refresh it
    if (error.response?.status === 401) {
      const account = await prisma.account.findFirst({
        where: { userId, provider: "zoom" },
      });

      if (account?.refresh_token) {
        try {
          const authHeader = Buffer.from(
            `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
          ).toString("base64");

          const refreshResponse = await axios.post(
            "https://zoom.us/oauth/token",
            new URLSearchParams({
              grant_type: "refresh_token",
              refresh_token: account.refresh_token,
            }),
            {
              headers: {
                Authorization: `Basic ${authHeader}`,
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          const { access_token, refresh_token, expires_in } = refreshResponse.data;

          // Update the account with the new tokens
          await prisma.account.update({
            where: { id: account.id },
            data: {
              access_token,
              refresh_token: refresh_token || account.refresh_token,
              expires_at: Math.floor(Date.now() / 1000) + expires_in,
            },
          });

          // Retry the meeting creation with the new access token
          return createZoomMeeting(userId, meetingDetails);
        } catch (refreshError) {
          console.error("Zoom token refresh failed:", refreshError);
        }
      }
    }

    console.error("Zoom meeting creation error:", error.response?.data || error.message);
    return null;
  }
}
