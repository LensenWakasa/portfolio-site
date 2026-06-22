"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  TextField,
  TextArea,
  TagInput,
  NumberField,
  FormActions,
} from "../../components/content-form"

export default function NewPaperPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    slug: "",
    title: "",
    abstract: "",
    content: "",
    authors: "",
    venue: "",
    year: "",
    link: "",
    pdfUrl: "",
    tags: [] as string[],
    sortOrder: 0,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch("/api/admin/papers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setLoading(false)
    if (res.ok) {
      router.push("/admin/papers")
      router.refresh()
    } else {
      alert("Failed to create paper")
    }
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
          <h1 className="font-heading text-xl font-bold">New Paper</h1>
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
            label="Abstract"
            value={form.abstract}
            onChange={(v) => setForm((f) => ({ ...f, abstract: v }))}
            rows={4}
          />
          <TextArea
            label="Content (full notes)"
            value={form.content}
            onChange={(v) => setForm((f) => ({ ...f, content: v }))}
            rows={10}
          />
          <TextField
            label="Authors"
            value={form.authors}
            onChange={(v) => setForm((f) => ({ ...f, authors: v }))}
          />
          <TextField
            label="Venue"
            value={form.venue}
            onChange={(v) => setForm((f) => ({ ...f, venue: v }))}
          />
          <TextField
            label="Year"
            value={form.year}
            onChange={(v) => setForm((f) => ({ ...f, year: v }))}
          />
          <TextField
            label="Link (arXiv / DOI)"
            value={form.link}
            onChange={(v) => setForm((f) => ({ ...f, link: v }))}
          />
          <TextField
            label="PDF URL"
            value={form.pdfUrl}
            onChange={(v) => setForm((f) => ({ ...f, pdfUrl: v }))}
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
          <FormActions
            loading={loading}
            onCancel={() => router.push("/admin/papers")}
          />
        </form>
      </main>
    </div>
  )
}
