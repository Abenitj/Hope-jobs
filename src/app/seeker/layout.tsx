import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { SeekerSidebar } from "@/components/layout/seeker-sidebar"
import { SeekerHeader } from "@/components/layout/seeker-header"
import { Toaster } from "sonner"
import { Providers } from "@/components/providers"

export default async function SeekerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session || session.user.role !== "SEEKER") {
    redirect("/login")
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
    },
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <Providers>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <SeekerSidebar user={user} />
        <div className="lg:pl-64">
          <SeekerHeader user={user} title="Job Seeker Dashboard" />
          <main className="p-6">{children}</main>
        </div>
        <Toaster />
      </div>
    </Providers>
  )
}
