import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/db"
import { requireAuth } from "@/lib/api-auth"

export async function GET() {
  const authError = await requireAuth()
  if (authError) return authError

  const { data, error } = await supabase
    .from("projects")
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
    summary: body.summary,
    content: body.content,
    status: body.status,
    tags: body.tags ?? [],
    link: body.link ?? null,
    cover_url: body.coverUrl ?? null,
    year: body.year ?? null,
    featured: body.featured ?? false,
    sort_order: body.sortOrder ?? 0,
    views: 0,
  }

  const { data, error } = await supabase
    .from("projects")
    .insert(dbBody)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
