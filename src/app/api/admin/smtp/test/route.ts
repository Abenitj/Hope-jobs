import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { testSMTPConnection } from "@/lib/smtp"

// POST - Test SMTP configuration
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { host, port, username, password, fromEmail, fromName, secure } = body

    // Validate required fields
    if (!host || !port || !username || !password || !fromEmail) {
      return NextResponse.json(
        { error: "Missing required fields for testing" },
        { status: 400 }
      )
    }

    // Test SMTP connection using the library
    const result = await testSMTPConnection({
      host,
      port: parseInt(port),
      username,
      password,
      fromEmail,
      fromName: fromName || "Hope Jobs",
      secure: secure || false,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("SMTP test error:", error)
    
    // Provide specific error messages
    let errorMessage = "SMTP connection failed"
    
    if (error.code === "EAUTH") {
      errorMessage = "Authentication failed. Please check your username and password."
    } else if (error.code === "ECONNECTION") {
      errorMessage = "Could not connect to SMTP server. Please check host and port."
    } else if (error.code === "ETIMEDOUT" || error.code === "ESOCKET") {
      errorMessage = "Connection timeout. Please check your network and server settings."
    } else if (error.code === "EENVELOPE") {
      errorMessage = "Invalid email address. Please check the 'From Email' field."
    } else if (error.message) {
      errorMessage = error.message
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.code || "UNKNOWN_ERROR"
      },
      { status: 400 }
    )
  }
}

