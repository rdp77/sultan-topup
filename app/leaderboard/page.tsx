import { LeaderboardSection } from '@/components/leaderboard/leaderboard-section';

export const metadata = {
  title: 'Leaderboard — Sultan Top Up',
  description:
    'Leaderboard Top Spender Sultan Top Up. Lihat peringkat pembeli terbanyak bulan ini dan terus top up untuk naik peringkat.',
  alternates: { canonical: 'https://sultantopup.com/leaderboard' },
  openGraph: {
    title: 'Leaderboard Top Spender — Sultan Top Up',
    description: 'Peringkat pembeli terbanyak bulan ini. Terus top up untuk naik peringkat.',
    url: 'https://sultantopup.com/leaderboard',
    siteName: 'Sultan Top Up',
    images: [
      {
        url: 'https://sultantopup.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Leaderboard Sultan Top Up',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leaderboard Top Spender — Sultan Top Up',
    description: 'Peringkat pembeli terbanyak bulan ini. Terus top up untuk naik peringkat.',
    images: ['https://sultantopup.com/og-image.png'],
  },
};

export default function LeaderboardPage() {
  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
        <section>
          <h1 className="text-center text-2xl font-bold tracking-tight text-balance md:text-3xl">
            Top Spender
          </h1>
          <p className="text-muted-foreground mt-2 text-center text-sm leading-relaxed">
            Peringkat pembeli terbanyak bulan ini. Terus top up dan naikkan peringkatmu!
          </p>

          <div className="mt-8">
            <LeaderboardSection />
          </div>
        </section>
      </div>
    </main>
  );
}
