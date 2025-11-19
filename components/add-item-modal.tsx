"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { VaultItem } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff } from 'lucide-react'

interface AddItemModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (item: Omit<VaultItem, "id" | "createdAt">) => void
  editingItem?: VaultItem | null
}

export function AddItemModal({ open, onOpenChange, onSave, editingItem }: AddItemModalProps) {
  const [siteName, setSiteName] = useState("")
  const [siteUrl, setSiteUrl] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [category, setCategory] = useState<"login" | "note" | "card">("login")
  const [notes, setNotes] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (editingItem) {
      setSiteName(editingItem.siteName)
      setSiteUrl(editingItem.siteUrl)
      setUsername(editingItem.username)
      setPassword(editingItem.password)
      setCategory(editingItem.category)
      setNotes(editingItem.notes || "")
    } else {
      resetForm()
    }
  }, [editingItem, open])

  const resetForm = () => {
    setSiteName("")
    setSiteUrl("")
    setUsername("")
    setPassword("")
    setCategory("login")
    setNotes("")
    setShowPassword(false)
  }

  const calculatePasswordStrength = (pwd: string): number => {
    let strength = 0
    if (pwd.length >= 8) strength += 25
    if (pwd.length >= 12) strength += 25
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 25
    if (/\d/.test(pwd)) strength += 12.5
    if (/[!@#$%^&*]/.test(pwd)) strength += 12.5
    return Math.min(strength, 100)
  }

  const passwordStrength = calculatePasswordStrength(password)
  const getStrengthLabel = () => {
    if (passwordStrength < 40) return "Weak"
    if (passwordStrength < 70) return "Fair"
    if (passwordStrength < 90) return "Good"
    return "Strong"
  }

  const getStrengthColor = () => {
    if (passwordStrength < 40) return "bg-destructive"
    if (passwordStrength < 70) return "bg-yellow-500"
    if (passwordStrength < 90) return "bg-accent"
    return "bg-green-500"
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      siteName,
      siteUrl,
      username,
      password,
      category,
      notes,
    })
    onOpenChange(false)
    resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle>
          <DialogDescription>
            {editingItem ? "Update your vault item details" : "Add a new password to your secure vault"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name *</Label>
            <Input
              id="siteName"
              placeholder="e.g., GitHub"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteUrl">Site URL *</Label>
            <Input
              id="siteUrl"
              type="url"
              placeholder="https://example.com"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username / Email *</Label>
            <Input
              id="username"
              type="text"
              placeholder="user@example.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {password && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Password Strength</span>
                  <span
                    className={
                      passwordStrength < 40
                        ? "text-destructive"
                        : passwordStrength < 70
                          ? "text-yellow-500"
                          : passwordStrength < 90
                            ? "text-accent"
                            : "text-green-500"
                    }
                  >
                    {getStrengthLabel()}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${getStrengthColor()}`}
                    style={{ width: `${passwordStrength}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value: "login" | "note" | "card") => setCategory(value)}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="note">Secure Note</SelectItem>
                <SelectItem value="card">Payment Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editingItem ? "Update Item" : "Add Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
