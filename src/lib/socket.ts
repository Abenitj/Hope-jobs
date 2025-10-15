import type { Server as HTTPServer } from "http"
import { Server as SocketIOServer } from "socket.io"

export type ServerToClientEvents = {
  "notification:new": (notification: any) => void
  "message:new": (message: any) => void
  "message:typing": (data: { chatId: string; userId: string; isTyping: boolean }) => void
  "user:online": (userId: string) => void
  "user:offline": (userId: string) => void
}

export type ClientToServerEvents = {
  "message:send": (data: { chatId: string; content: string }) => void
  "message:typing": (data: { chatId: string; isTyping: boolean }) => void
  "chat:join": (chatId: string) => void
  "chat:leave": (chatId: string) => void
}

let io: SocketIOServer<ClientToServerEvents, ServerToClientEvents> | undefined

export const initSocketServer = (httpServer: HTTPServer) => {
  if (io) {
    return io
  }

  io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: {
      origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
    path: "/api/socket",
  })

  // Track online users
  const onlineUsers = new Map<string, string>() // socketId -> userId

  io.on("connection", async (socket) => {
    console.log("Client connected:", socket.id)

    // Get user ID from auth token
    const userId = socket.handshake.auth.token
    if (!userId) {
      console.log("Socket connection rejected - no user ID")
      socket.disconnect()
      return
    }

    try {
      onlineUsers.set(socket.id, userId)

      // Broadcast user online
      io?.emit("user:online", userId)

      // Join user's personal room
      socket.join(`user:${userId}`)

      // Handle chat room joining
      socket.on("chat:join", (chatId) => {
        socket.join(`chat:${chatId}`)
        console.log(`User ${userId} joined chat ${chatId}`)
      })

      // Handle chat room leaving
      socket.on("chat:leave", (chatId) => {
        socket.leave(`chat:${chatId}`)
        console.log(`User ${userId} left chat ${chatId}`)
      })

      // Handle message sending
      socket.on("message:send", async (data) => {
        // Emit to chat room
        socket.to(`chat:${data.chatId}`).emit("message:new", {
          chatId: data.chatId,
          content: data.content,
          senderId: userId,
          createdAt: new Date(),
        })
      })

      // Handle typing indicator
      socket.on("message:typing", (data) => {
        socket.to(`chat:${data.chatId}`).emit("message:typing", {
          chatId: data.chatId,
          userId,
          isTyping: data.isTyping,
        })
      })

      // Handle disconnect
      socket.on("disconnect", () => {
        const disconnectedUserId = onlineUsers.get(socket.id)
        if (disconnectedUserId) {
          onlineUsers.delete(socket.id)
          io?.emit("user:offline", disconnectedUserId)
          console.log("User disconnected:", disconnectedUserId)
        }
      })
    } catch (error) {
      console.error("Socket authentication error:", error)
      socket.disconnect()
    }
  })

  console.log("Socket.io server initialized")
  return io
}

export const getSocketServer = () => {
  if (!io) {
    throw new Error("Socket.io server not initialized")
  }
  return io
}

// Helper to emit to specific user
export const emitToUser = (userId: string, event: string, data: any) => {
  io?.to(`user:${userId}`).emit(event as any, data)
}

// Helper to emit to specific chat
export const emitToChat = (chatId: string, event: string, data: any) => {
  io?.to(`chat:${chatId}`).emit(event as any, data)
}

