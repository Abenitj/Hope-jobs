import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/layout/admin-sidebar"
import { AdminHeader } from "@/components/layout/admin-header"
import { Toaster } from "@/components/ui/toaster"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar user={session.user} />
      <div className="lg:pl-64">
        <AdminHeader 
          user={session.user} 
          title="Admin Dashboard"
          subtitle="Manage your platform with powerful insights"
        />
        <main className="p-6">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  )
}

