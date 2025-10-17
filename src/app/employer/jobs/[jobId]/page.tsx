import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Briefcase, MapPin, Banknote, Clock, Users, Edit, Eye, ArrowLeft, CheckCircle, FileText } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

async function getJobDetails(jobId: string, userId: string) {
  const job = await db.job.findUnique({
    where: { id: jobId },
    include: {
      employer: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          applications: true,
        },
      },
    },
  })

  if (!job || job.employerId !== userId) {
    return null
  }

  return job
}

async function getJobApplications(jobId: string) {
  const applications = await db.application.findMany({
    where: { jobId },
    include: {
      seeker: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
    orderBy: { appliedAt: "desc" },
    take: 10,
  })

  return applications
}

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ jobId: string }>
}) {
  const session = await auth()
  const { jobId } = await params
  const job = await getJobDetails(jobId, session!.user.id)

  if (!job) {
    notFound()
  }

  const applications = await getJobApplications(jobId)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-6 text-white shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg">
              <Eye className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Job Details</h1>
              <p className="text-amber-100 text-sm mt-0.5">
                {job.title}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Link href="/employer/jobs">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-white text-amber-600 hover:bg-amber-50">
              <Link href={`/employer/jobs/${job.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Job
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Job Info Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20 mb-3">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Job Type</p>
              <p className="text-lg font-bold mt-1">{job.type.replace("_", " ")}</p>
            </div>
          </CardContent>
        </Card>

        {job.location && (
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20 mb-3">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p className="text-lg font-bold mt-1">{job.location}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {job.salary && (
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20 mb-3">
                  <Banknote className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Salary</p>
                <p className="text-lg font-bold mt-1">{job.salary}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/20 mb-3">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Applications</p>
              <p className="text-lg font-bold mt-1">{job._count.applications}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Content - 3 Columns */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Column 1: Description */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle>About this role</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
              {job.description}
            </p>
          </CardContent>
        </Card>

        {/* Column 2: Requirements OR Recent Applications */}
        {job.requirements ? (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle>Requirements</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {job.requirements.split('\n').filter(req => req.trim()).map((req, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{req.trim()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/20">
                  <Users className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-base">Recent Applications</CardTitle>
                  <CardDescription className="text-xs">
                    {job._count.applications} total
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No applications yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 5).map((app) => {
                    const initials = app.seeker.name.split(' ').map(n => n[0]).join('').toUpperCase()
                    
                    return (
                      <Link
                        key={app.id}
                        href={`/employer/applications/${app.id}`}
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={app.seeker.avatar || undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white text-sm">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{app.seeker.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(app.appliedAt, { addSuffix: true })}
                          </p>
                        </div>
                        <Badge
                          className={`text-xs ${
                            app.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                              : app.status === "REVIEWED"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                              : app.status === "ACCEPTED"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                          }`}
                        >
                          {app.status}
                        </Badge>
                      </Link>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Column 3: Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Job Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status */}
            <div>
              <p className="text-sm font-medium mb-2">Status</p>
              <Badge
                className={`w-full justify-center py-2 text-sm ${
                  job.status === "OPEN"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : job.status === "CLOSED"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                }`}
              >
                {job.status}
              </Badge>
            </div>

            <div className="h-px bg-border" />

            {/* Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Posted</span>
                <span className="text-sm font-medium">
                  {job.postedAt ? formatDistanceToNow(job.postedAt, { addSuffix: true }) : 'Draft'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Applications</span>
                <span className="text-sm font-medium">{job._count.applications}</span>
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Actions */}
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href={`/employer/jobs/${job.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Job
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href={`/employer/applications?job=${job.id}`}>
                  <Users className="h-4 w-4 mr-2" />
                  All Applications
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications - Full Width Below */}
      {job.requirements && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/20">
                  <Users className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>
                    {job._count.applications} candidates applied
                  </CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/employer/applications?job=${job.id}`}>
                  View All
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                <p className="text-sm">
                  Applications will appear here when candidates apply to this job
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {applications.map((app) => {
                  const initials = app.seeker.name.split(' ').map(n => n[0]).join('').toUpperCase()
                  
                  return (
                    <Link
                      key={app.id}
                      href={`/employer/applications/${app.id}`}
                      className="flex items-center gap-3 p-4 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={app.seeker.avatar || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{app.seeker.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(app.appliedAt, { addSuffix: true })}
                        </p>
                      </div>
                      <Badge
                        className={`text-xs ${
                          app.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                            : app.status === "REVIEWED"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                            : app.status === "ACCEPTED"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                      >
                        {app.status}
                      </Badge>
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

