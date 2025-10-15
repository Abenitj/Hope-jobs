import { auth } from "@/lib/auth"
import { createNotification } from "@/lib/notifications"
import { NextResponse } from "next/server"

// Test endpoint to create sample notifications
export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Create sample notifications for current user
    const notifications = await Promise.all([
      createNotification({
        userId: session.user.id,
        type: "APPLICATION",
        title: "New Application Received",
        message: "John Doe applied for Senior Developer position",
        link: "/employer/applications",
      }),
      createNotification({
        userId: session.user.id,
        type: "MESSAGE",
        title: "New Message",
        message: "You have a new message from Jane Smith",
        link: "/messages",
      }),
      createNotification({
        userId: session.user.id,
        type: "JOB_UPDATE",
        title: "Job Status Updated",
        message: "Your job posting 'Frontend Developer' is now live",
        link: "/employer/jobs",
      }),
      createNotification({
        userId: session.user.id,
        type: "SYSTEM",
        title: "Welcome to Hope Jobs!",
        message: "Your account has been set up successfully",
        link: "/admin/dashboard",
      }),
    ])

    return NextResponse.json({ 
      success: true, 
      count: notifications.length,
      message: "Sample notifications created"
    })
  } catch (error) {
    console.error("[NOTIFICATIONS_TEST]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

