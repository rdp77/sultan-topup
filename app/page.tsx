import Link from 'next/link';
import { Zap, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import { BannerSlider } from '@/components/banner-slider';
import { GameService } from '@/services';
import { Games } from '@/components/games';
import type { Game } from '@/types/games';
import type { PaginationMeta } from '@/types/pagination';

export const dynamic = 'force-dynamic';

const FALLBACK_META: PaginationMeta = {
  current_page: 1,
  from: null,
  last_page: 1,
  links: [],
  path: '',
  per_page: 12,
  to: null,
  total: 0,
};

export default async function HomePage() {
  let games: Game[] = [];
  let meta: PaginationMeta = FALLBACK_META;

  try {
    const res = await GameService.list(1);
    games = res.data;
    meta = res.meta;
  } catch {
    // API unreachable during build — render static shell, no crash
  }

  return (
    <main id="main" className="flex-1">
      <section className="mx-auto max-w-300 px-4 pt-6 md:px-6 md:pt-8">
        <BannerSlider />
      </section>

      <section className="mx-auto max-w-300 px-4 pt-6 pb-6 md:px-6 md:pt-8 md:pb-8">
        <h1 className="lift-in mx-auto max-w-2xl text-center text-3xl leading-tight font-bold tracking-tight text-balance md:text-5xl">
          Top up game favoritmu dalam hitungan detik
        </h1>
        <p className="lift-in lift-in-2 text-muted-foreground mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-pretty md:text-base">
          Proses otomatis 24 jam, harga bersahabat, dan pembayaran lengkap. Tanpa login, tanpa
          ribet.
        </p>
        <div className="lift-in lift-in-3 mt-8 flex justify-center">
          <Link
            href="#games"
            className="press bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-8 py-3 text-sm font-semibold transition-colors duration-200"
          >
            Mulai Top Up
          </Link>
        </div>
        <ul className="lift-in lift-in-4 text-muted-foreground mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <li className="flex items-center gap-2">
            <Zap className="text-primary size-4 shrink-0" aria-hidden="true" />
            Proses Instan
          </li>
          <li aria-hidden className="bg-border hidden h-4 w-px sm:block" />
          <li className="flex items-center gap-2">
            <ShieldCheck className="text-primary size-4 shrink-0" aria-hidden="true" />
            100% Aman
          </li>
          <li aria-hidden className="bg-border hidden h-4 w-px sm:block" />
          <li className="flex items-center gap-2">
            <Clock className="text-primary size-4 shrink-0" aria-hidden="true" />
            Layanan 24 Jam
          </li>
        </ul>
      </section>

      <section id="games" className="mx-auto max-w-300 px-4 pt-4 pb-20 md:px-6">
        <div className="reveal">
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">Pilih Game</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Cari dan klik game untuk mulai top up
          </p>
        </div>
        <div className="reveal mt-5">
          <Games initialGames={games} initialMeta={meta} />
        </div>
      </section>

      <section className="border-border bg-card/40 border-t">
        <div className="reveal mx-auto flex max-w-300 flex-col items-center gap-4 px-4 py-14 text-center md:px-6">
          <h2 className="max-w-md text-2xl font-bold tracking-tight text-balance">
            Siap mulai? Top up pertama kamu bisa dalam 1 menit.
          </h2>
          <Link
            href="#games"
            className="press bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-colors duration-200"
          >
            Mulai Top Up
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
