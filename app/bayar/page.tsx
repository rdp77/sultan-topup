import { Suspense } from 'react'
import { BayarCard } from '@/components/bayar-card'

export const metadata = {
  title: 'Pembayaran — Sultan Top Up',
  description:
    'Selesaikan pembayaran top up game Anda. Proses otomatis, konfirmasi instan via WhatsApp dan email.',
  alternates: { canonical: 'https://sultantopup.com/bayar' },
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Pembayaran — Sultan Top Up',
    description: 'Selesaikan pembayaran top up game Anda.',
    url: 'https://sultantopup.com/bayar',
    siteName: 'Sultan Top Up',
    images: [
      {
        url: 'https://sultantopup.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pembayaran Sultan Top Up',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pembayaran — Sultan Top Up',
    description: 'Selesaikan pembayaran top up game Anda.',
    images: ['https://sultantopup.com/og-image.png'],
  },
}

export default function BayarPage() {
  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-lg px-4 py-12 md:px-6 md:py-16">
        <Suspense
          fallback={
            <div className="flex flex-col gap-4">
              <div className="mx-auto h-8 w-48 animate-pulse rounded bg-muted" />
              <div className="h-80 animate-pulse rounded-xl bg-card" />
            </div>
          }
        >
          <BayarCard />
        </Suspense>
      </div>
    </main>
  )
}
