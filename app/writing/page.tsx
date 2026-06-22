export const dynamic = "force-dynamic"

import { PageHeader } from "@/components/page-header"
import { ContentCard } from "@/components/content-card"
import { getPosts } from "@/lib/data"
import { postToItem } from "@/lib/map"

export const metadata = {
  title: "Writing — Lensen Wakasa",
  description:
    "Essays, notes, and observations from the notebook — on AI research, building in Kenya, and the long view.",
}

export default async function WritingPage() {
  const posts = await getPosts()

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Notebook"
        title="Writing"
        description="Essays, field notes, and half-formed ideas — on continual learning, building systems, and working from Nakuru."
      />
      <section className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <ContentCard key={p.id} item={postToItem(p)} />
          ))}
        </div>
      </section>
    </div>
  )
}
