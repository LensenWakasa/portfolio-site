export const dynamic = "force-dynamic"

import Link from "next/link"
import { db } from "@/lib/db"
import { projects, papers, posts } from "@/lib/db/schema"
import { sql } from "drizzle-orm"
import { LogoutButton } from "./logout-button"

export default async function AdminDashboardPage() {
  const [projectCount, paperCount, postCount, totalViews] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(projects),
    db.select({ count: sql<number>`count(*)` }).from(papers),
    db.select({ count: sql<number>`count(*)` }).from(posts),
    db
      .select({ total: sql<number>`coalesce(sum(views),0)` })
      .from(projects)
      .then(async (p) => {
        const pv = p[0]?.total ?? 0
        const pap = await db
          .select({ total: sql<number>`coalesce(sum(views),0)` })
          .from(papers)
        const po = await db
          .select({ total: sql<number>`coalesce(sum(views),0)` })
          .from(posts)
        return pv + (pap[0]?.total ?? 0) + (po[0]?.total ?? 0)
      }),
  ])

  const stats = [
    { label: "Projects", count: projectCount[0].count, href: "/admin/projects" },
    { label: "Papers", count: paperCount[0].count, href: "/admin/papers" },
    { label: "Posts", count: postCount[0].count, href: "/admin/posts" },
    { label: "Total views", count: totalViews, href: null },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <h1 className="font-heading text-xl font-bold">Admin Dashboard</h1>
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) =>
            s.href ? (
              <Link
                key={s.label}
                href={s.href}
                className="rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
              >
                <p className="font-heading text-3xl font-bold text-primary">
                  {s.count}
                </p>
                <p className="mt-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </p>
              </Link>
            ) : (
              <div key={s.label} className="rounded-lg border border-border bg-card p-6">
                <p className="font-heading text-3xl font-bold text-primary">
                  {s.count.toLocaleString()}
                </p>
                <p className="mt-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </p>
              </div>
            )
          )}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <QuickLink
            title="Projects"
            description="Manage research systems and tools"
            href="/admin/projects"
          />
          <QuickLink
            title="Papers"
            description="Manage publications and abstracts"
            href="/admin/papers"
          />
          <QuickLink
            title="Posts"
            description="Manage blog posts and essays"
            href="/admin/posts"
          />
        </div>
      </main>
    </div>
  )
}

function QuickLink({
  title,
  description,
  href,
}: {
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
    >
      <h2 className="font-heading text-lg font-bold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </Link>
  )
}
