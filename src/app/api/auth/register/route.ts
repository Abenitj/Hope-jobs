import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { UserRole } from "@/types/prisma"
import { createNotification } from "@/lib/notifications"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, role } = body

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles: UserRole[] = ["ADMIN", "EMPLOYER", "SEEKER"]
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as UserRole,
        status: "ACTIVE",
      },
    })

    // Create profile based on role
    if (role === "SEEKER") {
      await db.jobSeekerProfile.create({
        data: {
          userId: user.id,
        },
      })
    } else if (role === "EMPLOYER") {
      await db.employerProfile.create({
        data: {
          userId: user.id,
          companyName: name, // Default to user's name, they can update later
        },
      })
    }

    // Notify all admins about new user
    const admins = await db.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true },
    })

    for (const admin of admins) {
      await createNotification({
        userId: admin.id,
        type: "SYSTEM",
        title: "New User Registered",
        message: `${name} joined as ${role}`,
        link: "/admin/users",
      })
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })
  } catch (error) {
    console.error("[REGISTER_POST]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}



