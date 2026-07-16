import { GameCard } from '@/components/game-card'
import type { Game } from '@/types/games'

interface GameGridProps {
  games: Game[]
}

export function GameGrid({ games }: Readonly<GameGridProps>) {
  return (
    <div className="reveal mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {games.map((game) => (
        <GameCard key={game.slug} game={game} />
      ))}
    </div>
  )
}
