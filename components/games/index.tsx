'use client'

import { useGameList } from '@/hooks/use-game-list'
import { SearchField } from './search-field'
import { GameGrid } from './game-grid'
import { EmptyState } from './empty-state'
import { LoadMoreButton } from './load-more-button'
import { ResultCount } from './result-count'
import type { Game } from '@/types/games'
import type { PaginationMeta } from '@/types/pagination'
import { NoGamesAvailable } from './no-games-available'

interface Games {
  initialGames: Game[]
  initialMeta: PaginationMeta
}

type ListState = 'no-games' | 'no-results' | 'has-results'

function getListState(totalLoaded: number, filteredLength: number): ListState {
  if (totalLoaded === 0) return 'no-games'
  if (filteredLength === 0) return 'no-results'
  return 'has-results'
}

export function Games({ initialGames, initialMeta }: Readonly<Games>) {
  const { query, setQuery, filtered, totalLoaded, hasMore, remaining, isPending, loadMore } =
    useGameList({ initialGames, initialMeta })

  const listState = getListState(totalLoaded, filtered.length)

  return (
    <div>
      <SearchField value={query} onChange={setQuery} />

      {listState === 'no-games' && <NoGamesAvailable />}
      {listState === 'no-results' && <EmptyState query={query} />}
      {listState === 'has-results' && (
        <>
          <GameGrid games={filtered} />
          <ResultCount count={filtered.length} totalLoaded={totalLoaded} query={query} />
        </>
      )}

      {hasMore && <LoadMoreButton remaining={remaining} isPending={isPending} onClick={loadMore} />}
    </div>
  )
}
