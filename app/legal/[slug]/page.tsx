import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LegalContent, legalPages } from '@/components/legal-content';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return Object.keys(legalPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const config = legalPages[slug];

  if (!config) {
    return { title: 'Tidak Ditemukan — Sultan Top Up' };
  }

  return {
    title: `${config.title} — Sultan Top Up`,
    description: config.description,
    alternates: { canonical: `https://sultantopup.com/legal/${slug}` },
  };
}

export default async function LegalPage({ params }: Readonly<PageProps>) {
  const { slug } = await params;
  const config = legalPages[slug];

  if (!config) {
    notFound();
  }

  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        {/* Meta bar */}
        <div className="text-muted-foreground mb-8 flex flex-wrap items-center gap-3 text-xs">
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
        <div className="border-border bg-card rounded-xl border p-6 md:p-8">
          <LegalContent slug={slug} />
        </div>
      </div>
    </main>
  );
}
