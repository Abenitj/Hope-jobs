import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { createNotification } from "@/lib/notifications"

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "SEEKER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { jobId, coverLetter } = await req.json()

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      )
    }

    // Check if job exists and is open
    const job = await db.job.findUnique({
      where: { id: jobId },
      include: {
        employer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    if (job.status !== "OPEN") {
      return NextResponse.json(
        { error: "This job is no longer accepting applications" },
        { status: 400 }
      )
    }

    // Check if user already applied
    const existingApplication = await db.application.findFirst({
      where: {
        jobId,
        applicantId: session.user.id,
      },
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied to this job" },
        { status: 400 }
      )
    }

    // Create application
    const application = await db.application.create({
      data: {
        jobId,
        applicantId: session.user.id,
        coverLetter,
        status: "PENDING",
      },
    })

    // Create notification for employer
    await createNotification({
      userId: job.employerId,
      type: "APPLICATION",
      title: "New Job Application",
      message: `${session.user.name} applied for ${job.title}`,
      link: `/employer/applications/${application.id}`,
    })

    return NextResponse.json(application)
  } catch (error) {
    console.error("Application error:", error)
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    )
  }
}

