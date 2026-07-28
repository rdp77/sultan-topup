import { Search } from 'lucide-react';

interface EmptyStateProps {
  query: string;
}

export function EmptyState({ query }: Readonly<EmptyStateProps>) {
  return (
    <div className="mt-10 flex flex-col items-center gap-2 text-center">
      <Search className="text-muted-foreground size-8" aria-hidden="true" />
      <p className="text-sm font-medium">Game tidak ditemukan</p>
      <p className="text-muted-foreground text-xs">
        Tidak ada game yang cocok dengan &quot;{query}&quot; dari game yang sudah dimuat.
      </p>
    </div>
  );
}
