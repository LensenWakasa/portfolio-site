import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { getProject } from "@/lib/data"
import { RichContent } from "@/components/rich-content"
import { ViewCounter } from "@/components/view-counter"

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) notFound()

  return (
    <article>
      <section className="border-b border-border/60 bg-card/30">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Projects
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="label-mono text-primary">{project.status}</p>
              <h1 className="mt-4 text-balance font-heading text-5xl font-bold leading-tight sm:text-6xl">
                {project.title}
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
                {project.summary}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <ViewCounter kind="project" id={project.id} initialViews={project.views} />
                {project.year && (
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    {project.year}
                  </span>
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-background">
              {project.coverUrl ? (
                <img src={project.coverUrl} alt={project.title} className="h-72 w-full object-cover" />
              ) : (
                <div className="flex h-72 flex-col justify-between p-6">
                  <span className="label-mono text-primary">Project preview</span>
                  <div>
                    <div className="mb-4 h-20 w-20 rounded-lg border border-primary/40 bg-primary/10" />
                    <div className="h-2 w-4/5 rounded-full bg-muted" />
                    <div className="mt-3 h-2 w-2/3 rounded-full bg-muted/70" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-6">
          <div>
            <p className="label-mono text-muted-foreground">Progress</p>
            <div className="mt-3 space-y-3 border-l border-border pl-4">
              <p className="text-sm text-muted-foreground">
                <span className="text-primary">Now</span> · {project.status}
              </p>
              {project.year && (
                <p className="text-sm text-muted-foreground">
                  <span className="text-primary">Window</span> · {project.year}
                </p>
              )}
              {project.featured && (
                <p className="text-sm text-muted-foreground">
                  <span className="text-primary">Featured</span> · Homepage
                </p>
              )}
            </div>
          </div>

          {project.tags.length > 0 && (
            <div>
              <p className="label-mono text-muted-foreground">Stack / Tags</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90"
            >
              Open project
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
        </aside>

        <div>
          <p className="label-mono text-primary">Notebook</p>
          <RichContent body={project.content} />
        </div>
      </section>
    </article>
  )
}
