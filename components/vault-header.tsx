"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface VaultHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  categoryFilter: string
  onCategoryChange: (category: string) => void
}

export function VaultHeader({ searchQuery, onSearchChange, categoryFilter, onCategoryChange }: VaultHeaderProps) {
  const categories = [
    { value: "all", label: "All Items" },
    { value: "login", label: "Logins" },
    { value: "note", label: "Secure Notes" },
    { value: "card", label: "Payment Cards" },
  ]

  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search vault..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-11"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 h-11 bg-transparent">
              <Filter className="h-4 w-4" />
              {categories.find((c) => c.value === categoryFilter)?.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {categories.map((category) => (
              <DropdownMenuItem key={category.value} onClick={() => onCategoryChange(category.value)}>
                {category.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
