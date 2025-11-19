export type VaultItem = {
  id: string
  siteName: string
  siteUrl: string
  username: string
  password: string
  category: "login" | "note" | "card"
  notes?: string
  createdAt: Date
}

export type PasswordStrength = "weak" | "fair" | "good" | "strong"
