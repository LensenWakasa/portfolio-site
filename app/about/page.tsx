import { PageHeader } from "@/components/page-header"

export const metadata = {
  title: "About — Lensen Wakasa",
  description:
    "AI researcher, founder of Wakasa Labs, and medic-in-training. Building continual-learning systems from Nakuru, Kenya.",
}

export default function AboutPage() {
  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Bio"
        title="About"
        description="Who I am, what I'm building, and where I'm headed."
      />

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="space-y-16">
          {/* Bio with photo */}
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
            <div className="shrink-0">
              <div className="relative h-48 w-48 overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
                <img
                  src="/images/image.png"
                  alt="Lensen Wakasa"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="font-heading text-2xl font-bold">Background</h2>
              <div className="mt-4 space-y-4 text-pretty leading-relaxed text-muted-foreground">
                <p>
                  I'm Lensen Wakasa, an AI researcher and the founder of Wakasa Labs.
                  I work on continual learning and cognitive architectures — designing
                  systems that accumulate knowledge without forgetting what came before.
                </p>
                <p>
                  My current focus is SOMA (Selective cOgnitive Memory Architecture),
                  a system that routes new tasks to fast-changing adapters while
                  consolidating old knowledge into slow, frozen representations. The
                  goal is to solve catastrophic forgetting at scale.
                </p>
                <p>
                  I'm also a medic-in-training, which shapes how I think about
                  biological intelligence and gives me a front-row seat to the
                  problems AI can help solve in healthcare and science.
                </p>
                <p>
                  I live and work in Nakuru, Kenya. I believe the next generation of
                  AI research will come from unexpected places — and I'm building to
                  prove it.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h2 className="font-heading text-2xl font-bold">Timeline</h2>
            <div className="mt-6 space-y-6">
              <TimelineItem
                year="2024–now"
                title="Wakasa Labs"
                body="Founded to build continual-learning systems and AI-for-science tools. Running experiments on adapter routing, memory replay, and multi-scale training."
              />
              <TimelineItem
                year="2023–now"
                title="Medicine"
                body="Medical training, with a focus on how biological systems handle memory, adaptation, and disease — metaphors that inform the architecture work."
              />
              <TimelineItem
                year="2022–2024"
                title="Research apprenticeship"
                body="Self-directed study in deep learning, moving from standard supervised learning into the continual-learning literature. Built early prototypes of what became SOMA."
              />
              <TimelineItem
                year="2019–2022"
                title="Foundations"
                body="Undergraduate work in quantitative disciplines. First exposure to machine learning through coursework and Kaggle competitions."
              />
            </div>
          </div>

          {/* Focus areas */}
          <div>
            <h2 className="font-heading text-2xl font-bold">Focus areas</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                "Continual Learning",
                "Cognitive Architectures",
                "Adapter Routing",
                "Multi-Scale Training",
                "AI for Science",
                "Computational Biology",
                "PyTorch",
                "EdTech",
                "Kenya",
                "Quantitative Finance",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-background/50 px-3.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-2xl border border-border bg-card p-8">
            <h2 className="font-heading text-xl font-bold">Get in touch</h2>
            <p className="mt-3 text-muted-foreground">
              I'm always open to collaborations, research discussions, or just
              thoughtful conversation. Reach me on{" "}
              <a
                href="https://x.com/LensenWakasa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4 transition-opacity hover:opacity-80"
              >
                X / Twitter
              </a>{" "}
              or{" "}
              <a
                href="https://instagram.com/lensenwakasa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4 transition-opacity hover:opacity-80"
              >
                Instagram
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function TimelineItem({
  year,
  title,
  body,
}: {
  year: string
  title: string
  body: string
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="h-3 w-3 rounded-full bg-primary ring-4 ring-primary/20" />
        <div className="mt-2 h-full w-px bg-border" />
      </div>
      <div className="pb-6">
        <span className="font-mono text-xs uppercase tracking-wider text-primary">
          {year}
        </span>
        <h3 className="mt-1 font-heading text-lg font-bold">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </div>
  )
}
