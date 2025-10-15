import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { saveUploadedFile, validateImageFile } from "@/lib/upload"

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Validate file
    const validation = validateImageFile(file)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Save file
    const url = await saveUploadedFile(file, 'avatars')

    // Update user avatar
    await db.user.update({
      where: { id: session.user.id },
      data: { avatar: url },
    })

    return NextResponse.json({ url })
  } catch (error) {
    console.error("[UPLOAD_AVATAR]", error)
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    )
  }
}

