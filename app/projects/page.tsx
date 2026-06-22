export const dynamic = "force-dynamic"

import { PageHeader } from "@/components/page-header"
import { ContentCard } from "@/components/content-card"
import { getProjects } from "@/lib/data"
import { projectToItem } from "@/lib/map"

export const metadata = {
  title: "Projects — Lensen Wakasa",
  description:
    "Research systems and tools built at Wakasa Labs, from continual-learning architectures to quantitative finance.",
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Selected work"
        title="Projects"
        description="Systems I have designed and built — research architectures, training infrastructure, and tools. Click any card to read the full write-up."
      />
      <section className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((p) => (
            <ContentCard key={p.id} item={projectToItem(p)} />
          ))}
        </div>
      </section>
    </div>
  )
}
