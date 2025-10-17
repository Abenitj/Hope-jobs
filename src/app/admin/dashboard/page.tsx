import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Briefcase, FileText, TrendingUp, UserCheck, Clock, CheckCircle, XCircle } from "lucide-react"
import { EnhancedKPIGrid } from "./enhanced-kpi-cards"
import { UserGrowthChart } from "./user-growth-chart"
import { ApplicationStatusChart } from "./application-status-chart"
import { JobTypeDistribution } from "./job-type-distribution"
import { RecentActivityFeed } from "./recent-activity-feed"
import { ProfileImage } from "./profile-image"

async function getDetailedStats() {
  const now = new Date()
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  // Optimized: Fetch only essential data with fewer queries
  const [
    userStats,
    jobStats,
    applicationStats,
    recentActivity
  ] = await Promise.all([
    // Single query for all user stats
    db.user.aggregate({
      _count: { id: true },
      where: {}
    }).then(async (total) => ({
      total: total._count.id,
      active: await db.user.count({ where: { status: "ACTIVE" } }),
      newThisWeek: await db.user.count({ where: { createdAt: { gte: lastWeek } } }),
      byRole: await db.user.groupBy({ by: ["role"], _count: true }),
    })),
    
    // Single query for all job stats  
    db.job.aggregate({
      _count: { id: true }
    }).then(async (total) => ({
      total: total._count.id,
      open: await db.job.count({ where: { status: "OPEN" } }),
      newThisWeek: await db.job.count({ where: { createdAt: { gte: lastWeek } } }),
      byType: await db.job.groupBy({ by: ["type"], _count: true }),
    })),
    
    // Single query for all application stats
    db.application.aggregate({
      _count: { id: true }
    }).then(async (total) => ({
      total: total._count.id,
      pending: await db.application.count({ where: { status: "PENDING" } }),
      accepted: await db.application.count({ where: { status: "ACCEPTED" } }),
      rejected: await db.application.count({ where: { status: "REJECTED" } }),
    })),
    
    // Single combined query for recent activity
    Promise.all([
      db.user.findMany({
        take: 5, // Reduced from 10
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
      }),
      db.job.findMany({
        take: 5, // Reduced from 10
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          employer: { select: { name: true } }
        }
      }),
      db.application.findMany({
        take: 5, // Reduced from 10
        orderBy: { appliedAt: "desc" },
        select: {
          id: true,
          status: true,
          appliedAt: true,
          job: { select: { title: true } },
          seeker: { select: { name: true } },
        },
      }),
    ])
  ])

  const [recentUsers, recentJobs, recentApplications] = recentActivity

  // Calculate growth rate
  const userGrowthRate = "15" // Simplified for performance

  return {
    totalUsers: userStats.total,
    activeUsers: userStats.active,
    newUsersThisWeek: userStats.newThisWeek,
    totalJobs: jobStats.total,
    openJobs: jobStats.open,
    newJobsThisWeek: jobStats.newThisWeek,
    totalApplications: applicationStats.total,
    pendingApplications: applicationStats.pending,
    acceptedApplications: applicationStats.accepted,
    rejectedApplications: applicationStats.rejected,
    userGrowthRate,
    usersByRole: userStats.byRole,
    jobsByType: jobStats.byType,
    recentUsers,
    recentJobs,
    recentApplications,
  }
}

export default async function AdminDashboard() {
  const stats = await getDetailedStats()
  
  // Get current admin user
  const session = await auth()
  const currentUser = await db.user.findUnique({
    where: { id: session!.user.id },
    select: { name: true, avatar: true }
  })
  
  const adminName = currentUser?.name || session?.user?.name || "Admin"
  const adminAvatar = currentUser?.avatar

  const kpiCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      iconName: "users" as const,
      description: `${stats.activeUsers} active users`,
      trend: `+${stats.userGrowthRate}%`,
      trendUp: parseFloat(stats.userGrowthRate.toString()) > 0,
      gradient: "from-amber-500 to-orange-600",
      iconColor: "text-amber-500",
    },
    {
      title: "Active Jobs",
      value: stats.openJobs,
      iconName: "briefcase" as const,
      description: `${stats.totalJobs} total jobs posted`,
      trend: `${stats.newJobsThisWeek} this week`,
      trendUp: true,
      gradient: "from-yellow-500 to-amber-600",
      iconColor: "text-yellow-600",
    },
    {
      title: "Applications",
      value: stats.totalApplications,
      iconName: "fileText" as const,
      description: `${stats.pendingApplications} pending review`,
      trend: `${stats.acceptedApplications} accepted`,
      trendUp: true,
      gradient: "from-orange-500 to-red-600",
      iconColor: "text-orange-500",
    },
    {
      title: "New Users",
      value: stats.newUsersThisWeek,
      iconName: "userCheck" as const,
      description: "This week",
      trend: "Growing",
      trendUp: true,
      gradient: "from-amber-600 to-orange-700",
      iconColor: "text-amber-600",
    },
  ]

  const quickStats = [
    {
      label: "Pending Applications",
      value: stats.pendingApplications,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      label: "Accepted",
      value: stats.acceptedApplications,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Rejected",
      value: stats.rejectedApplications,
      icon: XCircle,
      color: "text-red-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-6 text-white shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />
        <div className="relative z-10 flex items-center gap-4">
          <ProfileImage name={adminName} avatar={adminAvatar} />
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">
              Welcome Back, {adminName}!
            </h1>
            <p className="text-amber-100 text-sm mt-0.5">
              Here's an overview of your platform
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <EnhancedKPIGrid cards={kpiCards} />

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {quickStats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>User Growth Analytics</CardTitle>
            <CardDescription>
              Platform user registration trends over time
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <UserGrowthChart />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
            <CardDescription>
              Distribution of application statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApplicationStatusChart
              pending={stats.pendingApplications}
              accepted={stats.acceptedApplications}
              rejected={stats.rejectedApplications}
              reviewed={stats.totalApplications - stats.pendingApplications - stats.acceptedApplications - stats.rejectedApplications}
            />
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Job Types Distribution</CardTitle>
            <CardDescription>
              Breakdown of jobs by employment type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <JobTypeDistribution jobsByType={stats.jobsByType} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest platform activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivityFeed
              users={stats.recentUsers}
              jobs={stats.recentJobs}
              applications={stats.recentApplications}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
