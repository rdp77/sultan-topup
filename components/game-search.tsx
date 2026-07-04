'use client'

import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { GameCard } from '@/components/game-card'
import { games } from '@/lib/data'

export function GameSearch() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return games
    return games.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.publisher.toLowerCase().includes(q) ||
        g.currency.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <div>
      <div className="relative max-w-md">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <label htmlFor="game-search" className="sr-only">
          Cari game
        </label>
        <input
          id="game-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari game atau publisher..."
          className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-10 text-sm text-foreground outline-none transition-colors duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-2.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            aria-label="Hapus pencarian"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="reveal mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 flex flex-col items-center gap-2 text-center">
          <Search className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm font-medium">Game tidak ditemukan</p>
          <p className="text-xs text-muted-foreground">
            Coba kata kunci lain, contoh &quot;Mobile&quot; atau &quot;HoYoverse&quot;.
          </p>
        </div>
      )}

      {filtered.length > 0 && query && (
        <p className="mt-3 text-xs text-muted-foreground">
          {filtered.length} game ditemukan untuk &quot;{query}&quot;
        </p>
      )}
    </div>
  )
}