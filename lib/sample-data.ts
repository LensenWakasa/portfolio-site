import type { Paper, Post, Project } from "@/lib/db/schema"

export const sampleProjects: Project[] = [
  {
    id: 1,
    slug: "soma",
    title: "SOMA",
    summary: "Selective cognitive memory architecture for continual learning.",
    content:
      "SOMA explores adapter routing, consolidation, and memory selection for systems that need to learn new tasks without erasing prior knowledge.",
    status: "research",
    tags: ["Continual Learning", "Cognitive Architectures"],
    link: null,
    coverUrl: null,
    year: "2024-2026",
    featured: true,
    sortOrder: 0,
    views: 128,
    createdAt: "2026-06-01T00:00:00.000Z",
  },
  {
    id: 2,
    slug: "centai",
    title: "Centai",
    summary: "AI research engine for scientific discovery workflows.",
    content:
      "Centai is a research direction for reading scientific literature, connecting findings across domains, and helping generate experiment-ready hypotheses.",
    status: "building",
    tags: ["AI for Science", "Research Systems"],
    link: null,
    coverUrl: null,
    year: "2026",
    featured: true,
    sortOrder: 1,
    views: 86,
    createdAt: "2026-06-02T00:00:00.000Z",
  },
]

export const samplePapers: Paper[] = [
  {
    id: 1,
    slug: "soma-v1",
    title: "SOMA v1: Adapter Routing for Continual Learning",
    abstract:
      "A working-paper sketch of selective routing and consolidation mechanisms for lifelong learning systems.",
    content:
      "The paper frames continual learning as a routing and consolidation problem, then proposes a modular architecture for isolating fast-changing representations from slower long-term memory.",
    authors: "Lensen Wakasa",
    venue: "Working Paper",
    year: "2026",
    link: null,
    pdfUrl: null,
    coverUrl: null,
    tags: ["Continual Learning"],
    sortOrder: 0,
    views: 74,
    createdAt: "2026-06-03T00:00:00.000Z",
  },
]

export const samplePosts: Post[] = [
  {
    id: 1,
    slug: "why-continual-learning",
    title: "Why I am Betting on Continual Learning",
    excerpt:
      "The most useful intelligence systems should accumulate skill instead of constantly starting over.",
    content:
      "Continual learning matters because real work is sequential. Models that forget under pressure are brittle; systems that consolidate knowledge can become durable tools.",
    year: "2026",
    coverUrl: null,
    publishedAt: "2026-06-04T00:00:00.000Z",
    tags: ["AI", "Research"],
    views: 92,
    createdAt: "2026-06-04T00:00:00.000Z",
  },
]
