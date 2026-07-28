import Link from 'next/link';
import Image from 'next/image';
import { Game } from '@/types/games';

export function GameCard({ game }: Readonly<{ game: Game }>) {
  return (
    <Link
      href={`/game/${game.slug}`}
      className="group border-border/60 bg-card hover:border-primary/40 flex flex-col overflow-hidden rounded-xl border transition-colors duration-200"
    >
      <div className="bg-background relative aspect-3/4 w-full overflow-hidden">
        <Image
          src={game.cover || process.env.NEXT_PUBLIC_PLACEHOLDER_IMAGE || ''}
          alt={game.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {game.popular && (
          <span className="bg-primary text-primary-foreground absolute top-2 left-2 rounded-md px-2 py-0.5 text-xs font-medium">
            Populer
          </span>
        )}
      </div>
      <div className="flex items-start justify-between gap-2 p-3">
        <div className="min-w-0">
          <h3 className="text-foreground truncate text-sm leading-tight font-semibold">
            {game.name}
          </h3>
          <p className="text-muted-foreground mt-0.5 truncate text-xs">{game.publisher}</p>
        </div>
      </div>
    </Link>
  );
}
