import { createBrowserClient } from '@supabase/ssr'

declare global {
  var supabaseClient: ReturnType<typeof createBrowserClient> | undefined
}

export function createClient() {
  if (globalThis.supabaseClient) {
    return globalThis.supabaseClient
  }

  const client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  globalThis.supabaseClient = client

  return client
}

export const createBrowserSupabaseClient = createClient
