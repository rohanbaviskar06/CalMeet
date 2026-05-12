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
        // Zoom expects the local time if a timezone is provided
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
    console.error("Zoom meeting creation error:", error.response?.data || error.message);
    
    // If token expired, we should ideally refresh it here using account.refresh_token
    // and the code snippet provided by the user.
    
    return null;
  }
}
