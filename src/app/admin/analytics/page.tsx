import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Briefcase, FileText } from "lucide-react"

async function getAnalytics() {
  const [
    totalUsers,
    activeUsers,
    suspendedUsers,
    totalJobs,
    openJobs,
    totalApplications,
    pendingApplications,
    usersByRole,
    topEmployers,
    recentApplications,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { status: "ACTIVE" } }),
    db.user.count({ where: { status: "SUSPENDED" } }),
    db.job.count(),
    db.job.count({ where: { status: "OPEN" } }),
    db.application.count(),
    db.application.count({ where: { status: "PENDING" } }),
    db.user.groupBy({
      by: ["role"],
      _count: true,
    }),
    db.user.findMany({
      where: { role: "EMPLOYER" },
      take: 10,
      include: {
        _count: { select: { jobs: true } },
        employerProfile: { select: { companyName: true } },
      },
      orderBy: { jobs: { _count: "desc" } },
    }),
    db.application.findMany({
      take: 10,
      orderBy: { appliedAt: "desc" },
      include: {
        job: { select: { title: true } },
        seeker: { select: { name: true, email: true } },
      },
    }),
  ])

  return {
    totalUsers,
    activeUsers,
    suspendedUsers,
    totalJobs,
    openJobs,
    totalApplications,
    pendingApplications,
    usersByRole,
    topEmployers,
    recentApplications,
  }
}

export default async function AdminAnalyticsPage() {
  const analytics = await getAnalytics()

  const roleDistribution = analytics.usersByRole.map((item) => ({
    role: item.role,
    count: item._count,
  }))

  const summaryCards = [
    {
      title: "Total Users",
      value: analytics.totalUsers,
      subtitle: `${analytics.activeUsers} active, ${analytics.suspendedUsers} suspended`,
      icon: Users,
      color: "text-amber-600",
    },
    {
      title: "Total Jobs",
      value: analytics.totalJobs,
      subtitle: `${analytics.openJobs} currently open`,
      icon: Briefcase,
      color: "text-orange-600",
    },
    {
      title: "Applications",
      value: analytics.totalApplications,
      subtitle: `${analytics.pendingApplications} pending review`,
      icon: FileText,
      color: "text-yellow-600",
    },
  ]

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Analytics & Reports</h1>
              <p className="text-amber-100 text-sm mt-0.5">
                Platform statistics and insights
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {summaryCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <p className="text-3xl font-bold mt-1">{card.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>User Distribution by Role</CardTitle>
          <CardDescription>Breakdown of users across different roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roleDistribution.map((item) => {
              const percentage = ((item.count / analytics.totalUsers) * 100).toFixed(1)
              return (
                <div key={item.role} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        item.role === "ADMIN" ? "destructive" :
                        item.role === "EMPLOYER" ? "default" : "secondary"
                      }>
                        {item.role}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{percentage}%</span>
                    </div>
                    <span className="text-sm font-medium">{item.count} users</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.role === "ADMIN" ? "bg-red-500" :
                        item.role === "EMPLOYER" ? "bg-amber-500" : "bg-orange-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Employers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Employers</CardTitle>
            <CardDescription>Companies posting the most jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Company</TableHead>
                  <TableHead className="text-right font-semibold">Jobs Posted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.topEmployers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground h-20">
                      No employers yet
                    </TableCell>
                  </TableRow>
                ) : (
                  analytics.topEmployers.map((employer) => (
                    <TableRow key={employer.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">
                            {employer.employerProfile?.companyName || employer.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{employer.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-bold text-amber-600">{employer._count.jobs}</span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Latest job applications on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Applicant</TableHead>
                  <TableHead className="font-semibold">Job</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.recentApplications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground h-20">
                      No applications yet
                    </TableCell>
                  </TableRow>
                ) : (
                  analytics.recentApplications.map((app) => (
                    <TableRow key={app.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{app.seeker.name}</p>
                          <p className="text-xs text-muted-foreground">{app.seeker.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{app.job.title}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          app.status === "ACCEPTED" ? "success" :
                          app.status === "REJECTED" ? "destructive" : "outline"
                        }>
                          {app.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
