import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sendEmail } from "@/lib/smtp"
import crypto from "crypto"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    // Always return success (don't reveal if email exists for security)
    if (!user) {
      return NextResponse.json({
        message: "If an account with that email exists, a password reset link has been sent."
      })
    }

    // Check if user account is active
    if (user.status !== "ACTIVE") {
      return NextResponse.json({
        message: "If an account with that email exists, a password reset link has been sent."
      })
    }

    // Generate secure random token
    const token = crypto.randomBytes(32).toString("hex")
    const hashedToken = await bcrypt.hash(token, 10)

    // Token expires in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    // Invalidate any existing password reset tokens for this user
    await db.passwordReset.updateMany({
      where: {
        userId: user.id,
        used: false,
        expiresAt: { gt: new Date() }
      },
      data: { used: true }
    })

    // Create new password reset token
    await db.passwordReset.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expiresAt,
        used: false
      }
    })

    // Create password reset URL
    const baseUrl = process.env.NEXTAUTH_URL
    if (!baseUrl) {
      console.error('❌ NEXTAUTH_URL not set in environment variables')
      return NextResponse.json(
        { error: "Server configuration error. Please contact support." },
        { status: 500 }
      )
    }
    const resetUrl = `${baseUrl}/reset-password?token=${token}`

    console.log(`📧 Sending password reset email to: ${user.email}`)

    // Send password reset email using environment variables
    try {
      await sendEmail(
        user.email,
        "Password Reset Request - Hope Jobs",
        `Hello ${user.name},\n\nYou requested to reset your password. Click the link below to reset it:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nHope Jobs Team`,
        `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Hope Jobs</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1f2937; margin-top: 0;">Password Reset Request</h2>
              <p style="color: #374151; line-height: 1.6;">
                Hello <strong>${user.name}</strong>,
              </p>
              <p style="color: #374151; line-height: 1.6;">
                We received a request to reset your password for your Hope Jobs account. Click the button below to create a new password:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Reset Password
                </a>
              </div>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                Or copy and paste this link into your browser:<br>
                <a href="${resetUrl}" style="color: #f59e0b; word-break: break-all;">${resetUrl}</a>
              </p>
              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="color: #856404; margin: 0; font-size: 14px;">
                  <strong>⚠️ Important:</strong> This link will expire in <strong>1 hour</strong>.
                </p>
              </div>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                This is an automated message from Hope Jobs. Please do not reply to this email.
              </p>
            </div>
          </div>
        `
      )
      console.log("✅ Password reset email sent successfully!")
    } catch (emailError: any) {
      console.error("❌ Error sending password reset email:", emailError)
      console.error("Error details:", emailError.message)
      
      // Return error to user for debugging
      return NextResponse.json({
        error: `Failed to send email: ${emailError.message || 'Unknown error'}`
      }, { status: 500 })
    }

    return NextResponse.json({
      message: "If an account with that email exists, a password reset link has been sent."
    })

  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "An error occurred. Please try again later." },
      { status: 500 }
    )
  }
}

