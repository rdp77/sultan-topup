'use client';

import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { type LeaderboardEntry } from '@/types/leaderboard';
import { formatRupiah } from '@/lib/utils';
import { LeaderboardService } from '@/services';

function Skeleton() {
  return (
    <div className="flex flex-col gap-2" aria-busy="true" aria-label="Memuat leaderboard">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-accent/40 flex items-center gap-4 rounded-xl px-4 py-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full">
            <span className="bg-muted h-4 w-5 animate-pulse rounded" />
          </span>
          <div className="flex-1">
            <span className="bg-muted block h-4 w-32 animate-pulse rounded" />
            <span className="bg-muted mt-1.5 block h-3 w-16 animate-pulse rounded" />
          </div>
          <span className="bg-muted h-5 w-28 animate-pulse rounded" />
        </div>
      ))}
      <div className="my-1" />
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={`rest-${i}`} className="bg-card flex items-center gap-4 rounded-xl px-4 py-3">
          <span className="bg-background flex size-8 shrink-0 items-center justify-center rounded-full">
            <span className="bg-muted h-3.5 w-5 animate-pulse rounded" />
          </span>
          <div className="flex-1">
            <span className="bg-muted block h-4 w-28 animate-pulse rounded" />
            <span className="bg-muted mt-1.5 block h-3 w-16 animate-pulse rounded" />
          </div>
          <span className="bg-muted h-5 w-24 animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border-border bg-card/40 mt-8 flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center">
      <span className="bg-card text-muted-foreground flex size-12 items-center justify-center rounded-full">
        <Trophy className="size-6" aria-hidden="true" />
      </span>
      <p className="text-sm font-medium">Belum ada data leaderboard</p>
      <p className="text-muted-foreground max-w-xs text-xs">
        Data top spender akan muncul di sini. Terus top up untuk masuk peringkat!
      </p>
    </div>
  );
}

function RankBadge({ rank }: Readonly<{ rank: number }>) {
  if (rank > 3) {
    return (
      <span className="bg-background text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium tabular-nums">
        {rank}
      </span>
    );
  }

  const accent: Record<number, string> = {
    1: 'bg-primary text-primary-foreground size-10 text-sm font-bold',
    2: 'bg-primary/80 text-primary-foreground size-9 text-sm font-bold',
    3: 'bg-primary/60 text-primary-foreground size-9 text-sm font-semibold',
  };

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full tabular-nums ${accent[rank]}`}
    >
      {rank}
    </span>
  );
}

function getRowClass(rank: number): string {
  if (rank === 1) return 'bg-accent py-4';
  if (rank === 2) return 'bg-accent/90 py-4';
  if (rank === 3) return 'bg-accent/70 py-3.5';
  return '';
}

export function LeaderboardSection() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    LeaderboardService.list()
      .then((res) => {
        if (!cancelled) {
          setData(res.data ?? []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Gagal memuat data leaderboard.');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <Skeleton />;

  if (error) {
    return (
      <div className="border-border bg-card/40 mt-8 flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center">
        <p className="text-sm font-medium text-red-400">{error}</p>
        <p className="text-muted-foreground text-xs">Coba muat ulang halaman.</p>
      </div>
    );
  }

  if (data.length === 0) return <EmptyState />;

  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  return (
    <div>
      {/* Top 3 — podium */}
      <div className="flex flex-col gap-2">
        {top3.map((entry) => (
          <div
            key={entry.rank}
            className={`bg-card hover:bg-accent flex items-center gap-4 rounded-xl px-4 py-3 transition-colors duration-200 ${getRowClass(entry.rank)}`}
          >
            <RankBadge rank={entry.rank} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{entry.name}</p>
              <p className="text-muted-foreground text-xs">{entry.transactions} transaksi</p>
            </div>
            <span className="text-primary shrink-0 text-sm font-semibold tabular-nums">
              {formatRupiah(entry.total)}
            </span>
          </div>
        ))}
      </div>

      {/* Separator + rest */}
      {rest.length > 0 && (
        <>
          <div className="border-border/30 my-4 border-t" />
          <div className="flex flex-col gap-2">
            {rest.map((entry) => (
              <div
                key={entry.rank}
                className="bg-card hover:bg-accent flex items-center gap-4 rounded-xl px-4 py-3 transition-colors duration-200"
              >
                <RankBadge rank={entry.rank} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{entry.name}</p>
                  <p className="text-muted-foreground text-xs">{entry.transactions} transaksi</p>
                </div>
                <span className="text-primary shrink-0 text-sm font-semibold tabular-nums">
                  {formatRupiah(entry.total)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
