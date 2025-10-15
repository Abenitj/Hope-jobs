"use client"

import { useState, useMemo } from "react"
import { Job } from "@prisma/client"
import { JobStatus } from "@/types/prisma"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MoreHorizontal, Search, Eye, Trash2, Download, RefreshCw } from "lucide-react"
import { formatDateTime } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

type JobWithDetails = Job & {
  employer: {
    name: string
    email: string
    employerProfile: {
      companyName: string
    } | null
  }
  _count: {
    applications: number
  }
}

interface JobsTableProps {
  jobs: JobWithDetails[]
}

export function JobsTable({ jobs: initialJobs }: JobsTableProps) {
  const [jobs, setJobs] = useState(initialJobs)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [selectedJob, setSelectedJob] = useState<JobWithDetails | null>(null)
  const { toast } = useToast()

  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.employer.employerProfile?.companyName?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || job.status === statusFilter
      const matchesType = typeFilter === "all" || job.type === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "applications":
        filtered.sort((a, b) => b._count.applications - a._count.applications)
        break
      default:
        break
    }

    return filtered
  }, [jobs, searchQuery, statusFilter, typeFilter, sortBy])

  const getStatusBadgeVariant = (status: JobStatus) => {
    switch (status) {
      case "OPEN":
        return "success"
      case "CLOSED":
        return "secondary"
      case "DRAFT":
        return "outline"
      default:
        return "outline"
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    try {
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete job")

      setJobs(jobs.filter((j) => j.id !== jobId))
      toast({
        title: "Success",
        description: "Job deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      })
    }
  }

  const stats = useMemo(() => ({
    total: jobs.length,
    open: jobs.filter(j => j.status === "OPEN").length,
    closed: jobs.filter(j => j.status === "CLOSED").length,
    draft: jobs.filter(j => j.status === "DRAFT").length,
  }), [jobs])

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filters & Search</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <div className="relative col-span-2">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs, company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
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
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredAndSortedJobs.length}</span> of <span className="font-medium text-foreground">{jobs.length}</span> jobs
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="applications">Most Applications</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Job Title</TableHead>
                <TableHead className="font-semibold">Company</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Applications</TableHead>
                <TableHead className="font-semibold">Posted</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedJobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground h-32">
                    No jobs found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedJobs.map((job) => (
                  <TableRow key={job.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{job.title}</p>
                        <p className="text-xs text-muted-foreground">{job.location}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">
                          {job.employer.employerProfile?.companyName || job.employer.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{job.employer.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {job.type.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(job.status as JobStatus)}>
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">{job._count.applications}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs text-muted-foreground">
                        {job.postedAt ? formatDateTime(job.postedAt) : "Draft"}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setSelectedJob(job)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteJob(job.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Job
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Job Details Dialog */}
      <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
            <DialogDescription>Complete job posting information</DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="text-xl font-semibold">{selectedJob.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedJob.employer.employerProfile?.companyName || selectedJob.employer.name}
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">{selectedJob.type.replace("_", " ")}</Badge>
                  <Badge variant={getStatusBadgeVariant(selectedJob.status as JobStatus)}>
                    {selectedJob.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground">Location</p>
                  <p className="text-sm font-medium mt-1">{selectedJob.location}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground">Salary</p>
                  <p className="text-sm font-medium mt-1">{selectedJob.salary || "Not specified"}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground">Applications</p>
                  <p className="text-sm font-medium mt-1">{selectedJob._count.applications}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground">Posted</p>
                  <p className="text-sm font-medium mt-1">
                    {selectedJob.postedAt ? formatDateTime(selectedJob.postedAt) : "Draft"}
                  </p>
                </div>
              </div>

              <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-semibold">Description</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {selectedJob.description}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
