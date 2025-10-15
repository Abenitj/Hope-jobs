"use client"

import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import { useSession } from "next-auth/react"

let socket: Socket | null = null

export function useSocket() {
  const { data: session } = useSession()
  const [isConnected, setIsConnected] = useState(false)
  const [transport, setTransport] = useState("N/A")

  useEffect(() => {
    if (!session?.user) return

    if (!socket) {
      socket = io({
        path: "/api/socket",
        auth: {
          token: session.user.id, // In production, use proper JWT token
        },
      })

      socket.on("connect", () => {
        setIsConnected(true)
        setTransport(socket?.io.engine.transport.name || "N/A")
      })

      socket.on("disconnect", () => {
        setIsConnected(false)
      })

      socket.io.engine.on("upgrade", () => {
        setTransport(socket?.io.engine.transport.name || "N/A")
      })
    }

    return () => {
      if (socket) {
        socket.disconnect()
        socket = null
      }
    }
  }, [session])

  return { socket, isConnected, transport }
}

export function getSocket() {
  return socket
}

