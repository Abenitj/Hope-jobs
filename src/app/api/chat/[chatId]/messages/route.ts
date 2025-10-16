import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { emitToChat } from "@/lib/socket"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { chatId } = await params

    // Verify user is a participant
    const chat = await db.chat.findFirst({
      where: {
        id: chatId,
        participants: {
          some: {
            userId: session.user.id,
          },
        },
      },
    })

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    // Get messages
    const messages = await db.message.findMany({
      where: { chatId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { sentAt: "asc" },
    })

    // Transform to use createdAt for consistency with frontend
    const transformedMessages = messages.map(m => ({
      ...m,
      createdAt: m.sentAt,
    }))

    return NextResponse.json(transformedMessages)
  } catch (error) {
    console.error("Get messages error:", error)
    return NextResponse.json(
      { error: "Failed to get messages" },
      { status: 500 }
    )
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { chatId } = await params
    const { content } = await req.json()

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      )
    }

    // Verify user is a participant
    const chat = await db.chat.findFirst({
      where: {
        id: chatId,
        participants: {
          some: {
            userId: session.user.id,
          },
        },
      },
    })

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    // Create message
    const message = await db.message.create({
      data: {
        chatId,
        senderId: session.user.id,
        content: content.trim(),
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    // Update chat's updatedAt
    await db.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    })

    // Transform to use createdAt for consistency with frontend
    const transformedMessage = {
      ...message,
      createdAt: message.sentAt,
    }

    // Emit real-time event
    try {
      emitToChat(chatId, "message:new", transformedMessage)
    } catch (socketError) {
      console.error("Socket emit error:", socketError)
      // Continue even if socket fails
    }

    return NextResponse.json(transformedMessage)
  } catch (error) {
    console.error("Send message error:", error)
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}

