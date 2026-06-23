"use client"

import { useEffect, useState } from "react"
import { Eye } from "lucide-react"
import { incrementView, type ContentKind } from "@/app/actions/content"

export function ViewCounter({
  kind,
  id,
  initialViews,
}: {
  kind: ContentKind
  id: number
  initialViews: number
}) {
  const [views, setViews] = useState(initialViews)

  useEffect(() => {
    incrementView(kind, id)
      .then((count) => setViews(count))
      .catch(() => {})
  }, [kind, id])

  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
      <Eye className="h-4 w-4" />
      {views.toLocaleString()} views
    </span>
  )
}
