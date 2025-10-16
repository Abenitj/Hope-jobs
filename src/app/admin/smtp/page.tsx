"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Mail, 
  Plus, 
  Pencil, 
  Trash2, 
  Server, 
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Zap
} from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface SMTPConfig {
  id: string
  name: string
  host: string
  port: number
  username: string
  password: string
  fromEmail: string
  fromName: string
  secure: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface FormData {
  name: string
  host: string
  port: string
  username: string
  password: string
  fromEmail: string
  fromName: string
  secure: boolean
  isActive: boolean
}

const initialFormData: FormData = {
  name: "",
  host: "",
  port: "587",
  username: "",
  password: "",
  fromEmail: "",
  fromName: "",
  secure: true,
  isActive: false
}

export default function SMTPSettingsPage() {
  const [configs, setConfigs] = useState<SMTPConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  // Fetch configurations
  const fetchConfigs = async () => {
    try {
      const response = await fetch("/api/admin/smtp")
      if (response.ok) {
        const data = await response.json()
        setConfigs(data)
      } else {
        toast.error("Failed to fetch SMTP configurations")
      }
    } catch (error) {
      toast.error("An error occurred while fetching configurations")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfigs()
  }, [])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  // Open create dialog
  const handleCreate = () => {
    setFormData(initialFormData)
    setEditingId(null)
    setShowPassword(false)
    setTestResult(null)
    setShowDialog(true)
  }

  // Open edit dialog
  const handleEdit = (config: SMTPConfig) => {
    setFormData({
      name: config.name,
      host: config.host,
      port: config.port.toString(),
      username: config.username,
      password: config.password,
      fromEmail: config.fromEmail,
      fromName: config.fromName,
      secure: config.secure,
      isActive: config.isActive
    })
    setEditingId(config.id)
    setShowPassword(false)
    setTestResult(null)
    setShowDialog(true)
  }

  // Test SMTP connection
  const handleTestConnection = async () => {
    // Validate required fields for testing
    if (!formData.host || !formData.port || !formData.username || !formData.password || !formData.fromEmail) {
      toast.error("Please fill in all required fields before testing")
      return
    }

    // Don't test with masked password
    if (editingId && formData.password === "••••••••") {
      toast.error("Please enter the password to test the connection")
      return
    }

    setTesting(true)
    setTestResult(null)

    try {
      const response = await fetch("/api/admin/smtp/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setTestResult({ success: true, message: data.message })
        toast.success(data.message)
      } else {
        setTestResult({ success: false, message: data.error || "Connection test failed" })
        toast.error(data.error || "Connection test failed")
      }
    } catch (error) {
      const message = "Failed to test connection"
      setTestResult({ success: false, message })
      toast.error(message)
    } finally {
      setTesting(false)
    }
  }

  // Submit form (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const url = editingId ? `/api/admin/smtp/${editingId}` : "/api/admin/smtp"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(editingId ? "Configuration updated successfully" : "Configuration created successfully")
        setShowDialog(false)
        fetchConfigs()
      } else {
        toast.error(data.error || "Failed to save configuration")
      }
    } catch (error) {
      toast.error("An error occurred while saving configuration")
    } finally {
      setSubmitting(false)
    }
  }

  // Delete configuration
  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const response = await fetch(`/api/admin/smtp/${deleteId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        toast.success("Configuration deleted successfully")
        setDeleteId(null)
        fetchConfigs()
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to delete configuration")
      }
    } catch (error) {
      toast.error("An error occurred while deleting configuration")
    }
  }

  // Toggle active status
  const handleToggleActive = async (config: SMTPConfig) => {
    try {
      const response = await fetch(`/api/admin/smtp/${config.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !config.isActive })
      })

      if (response.ok) {
        toast.success(config.isActive ? "Configuration deactivated" : "Configuration activated")
        fetchConfigs()
      } else {
        toast.error("Failed to update configuration status")
      }
    } catch (error) {
      toast.error("An error occurred while updating status")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading configurations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SMTP Configuration</h1>
          <p className="text-muted-foreground mt-1">
            Manage email server settings for system notifications
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Configuration
        </Button>
      </div>

      {/* Configurations List */}
      <div className="grid gap-4">
        {configs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Mail className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No SMTP configurations</h3>
              <p className="text-muted-foreground text-center mb-4">
                Get started by adding your first SMTP configuration
              </p>
              <Button onClick={handleCreate} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Configuration
              </Button>
            </CardContent>
          </Card>
        ) : (
          configs.map((config) => (
            <Card key={config.id} className={config.isActive ? "border-amber-500 border-2" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{config.name}</CardTitle>
                      {config.isActive && (
                        <Badge className="bg-green-500 hover:bg-green-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      )}
                    </div>
                    <CardDescription>
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {config.fromEmail}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={config.isActive}
                      onCheckedChange={() => handleToggleActive(config)}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(config)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeleteId(config.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Host</p>
                    <p className="font-medium flex items-center gap-1">
                      <Server className="h-3 w-3" />
                      {config.host}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Port</p>
                    <p className="font-medium">{config.port}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Username</p>
                    <p className="font-medium">{config.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Security</p>
                    <p className="font-medium">
                      {config.secure ? "TLS/SSL" : "None"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit SMTP Configuration" : "Add SMTP Configuration"}
            </DialogTitle>
            <DialogDescription>
              Configure your email server settings. Only one configuration can be active at a time.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Configuration Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Primary, Backup"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name *</Label>
                  <Input
                    id="fromName"
                    name="fromName"
                    value={formData.fromName}
                    onChange={handleInputChange}
                    placeholder="e.g., Hope Jobs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fromEmail">From Email *</Label>
                <Input
                  id="fromEmail"
                  name="fromEmail"
                  type="email"
                  value={formData.fromEmail}
                  onChange={handleInputChange}
                  placeholder="noreply@example.com"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="host">SMTP Host *</Label>
                  <Input
                    id="host"
                    name="host"
                    value={formData.host}
                    onChange={handleInputChange}
                    placeholder="smtp.gmail.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port *</Label>
                  <Input
                    id="port"
                    name="port"
                    type="number"
                    value={formData.port}
                    onChange={handleInputChange}
                    placeholder="587"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="user@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={editingId ? "Leave blank to keep current" : "Enter password"}
                    required={!editingId}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="secure">Use TLS/SSL</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable secure connection to SMTP server
                  </p>
                </div>
                <Switch
                  id="secure"
                  checked={formData.secure}
                  onCheckedChange={(checked) => handleSwitchChange("secure", checked)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive">Set as Active</Label>
                  <p className="text-sm text-muted-foreground">
                    Use this configuration for sending emails
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">Common SMTP Settings:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Gmail: smtp.gmail.com:587 (TLS)</li>
                      <li>• Outlook: smtp-mail.outlook.com:587 (TLS)</li>
                      <li>• SendGrid: smtp.sendgrid.net:587 (TLS)</li>
                      <li>• Mailgun: smtp.mailgun.org:587 (TLS)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Test Result Display */}
              {testResult && (
                <div className={`rounded-lg border p-4 ${
                  testResult.success 
                    ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
                }`}>
                  <div className="flex gap-2">
                    {testResult.success ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className={`text-sm ${
                      testResult.success 
                        ? 'text-green-800 dark:text-green-200' 
                        : 'text-red-800 dark:text-red-200'
                    }`}>
                      <p className="font-medium">{testResult.success ? 'Test Successful!' : 'Test Failed'}</p>
                      <p className="mt-1">{testResult.message}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleTestConnection}
                disabled={submitting || testing}
                className="gap-2"
              >
                {testing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Test Connection
                  </>
                )}
              </Button>
              <div className="flex gap-2 ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                  disabled={submitting || testing}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting || testing}>
                  {submitting ? "Saving..." : editingId ? "Update" : "Create"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the SMTP configuration.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

