"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  TextField,
  TextArea,
  TagInput,
  NumberField,
  FormActions,
} from "../../../components/content-form"
import { mapPaper } from "@/lib/db/mappers"
import type { Paper } from "@/lib/db/schema"

export default function EditPaperPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Paper | null>(null)

  useEffect(() => {
    params.then(({ id }) => {
      fetch(`/api/admin/papers/${id}`)
        .then((r) => r.json())
        .then((data) => setForm(mapPaper(data)))
    })
  }, [params])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form) return
    setSaving(true)
    const { id: _id, createdAt: _ca, views: _v, ...body } = form
    const { id } = await params
    const res = await fetch(`/api/admin/papers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    setSaving(false)
    if (res.ok) {
      router.push("/admin/papers")
      router.refresh()
    } else {
      alert("Failed to update paper")
    }
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-background p-8">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/admin/papers"
            className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-primary"
          >
            ← Papers
          </Link>
          <h1 className="font-heading text-xl font-bold">Edit Paper</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <TextField
            label="Slug"
            value={form.slug}
            onChange={(v) => setForm((f) => (f ? { ...f, slug: v } : f))}
            required
          />
          <TextField
            label="Title"
            value={form.title}
            onChange={(v) => setForm((f) => (f ? { ...f, title: v } : f))}
            required
          />
          <TextArea
            label="Abstract"
            value={form.abstract}
            onChange={(v) => setForm((f) => (f ? { ...f, abstract: v } : f))}
            rows={4}
          />
          <TextArea
            label="Content (full notes)"
            value={form.content}
            onChange={(v) => setForm((f) => (f ? { ...f, content: v } : f))}
            rows={10}
          />
          <TextField
            label="Authors"
            value={form.authors}
            onChange={(v) => setForm((f) => (f ? { ...f, authors: v } : f))}
          />
          <TextField
            label="Venue"
            value={form.venue ?? ""}
            onChange={(v) => setForm((f) => (f ? { ...f, venue: v } : f))}
          />
          <TextField
            label="Year"
            value={form.year ?? ""}
            onChange={(v) => setForm((f) => (f ? { ...f, year: v } : f))}
          />
          <TextField
            label="Link (arXiv / DOI)"
            value={form.link ?? ""}
            onChange={(v) => setForm((f) => (f ? { ...f, link: v } : f))}
          />
          <TextField
            label="PDF URL"
            value={form.pdfUrl ?? ""}
            onChange={(v) => setForm((f) => (f ? { ...f, pdfUrl: v } : f))}
          />
          <TagInput
            label="Tags"
            tags={form.tags}
            onChange={(tags) => setForm((f) => (f ? { ...f, tags } : f))}
          />
          <NumberField
            label="Sort order"
            value={form.sortOrder}
            onChange={(v) => setForm((f) => (f ? { ...f, sortOrder: v } : f))}
          />
          <FormActions
            loading={saving}
            onCancel={() => router.push("/admin/papers")}
          />
        </form>
      </main>
    </div>
  )
}
