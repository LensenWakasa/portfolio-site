import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { projects } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { requireAuth } from "@/lib/api-auth"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth()
  if (authError) return authError
  const { id } = await params
  const [row] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, Number(id)))
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
    .update(projects)
    .set(body)
    .where(eq(projects.id, Number(id)))
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
  await db.delete(projects).where(eq(projects.id, Number(id)))
  return NextResponse.json({ ok: true })
}
