"use client"

import { Eye, ArrowUpRight } from "lucide-react"
import { useReader } from "@/components/reader-context"
import type { ReaderItem } from "@/lib/types"

function StatusChip({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    building: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    research: "bg-muted/15 text-muted-foreground border-muted/30",
    revenue: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  }
  const cls = colors[status.toLowerCase()] || colors.research
  return (
    <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider ${cls}`}>
      {status}
    </span>
  )
}

export function ContentCard({ item }: { item: ReaderItem }) {
  const reader = useReader()

  // Extract status from meta for projects
  const statusMatch = item.meta?.match(/^(active|building|research|revenue)/i)
  const status = statusMatch ? statusMatch[1] : null
  const metaWithoutStatus = status
    ? item.meta?.replace(new RegExp(`^${status}\\s*·\\s*`), "")
    : item.meta

  return (
    <button
      type="button"
      onClick={() => reader.open(item)}
      className="group flex h-full w-full flex-col rounded-2xl border border-border bg-card text-left transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 overflow-hidden"
    >
      {/* Thumbnail */}
      {item.coverUrl && (
        <div className="relative h-40 w-full overflow-hidden">
          <img
            src={item.coverUrl}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
        </div>
      )}

      <div className={`flex flex-col flex-1 ${item.coverUrl ? "p-5 pt-3" : "p-6"}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {status && <StatusChip status={status} />}
            {metaWithoutStatus && (
              <span className="font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
                {metaWithoutStatus}
              </span>
            )}
          </div>
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
                className="rounded-full border border-border bg-background/50 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <span className="mt-5 inline-flex items-center gap-1 font-mono text-[0.7rem] uppercase tracking-wider text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
          Read
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </button>
  )
}
