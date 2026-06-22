import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { papers } from "@/lib/db/schema"
import { desc } from "drizzle-orm"

export async function GET() {
  const rows = await db.select().from(papers).orderBy(desc(papers.createdAt))
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const [row] = await db.insert(papers).values(body).returning()
  return NextResponse.json(row, { status: 201 })
}
