"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface ProfileImageProps {
  name: string
  avatar: string | null | undefined
}

export function ProfileImage({ name, avatar }: ProfileImageProps) {
  const [open, setOpen] = useState(false)
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase()

  return (
    <>
      <div 
        className="cursor-pointer group transition-transform hover:scale-105 flex-shrink-0"
        onClick={() => setOpen(true)}
      >
        {avatar ? (
          <img 
            src={avatar}
            alt={name}
            className="h-20 w-20 rounded-full object-cover border-3 border-white/30 shadow-lg group-hover:shadow-xl transition-shadow"
          />
        ) : (
          <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 shadow-lg group-hover:shadow-xl transition-shadow">
            <span className="text-3xl font-bold">
              {initials}
            </span>
          </div>
        )}
      </div>

      {/* Full Image Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-0">
          <VisuallyHidden>
            <DialogTitle>{name} - Profile Picture</DialogTitle>
          </VisuallyHidden>
          <div className="relative">
            {avatar ? (
              <img 
                src={avatar}
                alt={name}
                className="w-full max-h-[90vh] object-contain rounded-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-9xl font-bold text-white drop-shadow-lg">
                  {initials}
                </span>
              </div>
            )}
            {/* Name overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">{name}</h2>
              <p className="text-white/80 text-sm">Admin Profile</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

