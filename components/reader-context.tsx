"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { X, ArrowUpRight, Eye } from "lucide-react"
import { incrementView } from "@/app/actions/content"
import { KIND_LABEL, type ReaderItem } from "@/lib/types"

type ReaderContextValue = {
  open: (item: ReaderItem) => void
}

const ReaderContext = createContext<ReaderContextValue | null>(null)

export function useReader() {
  const ctx = useContext(ReaderContext)
  if (!ctx) throw new Error("useReader must be used within ReaderProvider")
  return ctx
}

function renderBody(body: string) {
  const blocks = body.split("\n\n")
  return blocks.map((block, i) => {
    const trimmed = block.trim()
    if (!trimmed) return null

    // Heading: ### text
    if (/^#{1,3}\s/.test(trimmed)) {
      const level = trimmed.match(/^(#{1,3})\s/)?.[1].length ?? 1
      const text = trimmed.replace(/^#{1,3}\s/, "")
      const Tag = `h${level + 1}` as "h2" | "h3" | "h4"
      return (
        <Tag key={i} className="mt-8 font-heading text-xl font-bold text-card-foreground">
          {text}
        </Tag>
      )
    }

    // Blockquote: > text
    if (/^>\s/.test(trimmed)) {
      const text = trimmed.replace(/^>\s?/, "")
      return (
        <blockquote
          key={i}
          className="mt-4 rounded-r-xl border-l-2 border-primary bg-primary/5 px-4 py-3 text-pretty italic leading-relaxed text-muted-foreground"
        >
          {renderInline(text)}
        </blockquote>
      )
    }

    // Unordered list items
    if (/^[-*]\s/.test(trimmed)) {
      const items = trimmed.split("\n").filter((l) => l.trim().startsWith("- ") || l.trim().startsWith("* "))
      return (
        <ul key={i} className="mt-4 list-disc space-y-1.5 pl-5 text-muted-foreground">
          {items.map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: renderInline(item.replace(/^[-*]\s/, "")) }} />
          ))}
        </ul>
      )
    }

    // Ordered list
    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split("\n").filter((l) => /^\d+\.\s/.test(l.trim()))
      return (
        <ol key={i} className="mt-4 list-decimal space-y-1.5 pl-5 text-muted-foreground">
          {items.map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: renderInline(item.replace(/^\d+\.\s/, "")) }} />
          ))}
        </ol>
      )
    }

    // Horizontal rule
    if (/^---+$/.test(trimmed)) {
      return <hr key={i} className="my-6 border-border" />
    }

    // Regular paragraph
    return (
      <p
        key={i}
        className="text-pretty leading-relaxed text-muted-foreground"
        dangerouslySetInnerHTML={{ __html: renderInline(trimmed) }}
      />
    )
  })
}

function renderInline(text: string) {
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

  // Links: [text](url)
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline underline-offset-4 hover:opacity-80">$1</a>'
  )

  // Bold: **text**
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")

  // Italic: *text* (not inside bold)
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>")

  // Code: `text`
  html = html.replace(
    /`(.+?)`/g,
    '<code class="rounded-md bg-muted px-1.5 py-0.5 font-mono text-sm text-primary">$1</code>'
  )

  return html
}

export function ReaderProvider({ children }: { children: React.ReactNode }) {
  const [item, setItem] = useState<ReaderItem | null>(null)
  const [views, setViews] = useState<number>(0)

  const open = useCallback((next: ReaderItem) => {
    setItem(next)
    setViews(next.views)
    incrementView(next.kind, next.id)
      .then((count) => setViews(count))
      .catch(() => {})
  }, [])

  const close = useCallback(() => setItem(null), [])

  useEffect(() => {
    if (!item) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [item, close])

  return (
    <ReaderContext.Provider value={{ open }}>
      {children}
      {item && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-background/70 p-4 backdrop-blur-md sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          onClick={close}
        >
          <article
            className="relative my-4 w-full max-w-2xl rounded-2xl border border-border bg-card text-card-foreground shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cover image */}
            {item.coverUrl && (
              <div className="relative h-56 w-full overflow-hidden rounded-t-2xl">
                <img
                  src={item.coverUrl}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
              </div>
            )}

            <button
              type="button"
              onClick={close}
              aria-label="Close reader"
              className="absolute right-4 top-4 z-10 rounded-full bg-card/80 p-2 text-muted-foreground backdrop-blur-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:scale-110"
            >
              <X className="h-5 w-5" />
            </button>

            <div className={`px-6 pb-10 sm:px-10 ${item.coverUrl ? "pt-6" : "pt-8"}`}>
              <div className="flex items-center gap-3 label-mono text-primary">
                <span>{KIND_LABEL[item.kind]}</span>
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Eye className="h-3.5 w-3.5" />
                  {views.toLocaleString()}
                </span>
              </div>

              <h2 className="mt-4 text-balance font-heading text-3xl font-bold leading-tight sm:text-4xl">
                {item.title}
              </h2>

              {item.meta && (
                <p className="mt-3 font-mono text-xs text-muted-foreground">
                  {item.meta}
                </p>
              )}

              {item.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border bg-background/50 px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {item.lead && (
                <p className="mt-6 rounded-r-xl border-l-2 border-primary bg-primary/5 pl-4 py-3 text-pretty text-lg italic leading-relaxed text-muted-foreground">
                  {item.lead}
                </p>
              )}

              <div className="mt-6 space-y-2">
                {renderBody(item.body)}
              </div>

              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-primary-foreground transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-primary/20"
                >
                  View source
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </div>
          </article>
        </div>
      )}
    </ReaderContext.Provider>
  )
}
