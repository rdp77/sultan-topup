import { Crown, Medal, Trophy } from 'lucide-react';
import { formatRupiah, leaderboard } from '@/lib/data';
import { cn } from '@/lib/utils';

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
    description: 'Peringkat pembeli terbanyak bulan ini.',
    images: ['https://sultantopup.com/og-image.png'],
  },
};

const topStyles = [
  {
    icon: Crown,
    ring: 'border-warning shadow-[0_0_24px_rgba(251,191,36,0.15)]',
    badge: 'bg-warning text-background',
  },
  {
    icon: Medal,
    ring: 'border-muted-foreground/40',
    badge: 'bg-muted-foreground/80 text-background',
  },
  {
    icon: Trophy,
    ring: 'border-primary/50',
    badge: 'bg-primary text-primary-foreground',
  },
];

export default function LeaderboardPage() {
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        <h1 className="reveal text-center text-2xl font-bold tracking-tight text-balance md:text-3xl">
          Leaderboard Top Spender
        </h1>
        <p className="reveal text-muted-foreground mt-2 text-center text-sm leading-relaxed">
          Peringkat pembeli terbanyak bulan ini. Terus top up untuk naik peringkat!
        </p>

        {/* Top 3 */}
        <div className="reveal mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {top3.map((entry, i) => {
            const style = topStyles[i];
            const Icon = style.icon;
            return (
              <div
                key={entry.rank}
                className={cn(
                  'bg-card flex flex-col items-center gap-2 rounded-xl border p-6 text-center',
                  style.ring,
                  i === 0 && 'sm:order-2',
                  i === 1 && 'sm:order-1',
                  i === 2 && 'sm:order-3'
                )}
              >
                <span
                  className={cn(
                    'flex size-10 items-center justify-center rounded-full',
                    style.badge
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-muted-foreground text-xs font-semibold">
                  Peringkat {entry.rank}
                </span>
                <span className="text-base font-bold">{entry.name}</span>
                <span className="text-primary text-sm font-semibold">
                  {formatRupiah(entry.total)}
                </span>
                <span className="text-muted-foreground text-xs">
                  {entry.transactions} transaksi
                </span>
              </div>
            );
          })}
        </div>

        {/* Rank 4+ */}
        <ol className="mt-6 flex flex-col gap-2">
          {rest.map((entry) => (
            <li
              key={entry.rank}
              className="bg-card hover:bg-accent flex items-center gap-4 rounded-xl px-4 py-3 transition-colors duration-200"
            >
              <span className="bg-background text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                {entry.rank}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium">{entry.name}</p>
                <p className="text-muted-foreground text-xs">{entry.transactions} transaksi</p>
              </div>
              <span className="text-primary text-sm font-semibold">
                {formatRupiah(entry.total)}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
