function renderInline(text: string) {
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" class="mt-5 w-full rounded-xl border border-border bg-background object-cover" />'
  )
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline underline-offset-4 hover:opacity-80">$1</a>'
  )
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>")
  html = html.replace(
    /`(.+?)`/g,
    '<code class="rounded-md bg-muted px-1.5 py-0.5 font-mono text-sm text-primary">$1</code>'
  )
  return html
}

function renderSvg(svg: string, key: number) {
  return (
    <div
      key={key}
      className="my-8 overflow-hidden rounded-2xl border border-border bg-background p-4 [&_svg]:h-auto [&_svg]:w-full [&_svg_[data-animate='dash']]:animate-[dash_3s_linear_infinite] [&_svg_[data-animate='pulse']]:animate-pulse"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

export function RichContent({ body }: { body: string }) {
  const parts = body.split(/```svg\n([\s\S]*?)```/g)
  const nodes: React.ReactNode[] = []

  parts.forEach((part, partIndex) => {
    if (partIndex % 2 === 1) {
      nodes.push(renderSvg(part.trim(), partIndex))
      return
    }

    const blocks = part.split("\n\n")
    blocks.forEach((block, blockIndex) => {
      const trimmed = block.trim()
      if (!trimmed) return
      const key = partIndex * 1000 + blockIndex

      if (/^#{1,3}\s/.test(trimmed)) {
        const level = trimmed.match(/^(#{1,3})\s/)?.[1].length ?? 1
        const text = trimmed.replace(/^#{1,3}\s/, "")
        const Tag = `h${level + 1}` as "h2" | "h3" | "h4"
        nodes.push(
          <Tag key={key} className="mt-10 font-heading text-2xl font-bold text-foreground">
            {text}
          </Tag>
        )
        return
      }

      if (/^>\s/.test(trimmed)) {
        nodes.push(
          <blockquote
            key={key}
            className="mt-5 rounded-r-xl border-l-2 border-primary bg-primary/5 px-4 py-3 text-pretty italic leading-relaxed text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: renderInline(trimmed.replace(/^>\s?/, "")) }}
          />
        )
        return
      }

      if (/^[-*]\s/.test(trimmed)) {
        const items = trimmed
          .split("\n")
          .filter((line) => /^[-*]\s/.test(line.trim()))
        nodes.push(
          <ul key={key} className="mt-5 list-disc space-y-2 pl-5 text-muted-foreground">
            {items.map((item, i) => (
              <li
                key={i}
                dangerouslySetInnerHTML={{ __html: renderInline(item.replace(/^[-*]\s/, "")) }}
              />
            ))}
          </ul>
        )
        return
      }

      if (/^\d+\.\s/.test(trimmed)) {
        const items = trimmed
          .split("\n")
          .filter((line) => /^\d+\.\s/.test(line.trim()))
        nodes.push(
          <ol key={key} className="mt-5 list-decimal space-y-2 pl-5 text-muted-foreground">
            {items.map((item, i) => (
              <li
                key={i}
                dangerouslySetInnerHTML={{ __html: renderInline(item.replace(/^\d+\.\s/, "")) }}
              />
            ))}
          </ol>
        )
        return
      }

      if (/^---+$/.test(trimmed)) {
        nodes.push(<hr key={key} className="my-8 border-border" />)
        return
      }

      nodes.push(
        <p
          key={key}
          className="mt-5 text-pretty text-base leading-8 text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: renderInline(trimmed) }}
        />
      )
    })
  })

  return <div className="rich-content">{nodes}</div>
}
