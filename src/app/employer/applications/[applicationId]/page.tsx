import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  FileText, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar,
  Download,
  MessageSquare,
  ArrowLeft,
  User,
  Clock,
  Award,
  GraduationCap,
  CheckCircle
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ApplicationStatusForm } from "./application-status-form"

async function getApplicationDetails(applicationId: string, employerId: string) {
  const application = await db.application.findUnique({
    where: { 
      id: applicationId,
    },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          type: true,
          location: true,
          salary: true,
          employerId: true,
        },
      },
      seeker: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          createdAt: true,
          seekerProfile: {
            select: {
              phone: true,
              bio: true,
              skills: true,
              experience: true,
              education: true,
              resumeUrl: true,
              availability: true,
              location: true,
            },
          },
          _count: {
            select: {
              applications: true,
            },
          },
        },
      },
    },
  })

  // Check if application exists and belongs to this employer
  if (!application || application.job.employerId !== employerId) {
    return null
  }

  return application
}

export default async function ApplicationDetailsPage({
  params,
}: {
  params: Promise<{ applicationId: string }>
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== "EMPLOYER") {
    redirect("/auth/signin")
  }

  const { applicationId } = await params
  const application = await getApplicationDetails(applicationId, session.user.id)

  if (!application) {
    notFound()
  }

  const initials = application.seeker.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
    REVIEWING: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    SHORTLISTED: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
    INTERVIEWED: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400",
    OFFERED: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
    WITHDRAWN: "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400",
  }

  const availabilityColors: Record<string, string> = {
    IMMEDIATELY: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    WITHIN_2_WEEKS: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    WITHIN_1_MONTH: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
    NOT_AVAILABLE: "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400",
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/employer/applications">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applications
        </Link>
      </Button>

      {/* Application Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-8 text-white shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />
        
        <div className="relative z-10">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24 border-4 border-white/30">
              <AvatarImage src={application.seeker.avatar || undefined} />
              <AvatarFallback className="bg-white/20 backdrop-blur-sm text-white text-3xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">{application.seeker.name}</h1>
                  <p className="text-amber-100 text-lg mt-1">
                    Applied for: <span className="font-semibold text-white">{application.job.title}</span>
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-amber-100">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Applied {formatDistanceToNow(application.appliedAt, { addSuffix: true })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {application.job.type.replace("_", " ")}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {application.job.location}
                    </span>
                  </div>
                </div>
                <Badge className={`${statusColors[application.status]} text-sm px-3 py-1`}>
                  {application.status}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-4">
                {application.seeker.seekerProfile?.resumeUrl && (
                  <Button variant="secondary" size="sm" asChild>
                    <a
                      href={application.seeker.seekerProfile.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Resume
                    </a>
                  </Button>
                )}
                <Button variant="secondary" size="sm" asChild>
                  <Link href={`/employer/candidates/${application.seeker.id}`}>
                    <User className="h-4 w-4 mr-2" />
                    View Full Profile
                  </Link>
                </Button>
                <Button variant="secondary" size="sm" asChild>
                  <Link href={`/employer/messages?user=${application.seeker.id}`}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Status Management & Contact */}
        <div className="space-y-6">
          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                Application Status
              </CardTitle>
              <CardDescription>
                Update the application progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApplicationStatusForm 
                applicationId={application.id} 
                currentStatus={application.status}
                seekerId={application.seeker.id}
              />
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <Mail className="h-5 w-5 text-green-600" />
                </div>
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <a 
                    href={`mailto:${application.seeker.email}`}
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    {application.seeker.email}
                  </a>
                </div>
              </div>

              {application.seeker.seekerProfile?.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <a 
                      href={`tel:${application.seeker.seekerProfile.phone}`}
                      className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                    >
                      {application.seeker.seekerProfile.phone}
                    </a>
                  </div>
                </div>
              )}

              {application.seeker.seekerProfile?.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {application.seeker.seekerProfile.location}
                    </p>
                  </div>
                </div>
              )}

              {application.seeker.seekerProfile?.availability && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Availability</p>
                    <Badge className={`${availabilityColors[application.seeker.seekerProfile.availability]} mt-1`}>
                      {application.seeker.seekerProfile.availability.replace(/_/g, " ")}
                    </Badge>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 pt-3 border-t">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Total Applications</p>
                  <p className="text-sm text-muted-foreground">
                    {application.seeker._count.applications} applications submitted
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          {application.seeker.seekerProfile?.skills && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {application.seeker.seekerProfile.skills.split(',').map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill.trim()}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Cover Letter, Experience, Education */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cover Letter */}
          {application.coverLetter && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/20">
                    <FileText className="h-5 w-5 text-amber-600" />
                  </div>
                  Cover Letter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {application.coverLetter}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Bio */}
          {application.seeker.seekerProfile?.bio && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/20">
                    <User className="h-5 w-5 text-indigo-600" />
                  </div>
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {application.seeker.seekerProfile.bio}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Work Experience */}
          {application.seeker.seekerProfile?.experience && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                    <Briefcase className="h-5 w-5 text-green-600" />
                  </div>
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {application.seeker.seekerProfile.experience}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Education */}
          {application.seeker.seekerProfile?.education && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900/20">
                    <GraduationCap className="h-5 w-5 text-pink-600" />
                  </div>
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {application.seeker.seekerProfile.education}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                </div>
                Job Details
              </CardTitle>
              <CardDescription>
                Position applied for
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Position</p>
                <Link 
                  href={`/employer/jobs/${application.job.id}`}
                  className="text-lg font-semibold hover:underline"
                >
                  {application.job.title}
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Job Type</p>
                  <p className="text-sm">{application.job.type.replace("_", " ")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="text-sm">{application.job.location}</p>
                </div>
                {application.job.salary && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Salary</p>
                    <p className="text-sm">{application.job.salary}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Applied</p>
                  <p className="text-sm">
                    {new Date(application.appliedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

