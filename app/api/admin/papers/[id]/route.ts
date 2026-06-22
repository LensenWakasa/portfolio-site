import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { papers } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const [row] = await db.select().from(papers).where(eq(papers.id, Number(id)))
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(row)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const [row] = await db
    .update(papers)
    .set(body)
    .where(eq(papers.id, Number(id)))
    .returning()
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(row)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await db.delete(papers).where(eq(papers.id, Number(id)))
  return NextResponse.json({ ok: true })
}
