import type { Metadata } from 'next'
import { LegalContent, legalPages } from '@/components/legal-content'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return Object.keys(legalPages).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const config = legalPages[slug]

  if (!config) {
    return { title: 'Tidak Ditemukan — Sultan Top Up' }
  }

  return {
    title: `${config.title} — Sultan Top Up`,
    description: config.description,
    alternates: { canonical: `https://sultantopup.com/legal/${slug}` },
  }
}

export default async function LegalPage({ params }: Readonly<PageProps>) {
  const { slug } = await params
  const config = legalPages[slug]

  if (!config) {
    return (
      <main id="main" className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center">
            <p className="text-sm text-destructive">Halaman tidak ditemukan.</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        {/* Meta bar */}
        <div className="mb-8 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>
            Terakhir diperbarui:{' '}
            {new Date(config.lastUpdated).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>

        {/* Content card */}
        <div className="rounded-xl border border-border bg-card p-6 md:p-8">
          <LegalContent slug={slug} />
        </div>
      </div>
    </main>
  )
}
