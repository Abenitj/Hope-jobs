import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

// GET - Fetch all SMTP configurations
export async function GET() {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const configs = await db.sMTPConfig.findMany({
      orderBy: [
        { isActive: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    // Return configs with masked passwords
    const sanitizedConfigs = configs.map(config => ({
      ...config,
      password: "••••••••" // Mask password in response
    }))

    return NextResponse.json(sanitizedConfigs)
  } catch (error) {
    console.error("Error fetching SMTP configs:", error)
    return NextResponse.json(
      { error: "Failed to fetch SMTP configurations" },
      { status: 500 }
    )
  }
}

// POST - Create new SMTP configuration
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
    const { name, host, port, username, password, fromEmail, fromName, secure, isActive } = body

    // Validate required fields
    if (!name || !host || !port || !username || !password || !fromEmail || !fromName) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Check if name already exists
    const existing = await db.sMTPConfig.findUnique({
      where: { name }
    })

    if (existing) {
      return NextResponse.json(
        { error: "Configuration with this name already exists" },
        { status: 400 }
      )
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10)

    // If setting as active, deactivate all others
    if (isActive) {
      await db.sMTPConfig.updateMany({
        where: { isActive: true },
        data: { isActive: false }
      })
    }

    // Create new configuration
    const config = await db.sMTPConfig.create({
      data: {
        name,
        host,
        port: parseInt(port),
        username,
        password: hashedPassword,
        fromEmail,
        fromName,
        secure: secure !== undefined ? secure : true,
        isActive: isActive || false
      }
    })

    return NextResponse.json({
      ...config,
      password: "••••••••" // Mask password in response
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating SMTP config:", error)
    return NextResponse.json(
      { error: "Failed to create SMTP configuration" },
      { status: 500 }
    )
  }
}

