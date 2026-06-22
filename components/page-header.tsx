export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <header className="mx-auto max-w-5xl px-4 pb-4 pt-16 sm:px-6 sm:pt-24">
      <p className="label-mono text-primary">{eyebrow}</p>
      <h1 className="mt-4 text-balance font-heading text-4xl font-bold leading-tight sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
        {description}
      </p>
    </header>
  )
}
