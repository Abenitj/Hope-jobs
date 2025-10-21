import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, FileText, Clock, CheckCircle, Eye, MapPin, Sparkles } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ProfileImage } from "./profile-image"
import { getTopRecommendations } from "@/lib/recommendations"

async function getSeekerStats(userId: string) {
  const [applications, profile] = await Promise.all([
    db.application.findMany({
      where: { seekerId: userId },
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
    reviewing: applications.filter((app) => app.status === "REVIEWING").length,
    shortlisted: applications.filter((app) => app.status === "SHORTLISTED").length,
    interviewed: applications.filter((app) => app.status === "INTERVIEWED").length,
    offered: applications.filter((app) => app.status === "OFFERED").length,
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
  // Get user's profile with skills and preferences
  const profile = await db.jobSeekerProfile.findUnique({
    where: { userId },
    select: {
      skills: true,
      preferredJobTypes: true,
      location: true,
      experience: true,
    },
  })

  // Get user's existing applications to exclude already applied jobs
  const existingApplications = await db.application.findMany({
    where: { seekerId: userId },
    select: { jobId: true },
  })
  const appliedJobIds = existingApplications.map((app) => app.jobId)

  // Get all open jobs
  const jobs = await db.job.findMany({
    where: {
      status: "OPEN",
      id: {
        notIn: appliedJobIds, // Exclude jobs user already applied to
      },
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
    take: 50, // Get more jobs for better recommendations
  })

  // Use recommendation algorithm to score and rank jobs
  const recommendedJobs = getTopRecommendations(
    profile || {},
    jobs,
    6 // Return top 6 matches
  )

  return recommendedJobs
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
      label: "Shortlisted",
      value: stats.statusCounts.shortlisted,
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      label: "Offered",
      value: stats.statusCounts.offered,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
  ]

  const userName = user?.name || "Job Seeker"

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-6 text-white shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />
        <div className="relative z-10 flex items-center gap-4">
          <ProfileImage name={userName} avatar={user?.avatar || null} />
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
                              : app.status === "REVIEWING"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                              : app.status === "SHORTLISTED"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                              : app.status === "INTERVIEWED"
                              ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400"
                              : app.status === "OFFERED"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : app.status === "REJECTED"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
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
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Recommended for You
              </CardTitle>
              <CardDescription>Jobs matching your skills and preferences</CardDescription>
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
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg group-hover:scale-110 transition-transform">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium truncate">{job.title}</h4>
                        {job.matchScore && job.matchScore > 50 && (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-semibold shrink-0">
                            <Sparkles className="h-3 w-3" />
                            {job.matchScore}%
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {job.employer.name}
                      </p>
                      {job.matchReasons && job.matchReasons.length > 0 && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 line-clamp-1">
                          ✓ {job.matchReasons[0]}
                        </p>
                      )}
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
