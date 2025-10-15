import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl, auth } = req
  const isLoggedIn = !!auth?.user
  const userRole = auth?.user?.role

  const isApiRoute = nextUrl.pathname.startsWith("/api")
  const isAuthRoute = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register")
  const isPublicRoute = nextUrl.pathname === "/" || nextUrl.pathname.startsWith("/jobs")
  
  const isAdminRoute = nextUrl.pathname.startsWith("/admin")
  const isEmployerRoute = nextUrl.pathname.startsWith("/employer")
  const isSeekerRoute = nextUrl.pathname.startsWith("/seeker")

  // Allow API routes
  if (isApiRoute) {
    return NextResponse.next()
  }

  // Redirect logged-in users away from auth routes
  if (isAuthRoute && isLoggedIn) {
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", nextUrl))
    } else if (userRole === "EMPLOYER") {
      return NextResponse.redirect(new URL("/employer/dashboard", nextUrl))
    } else if (userRole === "SEEKER") {
      return NextResponse.redirect(new URL("/seeker/dashboard", nextUrl))
    }
  }

  // Allow public routes
  if (isPublicRoute && !isLoggedIn) {
    return NextResponse.next()
  }

  // Protect admin routes
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl))
    }
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl))
    }
  }

  // Protect employer routes
  if (isEmployerRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl))
    }
    if (userRole !== "EMPLOYER") {
      return NextResponse.redirect(new URL("/", nextUrl))
    }
  }

  // Protect seeker routes
  if (isSeekerRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl))
    }
    if (userRole !== "SEEKER") {
      return NextResponse.redirect(new URL("/", nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}


