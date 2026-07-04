import { Crown, Medal, Trophy } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { formatRupiah, leaderboard } from '@/lib/data'
import { cn } from '@/lib/utils'

export const metadata = {
  title: 'Leaderboard — TopUpin',
}

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
]

export default function LeaderboardPage() {
  const top3 = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
          <h1 className="text-balance text-center text-2xl font-bold tracking-tight md:text-3xl">
            Leaderboard Top Spender
          </h1>
          <p className="mt-2 text-center text-sm leading-relaxed text-muted-foreground">
            Peringkat pembeli terbanyak bulan ini. Terus top up untuk naik peringkat!
          </p>

          {/* Top 3 */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {top3.map((entry, i) => {
              const style = topStyles[i]
              const Icon = style.icon
              return (
                <div
                  key={entry.rank}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl border bg-card p-6 text-center transition-transform duration-200 hover:scale-[1.02]',
                    style.ring,
                    i === 0 && 'sm:order-2',
                    i === 1 && 'sm:order-1',
                    i === 2 && 'sm:order-3',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-10 items-center justify-center rounded-full',
                      style.badge,
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    Peringkat {entry.rank}
                  </span>
                  <span className="text-base font-bold">{entry.name}</span>
                  <span className="text-sm font-semibold text-primary">
                    {formatRupiah(entry.total)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {entry.transactions} transaksi
                  </span>
                </div>
              )
            })}
          </div>

          {/* Rank 4+ */}
          <ol className="mt-6 flex flex-col gap-2">
            {rest.map((entry) => (
              <li
                key={entry.rank}
                className="flex items-center gap-4 rounded-xl bg-card px-4 py-3 transition-colors duration-200 hover:bg-accent"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background text-sm font-semibold text-muted-foreground">
                  {entry.rank}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">{entry.transactions} transaksi</p>
                </div>
                <span className="text-sm font-semibold text-primary">
                  {formatRupiah(entry.total)}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </main>
      <Footer />
    </div>
  )
}
