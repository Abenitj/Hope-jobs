import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

// Fast endpoint to get only the unread count
export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const count = await db.notification.count({
      where: { 
        userId: session.user.id,
        read: false
      }
    })

    return NextResponse.json({ count })
  } catch (error) {
    console.error("[NOTIFICATIONS_COUNT]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}




