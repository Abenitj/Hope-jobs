"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export function LogoutButton() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <Button 
      onClick={handleSignOut}
      variant="ghost" 
      className="w-full justify-start h-9 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Sign Out
    </Button>
  )
}

