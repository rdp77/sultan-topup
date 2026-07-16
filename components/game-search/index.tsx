'use client'

import { useGameList } from '@/hooks/use-game-list'
import { SearchField } from './search-field'
import { GameGrid } from './game-grid'
import { EmptyState } from './empty-state'
import { LoadMoreButton } from './load-more-button'
import { ResultCount } from './result-count'
import type { Game } from '@/types/games'
import type { PaginationMeta } from '@/types/pagination'

interface GameSearchProps {
  initialGames: Game[]
  initialMeta: PaginationMeta
}

export function GameSearch({ initialGames, initialMeta }: Readonly<GameSearchProps>) {
  const { query, setQuery, filtered, totalLoaded, hasMore, remaining, isPending, loadMore } =
    useGameList({ initialGames, initialMeta })

  return (
    <div>
      <SearchField value={query} onChange={setQuery} />

      {filtered.length === 0 ? (
        <EmptyState query={query} />
      ) : (
        <>
          <GameGrid games={filtered} />
          <ResultCount count={filtered.length} totalLoaded={totalLoaded} query={query} />
        </>
      )}

      {hasMore && <LoadMoreButton remaining={remaining} isPending={isPending} onClick={loadMore} />}
    </div>
  )
}
