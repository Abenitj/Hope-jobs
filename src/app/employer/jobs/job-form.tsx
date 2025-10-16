"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Briefcase, CheckCircle } from "lucide-react"

interface JobFormProps {
  job?: {
    id: string
    title: string
    description: string
    requirements: string | null
    type: string
    location: string | null
    salary: string | null
    status: string
  }
}

export function JobForm({ job }: JobFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: job?.title || "",
    description: job?.description || "",
    requirements: job?.requirements || "",
    type: job?.type || "FULL_TIME",
    location: job?.location || "",
    salary: job?.salary || "",
    status: job?.status || "DRAFT",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = job
        ? `/api/employer/jobs/${job.id}`
        : "/api/employer/jobs"
      
      const method = job ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to save job")
      }

      const data = await response.json()

      toast({
        title: "Success",
        description: job ? "Job updated successfully" : "Job posted successfully",
      })

      router.push(`/employer/jobs/${data.id}`)
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Senior Software Engineer"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="text-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Job Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FULL_TIME">Full Time</SelectItem>
                  <SelectItem value="PART_TIME">Part Time</SelectItem>
                  <SelectItem value="CONTRACT">Contract</SelectItem>
                  <SelectItem value="FREELANCE">Freelance</SelectItem>
                  <SelectItem value="INTERNSHIP">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., Addis Ababa, Remote"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Salary Range (Optional)</Label>
              <Input
                id="salary"
                placeholder="e.g., $50,000 - $70,000"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the role, responsibilities, and what makes this opportunity unique..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={12}
              required
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Provide a detailed description of the role and what you're looking for
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Right Column: Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="requirements">Job Requirements (Optional)</Label>
            <Textarea
              id="requirements"
              placeholder="Enter requirements (one per line):&#10;• 5+ years of experience&#10;• Bachelor's degree in Computer Science&#10;• Strong communication skills"
              value={formData.requirements}
              onChange={(e) =>
                setFormData({ ...formData, requirements: e.target.value })
              }
              rows={12}
              className="resize-none font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              List requirements one per line. Each will appear with a checkmark icon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 sticky bottom-6 bg-slate-50 dark:bg-slate-950 p-4 -mx-6 -mb-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
          size="lg"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          size="lg"
          className="min-w-[140px]"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {job ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>{job ? "Update Job" : "Publish Job"}</>
          )}
        </Button>
      </div>
    </form>
  )
}
