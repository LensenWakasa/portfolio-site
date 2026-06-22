export const dynamic = "force-dynamic"

import { PageHeader } from "@/components/page-header"
import { ContentCard } from "@/components/content-card"
import { getPapers } from "@/lib/data"
import { paperToItem } from "@/lib/map"

export const metadata = {
  title: "Papers — Lensen Wakasa",
  description:
    "Research papers on continual learning, cognitive architectures, and AI for science.",
}

export default async function PapersPage() {
  const papers = await getPapers()

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Research"
        title="Papers"
        description="Published and in-progress work on continual learning, adapter routing, and multi-scale training. Click any card to read the abstract and full paper notes."
      />
      <section className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {papers.map((p) => (
            <ContentCard key={p.id} item={paperToItem(p)} />
          ))}
        </div>
      </section>
    </div>
  )
}
