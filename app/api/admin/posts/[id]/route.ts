import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { posts } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { requireAuth } from "@/lib/api-auth"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth()
  if (authError) return authError
  const { id } = await params
  const [row] = await db.select().from(posts).where(eq(posts.id, Number(id)))
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(row)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth()
  if (authError) return authError
  const { id } = await params
  const body = await req.json()
  const [row] = await db
    .update(posts)
    .set(body)
    .where(eq(posts.id, Number(id)))
    .returning()
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(row)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth()
  if (authError) return authError
  const { id } = await params
  await db.delete(posts).where(eq(posts.id, Number(id)))
  return NextResponse.json({ ok: true })
}
