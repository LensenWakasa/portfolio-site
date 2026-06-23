import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/db"
import { requireAuth } from "@/lib/api-auth"

export async function GET() {
  const authError = await requireAuth()
  if (authError) return authError

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  const body = await req.json()
  const dbBody = {
    slug: body.slug,
    title: body.title,
    excerpt: body.excerpt,
    content: body.content,
    year: body.year ?? null,
    published_at: new Date().toISOString(),
    tags: body.tags ?? [],
    views: 0,
  }

  const { data, error } = await supabase
    .from("posts")
    .insert(dbBody)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
