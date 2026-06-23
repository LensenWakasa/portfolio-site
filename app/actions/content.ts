"use server"

import { cookies } from "next/headers"
import { hasSupabaseConfig, supabase } from "@/lib/db"
import { samplePapers, samplePosts, sampleProjects } from "@/lib/sample-data"

export type ContentKind = "project" | "paper" | "post"

const tableFor: Record<ContentKind, string> = {
  project: "projects",
  paper: "papers",
  post: "posts",
}

function getViewCookieName(kind: ContentKind, id: number) {
  return `viewed_${kind}_${id}`
}

export async function incrementView(kind: ContentKind, id: number): Promise<number> {
  if (!hasSupabaseConfig) {
    const rows =
      kind === "project"
        ? sampleProjects
        : kind === "paper"
          ? samplePapers
          : samplePosts
    const row = rows.find((item) => item.id === id)
    return row?.views ?? 0
  }

  const cookieStore = await cookies()
  const cookieName = getViewCookieName(kind, id)
  const alreadyViewed = cookieStore.get(cookieName)?.value === "1"

  if (!alreadyViewed) {
    const { data: row } = await supabase
      .from(tableFor[kind])
      .select("views")
      .eq("id", id)
      .single()

    const newViews = (row?.views ?? 0) + 1
    await supabase
      .from(tableFor[kind])
      .update({ views: newViews })
      .eq("id", id)

    cookieStore.set(cookieName, "1", {
      maxAge: 60 * 60 * 24,
      path: "/",
      sameSite: "lax",
    })

    return newViews
  }

  const { data: row } = await supabase
    .from(tableFor[kind])
    .select("views")
    .eq("id", id)
    .single()

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

  if (!hasSupabaseConfig) {
    const normalized = q.toLowerCase()
    return [
      ...sampleProjects.map((x) => ({
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
      ...samplePapers.map((x) => ({
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
      ...samplePosts.map((x) => ({
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
    ].filter((item) =>
      [item.title, item.snippet, item.body, item.meta, item.tags.join(" ")]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalized))
    )
  }

  const [{ data: pj }, { data: pp }, { data: ps }] = await Promise.all([
    supabase.from("projects").select("*").ilike("title", `%${q}%`).limit(6),
    supabase.from("papers").select("*").ilike("title", `%${q}%`).limit(6),
    supabase.from("posts").select("*").ilike("title", `%${q}%`).limit(6),
  ])

  const results: SearchResult[] = [
    ...(pj ?? []).map((x: Record<string, unknown>) => ({
      kind: "project" as const,
      id: x.id as number,
      title: x.title as string,
      snippet: x.summary as string,
      body: x.content as string,
      meta: [x.status, x.year].filter(Boolean).join(" · "),
      link: (x.link as string | null) ?? null,
      tags: (x.tags as string[]) ?? [],
      views: (x.views as number) ?? 0,
    })),
    ...(pp ?? []).map((x: Record<string, unknown>) => ({
      kind: "paper" as const,
      id: x.id as number,
      title: x.title as string,
      snippet: x.abstract as string,
      body: x.content as string,
      meta: [x.authors, x.venue, x.year].filter(Boolean).join(" · "),
      link: (x.link as string | null) ?? null,
      tags: (x.tags as string[]) ?? [],
      views: (x.views as number) ?? 0,
    })),
    ...(ps ?? []).map((x: Record<string, unknown>) => ({
      kind: "post" as const,
      id: x.id as number,
      title: x.title as string,
      snippet: x.excerpt as string,
      body: x.content as string,
      meta: (x.year as string | null) ?? undefined,
      link: null,
      tags: (x.tags as string[]) ?? [],
      views: (x.views as number) ?? 0,
    })),
  ]

  return results
}
