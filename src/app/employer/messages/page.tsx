import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { ChatInterface } from "@/components/chat/chat-interface"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"
import { redirect } from "next/navigation"

async function getUserChats(userId: string) {
  const chats = await db.chat.findMany({
    where: {
      participants: {
        some: {
          userId: userId,
        },
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
      messages: {
        orderBy: { sentAt: "desc" },
        take: 1,
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  })

  // Transform the data to match the expected interface
  const transformedChats = chats.map(chat => ({
    ...chat,
    participants: chat.participants.map(p => p.user),
    messages: chat.messages.map(m => ({
      ...m,
      createdAt: m.sentAt,
    })),
  }))

  return transformedChats
}

async function createOrGetChat(currentUserId: string, otherUserId: string) {
  // Check if chat already exists
  const existingChat = await db.chat.findFirst({
    where: {
      AND: [
        {
          participants: {
            some: { userId: currentUserId },
          },
        },
        {
          participants: {
            some: { userId: otherUserId },
          },
        },
      ],
    },
  })

  if (existingChat) {
    return existingChat.id
  }

  // Create new chat
  const newChat = await db.chat.create({
    data: {
      participants: {
        create: [
          { userId: currentUserId },
          { userId: otherUserId },
        ],
      },
    },
  })

  return newChat.id
}

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: { user?: string }
}) {
  const session = await auth()
  
  // If user parameter is provided, create or get chat and redirect
  if (searchParams.user) {
    const chatId = await createOrGetChat(session!.user.id, searchParams.user)
    redirect(`/employer/messages?chat=${chatId}`)
  }

  const chats = await getUserChats(session!.user.id)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-6 text-white shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
              <p className="text-amber-100 text-sm mt-0.5">
                Chat with job seekers about opportunities
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      {chats.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
            <p className="text-muted-foreground text-center max-w-md">
              When you connect with candidates, your conversations will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ChatInterface
          currentUserId={session!.user.id}
          initialChats={chats}
        />
      )}
    </div>
  )
}

