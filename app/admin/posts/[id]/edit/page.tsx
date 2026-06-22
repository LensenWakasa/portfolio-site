"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  TextField,
  TextArea,
  TagInput,
  FormActions,
} from "../../../components/content-form"
import type { Post } from "@/lib/db/schema"

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Post | null>(null)

  useEffect(() => {
    params.then(({ id }) => {
      fetch(`/api/admin/posts/${id}`)
        .then((r) => r.json())
        .then((data) => setForm(data))
    })
  }, [params])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form) return
    setSaving(true)
    const { id: _id, createdAt: _ca, views: _v, publishedAt: _pa, ...body } = form
    const { id } = await params
    const res = await fetch(`/api/admin/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    setSaving(false)
    if (res.ok) {
      router.push("/admin/posts")
      router.refresh()
    } else {
      alert("Failed to update post")
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
            href="/admin/posts"
            className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-primary"
          >
            ← Posts
          </Link>
          <h1 className="font-heading text-xl font-bold">Edit Post</h1>
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
            label="Excerpt"
            value={form.excerpt}
            onChange={(v) => setForm((f) => (f ? { ...f, excerpt: v } : f))}
            rows={3}
          />
          <TextArea
            label="Content (full post)"
            value={form.content}
            onChange={(v) => setForm((f) => (f ? { ...f, content: v } : f))}
            rows={14}
          />
          <TextField
            label="Year"
            value={form.year ?? ""}
            onChange={(v) => setForm((f) => (f ? { ...f, year: v } : f))}
          />
          <TagInput
            label="Tags"
            tags={form.tags}
            onChange={(tags) => setForm((f) => (f ? { ...f, tags } : f))}
          />
          <FormActions
            loading={saving}
            onCancel={() => router.push("/admin/posts")}
          />
        </form>
      </main>
    </div>
  )
}
