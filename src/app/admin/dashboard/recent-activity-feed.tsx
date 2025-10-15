"use client"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserPlus, Briefcase, FileText } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Activity {
  type: "user" | "job" | "application"
  title: string
  subtitle: string
  time: Date
  status?: string
}

interface RecentActivityFeedProps {
  users: any[]
  jobs: any[]
  applications: any[]
}

export function RecentActivityFeed({ users, jobs, applications }: RecentActivityFeedProps) {
  const activities: Activity[] = [
    ...users.slice(0, 3).map(user => ({
      type: "user" as const,
      title: user.name,
      subtitle: `New ${user.role.toLowerCase()} registered`,
      time: user.createdAt,
      status: user.status,
    })),
    ...jobs.slice(0, 3).map(job => ({
      type: "job" as const,
      title: job.title,
      subtitle: job.employer.employerProfile?.companyName || job.employer.name,
      time: job.createdAt,
      status: job.status,
    })),
    ...applications.slice(0, 4).map(app => ({
      type: "application" as const,
      title: app.seeker.name,
      subtitle: `Applied for ${app.job.title}`,
      time: app.appliedAt,
      status: app.status,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8)

  const getIcon = (type: string) => {
    switch (type) {
      case "user":
        return UserPlus
      case "job":
        return Briefcase
      case "application":
        return FileText
      default:
        return UserPlus
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
      case "OPEN":
      case "ACCEPTED":
        return "success"
      case "PENDING":
        return "outline"
      case "CLOSED":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = getIcon(activity.type)
          return (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.subtitle}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                  </p>
                  {activity.status && (
                    <Badge variant={getStatusColor(activity.status) as any} className="text-xs">
                      {activity.status}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}


