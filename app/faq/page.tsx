import type { Metadata } from 'next';
import Link from 'next/link';
import { FaqView } from '@/components/faq-view';
import { faqConfigs, parseFaqMarkdown, type FaqContextData } from '@/lib/faq';

export const metadata: Metadata = {
  title: 'FAQ - Sultan Top Up',
  description:
    'Temukan jawaban dari pertanyaan umum seputar top up game, transaksi, pembayaran, akun, dan masalah teknis di Sultan Top Up.',
  alternates: { canonical: 'https://sultantopup.com/faq' },
  openGraph: {
    title: 'FAQ - Sultan Top Up',
    description:
      'Temukan jawaban dari pertanyaan umum seputar top up game, transaksi, pembayaran, akun, dan masalah teknis di Sultan Top Up.',
    url: 'https://sultantopup.com/faq',
    siteName: 'Sultan Top Up',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function FaqPage() {
  // Parse all FAQ markdown files server-side
  const dataMap: Record<string, FaqContextData> = {};
  for (const cfg of faqConfigs) {
    try {
      dataMap[cfg.slug] = parseFaqMarkdown(cfg.slug);
    } catch {
      // File missing - skip
    }
  }

  // Build FAQPage JSON-LD from parsed FAQ data
  const allFaqItems = Object.values(dataMap).flatMap((d) => d.items);
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFaqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer.replace(/<[^>]*>/g, ''), // strip HTML tags
      },
    })),
  };

  return (
    <main id="main" className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replaceAll('<', String.raw`<`),
        }}
      />
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
        <h1 className="text-foreground text-2xl font-bold tracking-tight md:text-3xl">
          Pertanyaan yang Sering Diajukan
        </h1>
        <p className="text-muted-foreground mt-2 max-w-lg text-sm leading-relaxed">
          Pilih kategori di samping untuk melihat jawaban. Kalau belum ketemu, hubungi kami via{' '}
          <Link
            href="/contact"
            className="text-primary hover:text-primary/80 font-medium underline underline-offset-2"
          >
            halaman Kontak
          </Link>
          .
        </p>

        <div className="mt-8">
          <FaqView configs={faqConfigs} dataMap={dataMap} />
        </div>
      </div>
    </main>
  );
}
