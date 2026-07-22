import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const LEGAL_DIR = join(process.cwd(), 'content', 'legal')

export interface LegalConfig {
  slug: string
  title: string
  description: string
  lastUpdated: string
}

export const legalPages: Record<string, LegalConfig> = {
  'privacy-policy': {
    slug: 'privacy-policy',
    title: 'Kebijakan Privasi',
    description:
      'Kebijakan Privasi Sultan Top Up — bagaimana kami mengumpulkan, menggunakan, dan melindungi data Anda.',
    lastUpdated: '2026-07-20',
  },
  'terms-and-conditions': {
    slug: 'terms-and-conditions',
    title: 'Syarat & Ketentuan',
    description: 'Syarat & Ketentuan penggunaan layanan Sultan Top Up.',
    lastUpdated: '2026-07-20',
  },
  'refund-policy': {
    slug: 'refund-policy',
    title: 'Kebijakan Pengembalian Dana',
    description:
      'Kebijakan Pengembalian Dana Sultan Top Up — kapan dan bagaimana refund dapat diajukan.',
    lastUpdated: '2026-07-20',
  },
}

function readLegalMarkdown(slug: string): string {
  return readFileSync(join(LEGAL_DIR, `${slug}.md`), 'utf-8')
}

/* -------------------------------------------------------------------------- */
/*  Lightweight Markdown Parser                                               */
/* -------------------------------------------------------------------------- */

type MDNode =
  | { type: 'h1'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; children: InlineNode[] }
  | { type: 'ul'; items: InlineNode[][] }
  | { type: 'ol'; items: InlineNode[][] }

type InlineNode =
  | { type: 'text'; value: string }
  | { type: 'bold'; children: InlineNode[] }
  | { type: 'link'; url: string; children: InlineNode[] }

function parseMarkdown(md: string): MDNode[] {
  const lines = md.split('\n')
  const nodes: MDNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    const h3 = /^### (.+)$/.exec(line)
    const h2 = /^## (.+)$/.exec(line)
    const h1 = /^# (.+)$/.exec(line)

    if (h3) {
      nodes.push({ type: 'h3', text: h3[1] })
      i++
      continue
    }
    if (h2) {
      nodes.push({ type: 'h2', text: h2[1] })
      i++
      continue
    }
    if (h1) {
      nodes.push({ type: 'h1', text: h1[1] })
      i++
      continue
    }

    // Unordered list
    if (/^- /.test(line)) {
      const items: InlineNode[][] = []
      while (i < lines.length && /^- /.test(lines[i])) {
        items.push(parseInline(lines[i].slice(2)))
        i++
      }
      nodes.push({ type: 'ul', items })
      continue
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      const items: InlineNode[][] = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(parseInline(lines[i].replace(/^\d+\. /, '')))
        i++
      }
      nodes.push({ type: 'ol', items })
      continue
    }

    // Paragraph
    if (line.trim() !== '') {
      const paraLines: string[] = []
      while (i < lines.length && lines[i].trim() !== '') {
        if (/^(#|- |\d+\. )/.test(lines[i])) break
        paraLines.push(lines[i])
        i++
      }
      nodes.push({ type: 'p', children: parseInline(paraLines.join(' ')) })
      continue
    }

    i++
  }

  return nodes
}

function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = []
  let remaining = text

  while (remaining.length > 0) {
    const boldMatch = /\*\*(.+?)\*\*/.exec(remaining)
    if (boldMatch && boldMatch.index === 0) {
      nodes.push({ type: 'bold', children: [{ type: 'text', value: boldMatch[1] }] })
      remaining = remaining.slice(boldMatch[0].length)
      continue
    }

    const linkMatch = /\[([^\]]+)\]\(([^)]+)\)/.exec(remaining)
    if (linkMatch && linkMatch.index === 0) {
      nodes.push({
        type: 'link',
        url: linkMatch[2],
        children: [{ type: 'text', value: linkMatch[1] }],
      })
      remaining = remaining.slice(linkMatch[0].length)
      continue
    }

    const nextToken = /(\*\*|\[)/.exec(remaining)
    if (nextToken) {
      const before = remaining.slice(0, nextToken.index)
      if (before) nodes.push({ type: 'text', value: before })
      remaining = remaining.slice(nextToken.index)
    } else {
      nodes.push({ type: 'text', value: remaining })
      remaining = ''
    }
  }

  return nodes
}

/* -------------------------------------------------------------------------- */
/*  Inline Renderer                                                           */
/* -------------------------------------------------------------------------- */

function renderInline(nodes: InlineNode[]): React.ReactNode {
  return nodes.map((node, i) => {
    switch (node.type) {
      case 'text':
        return node.value
      case 'bold':
        return (
          <strong key={i} className="font-semibold text-foreground">
            {renderInline(node.children)}
          </strong>
        )
      case 'link':
        return (
          <a
            key={i}
            href={node.url}
            className="font-medium text-primary underline underline-offset-2 transition-colors hover:text-primary/80"
          >
            {renderInline(node.children)}
          </a>
        )
    }
  })
}

/* -------------------------------------------------------------------------- */
/*  LegalContent Component                                                    */
/* -------------------------------------------------------------------------- */

export function LegalContent({ slug }: { slug: string }) {
  const config = legalPages[slug]

  if (!config) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center">
        <p className="text-sm text-destructive">Halaman tidak ditemukan.</p>
      </div>
    )
  }

  let md: MDNode[]
  try {
    const raw = readLegalMarkdown(slug)
    md = parseMarkdown(raw)
  } catch {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center">
        <p className="text-sm text-destructive">Konten halaman tidak tersedia.</p>
      </div>
    )
  }

  return (
    <article>
      {md.map((node, i) => {
        switch (node.type) {
          case 'h1':
            return (
              <h1 key={i} className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                {node.text}
              </h1>
            )
          case 'h2':
            return (
              <h2 key={i} className="mt-10 mb-3 text-lg font-semibold text-foreground first:mt-0">
                {node.text}
              </h2>
            )
          case 'h3':
            return (
              <h3 key={i} className="mt-8 mb-2 text-base font-semibold text-foreground">
                {node.text}
              </h3>
            )
          case 'p':
            return (
              <p key={i} className="mb-4 text-sm leading-relaxed text-muted-foreground">
                {renderInline(node.children)}
              </p>
            )
          case 'ul':
            return (
              <ul key={i} className="mb-4 ml-5 list-disc space-y-2">
                {node.items.map((item, j) => (
                  <li key={j} className="text-sm leading-relaxed text-muted-foreground">
                    {renderInline(item)}
                  </li>
                ))}
              </ul>
            )
          case 'ol':
            return (
              <ol key={i} className="mb-4 ml-5 list-decimal space-y-2">
                {node.items.map((item, j) => (
                  <li key={j} className="text-sm leading-relaxed text-muted-foreground">
                    {renderInline(item)}
                  </li>
                ))}
              </ol>
            )
          default:
            return null
        }
      })}
    </article>
  )
}
