import nodemailer from "nodemailer"

/**
 * Get SMTP configuration from environment variables
 */
function getSMTPConfig() {
  return {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    username: process.env.SMTP_USER || "abenitj@gmail.com",
    password: process.env.SMTP_PASS || "arqs qote qalh klll",
    fromEmail: process.env.SMTP_FROM_EMAIL || "abenitj@gmail.com",
    fromName: process.env.SMTP_FROM_NAME || "Hope Jobs",
  }
}

/**
 * Send an email using environment variable SMTP configuration
 * 
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param text - Plain text content
 * @param html - HTML content (optional)
 * @returns Promise with send results
 */
export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html?: string
) {
  const config = getSMTPConfig()
  
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465, // true for 465, false for other ports
    auth: {
      user: config.username,
      pass: config.password.replace(/\s/g, ''), // Remove spaces from password
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

