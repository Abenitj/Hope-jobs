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
    const { userId, action } = body

    if (!userId || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Prevent admins from modifying other admins
    const targetUser = await db.user.findUnique({
      where: { id: userId },
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    if (targetUser.role === "ADMIN") {
      return NextResponse.json(
        { error: "Cannot modify admin users" },
        { status: 403 }
      )
    }

    let updatedUser

    switch (action) {
      case "suspend":
        updatedUser = await db.user.update({
          where: { id: userId },
          data: { status: "SUSPENDED" },
        })
        break

      case "activate":
        updatedUser = await db.user.update({
          where: { id: userId },
          data: { status: "ACTIVE" },
        })
        break

      case "delete":
        updatedUser = await db.user.update({
          where: { id: userId },
          data: { status: "DELETED" },
        })
        break

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        )
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("[ADMIN_USERS_PATCH]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


