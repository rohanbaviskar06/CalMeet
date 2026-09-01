/**
 * CalMeet Professional Email Templates
 * Generates responsive, high-converting HTML emails for Guests (without CalMeet accounts) and Hosts.
 */

interface BookingEmailData {
  guestName: string;
  guestEmail: string;
  hostName: string;
  hostEmail: string;
  eventTitle: string;
  duration: number;
  startTime: Date;
  endTime: Date;
  meetLink?: string | null;
  notes?: string | null;
  timezone?: string;
  bookingId?: string;
}

/**
 * Format ISO dates for Google Calendar and Outlook deep links
 */
function formatGoogleCalendarUrl({
  title,
  startTime,
  endTime,
  description,
  location,
}: {
  title: string;
  startTime: Date;
  endTime: Date;
  description: string;
  location: string;
}) {
  const formatTime = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, "");
  const start = formatTime(startTime);
  const end = formatTime(endTime);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
}

function formatOutlookCalendarUrl({
  title,
  startTime,
  endTime,
  description,
  location,
}: {
  title: string;
  startTime: Date;
  endTime: Date;
  description: string;
  location: string;
}) {
  return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&startdt=${startTime.toISOString()}&enddt=${endTime.toISOString()}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
}

/**
 * Booking Confirmation Email for Guests (Even if they don't have a CalMeet account)
 */
