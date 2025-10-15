import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { participantId } = await req.json()

    if (!participantId) {
      return NextResponse.json(
        { error: "Participant ID is required" },
        { status: 400 }
      )
    }

    // Check if chat already exists between these users
    const existingChat = await db.chat.findFirst({
      where: {
        AND: [
          {
            participants: {
              some: {
                id: session.user.id,
              },
            },
          },
          {
            participants: {
              some: {
                id: participantId,
              },
            },
          },
        ],
      },
    })

    if (existingChat) {
      return NextResponse.json(existingChat)
    }

    // Create new chat
    const chat = await db.chat.create({
      data: {
        participants: {
          connect: [{ id: session.user.id }, { id: participantId }],
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json(chat)
  } catch (error) {
    console.error("Create chat error:", error)
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 }
    )
  }
}

