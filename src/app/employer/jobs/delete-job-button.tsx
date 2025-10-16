"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, Loader2, AlertTriangle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface DeleteJobButtonProps {
  jobId: string
  jobTitle: string
  applicationsCount: number
}

export function DeleteJobButton({ jobId, jobTitle, applicationsCount }: DeleteJobButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async () => {
    setLoading(true)

    try {
      const response = await fetch(`/api/employer/jobs/${jobId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete job")
      }

      toast({
        title: "Job Deleted",
        description: `"${jobTitle}" has been permanently deleted.`,
      })

      setOpen(false)
      router.push("/employer/jobs")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete job. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Job
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-xl">Delete Job?</AlertDialogTitle>
          </div>
          <AlertDialogDescription asChild>
            <div className="space-y-3 pt-2">
              <div>
                Are you sure you want to delete <span className="font-semibold text-foreground">"{jobTitle}"</span>?
              </div>
              {applicationsCount > 0 && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                    ⚠️ Warning: This job has {applicationsCount} application{applicationsCount !== 1 ? 's' : ''}.
                  </div>
                  <div className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                    All applications will also be permanently deleted.
                  </div>
                </div>
              )}
              <div className="text-sm">
                This action <span className="font-semibold text-red-600">cannot be undone</span>. The job and all associated data will be permanently removed.
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Yes, Delete Job
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

