import Link from "next/link"

const socials = [
  { label: "GitHub", href: "https://github.com/lensenwakasa" },
  { label: "X / Twitter", href: "https://x.com/LensenWakasa" },
  { label: "Instagram", href: "https://instagram.com/lensenwakasa" },
]

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-heading text-lg font-bold">Lensen Wakasa</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Wakasa Labs · Nakuru, Kenya
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
            >
              {s.label}
            </a>
          ))}
          <Link
            href="/admin"
            className="font-mono text-xs uppercase tracking-wider text-muted-foreground/50 transition-colors hover:text-primary"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
