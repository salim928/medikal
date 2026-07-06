import { Resend } from "resend";
import twilio from "twilio";

const resend = new Resend(process.env.RESEND_API_KEY);
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  try {
    await resend.emails.send({
      from: "noreply@mediconnect.health",
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
}

export async function sendSMS(
  phoneNumber: string,
  message: string
): Promise<void> {
  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: phoneNumber,
    });
  } catch (error) {
    console.error("SMS send error:", error);
    throw error;
  }
}

export async function sendAppointmentReminder(
  email: string,
  phone: string,
  providerName: string,
  appointmentTime: Date
): Promise<void> {
  const formattedTime = appointmentTime.toLocaleString();

  const emailHtml = `
    <h2>Appointment Reminder</h2>
    <p>Your appointment with Dr. ${providerName} is scheduled for:</p>
    <p><strong>${formattedTime}</strong></p>
    <p><a href="${process.env.NEXT_PUBLIC_DOMAIN}/appointments">View Details</a></p>
  `;

  const smsMessage = `Reminder: Your appointment with Dr. ${providerName} is at ${formattedTime}. ${process.env.NEXT_PUBLIC_DOMAIN}`;

  await Promise.all([
    sendEmail(email, "Appointment Reminder", emailHtml),
    sendSMS(phone, smsMessage),
  ]);
}