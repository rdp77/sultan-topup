import { Suspense } from 'react';
import { ResultCard } from '@/components/result-card';
import { ResultCardSkeleton } from '@/components/result-card-skeleton';

export const metadata = {
  title: 'Status Pesanan — Sultan Top Up',
  description:
    'Lihat status transaksi top up game Anda. Informasi pembayaran, status pengiriman, dan detail pesanan.',
  alternates: { canonical: 'https://sultantopup.com/result' },
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Status Pesanan — Sultan Top Up',
    description: 'Lihat status transaksi top up game Anda.',
    url: 'https://sultantopup.com/result',
    siteName: 'Sultan Top Up',
    images: [
      {
        url: 'https://sultantopup.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Status Pesanan Sultan Top Up',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Status Pesanan — Sultan Top Up',
    description: 'Lihat status transaksi top up game Anda.',
    images: ['https://sultantopup.com/og-image.png'],
  },
};

export default function ResultPage() {
  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-lg px-4 py-12 md:px-6 md:py-16">
        <Suspense fallback={<ResultCardSkeleton />}>
          <ResultCard />
        </Suspense>
      </div>
    </main>
  );
}
