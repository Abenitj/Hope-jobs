import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Search, Briefcase, MapPin, Mail, Phone, Download, MessageSquare } from "lucide-react"
import Link from "next/link"
import { CandidateSearchFilters } from "./candidate-search-filters"

interface SearchParams {
  search?: string
  availability?: string
  skills?: string
}

async function searchCandidates(params: SearchParams) {
  const { search, availability, skills } = params

  const where: any = {
    role: "SEEKER",
  }

  // Build search conditions
  const conditions: any[] = []

  if (search) {
    conditions.push({
      OR: [
        { name: { contains: search } },
        { email: { contains: search } },
      ],
    })
  }

  if (conditions.length > 0) {
    where.AND = conditions
  }

  const candidates = await db.user.findMany({
    where,
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
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  // Filter by availability and skills on the client side if needed
  let filteredCandidates = candidates

  if (availability && availability !== "all") {
    filteredCandidates = filteredCandidates.filter(
      c => c.seekerProfile?.availability === availability
    )
  }

  if (skills) {
    filteredCandidates = filteredCandidates.filter(
      c => c.seekerProfile?.skills?.toLowerCase().includes(skills.toLowerCase())
    )
  }

  const stats = {
    total: filteredCandidates.length,
    withProfiles: filteredCandidates.filter(c => c.seekerProfile).length,
    withResume: filteredCandidates.filter(c => c.seekerProfile?.resumeUrl).length,
    immediate: filteredCandidates.filter(c => c.seekerProfile?.availability === "IMMEDIATELY").length,
  }

  return { candidates: filteredCandidates, stats }
}

export default async function CandidatesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const session = await auth()
  const params = await searchParams
  const { candidates, stats } = await searchCandidates(params)

  const kpiCards = [
    {
      label: "Total Candidates",
      value: stats.total,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      label: "Complete Profiles",
      value: stats.withProfiles,
      icon: Briefcase,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      label: "With Resume",
      value: stats.withResume,
      icon: Download,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      label: "Available Now",
      value: stats.immediate,
      icon: Search,
      color: "text-amber-600",
      bgColor: "bg-amber-100 dark:bg-amber-900/20",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-6 text-white shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Candidate Search</h1>
              <p className="text-amber-100 text-sm mt-0.5">
                Find and connect with {stats.total} job seekers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => (
          <Card key={card.label} className="hover:shadow-lg transition-shadow">
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

      {/* Search and Filters */}
      <CandidateSearchFilters />

      {/* Candidates List */}
      <Card>
        <CardHeader>
          <CardTitle>Job Seekers</CardTitle>
          <CardDescription>
            Browse and connect with potential candidates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {candidates.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No candidates found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search filters to find candidates
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {candidates.map((candidate) => {
                const initials = candidate.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()

                return (
                  <div
                    key={candidate.id}
                    className="flex items-start gap-4 p-4 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={candidate.avatar || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white text-xl">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{candidate.name}</h4>
                          {candidate.seekerProfile?.bio && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {candidate.seekerProfile.bio}
                            </p>
                          )}
                        </div>
                        {candidate.seekerProfile?.availability && (
                          <Badge
                            className={
                              candidate.seekerProfile.availability === "IMMEDIATELY"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                : candidate.seekerProfile.availability === "WITHIN_2_WEEKS"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                            }
                          >
                            {candidate.seekerProfile.availability.replace(/_/g, " ")}
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-3">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {candidate.email}
                        </span>
                        {candidate.seekerProfile?.phone && (
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {candidate.seekerProfile.phone}
                          </span>
                        )}
                        {candidate.seekerProfile?.location && (
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {candidate.seekerProfile.location}
                          </span>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {candidate._count.applications} applications
                        </span>
                      </div>

                      {candidate.seekerProfile?.skills && (
                        <div className="mt-3">
                          <p className="text-sm">
                            <span className="font-medium">Skills:</span>{" "}
                            <span className="text-muted-foreground line-clamp-1">
                              {candidate.seekerProfile.skills}
                            </span>
                          </p>
                        </div>
                      )}

                      {candidate.seekerProfile?.experience && (
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            <span className="font-medium text-foreground">Experience:</span>{" "}
                            {candidate.seekerProfile.experience}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/employer/candidates/${candidate.id}`}>
                          View Profile
                        </Link>
                      </Button>
                      {candidate.seekerProfile?.resumeUrl && (
                        <Button variant="ghost" size="sm" asChild>
                          <a
                            href={candidate.seekerProfile.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Resume
                          </a>
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/employer/messages?user=${candidate.id}`}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Link>
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
