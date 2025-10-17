"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, MapPin, Clock, CheckCircle, Banknote } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface JobCardProps {
  job: {
    id: string
    title: string
    description: string
    type: string
    location: string | null
    salary: string | null
    postedAt: Date | null
    hasApplied: boolean
    employer: {
      name: string
      avatar: string | null
      employerProfile: {
        companyName: string | null
      } | null
    }
    _count: {
      applications: number
    }
  }
}

export function JobCard({ job }: JobCardProps) {
  const companyName = job.employer.employerProfile?.companyName || job.employer.name

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            {/* Company Logo/Avatar */}
            <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg">
              <Briefcase className="h-6 w-6 text-amber-600" />
            </div>

            {/* Job Info */}
            <div className="flex-1 min-w-0">
              <Link
                href={`/seeker/jobs/${job.id}`}
                className="text-lg font-semibold hover:text-amber-600 transition-colors"
              >
                {job.title}
              </Link>
              <p className="text-muted-foreground">{companyName}</p>

              {/* Job Meta */}
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {job.location && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {job.location}
                  </span>
                )}
                {job.salary && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Banknote className="h-3.5 w-3.5" />
                    {job.salary}
                  </span>
                )}
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {job.postedAt ? formatDistanceToNow(job.postedAt, { addSuffix: true }) : 'Draft'}
                </span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Badge variant="secondary">{job.type.replace("_", " ")}</Badge>
                {job.hasApplied && (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Applied
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {job._count.applications} applicants
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0">
            {job.hasApplied ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/seeker/jobs/${job.id}`}>View Details</Link>
              </Button>
            ) : (
              <Button size="sm" asChild>
                <Link href={`/seeker/jobs/${job.id}`}>Apply Now</Link>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {job.description}
        </p>
      </CardContent>
    </Card>
  )
}

