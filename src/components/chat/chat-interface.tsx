"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2 } from "lucide-react"
import { useSocket } from "@/hooks/use-socket"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  createdAt: Date
  sender: {
    id: string
    name: string
    avatar: string | null
  }
}

interface Chat {
  id: string
  participants: Array<{
    id: string
    name: string
    email: string
    avatar: string | null
    role: string
  }>
  messages: Message[]
  updatedAt: Date
}

interface ChatInterfaceProps {
  currentUserId: string
  initialChats: Chat[]
}

export function ChatInterface({ currentUserId, initialChats }: ChatInterfaceProps) {
  const [chats, setChats] = useState<Chat[]>(initialChats)
  const [selectedChatId, setSelectedChatId] = useState<string | null>(
    initialChats[0]?.id || null
  )
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { socket, isConnected } = useSocket()

  const selectedChat = chats.find((chat) => chat.id === selectedChatId)
  const otherParticipant = selectedChat?.participants.find(
    (p) => p.id !== currentUserId
  )

  // Load messages for selected chat
  useEffect(() => {
    if (selectedChatId) {
      loadMessages(selectedChatId)
    }
  }, [selectedChatId])

  // Join chat room when selected
  useEffect(() => {
    if (selectedChatId && socket) {
      socket.emit("chat:join", selectedChatId)

      return () => {
        socket.emit("chat:leave", selectedChatId)
      }
    }
  }, [selectedChatId, socket])

  // Listen for new messages
  useEffect(() => {
    if (!socket) return

    socket.on("message:new", (message: any) => {
      if (message.chatId === selectedChatId) {
        setMessages((prev) => [...prev, message])
        scrollToBottom()
      }
    })

    return () => {
      socket.off("message:new")
    }
  }, [socket, selectedChatId])

  const loadMessages = async (chatId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/chat/${chatId}/messages`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
        setTimeout(scrollToBottom, 100)
      }
    } catch (error) {
      console.error("Failed to load messages:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !selectedChatId || sending) return

    setSending(true)
    const content = newMessage.trim()
    setNewMessage("")

    try {
      // Send via API
      const response = await fetch(`/api/chat/${selectedChatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })

      if (response.ok) {
        const message = await response.json()
        setMessages((prev) => [...prev, message])

        // Also emit via socket for real-time delivery
        if (socket) {
          socket.emit("message:send", {
            chatId: selectedChatId,
            content,
          })
        }

        scrollToBottom()
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setSending(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-250px)]">
      {/* Chat List */}
      <Card className="col-span-4 overflow-hidden flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Conversations</h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {chats.map((chat) => {
              const otherUser = chat.participants.find((p) => p.id !== currentUserId)
              const lastMessage = chat.messages[0]
              const isSelected = chat.id === selectedChatId

              return (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  className={cn(
                    "w-full p-3 rounded-lg text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800",
                    isSelected && "bg-amber-100 dark:bg-amber-900/20"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={otherUser?.avatar || undefined} />
                      <AvatarFallback>
                        {otherUser?.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium truncate">{otherUser?.name}</p>
                        {lastMessage && (
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(lastMessage.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        )}
                      </div>
                      {lastMessage && (
                        <p className="text-sm text-muted-foreground truncate">
                          {lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </ScrollArea>
      </Card>

      {/* Messages Area */}
      <Card className="col-span-8 overflow-hidden flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center gap-3">
              <Avatar>
                <AvatarImage src={otherParticipant?.avatar || undefined} />
                <AvatarFallback>
                  {otherParticipant?.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{otherParticipant?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {otherParticipant?.role}
                </p>
              </div>
              {isConnected && (
                <div className="ml-auto">
                  <span className="flex items-center gap-2 text-xs text-green-600">
                    <span className="w-2 h-2 rounded-full bg-green-600"></span>
                    Online
                  </span>
                </div>
              )}
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isOwnMessage = message.sender.id === currentUserId

                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex items-end gap-2",
                          isOwnMessage && "flex-row-reverse"
                        )}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.sender.avatar || undefined} />
                          <AvatarFallback className="text-xs">
                            {message.sender.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={cn(
                            "max-w-[70%] rounded-lg p-3",
                            isOwnMessage
                              ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                              : "bg-slate-100 dark:bg-slate-800"
                          )}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={cn(
                              "text-xs mt-1",
                              isOwnMessage
                                ? "text-white/70"
                                : "text-muted-foreground"
                            )}
                          >
                            {formatDistanceToNow(new Date(message.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={sending}
                />
                <Button type="submit" size="icon" disabled={sending || !newMessage.trim()}>
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a conversation to start messaging
          </div>
        )}
      </Card>
    </div>
  )
}

