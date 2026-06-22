import type { ContentKind } from "@/app/actions/content"

export type { ContentKind }

export type ReaderItem = {
  kind: ContentKind
  id: number
  title: string
  /** secondary line: venue + authors, project status, or date */
  meta?: string
  tags: string[]
  /** short lead: abstract or summary or excerpt */
  lead?: string
  /** full long-form body */
  body: string
  link?: string | null
  views: number
  /** cover/thumbnail image URL */
  coverUrl?: string | null
}

export const KIND_LABEL: Record<ContentKind, string> = {
  project: "Project",
  paper: "Paper",
  post: "Writing",
}
