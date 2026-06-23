import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/db"
import { requireAuth } from "@/lib/api-auth"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth()
  if (authError) return authError

  const { id } = await params
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", Number(id))
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  return NextResponse.json(data)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth()
  if (authError) return authError

  const { id } = await params
  const body = await req.json()

  const dbBody: Record<string, unknown> = {}
  if ("slug" in body) dbBody.slug = body.slug
  if ("title" in body) dbBody.title = body.title
  if ("summary" in body) dbBody.summary = body.summary
  if ("content" in body) dbBody.content = body.content
  if ("status" in body) dbBody.status = body.status
  if ("tags" in body) dbBody.tags = body.tags
  if ("link" in body) dbBody.link = body.link ?? null
  if ("coverUrl" in body) dbBody.cover_url = body.coverUrl ?? null
  if ("year" in body) dbBody.year = body.year ?? null
  if ("featured" in body) dbBody.featured = body.featured
  if ("sortOrder" in body) dbBody.sort_order = body.sortOrder

  const { data, error } = await supabase
    .from("projects")
    .update(dbBody)
    .eq("id", Number(id))
    .select()
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  return NextResponse.json(data)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth()
  if (authError) return authError

  const { id } = await params
  const { error } = await supabase.from("projects").delete().eq("id", Number(id))

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
