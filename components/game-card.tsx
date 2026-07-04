import Link from 'next/link'
import Image from 'next/image'
import type { Game } from '@/lib/data'

export function GameCard({ game }: { game: Game }) {
  return (
    <Link
      href={`/game/${game.slug}`}
      className="group relative overflow-hidden rounded-xl border border-border/60 bg-card transition-colors duration-200 hover:border-primary/40"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <Image
          src={game.image || '/placeholder.svg'}
          alt={game.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {game.popular && (
          <span className="absolute left-2 top-2 rounded-md bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
            Populer
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/95 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-3">
          <h3 className="text-sm font-semibold leading-tight text-foreground">{game.name}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{game.publisher}</p>
        </div>
      </div>
    </Link>
  )
}
