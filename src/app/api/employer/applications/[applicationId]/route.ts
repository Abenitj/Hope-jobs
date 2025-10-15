import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { createNotification } from "@/lib/notifications"

export async function PATCH(
  req: Request,
  { params }: { params: { applicationId: string } }
) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "EMPLOYER") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const application = await db.application.findUnique({
      where: { id: params.applicationId },
      include: { 
        job: true,
        seeker: true,
      },
    })

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      )
    }

    if (application.job.employerId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { status } = body

    const updatedApplication = await db.application.update({
      where: { id: params.applicationId },
      data: { status },
    })

    // Create notification for job seeker
    await createNotification({
      userId: application.seekerId,
      type: "APPLICATION",
      title: "Application Status Updated",
      message: `Your application for ${application.job.title} has been ${status.toLowerCase()}`,
      link: "/seeker/applications",
    })

    return NextResponse.json(updatedApplication)
  } catch (error) {
    console.error("[EMPLOYER_APPLICATION_PATCH]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}



