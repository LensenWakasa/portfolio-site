"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Pencil, Trash2 } from "lucide-react"
import type { Paper } from "@/lib/db/schema"

export default function AdminPapersPage() {
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/papers")
      .then((r) => r.json())
      .then((data) => {
        setPapers(data)
        setLoading(false)
      })
  }, [])

  async function handleDelete(id: number) {
    if (!confirm("Delete this paper?")) return
    await fetch(`/api/admin/papers/${id}`, { method: "DELETE" })
    setPapers((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-primary"
            >
              ← Dashboard
            </Link>
            <h1 className="font-heading text-xl font-bold">Papers</h1>
          </div>
          <Link
            href="/admin/papers/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" />
            New
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : papers.length === 0 ? (
          <p className="text-muted-foreground">No papers yet.</p>
        ) : (
          <div className="space-y-3">
            {papers.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-heading text-base font-semibold">
                    {p.title}
                  </p>
                  <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                    {p.slug} · {p.venue || "No venue"} · {p.views} views
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/papers/${p.id}/edit`}
                    className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
