"use server"

import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { projects, papers, posts } from "@/lib/db/schema"
import { eq, sql, ilike, or } from "drizzle-orm"

export type ContentKind = "project" | "paper" | "post"

const tableFor = {
  project: projects,
  paper: papers,
  post: posts,
} as const

function getViewCookieName(kind: ContentKind, id: number) {
  return `viewed_${kind}_${id}`
}

export async function incrementView(kind: ContentKind, id: number): Promise<number> {
  const cookieStore = await cookies()
  const cookieName = getViewCookieName(kind, id)
  const alreadyViewed = cookieStore.get(cookieName)?.value === "1"

  const table = tableFor[kind]

  if (!alreadyViewed) {
    await db
      .update(table)
      .set({ views: sql`${table.views} + 1` })
      .where(eq(table.id, id))

    cookieStore.set(cookieName, "1", {
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
      sameSite: "lax",
    })
  }

  const [row] = await db
    .select({ views: table.views })
    .from(table)
    .where(eq(table.id, id))

  return row?.views ?? 0
}

export type SearchResult = {
  kind: ContentKind
  id: number
  title: string
  snippet: string
  body: string
  meta?: string
  link?: string | null
  tags: string[]
  views: number
}

export async function searchContent(query: string): Promise<SearchResult[]> {
  const q = query.trim()
  if (q.length < 2) return []
  const like = `%${q}%`

  const [pj, pp, ps] = await Promise.all([
    db
      .select()
      .from(projects)
      .where(or(ilike(projects.title, like), ilike(projects.summary, like), ilike(projects.content, like)))
      .limit(6),
    db
      .select()
      .from(papers)
      .where(or(ilike(papers.title, like), ilike(papers.abstract, like), ilike(papers.content, like)))
      .limit(6),
    db
      .select()
      .from(posts)
      .where(or(ilike(posts.title, like), ilike(posts.excerpt, like), ilike(posts.content, like)))
      .limit(6),
  ])

  const results: SearchResult[] = [
    ...pj.map((x) => ({
      kind: "project" as const,
      id: x.id,
      title: x.title,
      snippet: x.summary,
      body: x.content,
      meta: [x.status, x.year].filter(Boolean).join(" · "),
      link: x.link,
      tags: x.tags,
      views: x.views,
    })),
    ...pp.map((x) => ({
      kind: "paper" as const,
      id: x.id,
      title: x.title,
      snippet: x.abstract,
      body: x.content,
      meta: [x.authors, x.venue, x.year].filter(Boolean).join(" · "),
      link: x.link,
      tags: x.tags,
      views: x.views,
    })),
    ...ps.map((x) => ({
      kind: "post" as const,
      id: x.id,
      title: x.title,
      snippet: x.excerpt,
      body: x.content,
      meta: x.year ?? undefined,
      link: null,
      tags: x.tags,
      views: x.views,
    })),
  ]

  return results
}
