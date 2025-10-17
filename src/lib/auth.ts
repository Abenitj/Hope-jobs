import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./db"
import bcrypt from "bcryptjs"
import { UserRole } from "@/types/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db) as any,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.password) {
          throw new Error("Invalid credentials")
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error("Invalid credentials")
        }

        if (user.status === "SUSPENDED") {
          throw new Error("Account suspended")
        }

        if (user.status === "DELETED") {
          throw new Error("Account deleted")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as UserRole,
          avatar: user.avatar,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.avatar = (user as any).avatar
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
        session.user.avatar = token.avatar as string | null
      }
      return session
    },
    async authorized({ auth, request }) {
      const url = request.nextUrl
      const path = url.pathname
      const isLoggedIn = !!auth?.user
      const role = auth?.user?.role

      // Public routes
      if (path === "/" || path === "/login" || path === "/register" || 
          path === "/forgot-password" || path.startsWith("/reset-password")) {
        return true
      }

      // Require login for protected routes
      if (!isLoggedIn) return false

      // Role-based access
      if (path.startsWith("/admin")) return role === "ADMIN"
      if (path.startsWith("/employer")) return role === "EMPLOYER"
      if (path.startsWith("/seeker")) return role === "SEEKER"

      return true
    },
  },
})


