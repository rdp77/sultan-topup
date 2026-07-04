import Link from 'next/link'
import { Zap, ShieldCheck, Clock, ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { GameSearch } from '@/components/game-search'

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />

      <main id="main" className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-300 px-4 pb-10 pt-16 md:px-6 md:pt-24">
          <h1 className="lift-in mx-auto max-w-2xl text-balance text-center text-3xl font-bold leading-tight tracking-tight md:text-5xl">
            Top up game favoritmu dalam hitungan detik
          </h1>
          <p className="lift-in lift-in-2 mx-auto mt-4 max-w-xl text-pretty text-center text-sm leading-relaxed text-muted-foreground md:text-base">
            Proses otomatis 24 jam, harga bersahabat, dan pembayaran lengkap. Tanpa login, tanpa ribet.
          </p>
          <div className="lift-in lift-in-3 mt-8 flex justify-center">
            <Link
              href="#games"
              className="press rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
            >
              Mulai Top Up
            </Link>
          </div>
          {/* Trust strip: inline with dividers, no card boxes (anti 3-equal-card slop) */}
          <ul className="lift-in lift-in-4 mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Zap className="size-4 shrink-0 text-primary" aria-hidden="true" />
              Proses Instan
            </li>
            <li aria-hidden className="hidden h-4 w-px bg-border sm:block" />
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-4 shrink-0 text-primary" aria-hidden="true" />
              100% Aman
            </li>
            <li aria-hidden className="hidden h-4 w-px bg-border sm:block" />
            <li className="flex items-center gap-2">
              <Clock className="size-4 shrink-0 text-primary" aria-hidden="true" />
              Layanan 24 Jam
            </li>
          </ul>
        </section>

        {/* Game grid + search */}
        <section id="games" className="mx-auto max-w-300 px-4 pb-20 pt-4 md:px-6">
          <div className="reveal">
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">Pilih Game</h2>
            <p className="mt-1 text-sm text-muted-foreground">Cari dan klik game untuk mulai top up</p>
          </div>
          <div className="reveal mt-5">
            <GameSearch />
          </div>
        </section>

        {/* Closing CTA band — different layout family from grid above (Section-Repetition rule) */}
        <section className="border-t border-border bg-card/40">
          <div className="reveal mx-auto flex max-w-300 flex-col items-center gap-4 px-4 py-14 text-center md:px-6">
            <h2 className="max-w-md text-balance text-2xl font-bold tracking-tight">
              Siap mulai? Top up pertama kamu bisa dalam 1 menit.
            </h2>
            <Link
              href="#games"
              className="press inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
            >
              Mulai Top Up
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}