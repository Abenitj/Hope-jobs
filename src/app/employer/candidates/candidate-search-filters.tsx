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

export function CandidateSearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [availability, setAvailability] = useState(searchParams.get("availability") || "all")
  const [skills, setSkills] = useState(searchParams.get("skills") || "")

  // Debounce search inputs
  const debouncedSearch = useDebounce(search, 500)
  const debouncedSkills = useDebounce(skills, 500)

  // Auto-update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedSearch) params.set("search", debouncedSearch)
    if (availability && availability !== "all") params.set("availability", availability)
    if (debouncedSkills) params.set("skills", debouncedSkills)
    
    router.push(`/employer/candidates?${params.toString()}`)
  }, [debouncedSearch, availability, debouncedSkills, router])

  const handleClear = () => {
    setSearch("")
    setAvailability("all")
    setSkills("")
    router.push("/employer/candidates")
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border p-4 space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        {/* Search by Name/Email */}
        <div className="md:col-span-2">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Availability Filter */}
        <Select value={availability} onValueChange={setAvailability}>
          <SelectTrigger>
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Availability</SelectItem>
            <SelectItem value="IMMEDIATELY">Immediately</SelectItem>
            <SelectItem value="WITHIN_2_WEEKS">Within 2 Weeks</SelectItem>
            <SelectItem value="WITHIN_1_MONTH">Within 1 Month</SelectItem>
            <SelectItem value="NOT_AVAILABLE">Not Available</SelectItem>
          </SelectContent>
        </Select>

        {/* Skills Filter */}
        <Input
          placeholder="Skills (e.g., React)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
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

