"use client"

import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { 
  Send, 
  Loader2, 
  Paperclip, 
  X, 
  Image as ImageIcon, 
  FileIcon,
  Download,
  ExternalLink,
  Copy,
  XCircle
} from "lucide-react"
import { useSocket } from "@/hooks/use-socket"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

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
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [imageModalUrl, setImageModalUrl] = useState<string | null>(null)
  const [attachments, setAttachments] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
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

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const loadMessages = useCallback(async (chatId: string) => {
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
  }, [scrollToBottom])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if ((!newMessage.trim() && attachments.length === 0) || !selectedChatId || sending) return

    setSending(true)
    const content = newMessage.trim()
    setNewMessage("")
    const filesToUpload = [...attachments]
    setAttachments([])

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      let messageContent = content

      // Upload attachments if any
      if (filesToUpload.length > 0) {
        setUploading(true)
        const uploadedUrls: string[] = []

        for (const file of filesToUpload) {
          try {
            const formData = new FormData()
            formData.append('file', file)

            const uploadResponse = await fetch('/api/upload/chat-file', {
              method: 'POST',
              body: formData,
            })

            if (uploadResponse.ok) {
              const { url } = await uploadResponse.json()
              uploadedUrls.push(url)
            } else {
              const errorData = await uploadResponse.json()
              console.error('Upload failed:', errorData)
              throw new Error(errorData.error || 'Upload failed')
            }
          } catch (error) {
            console.error('File upload error:', error)
            setUploading(false)
            setSending(false)
            alert(`Failed to upload ${file.name}. Please try again.`)
            return
          }
        }

        setUploading(false)

        // Append file URLs to message
        if (uploadedUrls.length > 0) {
          messageContent = content + '\n' + uploadedUrls.map(url => `[File: ${url}]`).join('\n')
        }
      }

      // Send via API
      const response = await fetch(`/api/chat/${selectedChatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: messageContent }),
      })

      if (response.ok) {
        const message = await response.json()
        setMessages((prev) => [...prev, message])

        // Also emit via socket for real-time delivery
        if (socket) {
          socket.emit("message:send", {
            chatId: selectedChatId,
            content: messageContent,
          })
        }

        scrollToBottom()
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setSending(false)
      setUploading(false)
    }
  }

  // Auto-resize textarea as content grows
  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value)
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setAttachments(prev => [...prev, ...files])
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const removeAttachment = useCallback((index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }, [])

  const getFileIcon = useCallback((file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4" />
    }
    return <FileIcon className="h-4 w-4" />
  }, [])

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }, [])

  const copyToClipboard = useCallback(async (url: string) => {
    try {
      await navigator.clipboard.writeText(window.location.origin + url)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }, [])

  // Format last message preview for conversation list - Memoized
  const formatLastMessage = useCallback((content: string) => {
    const fileUrlRegex = /\[File: (\/uploads\/chat\/[^\]]+)\]/g
    const match = fileUrlRegex.exec(content)
    
    if (match) {
      const fileUrl = match[1]
      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl)
      
      // Remove file URLs and get remaining text
      const textOnly = content.replace(fileUrlRegex, '').trim()
      
      if (isImage) {
        return textOnly ? `${textOnly} 📷` : '📷 Photo'
      } else {
        return textOnly ? `${textOnly} 📄` : '📄 Document'
      }
    }
    
    return content
  }, [])

  // Render message content with file URLs - Memoized
  const renderMessageContent = useCallback((content: string, isOwnMessage: boolean) => {
    // Check if message contains file URLs
    const fileUrlRegex = /\[File: (\/uploads\/chat\/[^\]]+)\]/g
    const matches = [...content.matchAll(fileUrlRegex)]

    if (matches.length === 0) {
      // Regular text message
      return <p className="whitespace-pre-wrap break-words">{content}</p>
    }

    // Message with files
    const parts: React.ReactElement[] = []
    let lastIndex = 0

    matches.forEach((match, index) => {
      const fullMatch = match[0]
      const fileUrl = match[1]
      const matchIndex = match.index!

      // Add text before the file
      if (matchIndex > lastIndex) {
        const textBefore = content.substring(lastIndex, matchIndex)
        if (textBefore.trim()) {
          parts.push(
            <div 
              key={`text-${index}`} 
              className={cn(
                "rounded-xl p-3 mb-2",
                isOwnMessage
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800"
              )}
            >
              <p className="whitespace-pre-wrap break-words">{textBefore}</p>
            </div>
          )
        }
      }

      // Check if it's an image
      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl)

      if (isImage) {
        parts.push(
          <ContextMenu key={`file-${index}`}>
            <ContextMenuTrigger>
              <div className="my-1 group">
                <div className="relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <img
                    src={fileUrl}
                    alt="Attached"
                    className="max-w-xs w-full cursor-pointer transition-all"
                    onClick={() => setImageModalUrl(fileUrl)}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                </div>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-48">
              <ContextMenuItem onClick={() => setImageModalUrl(fileUrl)}>
                <ImageIcon className="mr-2 h-4 w-4" />
                View Image
              </ContextMenuItem>
              <ContextMenuItem asChild>
                <a href={fileUrl} download>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </a>
              </ContextMenuItem>
              <ContextMenuItem onClick={() => copyToClipboard(fileUrl)}>
                <Copy className="mr-2 h-4 w-4" />
                {copiedUrl === fileUrl ? 'Copied!' : 'Copy Link'}
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        )
      } else {
        const fileName = fileUrl.split('/').pop() || 'file'
        parts.push(
          <ContextMenu key={`file-${index}`}>
            <ContextMenuTrigger>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white dark:bg-slate-700 rounded-xl p-3 my-1 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600 shadow-sm"
              >
                <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                  <FileIcon className="h-5 w-5 text-amber-600" />
                </div>
                <span className="text-sm font-medium text-foreground flex-1 truncate">
                  {fileName}
                </span>
              </a>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-48">
              <ContextMenuItem asChild>
                <a href={fileUrl} download>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </a>
              </ContextMenuItem>
              <ContextMenuItem onClick={() => copyToClipboard(fileUrl)}>
                <Copy className="mr-2 h-4 w-4" />
                {copiedUrl === fileUrl ? 'Copied!' : 'Copy Link'}
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        )
      }

      lastIndex = matchIndex + fullMatch.length
    })

    // Add any remaining text
    if (lastIndex < content.length) {
      const textAfter = content.substring(lastIndex)
      if (textAfter.trim()) {
        parts.push(
          <div 
            key="text-end" 
            className={cn(
              "rounded-xl p-3 mt-2",
              isOwnMessage
                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                : "bg-slate-100 dark:bg-slate-800"
            )}
          >
            <p className="whitespace-pre-wrap break-words">{textAfter}</p>
          </div>
        )
      }
    }

    return <div className="space-y-1">{parts}</div>
  }, [copiedUrl, copyToClipboard])

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
                          {formatLastMessage(lastMessage.content)}
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
              <Avatar 
                className="cursor-pointer hover:ring-2 hover:ring-amber-500 transition-all"
                onClick={() => setProfileModalOpen(true)}
              >
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
                    const hasFile = /\[File: \/uploads\/chat\/[^\]]+\]/g.test(message.content)

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
                        {hasFile ? (
                          // File message - Telegram style
                          <div className={cn("max-w-[70%]", isOwnMessage && "flex flex-col items-end")}>
                            <div className="text-sm">
                              {renderMessageContent(message.content, isOwnMessage)}
                            </div>
                            <p 
                              className={cn(
                                "text-xs mt-1",
                                isOwnMessage ? "text-muted-foreground" : "text-muted-foreground"
                              )}
                            >
                              {formatDistanceToNow(new Date(message.createdAt), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        ) : (
                          // Regular text message - Telegram style
                          <div
                            className={cn(
                              "max-w-[70%] rounded-2xl px-4 py-2 shadow-sm",
                              isOwnMessage
                                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-br-md"
                                : "bg-white dark:bg-slate-800 text-foreground rounded-bl-md"
                            )}
                          >
                            <div className="text-sm leading-relaxed">
                              {renderMessageContent(message.content, isOwnMessage)}
                            </div>
                            <p
                              className={cn(
                                "text-xs mt-1 text-right",
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
                        )}
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="space-y-2">
                {/* Attachments Preview */}
                {attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 text-sm"
                      >
                        {getFileIcon(file)}
                        <span className="truncate max-w-[150px]">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({formatFileSize(file.size)})
                        </span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Message Input */}
                <div className="flex gap-2 items-end">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={sending || uploading}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Textarea
                    ref={textareaRef}
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={handleTextareaChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage(e)
                      }
                    }}
                    disabled={sending || uploading}
                    className="min-h-[40px] max-h-[150px] resize-none"
                    rows={1}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={sending || uploading || (!newMessage.trim() && attachments.length === 0)}
                  >
                    {sending || uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a conversation to start messaging
          </div>
        )}
      </Card>

      {/* Profile Picture Modal - Telegram Style */}
      <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
        <DialogContent className="max-w-2xl p-0 bg-black border-0">
          <VisuallyHidden>
            <DialogTitle>{otherParticipant?.name} - Profile Picture</DialogTitle>
          </VisuallyHidden>
          <div className="relative bg-black">
            {otherParticipant?.avatar ? (
              <img 
                src={otherParticipant.avatar}
                alt={otherParticipant.name}
                className="w-full h-auto object-contain"
              />
            ) : (
              <div className="w-full aspect-square bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 flex items-center justify-center">
                <span className="text-9xl font-bold text-white drop-shadow-lg">
                  {otherParticipant?.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
            {/* Name overlay - Telegram style */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-4">
              <h2 className="text-lg font-semibold text-white drop-shadow-lg">
                {otherParticipant?.name}
              </h2>
              <p className="text-white/80 text-sm capitalize">
                {otherParticipant?.role}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Viewer Modal - Telegram Style */}
      <Dialog open={!!imageModalUrl} onOpenChange={() => setImageModalUrl(null)}>
        <DialogContent className="max-w-7xl w-auto h-auto p-0 bg-transparent border-0 [&>button]:hidden">
          <VisuallyHidden>
            <DialogTitle>Image Viewer</DialogTitle>
          </VisuallyHidden>
          <div className="relative">
            {imageModalUrl && (
              <>
                <img 
                  src={imageModalUrl}
                  alt="Full size"
                  className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain rounded-lg"
                  loading="lazy"
                />
                {/* Close button - Enhanced Glassmorphism */}
                <button
                  onClick={() => setImageModalUrl(null)}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 hover:bg-white/15 text-white shadow-2xl transition-all hover:scale-110 active:scale-95 z-10"
                  aria-label="Close"
                >
                  <X className="h-6 w-6 stroke-[2.5] drop-shadow-lg" />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

