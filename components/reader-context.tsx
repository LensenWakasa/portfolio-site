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

export function ReaderProvider({ children }: { children: React.ReactNode }) {
  const [item, setItem] = useState<ReaderItem | null>(null)
  const [views, setViews] = useState<number>(0)

  const open = useCallback((next: ReaderItem) => {
    setItem(next)
    setViews(next.views)
    // Count the view (shared/persistent across visitors)
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
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-background/80 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          onClick={close}
        >
          <article
            className="relative my-4 w-full max-w-2xl rounded-lg border border-border bg-card text-card-foreground shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close reader"
              className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="px-6 pb-10 pt-8 sm:px-10">
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
                      className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {item.lead && (
                <p className="mt-6 border-l-2 border-primary pl-4 text-pretty text-lg italic leading-relaxed text-muted-foreground">
                  {item.lead}
                </p>
              )}

              <div className="mt-6 space-y-5 text-pretty leading-relaxed">
                {item.body.split("\n\n").map((para, i) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: renderInline(para) }} />
                ))}
              </div>

              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 font-mono text-xs uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90"
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

// Very small inline formatter: **bold** and `code`, escaping HTML first.
function renderInline(text: string) {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(
      /`(.+?)`/g,
      '<code class="font-mono text-sm text-primary">$1</code>',
    )
}
