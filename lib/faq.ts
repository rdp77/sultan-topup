import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const FAQ_DIR = join(process.cwd(), 'content', 'faq')

export interface FaqConfig {
  slug: string
  title: string
}

export interface FaqItem {
  question: string
  answer: string
}

export interface FaqContextData {
  config: FaqConfig
  items: FaqItem[]
}

export const faqConfigs: FaqConfig[] = [
  { slug: 'umum', title: 'Umum' },
  { slug: 'game', title: 'Game & Top Up' },
  { slug: 'transaksi', title: 'Transaksi & Pembayaran' },
  { slug: 'akun', title: 'Akun' },
  { slug: 'teknis', title: 'Masalah Teknis' },
]

function readFaqMarkdown(slug: string): string {
  return readFileSync(join(FAQ_DIR, `${slug}.md`), 'utf-8')
}

export function parseFaqMarkdown(slug: string): FaqContextData {
  const raw = readFaqMarkdown(slug)
  const config = faqConfigs.find((c) => c.slug === slug)!
  const lines = raw.split('\n')
  const items: FaqItem[] = []

  let currentQuestion = ''
  let currentAnswerLines: string[] = []

  for (const line of lines) {
    // Context title (# heading) - skip, we already have it from config
    if (/^# /.test(line)) continue

    // Question (## heading)
    const h2 = /^## (.+)$/.exec(line)
    if (h2) {
      // Save previous Q&A if any
      if (currentQuestion) {
        items.push({
          question: currentQuestion,
          answer: currentAnswerLines.join(' ').trim(),
        })
      }
      currentQuestion = h2[1]
      currentAnswerLines = []
      continue
    }

    // Skip empty lines between headings
    if (!currentQuestion) continue

    // Answer text
    if (line.trim() !== '') {
      currentAnswerLines.push(line.trim())
    }
  }

  // Save last Q&A
  if (currentQuestion) {
    items.push({
      question: currentQuestion,
      answer: currentAnswerLines.join(' ').trim(),
    })
  }

  return { config, items }
}
