"use client"

import { useEffect, useRef, useState } from "react"
import { Search, X, Eye } from "lucide-react"
import { searchContent, type SearchResult } from "@/app/actions/content"
import { useReader } from "@/components/reader-context"
import { KIND_LABEL } from "@/lib/types"

export function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const reader = useReader()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  useEffect(() => {
    if (!open) return
    const timer = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([])
        return
      }
      setLoading(true)
      try {
        setResults(await searchContent(query))
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query, open])

  function handleSelect(r: SearchResult) {
    reader.open({
      kind: r.kind,
      id: r.id,
      title: r.title,
      meta: r.meta,
      tags: r.tags,
      lead: r.snippet,
      body: r.body || r.snippet,
      link: r.link,
      views: r.views,
    })
    setOpen(false)
    setQuery("")
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <Search className="h-[18px] w-[18px]" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[110] flex items-start justify-center bg-background/80 p-4 pt-[12vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl overflow-hidden rounded-lg border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects, papers, writing..."
                className="w-full bg-transparent py-4 text-card-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close search"
                className="text-muted-foreground hover:text-card-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto">
              {loading && (
                <p className="px-4 py-6 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Searching...
                </p>
              )}
              {!loading && query.trim().length >= 2 && results.length === 0 && (
                <p className="px-4 py-6 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  No results for &ldquo;{query}&rdquo;
                </p>
              )}
              {!loading && query.trim().length < 2 && (
                <p className="px-4 py-6 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Type to search across all content
                </p>
              )}
              <ul>
                {results.map((r) => (
                  <li key={`${r.kind}-${r.id}`}>
                    <button
                      type="button"
                      onClick={() => handleSelect(r)}
                      className="flex w-full flex-col gap-1 border-b border-border/60 px-4 py-3 text-left transition-colors hover:bg-accent"
                    >
                      <div className="flex items-center gap-2">
                        <span className="label-mono text-primary">
                          {KIND_LABEL[r.kind]}
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono text-[0.7rem] text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          {r.views.toLocaleString()}
                        </span>
                      </div>
                      <span className="font-heading text-base font-semibold leading-snug text-card-foreground">
                        {r.title}
                      </span>
                      <span className="line-clamp-1 text-sm text-muted-foreground">
                        {r.snippet}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
