import type { VaultItem } from "@/types"

export const mockVaultItems: VaultItem[] = [
  {
    id: "1",
    siteName: "GitHub",
    siteUrl: "https://github.com",
    username: "user@example.com",
    password: "Gh!2#4aB$6cD",
    category: "login",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    siteName: "Gmail",
    siteUrl: "https://gmail.com",
    username: "myemail@gmail.com",
    password: "Gm@8xY#2zQ!9",
    category: "login",
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "3",
    siteName: "AWS Console",
    siteUrl: "https://aws.amazon.com",
    username: "admin@company.com",
    password: "Aw$5#7pL@3mN",
    category: "login",
    notes: "Production account - handle with care",
    createdAt: new Date("2024-03-10"),
  },
]

export function filterVaultItems(items: VaultItem[], searchQuery: string, categoryFilter: string): VaultItem[] {
  return items.filter((item) => {
    const matchesSearch =
      item.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.username.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })
}

export function generateVaultItemId(): string {
  return Math.random().toString(36).substr(2, 9)
}
