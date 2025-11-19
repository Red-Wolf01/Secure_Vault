"use client"

import { useState } from "react"
import type { VaultItem } from "@/types"
import { Button } from "@/components/ui/button"
import { Copy, Eye, EyeOff, Edit, Trash2, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

interface VaultGridProps {
  items: VaultItem[]
  onEdit: (item: VaultItem) => void
  onDelete: (id: string) => void
}

export function VaultGrid({ items, onEdit, onDelete }: VaultGridProps) {
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set())
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  const maskUsername = (username: string) => {
    if (username.length <= 4) return username
    const [local, domain] = username.split("@")
    if (domain) {
      return `${local.slice(0, 2)}${"•".repeat(local.length - 2)}@${domain}`
    }
    return `${username.slice(0, 2)}${"•".repeat(username.length - 2)}`
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-12">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Copy className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No items found</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Add your first password or try adjusting your search filters
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base truncate">{item.siteName}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <span className="truncate">{item.siteUrl}</span>
                    <a
                      href={item.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 flex-shrink-0"
                      aria-label={`Open ${item.siteName}`}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(item)}
                    aria-label="Edit item"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => setDeleteId(item.id)}
                    aria-label="Delete item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Username</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(item.username, "Username")}
                    aria-label="Copy username"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md truncate">
                  {maskUsername(item.username)}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Password</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => togglePasswordVisibility(item.id)}
                      aria-label={visiblePasswords.has(item.id) ? "Hide password" : "Show password"}
                    >
                      {visiblePasswords.has(item.id) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(item.password, "Password")}
                      aria-label="Copy password"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md truncate">
                  {visiblePasswords.has(item.id) ? item.password : "•".repeat(12)}
                </p>
              </div>

              {item.notes && (
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.notes}</p>
                </div>
              )}

              <div className="pt-1">
                <p className="text-xs text-muted-foreground">
                  <span className="sr-only">Passwords are encrypted client-side</span>🔒 Encrypted client-side
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this item?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the password from your vault.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) onDelete(deleteId)
                setDeleteId(null)
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
