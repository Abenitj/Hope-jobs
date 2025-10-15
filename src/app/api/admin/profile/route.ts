import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(req: Request) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { name, email } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if email is already taken by another user
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser && existingUser.id !== session.user.id) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      )
    }

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: { name, email },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("[ADMIN_PROFILE_PATCH]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

