import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, FileText, Clock, CheckCircle, Eye, MapPin } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

async function getSeekerStats(userId: string) {
  const [applications, profile] = await Promise.all([
    db.application.findMany({
      where: { applicantId: userId },
      include: {
        job: {
          include: {
            employer: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { appliedAt: "desc" },
      take: 5,
    }),
    db.jobSeekerProfile.findUnique({
      where: { userId },
    }),
  ])

  const statusCounts = {
    pending: applications.filter((app) => app.status === "PENDING").length,
    reviewed: applications.filter((app) => app.status === "REVIEWED").length,
    accepted: applications.filter((app) => app.status === "ACCEPTED").length,
    rejected: applications.filter((app) => app.status === "REJECTED").length,
  }

  return {
    applications,
    statusCounts,
    totalApplications: applications.length,
    profile,
  }
}

async function getRecommendedJobs(userId: string) {
  // Get user's profile skills and preferences
  const profile = await db.jobSeekerProfile.findUnique({
    where: { userId },
  })

  // Get recent open jobs
  const jobs = await db.job.findMany({
    where: {
      status: "OPEN",
    },
    include: {
      employer: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          applications: true,
        },
      },
    },
    orderBy: { postedAt: "desc" },
    take: 6,
  })

  return jobs
}

export default async function SeekerDashboard() {
  const session = await auth()
  const userId = session!.user.id

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      avatar: true,
    },
  })

  const stats = await getSeekerStats(userId)
  const recommendedJobs = await getRecommendedJobs(userId)

  const kpiCards = [
    {
      label: "Total Applications",
      value: stats.totalApplications,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      label: "Pending Review",
      value: stats.statusCounts.pending,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    },
    {
      label: "Under Review",
      value: stats.statusCounts.reviewed,
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      label: "Accepted",
      value: stats.statusCounts.accepted,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
  ]

  const userName = user?.name || "Job Seeker"
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase()

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-6 text-white shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />
        <div className="relative z-10 flex items-center gap-4">
          {user?.avatar ? (
            <img 
              src={user.avatar}
              alt={userName}
              className="h-20 w-20 rounded-full object-cover border-3 border-white/30 shadow-lg"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 shadow-lg flex-shrink-0">
              <span className="text-3xl font-bold">
                {userInitials}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">
              Welcome Back, {userName}!
            </h1>
            <p className="text-amber-100 text-sm mt-0.5">
              Find your dream job today
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => (
          <Card key={card.label} className="hover:shadow-md transition-shadow">
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

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Applications */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Your latest job applications</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/seeker/applications">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stats.applications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No applications yet</p>
                <Button variant="link" asChild className="mt-2">
                  <Link href="/seeker/jobs">Browse Jobs</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.applications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                      <Briefcase className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{app.job.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {app.job.employer.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
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
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(app.appliedAt, { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommended Jobs */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recommended Jobs</CardTitle>
              <CardDescription>Jobs matching your profile</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/seeker/jobs">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recommendedJobs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Briefcase className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No jobs available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendedJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/seeker/jobs/${job.id}`}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{job.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {job.employer.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {job.location && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </span>
                        )}
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                          {job.type}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
