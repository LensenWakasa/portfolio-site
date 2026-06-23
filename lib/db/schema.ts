export type Project = {
  id: number
  slug: string
  title: string
  summary: string
  content: string
  status: string
  tags: string[]
  link: string | null
  coverUrl: string | null
  year: string | null
  featured: boolean
  sortOrder: number
  views: number
  createdAt: string
}

export type Paper = {
  id: number
  slug: string
  title: string
  abstract: string
  content: string
  authors: string
  venue: string | null
  year: string | null
  link: string | null
  pdfUrl: string | null
  coverUrl: string | null
  tags: string[]
  sortOrder: number
  views: number
  createdAt: string
}

export type Post = {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  year: string | null
  coverUrl: string | null
  publishedAt: string
  tags: string[]
  views: number
  createdAt: string
}
