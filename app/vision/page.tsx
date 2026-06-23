import { PageHeader } from "@/components/page-header"

export const metadata = {
  title: "Vision — Lensen Wakasa",
  description:
    "The long-term vision: building continual-learning systems that accumulate knowledge without forgetting, from Nakuru to the world.",
}

export default function VisionPage() {
  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="The long view"
        title="Vision"
        description="What I'm building toward ---> a research agenda and a set of bets on the future of learning machines."
      />

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="space-y-16">
          {/* Core thesis */}
          <div>
            <h2 className="font-heading text-2xl font-bold">Core thesis</h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              The most important property of an intelligent system is not only how it's able to make use of what it knows,
              but also how gracefully it learns without forgetting. I believe the next leap in AI
              will come not from scaling alone, but from architectures that accumulate
              knowledge across tasks, domains, and time the way a human researcher does.
            </p>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              This is the motivation behind SOMA — a selective cognitive memory architecture
              that routes new tasks to fast-changing adapters while consolidating old knowledge
              into slow, frozen representations. The goal is a system that can train on a
              lifetime of problems without catastrophic interference.
            </p>
          </div>

          {/* Three scenarios */}
          <div>
            <h2 className="font-heading text-2xl font-bold">Three scenarios</h2>
            <p className="mt-2 text-muted-foreground">
              How the next decade might unfold, depending on how quickly the field converges
              on continual-learning primitives.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <ScenarioCard
                title="Conservative"
                subtitle="2030–2035"
                body="Continual learning remains a niche research topic. Most production systems still retrain from scratch. SOMA and similar architectures find use in specialized domains — computational biology, personal assistants, scientific instruments — but do not cross into general-purpose AI."
              />
              <ScenarioCard
                title="Strong"
                subtitle="2028–2032"
                body="A consensus architecture emerges (adapter routing + memory replay + sparse updates). Major labs integrate continual-learning pipelines into their training stacks. SOMA becomes a reference implementation for researchers in Africa and the Global South."
              />
              <ScenarioCard
                title="Exceptional"
                subtitle="2027–2030"
                body="Catastrophic forgetting is solved at scale. Models learn for years without retraining, accumulating expertise across disciplines. Wakasa Labs operates a distributed training cluster in United States."
              />
            </div>
          </div>

          {/* Principles */}
          <div>
            <h2 className="font-heading text-2xl font-bold">Operating principles</h2>
            <ul className="mt-6 space-y-4">
              <Principle
                number="01"
                title="Build in public"
                body="Research progress, failed experiments, and half-formed ideas are shared as they happen. The default is open."
              />
              <Principle
                number="02"
                title="Africa-first infrastructure"
                body="Compute, data, and talent should be developed on the continent. The goal is not to catch up, but to build differently."
              />
              <Principle
                number="03"
                title="Long-term bets"
                body="The meaningful problems have decade-long horizons. Optimize for compounding knowledge, not quarterly milestones."
              />
              <Principle
                number="04"
                title="Science as craft"
                body="Good research is like good carpentry - patient, precise, and grounded in the material. There are no shortcuts."
              />
            </ul>
          </div>

          {/* Time horizon */}
          <div className="rounded-lg border border-border bg-card p-8">
            <p className="label-mono text-primary">Time horizon</p>
            <p className="mt-2 font-heading text-3xl font-bold">2040</p>
            <p className="mt-2 text-muted-foreground">
              By 2040, I want Wakasa Labs to be a self-sustaining research institution
              operating at the frontier of continual learning and AI for science with
              deep roots in United States and collaborations across the world.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function ScenarioCard({
  title,
  subtitle,
  body,
}: {
  title: string
  subtitle: string
  body: string
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <p className="label-mono text-primary">{subtitle}</p>
      <h3 className="mt-2 font-heading text-xl font-bold">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  )
}

function Principle({
  number,
  title,
  body,
}: {
  number: string
  title: string
  body: string
}) {
  return (
    <li className="flex gap-4">
      <span className="shrink-0 font-mono text-sm text-primary">{number}</span>
      <div>
        <h3 className="font-heading text-lg font-bold">{title}</h3>
        <p className="mt-1 text-muted-foreground">{body}</p>
      </div>
    </li>
  )
}
