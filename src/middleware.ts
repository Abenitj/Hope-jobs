import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

// Lightweight middleware for auth redirects
export default auth((req) => {
  const { auth, nextUrl } = req
  const isLoggedIn = !!auth?.user
  const role = auth?.user?.role
  const path = nextUrl.pathname

  // Redirect logged-in users from auth pages to dashboard
  if (isLoggedIn && (path === "/login" || path === "/register")) {
    const dashboard = role === "ADMIN" ? "/admin/dashboard" 
      : role === "EMPLOYER" ? "/employer/dashboard" 
      : "/seeker/dashboard"
    return NextResponse.redirect(new URL(dashboard, nextUrl))
  }

  // Redirect from home to dashboard if logged in
  if (isLoggedIn && path === "/") {
    const dashboard = role === "ADMIN" ? "/admin/dashboard" 
      : role === "EMPLOYER" ? "/employer/dashboard" 
      : "/seeker/dashboard"
    return NextResponse.redirect(new URL(dashboard, nextUrl))
  }

  // Protect role-specific routes
  if (path.startsWith("/admin") && (!isLoggedIn || role !== "ADMIN")) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }
  if (path.startsWith("/employer") && (!isLoggedIn || role !== "EMPLOYER")) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }
  if (path.startsWith("/seeker") && (!isLoggedIn || role !== "SEEKER")) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/admin/:path*",
    "/employer/:path*",
    "/seeker/:path*"
  ],
}


