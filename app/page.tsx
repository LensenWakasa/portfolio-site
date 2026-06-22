export const dynamic = "force-dynamic"

import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { Starfield } from "@/components/starfield-hero"
import { ContentCard } from "@/components/content-card"
import {
  getFeaturedProjects,
  getPapers,
  getPosts,
  getStats,
} from "@/lib/data"
import { projectToItem, paperToItem, postToItem } from "@/lib/map"

export default async function HomePage() {
  const [featured, papers, posts, stats] = await Promise.all([
    getFeaturedProjects(),
    getPapers(),
    getPosts(),
    getStats(),
  ])

  return (
    <div>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/hero-spacecraft.png"
            alt=""
            fill
            priority
            className="object-cover object-right opacity-40"
          />
          <Starfield />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="mx-auto flex min-h-[88vh] max-w-5xl flex-col justify-center px-4 py-24 sm:px-6">
          <p className="label-mono text-primary">
            AI Researcher · Wakasa Labs · Nakuru, Kenya
          </p>
          <h1 className="mt-6 max-w-3xl text-balance font-heading text-5xl font-bold leading-[1.05] sm:text-6xl md:text-7xl">
            Building machines that learn for a lifetime.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            I&apos;m Lensen Wakasa. I work on continual learning, cognitive
            architectures, and AI for science — designing systems that
            accumulate knowledge without forgetting what came before.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90"
            >
              View work
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/vision"
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Read the vision
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px px-4 sm:px-6 md:grid-cols-4">
          <Stat value={stats.projects} label="Projects" />
          <Stat value={stats.papers} label="Papers" />
          <Stat value={stats.views.toLocaleString()} label="Total views" />
          <Stat value="2040" label="Time horizon" />
        </div>
      </section>

      {/* Featured projects */}
      <Section
        title="Featured projects"
        href="/projects"
        hrefLabel="All projects"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {featured.map((p) => (
            <ContentCard key={p.id} item={projectToItem(p)} />
          ))}
        </div>
      </Section>

      {/* Recent papers */}
      <Section title="Recent papers" href="/papers" hrefLabel="All papers">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {papers.slice(0, 3).map((p) => (
            <ContentCard key={p.id} item={paperToItem(p)} />
          ))}
        </div>
      </Section>

      {/* Recent writing */}
      <Section title="From the notebook" href="/writing" hrefLabel="All writing">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((p) => (
            <ContentCard key={p.id} item={postToItem(p)} />
          ))}
        </div>
      </Section>
    </div>
  )
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-8 text-center">
      <span className="font-heading text-4xl font-bold text-primary">
        {value}
      </span>
      <span className="font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

function Section({
  title,
  href,
  hrefLabel,
  children,
}: {
  title: string
  href: string
  hrefLabel: string
  children: React.ReactNode
}) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2 className="font-heading text-3xl font-bold sm:text-4xl">{title}</h2>
        <Link
          href={href}
          className="shrink-0 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
        >
          {hrefLabel} &rarr;
        </Link>
      </div>
      {children}
    </section>
  )
}
