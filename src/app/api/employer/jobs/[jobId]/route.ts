import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "EMPLOYER") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { jobId } = await params

    const job = await db.job.findUnique({
      where: { id: jobId },
    })

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      )
    }

    if (job.employerId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    const body = await req.json()

    const updatedJob = await db.job.update({
      where: { id: jobId },
      data: {
        ...body,
        postedAt: body.postedAt ? new Date(body.postedAt) : job.postedAt,
      },
    })

    return NextResponse.json(updatedJob)
  } catch (error) {
    console.error("[EMPLOYER_JOB_PATCH]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "EMPLOYER") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { jobId } = await params

    const job = await db.job.findUnique({
      where: { id: jobId },
    })

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      )
    }

    if (job.employerId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    await db.job.delete({
      where: { id: jobId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[EMPLOYER_JOB_DELETE]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


