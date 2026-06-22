"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  TextField,
  TextArea,
  TagInput,
  Checkbox,
  NumberField,
  FormActions,
} from "../../../components/content-form"
import type { Project } from "@/lib/db/schema"

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Project | null>(null)

  useEffect(() => {
    params.then(({ id }) => {
      fetch(`/api/admin/projects/${id}`)
        .then((r) => r.json())
        .then((data) => setForm(data))
    })
  }, [params])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form) return
    setSaving(true)
    const { id: _id, createdAt: _ca, views: _v, ...body } = form
    const { id } = await params
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    setSaving(false)
    if (res.ok) {
      router.push("/admin/projects")
      router.refresh()
    } else {
      alert("Failed to update project")
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
            href="/admin/projects"
            className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-primary"
          >
            ← Projects
          </Link>
          <h1 className="font-heading text-xl font-bold">Edit Project</h1>
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
            label="Summary"
            value={form.summary}
            onChange={(v) => setForm((f) => (f ? { ...f, summary: v } : f))}
            rows={3}
          />
          <TextArea
            label="Content (full write-up)"
            value={form.content}
            onChange={(v) => setForm((f) => (f ? { ...f, content: v } : f))}
            rows={10}
          />
          <TextField
            label="Status"
            value={form.status}
            onChange={(v) => setForm((f) => (f ? { ...f, status: v } : f))}
          />
          <TextField
            label="Year"
            value={form.year ?? ""}
            onChange={(v) => setForm((f) => (f ? { ...f, year: v } : f))}
          />
          <TextField
            label="Link (GitHub / demo)"
            value={form.link ?? ""}
            onChange={(v) => setForm((f) => (f ? { ...f, link: v } : f))}
          />
          <TextField
            label="Cover URL"
            value={form.coverUrl ?? ""}
            onChange={(v) => setForm((f) => (f ? { ...f, coverUrl: v } : f))}
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
          <Checkbox
            label="Featured on homepage"
            checked={form.featured}
            onChange={(v) => setForm((f) => (f ? { ...f, featured: v } : f))}
          />
          <FormActions
            loading={saving}
            onCancel={() => router.push("/admin/projects")}
          />
        </form>
      </main>
    </div>
  )
}
