"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationPanel } from "@/components/notifications/notification-panel"

interface AdminHeaderProps {
  user: {
    name: string
    email: string
    avatar?: string | null
  }
  title: string
  subtitle?: string
}

export function AdminHeader({ user, title, subtitle }: AdminHeaderProps) {
  return (
    <div className="sticky top-0 z-30 border-b bg-white dark:bg-slate-900 shadow-sm">
      <div className="flex h-14 items-center justify-end gap-2 px-6">
        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <NotificationPanel />
        </div>
      </div>
    </div>
  )
}

