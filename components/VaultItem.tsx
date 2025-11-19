"use client"

import { useState } from "react"
import { Eye, EyeOff, Copy, Edit, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import type { VaultItem as VaultItemType } from "@/types"

interface VaultItemProps {
  item: VaultItemType
  onEdit: (item: VaultItemType) => void
  onDelete: (id: string) => void
}

export function VaultItem({ item, onEdit, onDelete }: VaultItemProps) {
  const [showPassword, setShowPassword] = useState(false)

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(item.password)
    toast.success("Password copied to clipboard")
  }

  const handleCopyUsername = () => {
    navigator.clipboard.writeText(item.username)
    toast.success("Username copied to clipboard")
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{item.siteName}</CardTitle>
            <CardDescription className="text-xs mt-1">{item.category.toUpperCase()}</CardDescription>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(item)}
              className="h-8 w-8 p-0"
              aria-label="Edit item"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(item.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              aria-label="Delete item"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Username</p>
          <div className="flex items-center justify-between gap-2 bg-muted p-2 rounded">
            <p className="text-sm font-mono truncate">{item.username}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyUsername}
              className="h-6 w-6 p-0 flex-shrink-0"
              aria-label="Copy username"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Password</p>
          <div className="flex items-center justify-between gap-2 bg-muted p-2 rounded">
            <p className="text-sm font-mono">{showPassword ? item.password : "••••••••"}</p>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="h-6 w-6 p-0"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyPassword}
                className="h-6 w-6 p-0"
                aria-label="Copy password"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {item.notes && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Notes</p>
            <p className="text-sm text-foreground bg-muted p-2 rounded">{item.notes}</p>
          </div>
        )}

        {item.siteUrl && (
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 bg-transparent"
            onClick={() => window.open(item.siteUrl, "_blank")}
          >
            <ExternalLink className="h-3 w-3" />
            Visit Site
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
