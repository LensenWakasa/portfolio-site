"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  TextField,
  TextArea,
  TagInput,
  FormActions,
} from "../../components/content-form"

export default function NewPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    year: "",
    tags: [] as string[],
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setLoading(false)
    if (res.ok) {
      router.push("/admin/posts")
      router.refresh()
    } else {
      alert("Failed to create post")
    }
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
          <h1 className="font-heading text-xl font-bold">New Post</h1>
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
            label="Excerpt"
            value={form.excerpt}
            onChange={(v) => setForm((f) => ({ ...f, excerpt: v }))}
            rows={3}
          />
          <TextArea
            label="Content (full post)"
            value={form.content}
            onChange={(v) => setForm((f) => ({ ...f, content: v }))}
            rows={14}
          />
          <TextField
            label="Year"
            value={form.year}
            onChange={(v) => setForm((f) => ({ ...f, year: v }))}
          />
          <TagInput
            label="Tags"
            tags={form.tags}
            onChange={(tags) => setForm((f) => ({ ...f, tags }))}
          />
          <FormActions
            loading={loading}
            onCancel={() => router.push("/admin/posts")}
          />
        </form>
      </main>
    </div>
  )
}
