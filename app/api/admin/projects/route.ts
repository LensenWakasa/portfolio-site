import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { projects } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"

export async function GET() {
  const rows = await db.select().from(projects).orderBy(desc(projects.createdAt))
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const [row] = await db.insert(projects).values(body).returning()
  return NextResponse.json(row, { status: 201 })
}
