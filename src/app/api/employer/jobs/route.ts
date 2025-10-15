import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "EMPLOYER") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const {
      title,
      description,
      location,
      type,
      salary,
      requirements,
      responsibilities,
      skills,
      status,
      postedAt,
    } = body

    if (!title || !description || !location || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const job = await db.job.create({
      data: {
        employerId: session.user.id,
        title,
        description,
        location,
        type,
        salary: salary || null,
        requirements: requirements || null,
        responsibilities: responsibilities || null,
        skills: skills || null,
        status: status || "DRAFT",
        postedAt: postedAt ? new Date(postedAt) : null,
      },
    })

    return NextResponse.json(job)
  } catch (error) {
    console.error("[EMPLOYER_JOBS_POST]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


