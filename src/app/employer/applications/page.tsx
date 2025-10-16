import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, Clock, CheckCircle, XCircle, Eye, Mail, Download } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ApplicationFilters } from "./application-filters"

interface SearchParams {
  search?: string
  status?: string
  job?: string
}

async function getApplications(userId: string, params: SearchParams) {
  const { search, status, job } = params
  const where: any = {
    job: { employerId: userId },
  }

  if (search) {
    where.seeker = {
      name: { contains: search },
    }
  }

  if (status && status !== "all") {
    where.status = status
  }

  if (job && job !== "all") {
    where.jobId = job
  }

  const applications = await db.application.findMany({
    where,
    include: {
      job: {
        select: { id: true, title: true, type: true },
      },
      seeker: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          seekerProfile: {
            select: {
              phone: true,
              skills: true,
              experience: true,
              resumeUrl: true,
            },
          },
        },
      },
    },
    orderBy: { appliedAt: "desc" },
  })

  const allApplications = await db.application.findMany({
    where: { job: { employerId: userId } },
    select: { status: true },
  })

  const stats = {
    total: allApplications.length,
    pending: allApplications.filter(a => a.status === "PENDING").length,
    reviewed: allApplications.filter(a => a.status === "REVIEWED").length,
    accepted: allApplications.filter(a => a.status === "ACCEPTED").length,
    rejected: allApplications.filter(a => a.status === "REJECTED").length,
    filtered: applications.length,
  }

  return { applications, stats }
}

export default async function EmployerApplicationsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const session = await auth()
  const { applications, stats } = await getApplications(session!.user.id, searchParams)

  const kpiCards = [
    {
      label: "Total Applications",
      value: stats.total,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      label: "Pending Review",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    },
    {
      label: "Reviewed",
      value: stats.reviewed,
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      label: "Accepted",
      value: stats.accepted,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-6 text-white shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
              <p className="text-amber-100 text-sm mt-0.5">
                {stats.filtered === stats.total 
                  ? `Review and manage ${stats.total} candidate applications`
                  : `Showing ${stats.filtered} of ${stats.total} applications`
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <ApplicationFilters />

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

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
          <CardDescription>
            Candidate applications for your job postings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
              <p className="text-muted-foreground">
                Applications will appear here once candidates apply to your jobs
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => {
                const initials = application.seeker.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()

                return (
                  <div
                    key={application.id}
                    className="flex items-start gap-4 p-4 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={application.seeker.avatar || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{application.seeker.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Applied for: {application.job.title}
                          </p>
                        </div>
                        <Badge
                          className={
                            application.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                              : application.status === "REVIEWED"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                              : application.status === "ACCEPTED"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                          }
                        >
                          {application.status}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-3">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {application.seeker.email}
                        </span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Applied {formatDistanceToNow(application.appliedAt, { addSuffix: true })}
                        </span>
                        <Badge variant="secondary">
                          {application.job.type.replace("_", " ")}
                        </Badge>
                      </div>

                      {application.seeker.seekerProfile?.skills && (
                        <div className="mt-3">
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            <span className="font-medium">Skills:</span> {application.seeker.seekerProfile.skills}
                          </p>
                        </div>
                      )}

                      {application.coverLetter && (
                        <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            <span className="font-medium">Cover Letter:</span> {application.coverLetter}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/employer/applications/${application.id}`}>
                          View Details
                        </Link>
                      </Button>
                      {application.seeker.seekerProfile?.resumeUrl && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={application.seeker.seekerProfile.resumeUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-2" />
                            Resume
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Rejected
                </p>
                <p className="text-2xl font-bold mt-1">{stats.rejected}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Acceptance Rate
                </p>
                <p className="text-2xl font-bold mt-1">
                  {stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0}%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Needs Attention
                </p>
                <p className="text-2xl font-bold mt-1">{stats.pending}</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
