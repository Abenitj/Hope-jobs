import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Briefcase, MapPin, DollarSign, Clock, Calendar, Building2, CheckCircle } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import Link from "next/link"
import { ApplyButton } from "./apply-button"

async function getJobDetails(jobId: string, userId: string) {
  const job = await db.job.findUnique({
    where: { id: jobId },
    include: {
      employer: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          employerProfile: true,
        },
      },
      _count: {
        select: {
          applications: true,
        },
      },
    },
  })

  if (!job) {
    return null
  }

  // Check if user already applied
  const existingApplication = await db.application.findFirst({
    where: {
      jobId,
      applicantId: userId,
    },
  })

  return {
    ...job,
    hasApplied: !!existingApplication,
    applicationStatus: existingApplication?.status,
  }
}

export default async function JobDetailsPage({
  params,
}: {
  params: { jobId: string }
}) {
  const session = await auth()
  const job = await getJobDetails(params.jobId, session!.user.id)

  if (!job) {
    notFound()
  }

  const companyName = job.employer.employerProfile?.companyName || job.employer.name

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Job Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              {/* Company Logo */}
              <div className="p-4 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl">
                <Briefcase className="h-8 w-8 text-amber-600" />
              </div>

              {/* Job Title & Company */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                  {job.title}
                </h1>
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-lg text-muted-foreground">{companyName}</span>
                </div>

                {/* Job Meta */}
                <div className="flex flex-wrap items-center gap-4">
                  {job.location && (
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                  )}
                  {job.salary && (
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {job.salary}
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Posted {formatDistanceToNow(job.postedAt, { addSuffix: true })}
                  </span>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Badge variant="secondary" className="text-sm">
                    {job.type.replace("_", " ")}
                  </Badge>
                  <Badge
                    variant={job.status === "OPEN" ? "default" : "secondary"}
                    className="text-sm"
                  >
                    {job.status}
                  </Badge>
                  {job.hasApplied && (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Applied - {job.applicationStatus}
                    </Badge>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {job._count.applications} applicants
                  </span>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="flex-shrink-0">
              {job.hasApplied ? (
                <Button variant="outline" asChild>
                  <Link href="/seeker/applications">View Application</Link>
                </Button>
              ) : (
                <ApplyButton jobId={job.id} jobTitle={job.title} />
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Job Description */}
      <Card>
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p className="whitespace-pre-line">{job.description}</p>
        </CardContent>
      </Card>

      {/* Requirements */}
      {job.requirements && (
        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-line">{job.requirements}</p>
          </CardContent>
        </Card>
      )}

      {/* About Company */}
      {job.employer.employerProfile && (
        <Card>
          <CardHeader>
            <CardTitle>About {companyName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {job.employer.employerProfile.companyDescription && (
                <p className="text-muted-foreground">
                  {job.employer.employerProfile.companyDescription}
                </p>
              )}
              {job.employer.employerProfile.companyWebsite && (
                <div>
                  <span className="text-sm font-medium">Website: </span>
                  <a
                    href={job.employer.employerProfile.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:underline text-sm"
                  >
                    {job.employer.employerProfile.companyWebsite}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

