"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"

interface WelcomeBannerProps {
  name: string
  avatar: string | null
}

export function WelcomeBanner({ name, avatar }: WelcomeBannerProps) {
  const [open, setOpen] = useState(false)
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase()

  return (
    <>
      <div 
        className="relative overflow-hidden rounded-xl h-48 shadow-lg cursor-pointer group"
        onClick={() => setOpen(true)}
      >
        {/* Background Image or Gradient */}
        {avatar ? (
          <>
            <img 
              src={avatar}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
          </>
        )}
        
        {/* Content at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">
                Welcome Back, {name}!
              </h1>
              <p className="text-white/90 text-sm mt-1 drop-shadow">
                Here's an overview of your platform
              </p>
            </div>
            {!avatar && (
              <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40 shadow-lg flex-shrink-0">
                <span className="text-3xl font-bold text-white">
                  {initials}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Click hint */}
        <div className="absolute top-4 right-4 px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
          Click to view full image
        </div>
      </div>

      {/* Full Image Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-0">
          <div className="relative">
            {avatar ? (
              <img 
                src={avatar}
                alt={name}
                className="w-full max-h-[90vh] object-contain"
              />
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 flex items-center justify-center">
                <span className="text-9xl font-bold text-white drop-shadow-lg">
                  {initials}
                </span>
              </div>
            )}
            {/* Name overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">{name}</h2>
              <p className="text-white/80 text-sm">Admin Profile</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

