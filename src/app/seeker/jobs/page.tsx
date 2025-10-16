import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Briefcase, MapPin, DollarSign, Clock, Search } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { JobSearchFilters } from "./job-search-filters"
import { JobCard } from "./job-card"

interface SearchParams {
  search?: string
  type?: string
  location?: string
}

async function searchJobs(params: SearchParams, userId: string) {
  const { search, type, location } = params

  // Get user's existing applications
  const existingApplications = await db.application.findMany({
    where: { seekerId: userId },
    select: { jobId: true },
  })

  const appliedJobIds = existingApplications.map((app) => app.jobId)

  const where: any = {
    status: "OPEN",
  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { requirements: { contains: search } },
    ]
  }

  if (type && type !== "all") {
    where.type = type
  }

  if (location) {
    where.location = { contains: location }
  }

  const jobs = await db.job.findMany({
    where,
    include: {
      employer: {
        select: {
          name: true,
          avatar: true,
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
    orderBy: { postedAt: "desc" },
  })

  return jobs.map((job) => ({
    ...job,
    hasApplied: appliedJobIds.includes(job.id),
  }))
}

export default async function BrowseJobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const session = await auth()
  const params = await searchParams
  const jobs = await searchJobs(params, session!.user.id)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-6 text-white shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg">
              <Search className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Browse Jobs</h1>
              <p className="text-amber-100 text-sm mt-0.5">
                Find your next opportunity from {jobs.length} available positions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <JobSearchFilters />

      {/* Job Results */}
      <div className="grid gap-4">
        {jobs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Briefcase className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
              <p className="text-muted-foreground text-center max-w-md">
                We couldn't find any jobs matching your criteria. Try adjusting your
                filters or search terms.
              </p>
            </CardContent>
          </Card>
        ) : (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        )}
      </div>
    </div>
  )
}

