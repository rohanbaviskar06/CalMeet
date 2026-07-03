import { Resend } from "resend";
import nodemailer from "nodemailer";

export const resend = new Resend(process.env.RESEND_API_KEY || "temp_key");

// Configure SMTP transporter if credentials exist
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASSWORD;

const transporter = smtpUser && smtpPass 
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })
  : null;

/**
 * Universal email sender utility.
 * Automatically falls back to Resend if SMTP is not configured.
 */
export async function sendEmail({
  to,
  subject,
  html,
  fromName = "CalMeet",
  fromEmail = "onboarding@resend.dev",
}: {
  to: string;
  subject: string;
  html: string;
  fromName?: string;
  fromEmail?: string;
}) {
  if (transporter && smtpUser) {
    try {
      console.log(`Sending email to ${to} via Gmail SMTP...`);
      await transporter.sendMail({
        from: `"${fromName}" <${smtpUser}>`,
        to,
        subject,
        html,
      });
      console.log("Email successfully sent via Gmail SMTP.");
      return { success: true };
    } catch (error) {
      console.error("Gmail SMTP sending failed:", error);
      throw error;
    }
  }

  // Fallback to Resend
  if (!process.env.RESEND_API_KEY) {
    console.warn("Skipping email delivery. Neither Resend nor SMTP credentials are provided.");
    return { error: "No email service configured." };
  }

  try {
    console.log(`Sending email to ${to} via Resend...`);
    await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to,
      subject,
      html,
    });
    console.log("Email successfully sent via Resend.");
    return { success: true };
  } catch (error) {
    console.error("Resend sending failed:", error);
    throw error;
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 12px;">
      <h2 style="color: #0F172A; margin-bottom: 16px;">Welcome to CalMeet, ${name}!</h2>
      <p style="color: #475569; font-size: 16px; line-height: 24px;">
        We're thrilled to have you join CalMeet. Automate your meetings, sync your calendars, and reclaim your time.
      </p>
      <p style="color: #475569; font-size: 16px; line-height: 24px;">
        Here are your next steps to get started:
      </p>
      <ul style="color: #475569; font-size: 14px; line-height: 20px; margin-left: 20px;">
        <li style="margin-bottom: 8px;"><strong>Connect your calendar</strong> in the Integrations tab to sync meetings.</li>
        <li style="margin-bottom: 8px;"><strong>Create Event Types</strong> to define your availability.</li>
        <li style="margin-bottom: 8px;"><strong>Share your public booking link</strong> with your guests.</li>
      </ul>
      <a href="${baseUrl}/dashboard" style="display: inline-block; background-color: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 15px; text-align: center;">Go to Dashboard</a>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
      <p style="color: #94a3b8; font-size: 12px;">If you have any questions, feel free to reply to this email.</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "Welcome to CalMeet! 🗓️",
    html,
  });
}
