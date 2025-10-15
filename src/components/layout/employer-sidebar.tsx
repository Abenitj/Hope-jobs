"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  FileText,
  MessageSquare,
  UserCircle,
  Menu
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/logout-button"
import { useState } from "react"

interface EmployerSidebarProps {
  user: {
    name: string
    email: string
    avatar?: string | null
  }
}

const navigation = [
  { name: "Dashboard", href: "/employer/dashboard", icon: LayoutDashboard },
  { name: "My Jobs", href: "/employer/jobs", icon: Briefcase },
  { name: "Candidates", href: "/employer/candidates", icon: Users },
  { name: "Applications", href: "/employer/applications", icon: FileText },
  { name: "Messages", href: "/employer/messages", icon: MessageSquare },
  { name: "Profile", href: "/employer/profile", icon: UserCircle },
]

export function EmployerSidebar({ user }: EmployerSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="relative">
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-0 left-0 z-50 p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0",
          collapsed ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-14 px-4 border-b border-slate-200 dark:border-slate-800">
            <Link href="/employer/dashboard" className="flex items-center space-x-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg">Hope Jobs</span>
                <p className="text-xs text-muted-foreground">Employer</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                  onClick={() => setCollapsed(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Sign Out - Bottom */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800">
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
    </div>
  )
}


