import { UserRole } from "@/types/prisma"
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
      avatar: string | null
    } & DefaultSession["user"]
  }

  interface User {
    role: UserRole
    avatar: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
    avatar: string | null
  }
}

