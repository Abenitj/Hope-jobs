"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ApplicationStatusFormProps {
  applicationId: string
  currentStatus: string
  seekerId: string
}

const statusOptions = [
  { value: "PENDING", label: "Pending", color: "text-yellow-600" },
  { value: "REVIEWING", label: "Reviewing", color: "text-blue-600" },
  { value: "SHORTLISTED", label: "Shortlisted", color: "text-purple-600" },
  { value: "INTERVIEWED", label: "Interviewed", color: "text-indigo-600" },
  { value: "OFFERED", label: "Offered", color: "text-green-600" },
  { value: "REJECTED", label: "Rejected", color: "text-red-600" },
  { value: "WITHDRAWN", label: "Withdrawn", color: "text-gray-600" },
]

export function ApplicationStatusForm({ 
  applicationId, 
  currentStatus,
  seekerId 
}: ApplicationStatusFormProps) {
  const [status, setStatus] = useState(currentStatus)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleStatusUpdate = async () => {
    if (status === currentStatus) {
      toast.info("Status hasn't changed")
      return
    }

    startTransition(async () => {
      try {
        const response = await fetch(`/api/employer/applications/${applicationId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || "Failed to update status")
        }

        toast.success("Application status updated successfully")
        router.refresh()
      } catch (error) {
        console.error("Failed to update status:", error)
        toast.error(error instanceof Error ? error.message : "Failed to update status")
        setStatus(currentStatus) // Revert on error
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className={option.color}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button 
        onClick={handleStatusUpdate} 
        disabled={isPending || status === currentStatus}
        className="w-full"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          "Update Status"
        )}
      </Button>

      {status !== currentStatus && (
        <p className="text-xs text-muted-foreground">
          Click &quot;Update Status&quot; to save changes
        </p>
      )}
    </div>
  )
}

