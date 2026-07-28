'use client';

import { Search, X } from 'lucide-react';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchField({ value, onChange }: Readonly<SearchFieldProps>) {
  return (
    <div className="relative max-w-md">
      <Search
        className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
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
        className="border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/30 w-full rounded-lg border py-2.5 pr-10 pl-10 text-sm transition-colors duration-200 outline-none focus:ring-2"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="text-muted-foreground hover:text-foreground focus-visible:ring-primary/60 absolute top-1/2 right-2.5 flex size-6 -translate-y-1/2 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
          aria-label="Hapus pencarian"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
