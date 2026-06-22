"use client"

import { Eye, ArrowUpRight } from "lucide-react"
import { useReader } from "@/components/reader-context"
import type { ReaderItem } from "@/lib/types"

export function ContentCard({ item }: { item: ReaderItem }) {
  const reader = useReader()

  return (
    <button
      type="button"
      onClick={() => reader.open(item)}
      className="group flex h-full w-full flex-col rounded-lg border border-border bg-card p-6 text-left transition-colors hover:border-primary/60"
    >
      <div className="flex items-center justify-between gap-2">
        {item.meta ? (
          <span className="font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
            {item.meta}
          </span>
        ) : (
          <span />
        )}
        <span className="inline-flex items-center gap-1 font-mono text-[0.7rem] text-muted-foreground">
          <Eye className="h-3 w-3" />
          {item.views.toLocaleString()}
        </span>
      </div>

      <h3 className="mt-3 text-balance font-heading text-xl font-bold leading-snug text-card-foreground transition-colors group-hover:text-primary">
        {item.title}
      </h3>

      {item.lead && (
        <p className="mt-3 line-clamp-3 flex-1 text-pretty leading-relaxed text-muted-foreground">
          {item.lead}
        </p>
      )}

      {item.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full border border-border px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <span className="mt-5 inline-flex items-center gap-1 font-mono text-[0.7rem] uppercase tracking-wider text-primary opacity-0 transition-opacity group-hover:opacity-100">
        Read
        <ArrowUpRight className="h-3.5 w-3.5" />
      </span>
    </button>
  )
}