export function generateGuestConfirmationEmail(data: BookingEmailData) {
  const {
    guestName,
    hostName,
    hostEmail,
    eventTitle,
    duration,
    startTime,
    endTime,
    meetLink,
    notes,
    timezone = "UTC",
  } = data;

  const formattedDate = startTime.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
    timeZone: timezone,
  });

  const locationText = meetLink || "Video Meeting";
  const googleCalUrl = formatGoogleCalendarUrl({
    title: `${eventTitle}: ${guestName} & ${hostName}`,
    startTime,
    endTime,
    description: `Meeting with ${hostName} (${hostEmail})\n\nVideo link: ${meetLink || "Check invitation"}`,
    location: locationText,
  });

  const outlookCalUrl = formatOutlookCalendarUrl({
    title: `${eventTitle}: ${guestName} & ${hostName}`,
    startTime,
    endTime,
    description: `Meeting with ${hostName} (${hostEmail})\n\nVideo link: ${meetLink || "Check invitation"}`,
    location: locationText,
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meeting Confirmed</title>
</head>
<body style="margin:0;padding:24px 12px;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:540px;margin:0 auto;background-color:#ffffff;border-radius:16px;border:1px solid #e4e4e7;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.04);">
    <!-- Header -->
    <div style="background-color:#18181b;padding:24px;color:#ffffff;text-align:center;">
      <div style="font-size:24px;margin-bottom:4px;">📅</div>
      <h1 style="margin:0;font-size:20px;font-weight:700;color:#ffffff;">Meeting Confirmed!</h1>
      <p style="margin:6px 0 0 0;font-size:13px;color:#a1a1aa;">You're scheduled with ${hostName}</p>
    </div>

    <!-- Body -->
    <div style="padding:24px;">
      <p style="margin:0 0 16px 0;font-size:15px;color:#27272a;line-height:1.5;">
        Hi <strong>${guestName}</strong>,<br>
        Your meeting <strong>"${eventTitle}"</strong> has been confirmed. Below are your meeting details:
      </p>

      <!-- Event Details Card -->
      <div style="background-color:#fafafa;border:1px solid #f4f4f5;border-radius:12px;padding:16px;margin-bottom:20px;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="font-size:13px;color:#3f3f46;">
          <tr>
            <td style="padding:6px 0;color:#71717a;width:100px;">Event:</td>
            <td style="padding:6px 0;font-weight:600;color:#09090b;">${eventTitle} (${duration} mins)</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#71717a;">Host:</td>
            <td style="padding:6px 0;font-weight:600;color:#09090b;">${hostName} (<a href="mailto:${hostEmail}" style="color:#2563eb;text-decoration:none;">${hostEmail}</a>)</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#71717a;">When:</td>
            <td style="padding:6px 0;font-weight:600;color:#09090b;">${formattedDate}</td>
          </tr>
          ${meetLink ? `
          <tr>
            <td style="padding:6px 0;color:#71717a;">Video Call:</td>
            <td style="padding:6px 0;"><a href="${meetLink}" style="color:#2563eb;font-weight:600;text-decoration:underline;">${meetLink}</a></td>
          </tr>
          ` : ""}
          ${notes ? `
          <tr>
            <td style="padding:6px 0;color:#71717a;vertical-align:top;">Notes:</td>
            <td style="padding:6px 0;color:#52525b;">${notes}</td>
          </tr>
          ` : ""}
        </table>
      </div>

      <!-- Join Button if video call -->
      ${meetLink ? `
      <div style="text-align:center;margin-bottom:24px;">
        <a href="${meetLink}" target="_blank" style="display:inline-block;background-color:#18181b;color:#ffffff;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
          📹 Join Video Call
        </a>
      </div>
      ` : ""}

      <!-- Add to Calendar Section -->
      <div style="border-top:1px solid #f4f4f5;padding-top:16px;text-align:center;">
        <div style="font-size:12px;font-weight:600;color:#71717a;margin-bottom:10px;">ADD TO YOUR CALENDAR:</div>
        <div style="display:inline-block;">
          <a href="${googleCalUrl}" target="_blank" style="display:inline-block;margin:0 4px;padding:6px 12px;border:1px solid #e4e4e7;border-radius:6px;font-size:12px;font-weight:600;color:#27272a;text-decoration:none;background:#ffffff;">+ Google Calendar</a>
          <a href="${outlookCalUrl}" target="_blank" style="display:inline-block;margin:0 4px;padding:6px 12px;border:1px solid #e4e4e7;border-radius:6px;font-size:12px;font-weight:600;color:#27272a;text-decoration:none;background:#ffffff;">+ Outlook</a>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color:#fafafa;padding:16px;text-align:center;border-top:1px solid #f4f4f5;font-size:11px;color:#a1a1aa;">
      Powered by <strong>CalMeet</strong> · Seamless Scheduling for Everyone
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Pre-Meeting Reminder Email (e.g. 24 hours or 1 hour before meeting)
 */
export function generateMeetingReminderEmail(data: BookingEmailData & { reminderNotice?: string }) {
  const {
    guestName,
    hostName,
    hostEmail,
    eventTitle,
    startTime,
    meetLink,
    notes,
    timezone = "UTC",
    reminderNotice = "Upcoming Meeting Reminder",
  } = data;

  const formattedDate = startTime.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
    timeZone: timezone,
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meeting Reminder</title>
</head>
<body style="margin:0;padding:24px 12px;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:540px;margin:0 auto;background-color:#ffffff;border-radius:16px;border:1px solid #e4e4e7;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.04);">
    <!-- Header -->
    <div style="background-color:#18181b;padding:20px;color:#ffffff;text-align:center;">
      <div style="font-size:22px;margin-bottom:4px;">⏰</div>
      <h1 style="margin:0;font-size:18px;font-weight:700;color:#ffffff;">${reminderNotice}</h1>
      <p style="margin:4px 0 0 0;font-size:12px;color:#a1a1aa;">Starting soon with ${hostName}</p>
    </div>

    <!-- Body -->
    <div style="padding:24px;">
      <p style="margin:0 0 16px 0;font-size:14px;color:#27272a;line-height:1.5;">
        Hi <strong>${guestName}</strong>,<br>
        This is a friendly reminder that your upcoming meeting <strong>"${eventTitle}"</strong> is coming up soon.
      </p>

      <!-- Details Box -->
      <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:20px;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="font-size:13px;color:#334155;">
          <tr>
            <td style="padding:4px 0;color:#64748b;width:90px;">Time:</td>
            <td style="padding:4px 0;font-weight:700;color:#0f172a;">${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#64748b;">Host:</td>
            <td style="padding:4px 0;font-weight:600;color:#0f172a;">${hostName} (${hostEmail})</td>
          </tr>
          ${meetLink ? `
          <tr>
            <td style="padding:4px 0;color:#64748b;">Call Link:</td>
            <td style="padding:4px 0;"><a href="${meetLink}" style="color:#2563eb;font-weight:600;text-decoration:underline;">${meetLink}</a></td>
          </tr>
          ` : ""}
        </table>
      </div>

      ${meetLink ? `
      <div style="text-align:center;margin-bottom:16px;">
        <a href="${meetLink}" target="_blank" style="display:inline-block;background-color:#18181b;color:#ffffff;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;">
          📹 Join Meeting Room
        </a>
      </div>
      ` : ""}

      <p style="font-size:12px;color:#71717a;margin:16px 0 0 0;text-align:center;">
        Need to change your time? Reply directly to this email to reach ${hostName}.
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color:#fafafa;padding:14px;text-align:center;border-top:1px solid #f4f4f5;font-size:11px;color:#a1a1aa;">
      CalMeet Automated Reminders
    </div>
  </div>
</body>
</html>
`;
}
