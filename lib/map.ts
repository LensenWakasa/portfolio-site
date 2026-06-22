import type { Project, Paper, Post } from "@/lib/db/schema"
import type { ReaderItem } from "@/lib/types"

export function projectToItem(p: Project): ReaderItem {
  return {
    kind: "project",
    id: p.id,
    title: p.title,
    meta: [p.status, p.year].filter(Boolean).join(" · "),
    tags: p.tags,
    lead: p.summary,
    body: p.content,
    link: p.link,
    views: p.views,
    coverUrl: p.coverUrl,
  }
}

export function paperToItem(p: Paper): ReaderItem {
  return {
    kind: "paper",
    id: p.id,
    title: p.title,
    meta: [p.authors, p.venue, p.year].filter(Boolean).join(" · "),
    tags: p.tags,
    lead: p.abstract,
    body: p.content,
    link: p.link,
    views: p.views,
    coverUrl: null,
  }
}

export function postToItem(p: Post): ReaderItem {
  return {
    kind: "post",
    id: p.id,
    title: p.title,
    meta: p.year ?? undefined,
    tags: p.tags,
    lead: p.excerpt,
    body: p.content,
    link: null,
    views: p.views,
    coverUrl: null,
  }
}
