"use client"

import { useState, useMemo } from "react"
import { User } from "@prisma/client"
import { UserRole, UserStatus } from "@/types/prisma"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MoreHorizontal, Search, Shield, Ban, Trash2, CheckCircle, Filter, Download, RefreshCw } from "lucide-react"
import { formatDateTime, getInitials } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

type UserWithDetails = User & {
  seekerProfile: any
  employerProfile: any
  _count: {
    jobs: number
    applications: number
  }
}

interface UsersTableProps {
  users: UserWithDetails[]
}

export function UsersTable({ users: initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState(initialUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null)
  const [actionDialog, setActionDialog] = useState<{
    open: boolean
    action: "suspend" | "activate" | "delete" | null
    user: UserWithDetails | null
  }>({
    open: false,
    action: null,
    user: null,
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesRole = roleFilter === "all" || user.role === roleFilter
      const matchesStatus = statusFilter === "all" || user.status === statusFilter

      return matchesSearch && matchesRole && matchesStatus
    })

    // Sort users
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        break
    }

    return filtered
  }, [users, searchQuery, roleFilter, statusFilter, sortBy])

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return "destructive"
      case "EMPLOYER":
        return "default" // Will use amber/golden color
      case "SEEKER":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusBadgeVariant = (status: UserStatus) => {
    switch (status) {
      case "ACTIVE":
        return "success"
      case "SUSPENDED":
        return "warning"
      case "DELETED":
        return "destructive"
      default:
        return "outline"
    }
  }

  const handleAction = async () => {
    if (!actionDialog.user || !actionDialog.action) return

    setLoading(true)
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: actionDialog.user.id,
          action: actionDialog.action,
        }),
      })

      if (!response.ok) throw new Error("Failed to update user")

      const updatedUser = await response.json()

      setUsers(users.map((u) => (u.id === updatedUser.id ? { ...u, status: updatedUser.status } : u)))

      toast({
        title: "Success",
        description: `User ${actionDialog.action}d successfully`,
      })

      setActionDialog({ open: false, action: null, user: null })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const openActionDialog = (action: "suspend" | "activate" | "delete", user: UserWithDetails) => {
    setActionDialog({ open: true, action, user })
  }

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.status === "ACTIVE").length,
    employers: users.filter(u => u.role === "EMPLOYER").length,
    seekers: users.filter(u => u.role === "SEEKER").length,
  }), [users])

  return (
    <div className="space-y-4">
      {/* Filters Card */}
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
            {/* Search */}
            <div className="relative col-span-2">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Role Filter */}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="EMPLOYER">Employer</SelectItem>
                <SelectItem value="SEEKER">Job Seeker</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                <SelectItem value="DELETED">Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredAndSortedUsers.length}</span> of <span className="font-medium text-foreground">{users.length}</span> users
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
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
                <TableHead className="font-semibold">User</TableHead>
                <TableHead className="font-semibold">Role</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Activity</TableHead>
                <TableHead className="font-semibold">Joined</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground h-32">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.avatar || undefined} />
                          <AvatarFallback className="text-sm">{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role as UserRole)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(user.status as UserStatus)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.role === "EMPLOYER" && (
                        <p className="text-sm">{user._count.jobs} jobs</p>
                      )}
                      {user.role === "SEEKER" && (
                        <p className="text-sm">{user._count.applications} apps</p>
                      )}
                      {user.role === "ADMIN" && (
                        <p className="text-sm text-muted-foreground">Admin</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="text-xs text-muted-foreground">{formatDateTime(user.createdAt)}</p>
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
                          <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                            <Shield className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {user.status === "ACTIVE" && user.role !== "ADMIN" && (
                            <DropdownMenuItem onClick={() => openActionDialog("suspend", user)}>
                              <Ban className="mr-2 h-4 w-4" />
                              Suspend User
                            </DropdownMenuItem>
                          )}
                          {user.status === "SUSPENDED" && (
                            <DropdownMenuItem onClick={() => openActionDialog("activate", user)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Activate User
                            </DropdownMenuItem>
                          )}
                          {user.role !== "ADMIN" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => openActionDialog("delete", user)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </>
                          )}
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

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Complete information about the user
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar || undefined} />
                  <AvatarFallback className="text-lg">
                    {getInitials(selectedUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={getRoleBadgeVariant(selectedUser.role as UserRole)}>
                      {selectedUser.role}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(selectedUser.status as UserStatus)}>
                      {selectedUser.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground">Joined</p>
                  <p className="text-sm font-medium mt-1">{formatDateTime(selectedUser.createdAt)}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-sm font-medium mt-1">{formatDateTime(selectedUser.updatedAt)}</p>
                </div>
                {selectedUser.role === "EMPLOYER" && (
                  <>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs font-medium text-muted-foreground">Company</p>
                      <p className="text-sm font-medium mt-1">
                        {selectedUser.employerProfile?.companyName || "Not set"}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs font-medium text-muted-foreground">Jobs Posted</p>
                      <p className="text-sm font-medium mt-1">{selectedUser._count.jobs}</p>
                    </div>
                  </>
                )}
                {selectedUser.role === "SEEKER" && (
                  <>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs font-medium text-muted-foreground">Location</p>
                      <p className="text-sm font-medium mt-1">
                        {selectedUser.seekerProfile?.location || "Not set"}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs font-medium text-muted-foreground">Applications</p>
                      <p className="text-sm font-medium mt-1">{selectedUser._count.applications}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <Dialog
        open={actionDialog.open}
        onOpenChange={(open) => !open && setActionDialog({ open: false, action: null, user: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.action === "delete" && "Delete User"}
              {actionDialog.action === "suspend" && "Suspend User"}
              {actionDialog.action === "activate" && "Activate User"}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.action === "delete" &&
                "This will permanently delete the user. This action cannot be undone."}
              {actionDialog.action === "suspend" &&
                "This will suspend the user account. They won't be able to log in."}
              {actionDialog.action === "activate" &&
                "This will reactivate the user account."}
            </DialogDescription>
          </DialogHeader>
          {actionDialog.user && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">
                <span className="font-medium">User:</span> {actionDialog.user.name}
              </p>
              <p className="text-sm text-muted-foreground">{actionDialog.user.email}</p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionDialog({ open: false, action: null, user: null })}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant={actionDialog.action === "delete" ? "destructive" : "default"}
              onClick={handleAction}
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
