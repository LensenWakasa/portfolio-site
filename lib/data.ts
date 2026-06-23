import "server-only"
import { hasSupabaseConfig, supabase } from "@/lib/db"
import type { Project, Paper, Post } from "@/lib/db/schema"
import { samplePapers, samplePosts, sampleProjects } from "@/lib/sample-data"

export async function getProjects(): Promise<Project[]> {
  if (!hasSupabaseConfig) return sampleProjects

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(rowToProject)
}

export async function getProject(slug: string): Promise<Project | null> {
  if (!hasSupabaseConfig) {
    return sampleProjects.find((project) => project.slug === slug) ?? null
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single()
  if (error) return null
  return rowToProject(data)
}

export async function getFeaturedProjects(): Promise<Project[]> {
  if (!hasSupabaseConfig) return sampleProjects.filter((p) => p.featured)

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("featured", true)
    .order("sort_order", { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []).map(rowToProject)
}

export async function getPapers(): Promise<Paper[]> {
  if (!hasSupabaseConfig) return samplePapers

  const { data, error } = await supabase
    .from("papers")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(rowToPaper)
}

export async function getPaper(slug: string): Promise<Paper | null> {
  if (!hasSupabaseConfig) {
    return samplePapers.find((paper) => paper.slug === slug) ?? null
  }

  const { data, error } = await supabase
    .from("papers")
    .select("*")
    .eq("slug", slug)
    .single()
  if (error) return null
  return rowToPaper(data)
}

export async function getPosts(): Promise<Post[]> {
  if (!hasSupabaseConfig) return samplePosts

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("published_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(rowToPost)
}

export async function getPost(slug: string): Promise<Post | null> {
  if (!hasSupabaseConfig) {
    return samplePosts.find((post) => post.slug === slug) ?? null
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single()
  if (error) return null
  return rowToPost(data)
}

export async function getStats() {
  const [p, r, w] = await Promise.all([getProjects(), getPapers(), getPosts()])
  const totalViews =
    p.reduce((s, x) => s + x.views, 0) +
    r.reduce((s, x) => s + x.views, 0) +
    w.reduce((s, x) => s + x.views, 0)
  return {
    projects: p.length,
    papers: r.length,
    posts: w.length,
    views: totalViews,
  }
}

function rowToProject(row: Record<string, unknown>): Project {
  return {
    id: row.id as number,
    slug: row.slug as string,
    title: row.title as string,
    summary: row.summary as string,
    content: row.content as string,
    status: row.status as string,
    tags: (row.tags as string[]) ?? [],
    link: (row.link as string | null) ?? null,
    coverUrl: (row.cover_url as string | null) ?? null,
    year: (row.year as string | null) ?? null,
    featured: (row.featured as boolean) ?? false,
    sortOrder: (row.sort_order as number) ?? 0,
    views: (row.views as number) ?? 0,
    createdAt: row.created_at as string,
  }
}

function rowToPaper(row: Record<string, unknown>): Paper {
  return {
    id: row.id as number,
    slug: row.slug as string,
    title: row.title as string,
    abstract: row.abstract as string,
    content: row.content as string,
    authors: row.authors as string,
    venue: (row.venue as string | null) ?? null,
    year: (row.year as string | null) ?? null,
    link: (row.link as string | null) ?? null,
    pdfUrl: (row.pdf_url as string | null) ?? null,
    coverUrl: (row.cover_url as string | null) ?? null,
    tags: (row.tags as string[]) ?? [],
    sortOrder: (row.sort_order as number) ?? 0,
    views: (row.views as number) ?? 0,
    createdAt: row.created_at as string,
  }
}

function rowToPost(row: Record<string, unknown>): Post {
  return {
    id: row.id as number,
    slug: row.slug as string,
    title: row.title as string,
    excerpt: row.excerpt as string,
    content: row.content as string,
    year: (row.year as string | null) ?? null,
    coverUrl: (row.cover_url as string | null) ?? null,
    publishedAt: row.published_at as string,
    tags: (row.tags as string[]) ?? [],
    views: (row.views as number) ?? 0,
    createdAt: row.created_at as string,
  }
}
