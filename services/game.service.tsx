import { apiFetch } from '@/lib/api-client'
import type { GameListResponse, GameDetailResponse } from '@/types/games'

export const GameService = {
  // List with pagination, revalidate every 60s (adjust to your caching needs)
  list(page = 1) {
    return apiFetch<GameListResponse>(`/games?page=${page}`, {
      next: { revalidate: 60 },
    })
  },

  detail(slug: string) {
    return apiFetch<GameDetailResponse>(`/games/${slug}`, {
      next: { revalidate: 60 },
    })
  },
}
