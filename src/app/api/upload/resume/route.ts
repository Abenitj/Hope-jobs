import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF, DOC, and DOCX files are allowed" },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads", "resumes")
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const extension = file.name.split(".").pop()
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`
    const filepath = join(uploadsDir, filename)

    // Write file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Generate URL
    const url = `/uploads/resumes/${filename}`

    // Update user's resume URL in database
    await db.jobSeekerProfile.upsert({
      where: { userId: session.user.id },
      update: { resumeUrl: url },
      create: {
        userId: session.user.id,
        resumeUrl: url,
        availability: "IMMEDIATELY",
      },
    })

    return NextResponse.json({ url })
  } catch (error) {
    console.error("Resume upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload resume" },
      { status: 500 }
    )
  }
}

