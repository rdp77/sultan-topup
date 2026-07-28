interface ResultCountProps {
  count: number;
  totalLoaded: number;
  query: string;
}

export function ResultCount({ count, totalLoaded, query }: Readonly<ResultCountProps>) {
  if (!query || count === 0) return null;
  return (
    <p className="text-muted-foreground mt-3 text-xs">
      {count} game ditemukan untuk &quot;{query}&quot; dari {totalLoaded} game yang sudah dimuat
    </p>
  );
}
