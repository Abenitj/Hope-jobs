import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Calendar, 
  Building2, 
  CheckCircle, 
  ArrowLeft, 
  Users,
  FileText,
  Award
} from "lucide-react"
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
      seekerId: userId,
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
  
  // Parse requirements into array if it's a string
  const requirementsList = job.requirements 
    ? job.requirements.split('\n').filter(req => req.trim())
    : []

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-6 text-white shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="text-white hover:bg-white/20"
            >
              <Link href="/seeker/jobs">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Job Details</h1>
              <p className="text-amber-100 text-sm mt-0.5">
                Review the position and apply
              </p>
            </div>
          </div>
          {!job.hasApplied && (
            <ApplyButton jobId={job.id} jobTitle={job.title} />
          )}
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Job Type</p>
                <p className="font-semibold">{job.type.replace("_", " ")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-semibold">{job.location || "Remote"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {job.salary && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/20">
                  <DollarSign className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Salary</p>
                  <p className="font-semibold">{job.salary}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Applicants</p>
                <p className="font-semibold">{job._count.applications}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - 3 Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company & Job Title */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-4 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl flex-shrink-0">
                  <Briefcase className="h-8 w-8 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium">{companyName}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge 
                      variant={job.status === "OPEN" ? "default" : "secondary"}
                      className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    >
                      {job.status}
                    </Badge>
                    {job.hasApplied && (
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Applied - {job.applicationStatus}
                      </Badge>
                    )}
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Posted {formatDistanceToNow(job.postedAt, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-amber-600" />
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {job.description}
              </p>
            </CardContent>
          </Card>

          {/* Requirements */}
          {requirementsList.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-600" />
                  Requirements & Qualifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {requirementsList.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Application Status */}
          {job.hasApplied ? (
            <Card className="border-green-200 dark:border-green-900/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Application Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                    You've applied for this position
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Status: <span className="font-semibold">{job.applicationStatus}</span>
                  </p>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/seeker/applications">View My Applications</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-amber-200 dark:border-amber-900/20">
              <CardHeader>
                <CardTitle className="text-base">Apply Now</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Interested in this position? Submit your application now!
                </p>
                <ApplyButton jobId={job.id} jobTitle={job.title} />
              </CardContent>
            </Card>
          )}

          {/* Company Information */}
          {job.employer.employerProfile && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-amber-600" />
                  About {companyName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {job.employer.employerProfile.description && (
                  <p className="text-sm text-muted-foreground">
                    {job.employer.employerProfile.description}
                  </p>
                )}
                
                <Separator />
                
                <div className="space-y-2 text-sm">
                  {job.employer.employerProfile.industry && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Industry:</span>
                      <span className="font-medium">{job.employer.employerProfile.industry}</span>
                    </div>
                  )}
                  {job.employer.employerProfile.companySize && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Company Size:</span>
                      <span className="font-medium">{job.employer.employerProfile.companySize}</span>
                    </div>
                  )}
                  {job.employer.employerProfile.location && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium">{job.employer.employerProfile.location}</span>
                    </div>
                  )}
                  {job.employer.employerProfile.website && (
                    <div className="pt-2">
                      <a
                        href={job.employer.employerProfile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-600 hover:underline text-sm font-medium"
                      >
                        Visit Company Website →
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Posted:</span>
                <span className="font-medium">
                  {format(new Date(job.postedAt), "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Applicants:</span>
                <span className="font-medium">{job._count.applications}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Job Status:</span>
                <Badge variant="outline" className="text-xs">
                  {job.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

