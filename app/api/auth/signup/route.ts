import { createServerSupabaseClient } from "@/lib/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("Request parsing error:", parseError)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || request.headers.get("origin")}/`,
      },
    })

    if (error) {
      console.error("Signup error:", error.message)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // The database trigger automatically creates the user profile
    return NextResponse.json({ user: data.user }, { status: 200 })
  } catch (error) {
    console.error("Signup exception:", error)
    return NextResponse.json({ error: "Failed to sign up" }, { status: 500 })
  }
}
