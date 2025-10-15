import { db } from "@/lib/db"
import { JobsTable } from "./jobs-table"

async function getJobs() {
  const jobs = await db.job.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      employer: {
        select: {
          name: true,
          email: true,
          employerProfile: {
            select: {
              companyName: true,
            },
          },
        },
      },
      _count: {
        select: {
          applications: true,
        },
      },
    },
  })
  return jobs
}

export default async function AdminJobsPage() {
  const jobs = await getJobs()

  return (
    <div className="space-y-6">
      {/* Beautiful Page Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-6 text-white shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Job Moderation</h1>
              <p className="text-amber-100 text-sm mt-0.5">
                Review and manage all job postings
              </p>
            </div>
          </div>
        </div>
      </div>

      <JobsTable jobs={jobs} />
    </div>
  )
}
