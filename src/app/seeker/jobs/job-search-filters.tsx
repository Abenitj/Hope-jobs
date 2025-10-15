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

export function JobSearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [type, setType] = useState(searchParams.get("type") || "all")
  const [location, setLocation] = useState(searchParams.get("location") || "")

  // Debounce search inputs
  const debouncedSearch = useDebounce(search, 500)
  const debouncedLocation = useDebounce(location, 500)

  // Auto-update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedSearch) params.set("search", debouncedSearch)
    if (type && type !== "all") params.set("type", type)
    if (debouncedLocation) params.set("location", debouncedLocation)
    
    router.push(`/seeker/jobs?${params.toString()}`)
  }, [debouncedSearch, type, debouncedLocation, router])

  const handleClear = () => {
    setSearch("")
    setType("all")
    setLocation("")
    router.push("/seeker/jobs")
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border p-4 space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        {/* Search */}
        <div className="md:col-span-2">
          <Input
            placeholder="Search by title, keywords, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Job Type */}
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="FULL_TIME">Full Time</SelectItem>
            <SelectItem value="PART_TIME">Part Time</SelectItem>
            <SelectItem value="CONTRACT">Contract</SelectItem>
            <SelectItem value="FREELANCE">Freelance</SelectItem>
            <SelectItem value="INTERNSHIP">Internship</SelectItem>
          </SelectContent>
        </Select>

        {/* Location */}
        <Input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
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

