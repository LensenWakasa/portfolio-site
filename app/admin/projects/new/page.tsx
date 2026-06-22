"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  TextField,
  TextArea,
  TagInput,
  Checkbox,
  NumberField,
  FormActions,
} from "../../components/content-form"

export default function NewProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    slug: "",
    title: "",
    summary: "",
    content: "",
    status: "active",
    tags: [] as string[],
    link: "",
    coverUrl: "",
    year: "",
    featured: false,
    sortOrder: 0,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setLoading(false)
    if (res.ok) {
      router.push("/admin/projects")
      router.refresh()
    } else {
      alert("Failed to create project")
    }
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
          <h1 className="font-heading text-xl font-bold">New Project</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <TextField
            label="Slug"
            value={form.slug}
            onChange={(v) => setForm((f) => ({ ...f, slug: v }))}
            required
          />
          <TextField
            label="Title"
            value={form.title}
            onChange={(v) => setForm((f) => ({ ...f, title: v }))}
            required
          />
          <TextArea
            label="Summary"
            value={form.summary}
            onChange={(v) => setForm((f) => ({ ...f, summary: v }))}
            rows={3}
          />
          <TextArea
            label="Content (full write-up)"
            value={form.content}
            onChange={(v) => setForm((f) => ({ ...f, content: v }))}
            rows={10}
          />
          <TextField
            label="Status"
            value={form.status}
            onChange={(v) => setForm((f) => ({ ...f, status: v }))}
          />
          <TextField
            label="Year"
            value={form.year}
            onChange={(v) => setForm((f) => ({ ...f, year: v }))}
          />
          <TextField
            label="Link (GitHub / demo)"
            value={form.link}
            onChange={(v) => setForm((f) => ({ ...f, link: v }))}
          />
          <TextField
            label="Cover URL"
            value={form.coverUrl}
            onChange={(v) => setForm((f) => ({ ...f, coverUrl: v }))}
          />
          <TagInput
            label="Tags"
            tags={form.tags}
            onChange={(tags) => setForm((f) => ({ ...f, tags }))}
          />
          <NumberField
            label="Sort order"
            value={form.sortOrder}
            onChange={(v) => setForm((f) => ({ ...f, sortOrder: v }))}
          />
          <Checkbox
            label="Featured on homepage"
            checked={form.featured}
            onChange={(v) => setForm((f) => ({ ...f, featured: v }))}
          />
          <FormActions
            loading={loading}
            onCancel={() => router.push("/admin/projects")}
          />
        </form>
      </main>
    </div>
  )
}
