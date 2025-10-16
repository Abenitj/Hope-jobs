import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

// GET - Fetch single SMTP configuration
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ configId: string }> }
) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { configId } = await params

    const config = await db.sMTPConfig.findUnique({
      where: { id: configId }
    })

    if (!config) {
      return NextResponse.json(
        { error: "Configuration not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...config,
      password: "••••••••" // Mask password in response
    })
  } catch (error) {
    console.error("Error fetching SMTP config:", error)
    return NextResponse.json(
      { error: "Failed to fetch SMTP configuration" },
      { status: 500 }
    )
  }
}

// PUT - Update SMTP configuration
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ configId: string }> }
) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { configId } = await params
    const body = await request.json()
    const { name, host, port, username, password, fromEmail, fromName, secure, isActive } = body

    // Check if config exists
    const existing = await db.sMTPConfig.findUnique({
      where: { id: configId }
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Configuration not found" },
        { status: 404 }
      )
    }

    // Check if name is being changed and if it conflicts
    if (name && name !== existing.name) {
      const nameConflict = await db.sMTPConfig.findUnique({
        where: { name }
      })
      if (nameConflict) {
        return NextResponse.json(
          { error: "Configuration with this name already exists" },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData: any = {
      ...(name && { name }),
      ...(host && { host }),
      ...(port && { port: parseInt(port) }),
      ...(username && { username }),
      ...(fromEmail && { fromEmail }),
      ...(fromName && { fromName }),
      ...(secure !== undefined && { secure }),
    }

    // Only update password if a new one is provided and it's not the masked value
    if (password && password !== "••••••••") {
      updateData.password = await bcrypt.hash(password, 10)
    }

    // If setting as active, deactivate all others
    if (isActive !== undefined) {
      updateData.isActive = isActive
      if (isActive) {
        await db.sMTPConfig.updateMany({
          where: { 
            id: { not: configId },
            isActive: true 
          },
          data: { isActive: false }
        })
      }
    }

    // Update configuration
    const config = await db.sMTPConfig.update({
      where: { id: configId },
      data: updateData
    })

    return NextResponse.json({
      ...config,
      password: "••••••••" // Mask password in response
    })
  } catch (error) {
    console.error("Error updating SMTP config:", error)
    return NextResponse.json(
      { error: "Failed to update SMTP configuration" },
      { status: 500 }
    )
  }
}

// DELETE - Delete SMTP configuration
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ configId: string }> }
) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { configId } = await params

    // Check if config exists
    const existing = await db.sMTPConfig.findUnique({
      where: { id: configId }
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Configuration not found" },
        { status: 404 }
      )
    }

    // Delete configuration
    await db.sMTPConfig.delete({
      where: { id: configId }
    })

    return NextResponse.json({ 
      message: "Configuration deleted successfully" 
    })
  } catch (error) {
    console.error("Error deleting SMTP config:", error)
    return NextResponse.json(
      { error: "Failed to delete SMTP configuration" },
      { status: 500 }
    )
  }
}

