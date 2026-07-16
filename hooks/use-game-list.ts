'use client'

import { useMemo, useState, useTransition } from 'react'
import { loadMoreGamesAction } from '@/app/actions/games'
import type { Game } from '@/types/games'
import type { PaginationMeta } from '@/types/pagination'

interface UseGameListParams {
  initialGames: Game[]
  initialMeta: PaginationMeta
}

export function useGameList({ initialGames, initialMeta }: UseGameListParams) {
  const [query, setQuery] = useState('')
  const [games, setGames] = useState<Game[]>(initialGames)
  const [meta, setMeta] = useState<PaginationMeta>(initialMeta)
  const [isPending, startTransition] = useTransition()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return games
    return games.filter(
      (g) => g.name.toLowerCase().includes(q) || g.publisher.toLowerCase().includes(q),
    )
  }, [query, games])

  function loadMore() {
    startTransition(async () => {
      const next = await loadMoreGamesAction(meta.current_page + 1)
      setGames((prev) => [...prev, ...next.data])
      setMeta(next.meta)
    })
  }

  return {
    query,
    setQuery,
    filtered,
    totalLoaded: games.length,
    hasMore: meta.current_page < meta.last_page && !query,
    remaining: meta.total - games.length,
    isPending,
    loadMore,
  }
}
