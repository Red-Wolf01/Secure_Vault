"use client"

import { useRouter, usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ShieldCheck, Vault, Plus, Settings, LogOut } from 'lucide-react'
import { cn } from "@/lib/utils"
import { createBrowserSupabaseClient } from "@/lib/client"

interface VaultSidebarProps {
  onAddItem: () => void
}

export function VaultSidebar({ onAddItem }: VaultSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createBrowserSupabaseClient()

  const navItems = [
    { icon: Vault, label: "Vault", href: "/vault" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ]

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-base">SecureVault</h2>
            <p className="text-xs text-muted-foreground">Password Manager</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Button onClick={onAddItem} className="w-full justify-start gap-3 h-11">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>

        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn("w-full justify-start gap-3 h-11", pathname === item.href && "bg-secondary")}
            onClick={() => router.push(item.href)}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-11 text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
