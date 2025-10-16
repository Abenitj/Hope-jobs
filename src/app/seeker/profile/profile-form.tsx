"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Camera, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ProfileFormProps {
  user: {
    id: string
    name: string
    email: string
    avatar: string | null
  }
  profile: {
    id: string
    phone: string | null
    bio: string | null
    skills: string | null
    experience: string | null
    education: string | null
    resume: string | null
    availability: string
  } | null
}

export function SeekerProfileForm({ user, profile }: ProfileFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const resumeInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Split name into first and last
  const nameParts = user.name.split(' ')
  const [formData, setFormData] = useState({
    firstName: nameParts[0] || '',
    lastName: nameParts.slice(1).join(' ') || '',
    email: user.email,
    phone: profile?.phone || '',
    bio: profile?.bio || '',
    skills: profile?.skills || '',
    experience: profile?.experience || '',
    education: profile?.education || '',
    availability: profile?.availability || 'IMMEDIATELY',
  })
  const [avatarUrl, setAvatarUrl] = useState(user.avatar)
  const [resumeUrl, setResumeUrl] = useState(profile?.resumeUrl)

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      setAvatarUrl(data.url)

      toast({
        title: "Success",
        description: "Avatar uploaded successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload avatar",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Resume size must be less than 10MB",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload/resume", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      setResumeUrl(data.url)

      toast({
        title: "Success",
        description: "Resume uploaded successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload resume",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/seeker/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          bio: formData.bio,
          skills: formData.skills,
          experience: formData.experience,
          education: formData.education,
          availability: formData.availability,
        }),
      })

      if (!response.ok) throw new Error("Failed to update profile")

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Picture */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarUrl || undefined} />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                  {formData.firstName[0]}{formData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 h-7 w-7 rounded-full shadow-lg"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Camera className="h-3 w-3" />
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Profile Picture</p>
              <p className="text-xs text-muted-foreground mb-3">
                JPG, PNG, or WebP. Max size 5MB.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Change Picture"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information and Professional Information - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+251 900 000 000"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell employers about yourself..."
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              rows={4}
            />
          </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <Textarea
              id="skills"
              placeholder="List your skills (e.g., JavaScript, React, Node.js)"
              value={formData.skills}
              onChange={(e) =>
                setFormData({ ...formData, skills: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Work Experience</Label>
            <Textarea
              id="experience"
              placeholder="Describe your work experience..."
              value={formData.experience}
              onChange={(e) =>
                setFormData({ ...formData, experience: e.target.value })
              }
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Education</Label>
            <Textarea
              id="education"
              placeholder="Describe your educational background..."
              value={formData.education}
              onChange={(e) =>
                setFormData({ ...formData, education: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="availability">Availability</Label>
            <Select
              value={formData.availability}
              onValueChange={(value) =>
                setFormData({ ...formData, availability: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IMMEDIATELY">Immediately</SelectItem>
                <SelectItem value="WITHIN_2_WEEKS">Within 2 Weeks</SelectItem>
                <SelectItem value="WITHIN_1_MONTH">Within 1 Month</SelectItem>
                <SelectItem value="NOT_AVAILABLE">Not Available</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume">Resume</Label>
            <div className="flex items-center gap-3">
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-amber-600 hover:underline"
                >
                  View Current Resume
                </a>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => resumeInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : resumeUrl ? "Replace Resume" : "Upload Resume"}
              </Button>
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
                className="hidden"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              PDF, DOC, or DOCX. Max size 10MB.
            </p>
          </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading || uploading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading || uploading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  )
}
