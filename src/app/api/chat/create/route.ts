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
                userId: session.user.id,
              },
            },
          },
          {
            participants: {
              some: {
                userId: participantId,
              },
            },
          },
        ],
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
              },
            },
          },
        },
      },
    })

    if (existingChat) {
      const transformedChat = {
        ...existingChat,
        participants: existingChat.participants.map(p => p.user),
      }
      return NextResponse.json(transformedChat)
    }

    // Create new chat
    const chat = await db.chat.create({
      data: {
        participants: {
          create: [
            { userId: session.user.id },
            { userId: participantId },
          ],
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
              },
            },
          },
        },
      },
    })

    const transformedChat = {
      ...chat,
      participants: chat.participants.map(p => p.user),
    }

    return NextResponse.json(transformedChat)
  } catch (error) {
    console.error("Create chat error:", error)
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 }
    )
  }
}

