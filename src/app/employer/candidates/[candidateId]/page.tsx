import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Award,
  Download,
  MessageSquare,
  Calendar,
  CheckCircle,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"

async function getCandidateProfile(candidateId: string) {
  const candidate = await db.user.findUnique({
    where: { 
      id: candidateId,
      role: "SEEKER"
    },
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
      applications: {
        select: {
          id: true,
          status: true,
          appliedAt: true,
          job: {
            select: {
              id: true,
              title: true,
              type: true,
              location: true,
            },
          },
        },
        orderBy: {
          appliedAt: "desc"
        },
      },
    },
  })

  return candidate
}

export default async function CandidateProfilePage({
  params,
}: {
  params: Promise<{ candidateId: string }>
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== "EMPLOYER") {
    redirect("/auth/signin")
  }

  const { candidateId } = await params
  const candidate = await getCandidateProfile(candidateId)

  if (!candidate) {
    notFound()
  }

  const initials = candidate.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()

  const availabilityColors: Record<string, string> = {
    IMMEDIATELY: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    WITHIN_2_WEEKS: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    WITHIN_1_MONTH: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
    NOT_AVAILABLE: "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400",
  }

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20",
    REVIEWING: "bg-blue-100 text-blue-700 dark:bg-blue-900/20",
    SHORTLISTED: "bg-purple-100 text-purple-700 dark:bg-purple-900/20",
    INTERVIEWED: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20",
    OFFERED: "bg-green-100 text-green-700 dark:bg-green-900/20",
    REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/20",
    WITHDRAWN: "bg-gray-100 text-gray-700 dark:bg-gray-900/20",
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/employer/candidates">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Candidates
        </Link>
      </Button>

      {/* Profile Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-8 text-white shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />
        
        <div className="relative z-10 flex items-start gap-6">
          <Avatar className="h-24 w-24 border-4 border-white/30">
            <AvatarImage src={candidate.avatar || undefined} />
            <AvatarFallback className="bg-white/20 backdrop-blur-sm text-white text-3xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{candidate.name}</h1>
                {candidate.seekerProfile?.bio && (
                  <p className="text-amber-100 text-base mt-2 max-w-2xl">
                    {candidate.seekerProfile.bio}
                  </p>
                )}
              </div>
              {candidate.seekerProfile?.availability && (
                <Badge 
                  className={`${
                    availabilityColors[candidate.seekerProfile.availability] || availabilityColors.NOT_AVAILABLE
                  } text-sm px-3 py-1`}
                >
                  {candidate.seekerProfile.availability.replace(/_/g, " ")}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-4">
              {candidate.seekerProfile?.resumeUrl && (
                <Button variant="secondary" size="sm" asChild>
                  <a
                    href={candidate.seekerProfile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Resume
                  </a>
                </Button>
              )}
              <Button variant="secondary" size="sm" asChild>
                <Link href={`/employer/messages?user=${candidate.id}`}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Contact & Details */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <User className="h-5 w-5 text-blue-600" />
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
                    href={`mailto:${candidate.email}`}
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    {candidate.email}
                  </a>
                </div>
              </div>

              {candidate.seekerProfile?.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <a 
                      href={`tel:${candidate.seekerProfile.phone}`}
                      className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                    >
                      {candidate.seekerProfile.phone}
                    </a>
                  </div>
                </div>
              )}

              {candidate.seekerProfile?.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {candidate.seekerProfile.location}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Member Since</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(candidate.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          {candidate.seekerProfile?.skills && (
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
                  {candidate.seekerProfile.skills.split(',').map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill.trim()}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Experience, Education, Applications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Experience */}
          {candidate.seekerProfile?.experience && (
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
                  {candidate.seekerProfile.experience}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Education */}
          {candidate.seekerProfile?.education && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/20">
                    <GraduationCap className="h-5 w-5 text-indigo-600" />
                  </div>
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {candidate.seekerProfile.education}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Application History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/20">
                  <CheckCircle className="h-5 w-5 text-amber-600" />
                </div>
                Application History
              </CardTitle>
              <CardDescription>
                {candidate.applications.length} applications from this candidate
              </CardDescription>
            </CardHeader>
            <CardContent>
              {candidate.applications.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    No applications from this candidate yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {candidate.applications.map((application) => (
                    <div
                      key={application.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/employer/jobs/${application.job.id}`}
                          className="font-medium hover:underline"
                        >
                          {application.job.title}
                        </Link>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5" />
                            {application.job.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {application.job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(application.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Badge className={statusColors[application.status]}>
                        {application.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

