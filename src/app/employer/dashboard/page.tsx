import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, FileText, Users, CheckCircle, Clock, XCircle, TrendingUp, Eye } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ProfileImage } from "./profile-image"

async function getEmployerStats(userId: string) {
  const [
    totalJobs,
    activeJobs,
    totalApplications,
    pendingApplications,
    acceptedApplications,
    rejectedApplications,
    recentJobs,
    recentApplications,
  ] = await Promise.all([
    db.job.count({ where: { employerId: userId } }),
    db.job.count({ where: { employerId: userId, status: "OPEN" } }),
    db.application.count({
      where: {
        job: { employerId: userId },
      },
    }),
    db.application.count({
      where: {
        job: { employerId: userId },
        status: "PENDING",
      },
    }),
    db.application.count({
      where: {
        job: { employerId: userId },
        status: "ACCEPTED",
      },
    }),
    db.application.count({
      where: {
        job: { employerId: userId },
        status: "REJECTED",
      },
    }),
    db.job.findMany({
      where: { employerId: userId },
      take: 5,
      orderBy: { postedAt: "desc" },
      include: {
        _count: { select: { applications: true } },
      },
    }),
    db.application.findMany({
      where: {
        job: { employerId: userId },
      },
      take: 5,
      orderBy: { appliedAt: "desc" },
      include: {
        job: { select: { title: true } },
        seeker: { select: { name: true, email: true } },
      },
    }),
  ])

  return {
    totalJobs,
    activeJobs,
    totalApplications,
    pendingApplications,
    acceptedApplications,
    rejectedApplications,
    recentJobs,
    recentApplications,
  }
}

export default async function EmployerDashboard() {
  const session = await auth()
  const stats = await getEmployerStats(session!.user.id)

  const user = await db.user.findUnique({
    where: { id: session!.user.id },
    select: {
      name: true,
      avatar: true,
    },
  })

  const employerName = user?.name || "Employer"
  const employerInitials = employerName.split(' ').map(n => n[0]).join('').toUpperCase()

  const kpiCards = [
    {
      label: "Active Jobs",
      value: stats.activeJobs,
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      label: "Total Applications",
      value: stats.totalApplications,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      label: "Pending Review",
      value: stats.pendingApplications,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
      gradient: "from-yellow-500 to-yellow-600",
    },
    {
      label: "Accepted",
      value: stats.acceptedApplications,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      gradient: "from-green-500 to-green-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-6 text-white shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />
        <div className="relative z-10 flex items-center gap-4">
          <ProfileImage name={employerName} avatar={user?.avatar || null} />
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">
              Welcome Back, {employerName}!
            </h1>
            <p className="text-amber-100 text-sm mt-0.5">
              Manage your job postings and candidates
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => (
          <Card key={card.label} className="relative overflow-hidden hover:shadow-lg transition-shadow">
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-5`} />
            <CardContent className="pt-6 relative">
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

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Jobs Posted
                </p>
                <p className="text-2xl font-bold mt-1">{stats.totalJobs}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Rejected
                </p>
                <p className="text-2xl font-bold mt-1">{stats.rejectedApplications}</p>
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
                  Success Rate
                </p>
                <p className="text-2xl font-bold mt-1">
                  {stats.totalApplications > 0 
                    ? Math.round((stats.acceptedApplications / stats.totalApplications) * 100)
                    : 0}%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs and Applications */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Jobs</CardTitle>
              <CardDescription>Your latest job postings</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/employer/jobs">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stats.recentJobs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Briefcase className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No jobs posted yet</p>
                <Button variant="link" asChild className="mt-2">
                  <Link href="/employer/jobs/new">Post a Job</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                      <Briefcase className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{job.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {job._count.applications} applications
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Posted {formatDistanceToNow(job.postedAt, { addSuffix: true })}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/employer/jobs/${job.id}`}>View</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Latest candidate applications</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/employer/applications">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stats.recentApplications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No applications yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentApplications.map((application) => (
                  <div
                    key={application.id}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{application.seeker.name}</h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {application.job.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            application.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                              : application.status === "REVIEWED"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                              : application.status === "ACCEPTED"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                          }`}
                        >
                          {application.status}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(application.appliedAt, { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/employer/applications/${application.id}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
