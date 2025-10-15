"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react"
import { useDebounce } from "@/hooks/use-debounce"

export function ApplicationFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [status, setStatus] = useState(searchParams.get("status") || "all")
  const [job, setJob] = useState(searchParams.get("job") || "all")

  // Debounce search to avoid too many requests
  const debouncedSearch = useDebounce(search, 500)

  // Auto-update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedSearch) params.set("search", debouncedSearch)
    if (status && status !== "all") params.set("status", status)
    if (job && job !== "all") params.set("job", job)
    
    router.push(`/employer/applications?${params.toString()}`)
  }, [debouncedSearch, status, job, router])

  const handleClear = () => {
    setSearch("")
    setStatus("all")
    setJob("all")
    router.push("/employer/applications")
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border p-4 space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        {/* Search by Candidate Name */}
        <div className="md:col-span-1">
          <Input
            placeholder="Search candidate name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Status Filter */}
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Application Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="REVIEWED">Reviewed</SelectItem>
            <SelectItem value="ACCEPTED">Accepted</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort by Date */}
        <Select defaultValue="newest">
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleClear} className="ml-auto">
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      </div>
    </div>
  )
}

