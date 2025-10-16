import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import { createNotification } from "@/lib/notifications"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { applicationId: string } }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== "EMPLOYER") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { status } = await req.json()

    if (!status) {
      return NextResponse.json(
        { message: "Status is required" },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = [
      "PENDING",
      "REVIEWING",
      "SHORTLISTED",
      "INTERVIEWED",
      "OFFERED",
      "REJECTED",
      "WITHDRAWN"
    ]

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status" },
        { status: 400 }
      )
    }

    // Get the application with job details to verify ownership
    const application = await db.application.findUnique({
      where: { id: params.applicationId },
      include: {
        job: {
          select: {
            employerId: true,
            title: true,
          },
        },
        seeker: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!application) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      )
    }

    // Verify that the application belongs to this employer's job
    if (application.job.employerId !== session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      )
    }

    // Update the application status
    const updatedApplication = await db.application.update({
      where: { id: params.applicationId },
      data: { status },
    })

    // Create notification for the job seeker
    const statusMessages: Record<string, string> = {
      PENDING: `Your application for "${application.job.title}" is pending review`,
      REVIEWING: `Your application for "${application.job.title}" is being reviewed`,
      SHORTLISTED: `Congratulations! You've been shortlisted for "${application.job.title}"`,
      INTERVIEWED: `You've been selected for an interview for "${application.job.title}"`,
      OFFERED: `Great news! You've received a job offer for "${application.job.title}"`,
      REJECTED: `Your application for "${application.job.title}" was not selected at this time`,
      WITHDRAWN: `Your application for "${application.job.title}" has been withdrawn`,
    }

    await createNotification({
      userId: application.seeker.id,
      title: "Application Status Update",
      message: statusMessages[status] || `Your application status has been updated to ${status}`,
      type: status === "OFFERED" || status === "SHORTLISTED" || status === "INTERVIEWED" 
        ? "success" 
        : status === "REJECTED" 
        ? "error" 
        : "info",
    })

    return NextResponse.json({
      message: "Application status updated successfully",
      application: updatedApplication,
    })
  } catch (error) {
    console.error("Error updating application status:", error)
    return NextResponse.json(
      { message: "Failed to update application status" },
      { status: 500 }
    )
  }
}
