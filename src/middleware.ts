import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl, auth } = req
  const isLoggedIn = !!auth?.user
  const userRole = auth?.user?.role
  const path = nextUrl.pathname

  // Allow API routes
  if (path.startsWith("/api")) return NextResponse.next()

  // Redirect logged-in users away from auth routes
  if ((path === "/login" || path === "/register") && isLoggedIn) {
    const dashboard = userRole === "ADMIN" ? "/admin/dashboard" 
      : userRole === "EMPLOYER" ? "/employer/dashboard" 
      : "/seeker/dashboard"
    return NextResponse.redirect(new URL(dashboard, nextUrl))
  }

  // Redirect logged-in users from home to dashboard
  if (path === "/" && isLoggedIn) {
    const dashboard = userRole === "ADMIN" ? "/admin/dashboard" 
      : userRole === "EMPLOYER" ? "/employer/dashboard" 
      : "/seeker/dashboard"
    return NextResponse.redirect(new URL(dashboard, nextUrl))
  }

  // Protect role-specific routes
  const roleRoutes = [
    { prefix: "/admin", requiredRole: "ADMIN" },
    { prefix: "/employer", requiredRole: "EMPLOYER" },
    { prefix: "/seeker", requiredRole: "SEEKER" }
  ]

  for (const { prefix, requiredRole } of roleRoutes) {
    if (path.startsWith(prefix)) {
      if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl))
      if (userRole !== requiredRole) return NextResponse.redirect(new URL("/", nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next|api|.*\\.).*)"],
}


