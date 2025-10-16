import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      )
    }

    // Find all valid (unused and not expired) password reset records
    const passwordResets = await db.passwordReset.findMany({
      where: {
        used: false,
        expiresAt: { gt: new Date() }
      },
      include: {
        user: true
      }
    })

    // Find the matching token by comparing hashes
    let matchedReset = null
    for (const reset of passwordResets) {
      const isMatch = await bcrypt.compare(token, reset.token)
      if (isMatch) {
        matchedReset = reset
        break
      }
    }

    if (!matchedReset) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      )
    }

    // Check if user account is active
    if (matchedReset.user.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "This account is not active" },
        { status: 403 }
      )
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update user password
    await db.user.update({
      where: { id: matchedReset.userId },
      data: { password: hashedPassword }
    })

    // Mark the reset token as used
    await db.passwordReset.update({
      where: { id: matchedReset.id },
      data: { used: true }
    })

    // Invalidate all other reset tokens for this user
    await db.passwordReset.updateMany({
      where: {
        userId: matchedReset.userId,
        id: { not: matchedReset.id },
        used: false
      },
      data: { used: true }
    })

    return NextResponse.json({
      message: "Password has been reset successfully. You can now log in with your new password."
    })

  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json(
      { error: "An error occurred. Please try again later." },
      { status: 500 }
    )
  }
}

