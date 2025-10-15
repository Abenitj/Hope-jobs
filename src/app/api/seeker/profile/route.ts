import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(req: Request) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "SEEKER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      name,
      email,
      phone,
      bio,
      skills,
      experience,
      education,
      availability,
    } = body

    // Update user info
    await db.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email,
      },
    })

    // Update or create job seeker profile
    await db.jobSeekerProfile.upsert({
      where: { userId: session.user.id },
      update: {
        phone,
        bio,
        skills,
        experience,
        education,
        availability,
      },
      create: {
        userId: session.user.id,
        phone,
        bio,
        skills,
        experience,
        education,
        availability: availability || "IMMEDIATELY",
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}
