import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { SeekerProfileForm } from "./profile-form"

async function getSeekerProfile(userId: string) {
  const [user, profile] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
      },
    }),
    db.jobSeekerProfile.findUnique({
      where: { userId },
    }),
  ])

  return { user, profile }
}

export default async function SeekerProfilePage() {
  const session = await auth()
  const { user, profile } = await getSeekerProfile(session!.user.id)

  if (!user) {
    redirect("/seeker/dashboard")
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-6 text-white shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
              <p className="text-amber-100 text-sm mt-0.5">
                Manage your personal information and job preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      <SeekerProfileForm user={user} profile={profile} />
    </div>
  )
}
