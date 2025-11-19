"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PasswordInput } from "@/components/PasswordInput"
import {
  calculatePasswordStrength,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
} from "@/lib/crypto"
import type { VaultItem } from "@/types"

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
  }

  const passwordStrength = calculatePasswordStrength(password)

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
            <PasswordInput
              id="password"
              label=""
              placeholder="Enter password"
              value={password}
              onChange={setPassword}
              required
              autoComplete="new-password"
            />
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
                    {getPasswordStrengthLabel(passwordStrength)}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${getPasswordStrengthColor(passwordStrength)}`}
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
