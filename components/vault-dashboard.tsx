"use client"

import { useState, useEffect } from "react"
import { VaultSidebar } from "@/components/vault-sidebar"
import { VaultHeader } from "@/components/vault-header"
import { VaultGrid } from "@/components/vault-grid"
import { AddItemModal } from "@/components/AddItemModal"
import { filterVaultItems, generateVaultItemId } from "@/lib/vault"
import type { VaultItem } from "@/types"
import { fetchVaultItems, addVaultItem, updateVaultItem, deleteVaultItem } from "@/lib/vault-api"
import { toast } from "sonner"

export function VaultDashboard() {
  const [items, setItems] = useState<VaultItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadItems = async () => {
      try {
        setIsLoading(true)
        const data = await fetchVaultItems()
        setItems(data)
      } catch (error) {
        console.log("[v0] Error loading vault items:", error)
        toast.error("Failed to load vault items")
      } finally {
        setIsLoading(false)
      }
    }
    loadItems()
  }, [])

  const filteredItems = filterVaultItems(items, searchQuery, categoryFilter)

  const handleAddItem = async (item: Omit<VaultItem, "id" | "createdAt">) => {
    try {
      const newItem = await addVaultItem(item)
      setItems([...items, newItem])
      toast.success("Item added successfully")
    } catch (error) {
      console.log("[v0] Error adding item:", error)
      toast.error("Failed to add item")
    }
  }

  const handleEditItem = async (item: VaultItem) => {
    try {
      const updatedItem = await updateVaultItem(item)
      setItems(items.map((i) => (i.id === item.id ? updatedItem : i)))
      toast.success("Item updated successfully")
    } catch (error) {
      console.log("[v0] Error updating item:", error)
      toast.error("Failed to update item")
    }
  }

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteVaultItem(id)
      setItems(items.filter((item) => item.id !== id))
      toast.success("Item deleted successfully")
    } catch (error) {
      console.log("[v0] Error deleting item:", error)
      toast.error("Failed to delete item")
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <VaultSidebar onAddItem={() => setIsAddModalOpen(true)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <VaultHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <VaultGrid
            items={filteredItems}
            onEdit={(item) => {
              setEditingItem(item)
              setIsAddModalOpen(true)
            }}
            onDelete={handleDeleteItem}
          />
        </main>
      </div>

      <AddItemModal
        open={isAddModalOpen}
        onOpenChange={(open) => {
          setIsAddModalOpen(open)
          if (!open) setEditingItem(null)
        }}
        onSave={(item) => {
          if (editingItem) {
            handleEditItem({ ...item, id: editingItem.id, createdAt: editingItem.createdAt })
          } else {
            handleAddItem(item)
          }
        }}
        editingItem={editingItem}
      />
    </div>
  )
}
