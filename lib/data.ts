import "server-only"
import { db } from "@/lib/db"
import { projects, papers, posts } from "@/lib/db/schema"
import { asc, desc, eq } from "drizzle-orm"

export async function getProjects() {
  return db
    .select()
    .from(projects)
    .orderBy(asc(projects.sortOrder), desc(projects.createdAt))
}

export async function getFeaturedProjects() {
  return db
    .select()
    .from(projects)
    .where(eq(projects.featured, true))
    .orderBy(asc(projects.sortOrder))
}

export async function getPapers() {
  return db
    .select()
    .from(papers)
    .orderBy(asc(papers.sortOrder), desc(papers.createdAt))
}

export async function getPosts() {
  return db.select().from(posts).orderBy(desc(posts.publishedAt))
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
