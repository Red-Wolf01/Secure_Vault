import type { VaultItem } from '@/types'

export async function fetchVaultItems(): Promise<VaultItem[]> {
  const response = await fetch('/api/vault')
  const data = await response.json()
  
  if (!response.ok) {
    console.error('[v0] Server response:', data)
    throw new Error(data.error || 'Failed to fetch vault items')
  }
  
  return data.map((item: any) => ({
    id: item.id,
    siteName: item.title,
    siteUrl: item.website,
    username: item.username,
    password: item.password,
    category: item.category,
    notes: item.notes,
    createdAt: new Date(item.created_at),
  }))
}

export async function addVaultItem(
  item: Omit<VaultItem, 'id' | 'createdAt'>,
): Promise<VaultItem> {
  const response = await fetch('/api/vault', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  })
  const data = await response.json()
  
  if (!response.ok) {
    console.error('[v0] Server response:', data)
    throw new Error(data.error || 'Failed to add vault item')
  }
  
  return {
    id: data.id,
    siteName: data.title,
    siteUrl: data.website,
    username: data.username,
    password: data.password,
    category: data.category,
    notes: data.notes,
    createdAt: new Date(data.created_at),
  }
}

export async function updateVaultItem(item: VaultItem): Promise<VaultItem> {
  const response = await fetch('/api/vault', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  })
  const data = await response.json()
  
  if (!response.ok) {
    console.error('[v0] Server response:', data)
    throw new Error(data.error || 'Failed to update vault item')
  }
  
  return {
    id: data.id,
    siteName: data.title,
    siteUrl: data.website,
    username: data.username,
    password: data.password,
    category: data.category,
    notes: data.notes,
    createdAt: new Date(data.created_at),
  }
}

export async function deleteVaultItem(id: string): Promise<void> {
  const response = await fetch(`/api/vault?id=${id}`, {
    method: 'DELETE',
  })
  const data = await response.json()
  
  if (!response.ok) {
    console.error('[v0] Server response:', data)
    throw new Error(data.error || 'Failed to delete vault item')
  }
}
