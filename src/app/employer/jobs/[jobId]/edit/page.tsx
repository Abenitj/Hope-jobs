import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { JobForm } from "../../job-form"
import { Edit, ArrowLeft } from "lucide-react"
import Link from "next/link"

async function getJob(jobId: string, userId: string) {
  const job = await db.job.findUnique({
    where: { id: jobId },
  })

  if (!job || job.employerId !== userId) {
    return null
  }

  return job
}

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ jobId: string }>
}) {
  const session = await auth()
  const { jobId } = await params
  const job = await getJob(jobId, session!.user.id)

  if (!job) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-6 text-white shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg">
              <Edit className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Edit Job</h1>
              <p className="text-amber-100 text-sm mt-0.5">
                {job.title}
              </p>
            </div>
          </div>
          <Button asChild size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
            <Link href={`/employer/jobs/${job.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Details
            </Link>
          </Button>
        </div>
      </div>

      <JobForm job={job} />
    </div>
  )
}

