import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const job = await db.job.findUnique({
      where: { id: params.jobId },
    })

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      )
    }

    await db.job.delete({
      where: { id: params.jobId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[ADMIN_JOB_DELETE]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


