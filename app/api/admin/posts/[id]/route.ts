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
    .from("posts")
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
  if ("excerpt" in body) dbBody.excerpt = body.excerpt
  if ("content" in body) dbBody.content = body.content
  if ("year" in body) dbBody.year = body.year ?? null
  if ("tags" in body) dbBody.tags = body.tags

  const { data, error } = await supabase
    .from("posts")
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
  const { error } = await supabase.from("posts").delete().eq("id", Number(id))

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
