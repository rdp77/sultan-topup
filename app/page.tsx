import Link from 'next/link'
import { Zap, ShieldCheck, Clock } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { GameCard } from '@/components/game-card'
import { games } from '@/lib/data'

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-[1200px] px-4 pb-12 pt-16 text-center md:px-6 md:pt-24">
          <h1 className="mx-auto max-w-2xl text-balance text-3xl font-bold leading-tight tracking-tight md:text-5xl">
            Top up game favoritmu dalam hitungan detik
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
            Proses otomatis 24 jam, harga bersahabat, dan pembayaran lengkap. Tanpa login, tanpa ribet.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="#games"
              className="press rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
            >
              Mulai Top Up
            </Link>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center justify-center gap-2.5 rounded-xl bg-card px-4 py-3">
              <Zap className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="text-sm text-muted-foreground">Proses Instan</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 rounded-xl bg-card px-4 py-3">
              <ShieldCheck className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="text-sm text-muted-foreground">100% Aman</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 rounded-xl bg-card px-4 py-3">
              <Clock className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="text-sm text-muted-foreground">Layanan 24 Jam</span>
            </div>
          </div>
        </section>

        {/* Game grid */}
        <section id="games" className="mx-auto max-w-[1200px] px-4 pb-20 pt-4 md:px-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">Pilih Game</h2>
            <p className="mt-1 text-sm text-muted-foreground">Klik game untuk mulai top up</p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {games.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
