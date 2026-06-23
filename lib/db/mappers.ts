export function mapProject(row: Record<string, unknown>) {
  return {
    id: row.id as number,
    slug: row.slug as string,
    title: row.title as string,
    summary: row.summary as string,
    content: row.content as string,
    status: row.status as string,
    tags: (row.tags as string[]) ?? [],
    link: (row.link as string | null) ?? null,
    coverUrl: (row.cover_url as string | null) ?? null,
    year: (row.year as string | null) ?? null,
    featured: (row.featured as boolean) ?? false,
    sortOrder: (row.sort_order as number) ?? 0,
    views: (row.views as number) ?? 0,
    createdAt: row.created_at as string,
  }
}

export function mapPaper(row: Record<string, unknown>) {
  return {
    id: row.id as number,
    slug: row.slug as string,
    title: row.title as string,
    abstract: row.abstract as string,
    content: row.content as string,
    authors: row.authors as string,
    venue: (row.venue as string | null) ?? null,
    year: (row.year as string | null) ?? null,
    link: (row.link as string | null) ?? null,
    pdfUrl: (row.pdf_url as string | null) ?? null,
    tags: (row.tags as string[]) ?? [],
    sortOrder: (row.sort_order as number) ?? 0,
    views: (row.views as number) ?? 0,
    createdAt: row.created_at as string,
  }
}

export function mapPost(row: Record<string, unknown>) {
  return {
    id: row.id as number,
    slug: row.slug as string,
    title: row.title as string,
    excerpt: row.excerpt as string,
    content: row.content as string,
    year: (row.year as string | null) ?? null,
    publishedAt: row.published_at as string,
    tags: (row.tags as string[]) ?? [],
    views: (row.views as number) ?? 0,
    createdAt: row.created_at as string,
  }
}
