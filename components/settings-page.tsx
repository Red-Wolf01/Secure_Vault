"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { VaultSidebar } from "@/components/vault-sidebar"
import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/PasswordInput"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Shield, Key, Clock } from 'lucide-react'
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface AuditLog {
  id: string
  action: string
  details: string | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export function SettingsPage() {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [securityLogs, setSecurityLogs] = useState<AuditLog[]>([])
  const [isLoadingLogs, setIsLoadingLogs] = useState(true)

  useEffect(() => {
    const fetchSecurityLogs = async () => {
      try {
        const response = await fetch('/api/security/logs')
        if (!response.ok) {
          throw new Error('Failed to fetch security logs')
        }
        const data = await response.json()
        setSecurityLogs(data.logs || [])
      } catch (error) {
        console.error('[v0] Error fetching security logs:', error)
        toast.error('Failed to load security activity')
      } finally {
        setIsLoadingLogs(false)
      }
    }

    fetchSecurityLogs()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const parseDeviceInfo = (userAgent: string | null) => {
    if (!userAgent) return 'Unknown Device'
    
    if (userAgent.includes('Chrome')) return 'Chrome Browser'
    if (userAgent.includes('Firefox')) return 'Firefox Browser'
    if (userAgent.includes('Safari')) return 'Safari Browser'
    if (userAgent.includes('Edge')) return 'Edge Browser'
    
    return 'Unknown Browser'
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }
    // Placeholder: would call /api/auth/change-password
    toast.success("Master password updated successfully")
    setOldPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleExportVault = () => {
    // Placeholder: would call /api/vault/export
    toast.success("Your encrypted vault is being prepared for download")
  }

  return (
    <div className="flex h-screen bg-background">
      <VaultSidebar onAddItem={() => {}} />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-2">Manage your account security and preferences</p>
          </div>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>Add an extra layer of security to your account</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">Authenticator App</p>
                  <p className="text-sm text-muted-foreground">Use an app like Google Authenticator</p>
                </div>
                <Button variant="outline">Setup</Button>
              </div>

              <div className="p-4 border border-dashed border-border rounded-lg text-center">
                <div className="h-32 w-32 mx-auto bg-muted rounded-lg flex items-center justify-center mb-3">
                  <p className="text-xs text-muted-foreground">QR Code Placeholder</p>
                </div>
                <p className="text-sm text-muted-foreground">Scan this code with your authenticator app</p>
              </div>
            </CardContent>
          </Card>

          {/* Change Master Password */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Change Master Password</CardTitle>
                  <CardDescription>Update your master password to keep your vault secure</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <PasswordInput
                  id="oldPassword"
                  label="Current Master Password"
                  value={oldPassword}
                  onChange={setOldPassword}
                  required
                  autoComplete="current-password"
                />

                <PasswordInput
                  id="newPassword"
                  label="New Master Password"
                  value={newPassword}
                  onChange={setNewPassword}
                  required
                  autoComplete="new-password"
                />

                <PasswordInput
                  id="confirmPassword"
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  required
                  autoComplete="new-password"
                />

                <Button type="submit" className="w-full">
                  Update Master Password
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Export Vault */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Download className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Export Vault</CardTitle>
                  <CardDescription>Download an encrypted backup of your vault</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 border border-yellow-500/50 bg-yellow-500/10 rounded-lg mb-4">
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  <strong>Warning:</strong> Your exported vault will be encrypted, but keep it secure. Anyone with
                  access to this file and your master password can decrypt your data.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Export Encrypted Vault
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Export your vault?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will download an encrypted backup of all your passwords and vault items. Store this file
                      securely.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleExportVault}>Export Vault</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>

          {/* Security Logs */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Security Activity</CardTitle>
                  <CardDescription>Recent account activity and login history</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingLogs ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading security activity...
                </div>
              ) : securityLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No security activity yet
                </div>
              ) : (
                <div className="space-y-3">
                  {securityLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{log.action}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {parseDeviceInfo(log.user_agent)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {log.details} • {formatDate(log.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
