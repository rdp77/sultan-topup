'use client'

import { Search, X } from 'lucide-react'

interface SearchFieldProps {
  value: string
  onChange: (value: string) => void
}

export function SearchField({ value, onChange }: Readonly<SearchFieldProps>) {
  return (
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cari game atau publisher..."
        className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-10 text-sm text-foreground outline-none transition-colors duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          aria-label="Hapus pencarian"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
