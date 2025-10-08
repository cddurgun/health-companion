import { Resend } from 'resend'

// Initialize Resend with API key, fallback to empty string for build time
const resend = new Resend(process.env.RESEND_API_KEY || '')

interface ZoomMeeting {
  meetingId: string
  password: string
  joinUrl: string
}

// Generate a Zoom-style meeting link (mock for now - in production use Zoom API)
export function generateZoomLink(appointmentDate: Date, appointmentTime: string): ZoomMeeting {
  // Generate a random meeting ID
  const meetingId = Math.floor(100000000 + Math.random() * 900000000).toString()

  // Generate a random password
  const password = Math.random().toString(36).substring(2, 8).toUpperCase()

  // Create join URL
  const joinUrl = `https://zoom.us/j/${meetingId}?pwd=${password}`

  return {
    meetingId,
    password,
    joinUrl,
  }
}

interface SendAppointmentEmailParams {
  patientName: string
  patientEmail: string
  doctorName: string
  appointmentDate: Date
  appointmentTime: string
  reason: string
  zoomMeeting: ZoomMeeting
}

export async function sendAppointmentEmail({
  patientName,
  patientEmail,
  doctorName,
  appointmentDate,
  appointmentTime,
  reason,
  zoomMeeting,
}: SendAppointmentEmailParams) {
  const formattedDate = appointmentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">🏥 Health Companion</h1>
    <p style="margin: 10px 0 0 0; font-size: 16px;">Appointment Confirmation</p>
  </div>

  <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 18px; color: #2d3748; margin-bottom: 20px;">Hello <strong>${patientName}</strong>,</p>

    <p style="font-size: 16px; color: #4a5568;">Your telehealth appointment has been confirmed! 🎉</p>

    <div style="background: white; border-left: 4px solid #4299e1; padding: 20px; margin: 20px 0; border-radius: 5px;">
      <h2 style="margin-top: 0; color: #2d3748; font-size: 20px;">📅 Appointment Details</h2>
      <table style="width: 100%; font-size: 15px;">
        <tr>
          <td style="padding: 8px 0; color: #718096;"><strong>Doctor:</strong></td>
          <td style="padding: 8px 0; color: #2d3748;">${doctorName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #718096;"><strong>Date:</strong></td>
          <td style="padding: 8px 0; color: #2d3748;">${formattedDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #718096;"><strong>Time:</strong></td>
          <td style="padding: 8px 0; color: #2d3748;">${appointmentTime}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #718096;"><strong>Reason:</strong></td>
          <td style="padding: 8px 0; color: #2d3748;">${reason}</td>
        </tr>
      </table>
    </div>

    <div style="background: #e6fffa; border: 2px solid #38b2ac; padding: 20px; margin: 20px 0; border-radius: 5px; text-align: center;">
      <h2 style="margin-top: 0; color: #234e52; font-size: 20px;">🎥 Zoom Meeting Details</h2>

      <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p style="margin: 5px 0; font-size: 14px; color: #718096;">Meeting ID</p>
        <p style="margin: 5px 0; font-size: 24px; font-weight: bold; color: #2d3748; letter-spacing: 2px;">${zoomMeeting.meetingId}</p>
      </div>

      <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p style="margin: 5px 0; font-size: 14px; color: #718096;">Password</p>
        <p style="margin: 5px 0; font-size: 20px; font-weight: bold; color: #2d3748; letter-spacing: 3px;">${zoomMeeting.password}</p>
      </div>

      <a href="${zoomMeeting.joinUrl}"
         style="display: inline-block; background: #38b2ac; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; margin-top: 10px;">
        🔗 Join Zoom Meeting
      </a>
    </div>

    <div style="background: #fff5f5; border-left: 4px solid #fc8181; padding: 15px; margin: 20px 0; border-radius: 5px;">
      <p style="margin: 0; color: #742a2a; font-size: 14px;">
        <strong>⏰ Important:</strong> Please join the meeting 5 minutes early to test your audio and video.
      </p>
    </div>

    <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border: 1px solid #e2e8f0;">
      <h3 style="margin-top: 0; color: #2d3748; font-size: 16px;">📋 Before Your Appointment:</h3>
      <ul style="color: #4a5568; font-size: 14px; line-height: 1.8; padding-left: 20px;">
        <li>Test your internet connection</li>
        <li>Ensure your camera and microphone work</li>
        <li>Prepare any questions or concerns to discuss</li>
        <li>Have your medication list ready if applicable</li>
      </ul>
    </div>

    <p style="font-size: 14px; color: #718096; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
      If you need to reschedule or cancel, please log in to your Health Companion dashboard.
    </p>

    <p style="font-size: 14px; color: #718096;">
      Best regards,<br>
      <strong>Health Companion Team</strong>
    </p>
  </div>

  <div style="text-align: center; padding: 20px; color: #a0aec0; font-size: 12px;">
    <p>This is an automated message from Health Companion</p>
    <p>© 2025 Health Companion. All rights reserved.</p>
  </div>
</body>
</html>
  `

  const emailText = `
Health Companion - Appointment Confirmation

Hello ${patientName},

Your telehealth appointment has been confirmed!

Appointment Details:
- Doctor: ${doctorName}
- Date: ${formattedDate}
- Time: ${appointmentTime}
- Reason: ${reason}

Zoom Meeting Details:
- Meeting ID: ${zoomMeeting.meetingId}
- Password: ${zoomMeeting.password}
- Join URL: ${zoomMeeting.joinUrl}

Please join the meeting 5 minutes early to test your audio and video.

Best regards,
Health Companion Team
  `

  // Check if API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured - email not sent')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const data = await resend.emails.send({
      from: 'Health Companion <onboarding@resend.dev>',
      to: [patientEmail, 'cdenizcandurgun@gmail.com'],
      subject: `Appointment Confirmed - ${formattedDate} at ${appointmentTime}`,
      html: emailHtml,
      text: emailText,
    })

    return { success: true, data }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error }
  }
}
