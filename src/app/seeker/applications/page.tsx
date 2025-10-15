import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Briefcase, MapPin, Clock, FileText, Eye } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

async function getUserApplications(userId: string) {
  const applications = await db.application.findMany({
    where: { applicantId: userId },
    include: {
      job: {
        include: {
          employer: {
            select: {
              name: true,
              employerProfile: {
                select: {
                  companyName: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { appliedAt: "desc" },
  })

  return applications
}

export default async function MyApplicationsPage() {
  const session = await auth()
  const applications = await getUserApplications(session!.user.id)

  const statusCounts = {
    pending: applications.filter((app) => app.status === "PENDING").length,
    reviewed: applications.filter((app) => app.status === "REVIEWED").length,
    accepted: applications.filter((app) => app.status === "ACCEPTED").length,
    rejected: applications.filter((app) => app.status === "REJECTED").length,
  }

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
              <h1 className="text-2xl font-bold tracking-tight">My Applications</h1>
              <p className="text-amber-100 text-sm mt-0.5">
                Track your {applications.length} job applications
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold mt-1">{statusCounts.pending}</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reviewed</p>
                <p className="text-2xl font-bold mt-1">{statusCounts.reviewed}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <Eye className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Accepted</p>
                <p className="text-2xl font-bold mt-1">{statusCounts.accepted}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                <Briefcase className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold mt-1">{statusCounts.rejected}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
                <Clock className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                Start your job search and apply to positions that match your skills
                and interests.
              </p>
              <Button asChild>
                <Link href="/seeker/jobs">Browse Jobs</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          applications.map((application) => {
            const companyName =
              application.job.employer.employerProfile?.companyName ||
              application.job.employer.name

            return (
              <Card
                key={application.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Job Icon */}
                      <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg">
                        <Briefcase className="h-6 w-6 text-amber-600" />
                      </div>

                      {/* Application Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/seeker/jobs/${application.job.id}`}
                          className="text-lg font-semibold hover:text-amber-600 transition-colors"
                        >
                          {application.job.title}
                        </Link>
                        <p className="text-muted-foreground">{companyName}</p>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          {application.job.location && (
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {application.job.location}
                            </span>
                          )}
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            Applied {formatDistanceToNow(application.appliedAt, { addSuffix: true })}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div className="mt-3">
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

                        {/* Cover Letter Preview */}
                        {application.coverLetter && (
                          <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {application.coverLetter}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* View Job Button */}
                    <div className="flex-shrink-0">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/seeker/jobs/${application.job.id}`}>
                          View Job
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

