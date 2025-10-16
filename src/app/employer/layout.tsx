import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { EmployerSidebar } from "@/components/layout/employer-sidebar"
import { EmployerHeader } from "@/components/layout/employer-header"
import { Toaster } from "sonner"
import { Providers } from "@/components/providers"

export default async function EmployerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session || session.user.role !== "EMPLOYER") {
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
        <EmployerSidebar user={user} />
        <div className="lg:pl-64">
          <EmployerHeader user={user} title="Employer Dashboard" />
          <main className="p-6">{children}</main>
        </div>
        <Toaster />
      </div>
    </Providers>
  )
}


