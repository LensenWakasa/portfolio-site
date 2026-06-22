import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { posts } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import { requireAuth } from "@/lib/api-auth"

export async function GET() {
  const authError = await requireAuth()
  if (authError) return authError
  const rows = await db.select().from(posts).orderBy(desc(posts.createdAt))
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError
  const body = await req.json()
  const [row] = await db.insert(posts).values(body).returning()
  return NextResponse.json(row, { status: 201 })
}
