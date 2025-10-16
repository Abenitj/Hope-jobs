import nodemailer from "nodemailer"

export interface SMTPConfig {
  host: string
  port: number
  username: string
  password: string
  fromEmail: string
  fromName: string
  secure: boolean
}

/**
 * Test SMTP connection and optionally send a test email
 * 
 * @param config - SMTP configuration to test
 * @param sendTestEmail - Whether to send an actual test email (default: true)
 * @returns Promise with test results
 */
export async function testSMTPConnection(
  config: SMTPConfig,
  sendTestEmail: boolean = true
) {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465, // true for 465, false for other ports
    auth: {
      user: config.username,
      pass: config.password,
    },
    tls: {
      // Do not fail on invalid certs (for development)
      rejectUnauthorized: false,
    },
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  })

  // Verify connection
  await transporter.verify()

  if (!sendTestEmail) {
    return {
      success: true,
      message: "SMTP connection verified successfully",
    }
  }

  // Send test email
  const result = await transporter.sendMail({
    from: `"${config.fromName}" <${config.fromEmail}>`,
    to: config.fromEmail,
    subject: "SMTP Configuration Test - Hope Jobs",
    text: "This is a test email to verify your SMTP configuration is working correctly.",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Hope Jobs</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #f59e0b; margin-top: 0;">SMTP Configuration Test</h2>
          <p style="color: #374151; line-height: 1.6;">
            Congratulations! Your SMTP configuration is working correctly.
          </p>
          <p style="color: #374151; line-height: 1.6;">
            This test email was sent from <strong>Hope Jobs</strong> to verify the connection settings.
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #f59e0b;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              <strong>Configuration Details:</strong><br><br>
              • Host: ${config.host}<br>
              • Port: ${config.port}<br>
              • Username: ${config.username}<br>
              • Security: ${config.secure ? 'TLS/SSL Enabled' : 'No encryption'}<br>
              • From: ${config.fromName} &lt;${config.fromEmail}&gt;
            </p>
          </div>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 30px; text-align: center;">
            This is an automated test message from Hope Jobs Admin Panel.
          </p>
        </div>
      </div>
    `,
  })

  return {
    success: true,
    message: "SMTP connection successful! A test email has been sent.",
    details: {
      accepted: result.accepted,
      messageId: result.messageId,
    },
  }
}

/**
 * Send an email using the provided SMTP configuration
 * 
 * @param config - SMTP configuration
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param text - Plain text content
 * @param html - HTML content (optional)
 * @returns Promise with send results
 */
export async function sendEmail(
  config: SMTPConfig,
  to: string,
  subject: string,
  text: string,
  html?: string
) {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465, // true for 465, false for other ports
    auth: {
      user: config.username,
      pass: config.password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })

  const result = await transporter.sendMail({
    from: `"${config.fromName}" <${config.fromEmail}>`,
    to,
    subject,
    text,
    html: html || text,
  })

  return result
}

