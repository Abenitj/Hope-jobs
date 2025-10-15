import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

// Quick endpoint to set a sample avatar for testing
export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Set a sample avatar from a public source
    const sampleAvatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + session.user.name

    await db.user.update({
      where: { id: session.user.id },
      data: { avatar: sampleAvatarUrl },
    })

    return NextResponse.json({ 
      success: true, 
      url: sampleAvatarUrl,
      message: "Sample avatar set successfully" 
    })
  } catch (error) {
    console.error("[SET_SAMPLE_AVATAR]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

