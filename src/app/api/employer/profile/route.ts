import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(req: Request) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      name,
      email,
      companyName,
      companyWebsite,
      companyDescription,
      companySize,
      industry,
    } = body

    // Update user info
    await db.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email,
      },
    })

    // Update or create employer profile
    await db.employerProfile.upsert({
      where: { userId: session.user.id },
      update: {
        companyName: companyName || "Unnamed Company",
        website: companyWebsite || null,
        description: companyDescription || null,
        companySize: companySize || null,
        industry: industry || null,
      },
      create: {
        userId: session.user.id,
        companyName: companyName || "Unnamed Company",
        website: companyWebsite || null,
        description: companyDescription || null,
        companySize: companySize || null,
        industry: industry || null,
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

