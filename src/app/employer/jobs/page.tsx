import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Plus, MapPin, DollarSign, Clock, Eye, Users, Edit, Trash2, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { JobFilters } from "./job-filters"
import { DeleteJobButton } from "./delete-job-button"

interface SearchParams {
  search?: string
  status?: string
  type?: string
  location?: string
}

async function getEmployerJobs(userId: string, params: SearchParams) {
  const { search, status, type, location } = params

  const where: any = { employerId: userId }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ]
  }

  if (status && status !== "all") {
    where.status = status
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
      _count: {
        select: {
          applications: true,
        },
      },
    },
    orderBy: { postedAt: "desc" },
  })

  const allJobs = await db.job.findMany({
    where: { employerId: userId },
    select: {
      status: true,
      _count: {
        select: {
          applications: true,
        },
      },
    },
  })

  const stats = {
    total: allJobs.length,
    open: allJobs.filter(j => j.status === "OPEN").length,
    closed: allJobs.filter(j => j.status === "CLOSED").length,
    draft: allJobs.filter(j => j.status === "DRAFT").length,
    totalApplications: allJobs.reduce((sum, job) => sum + job._count.applications, 0),
    filtered: jobs.length,
  }

  return { jobs, stats }
}

export default async function EmployerJobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const session = await auth()
  const params = await searchParams
  const { jobs, stats } = await getEmployerJobs(session!.user.id, params)

  const kpiCards = [
    {
      label: "Total Jobs",
      value: stats.total,
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      label: "Open Jobs",
      value: stats.open,
      icon: Eye,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      label: "Total Applications",
      value: stats.totalApplications,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      label: "Draft Jobs",
      value: stats.draft,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-6 text-white shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">My Jobs</h1>
              <p className="text-amber-100 text-sm mt-0.5">
                {stats.filtered === stats.total 
                  ? `Manage your ${stats.total} job postings`
                  : `Showing ${stats.filtered} of ${stats.total} jobs`
                }
              </p>
            </div>
          </div>
          <Button asChild size="lg" className="bg-white text-amber-600 hover:bg-amber-50">
            <Link href="/employer/jobs/new">
              <Plus className="h-5 w-5 mr-2" />
              Post New Job
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <JobFilters />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => (
          <Card key={card.label} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold mt-1">{card.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Jobs List */}
      <Card>
        <CardHeader>
          <CardTitle>All Job Postings</CardTitle>
          <CardDescription>
            View and manage all your job listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No jobs posted yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by posting your first job to attract candidates
              </p>
              <Button asChild>
                <Link href="/employer/jobs/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Your First Job
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-start gap-4 p-4 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg">
                    <Briefcase className="h-6 w-6 text-amber-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <Link
                          href={`/employer/jobs/${job.id}`}
                          className="text-lg font-semibold hover:text-amber-600 transition-colors"
                        >
                          {job.title}
                        </Link>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {job.description}
                        </p>
                      </div>
                      <Badge
                        className={
                          job.status === "OPEN"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : job.status === "CLOSED"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                        }
                      >
                        {job.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      {job.location && (
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                      )}
                      {job.salary && (
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {job.salary}
                        </span>
                      )}
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.postedAt ? `Posted ${formatDistanceToNow(job.postedAt, { addSuffix: true })}` : 'Draft'}
                      </span>
                      <span className="text-sm font-medium text-blue-600 flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {job._count.applications} applications
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="secondary">{job.type.replace("_", " ")}</Badge>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/employer/jobs/${job.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/employer/jobs/${job.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                          <Link href={`/employer/applications?job=${job.id}`} className="cursor-pointer">
                            <Users className="h-4 w-4 mr-2" />
                            View Applications ({job._count.applications})
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/employer/jobs/${job.id}/edit`} className="cursor-pointer">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Job
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DeleteJobButton 
                          jobId={job.id} 
                          jobTitle={job.title}
                          applicationsCount={job._count.applications}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
