import { NextResponse } from "next/server"
import { getSession } from "./auth"

export async function requireAuth() {
  const session = await getSession()
  if (!session.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return null
}
