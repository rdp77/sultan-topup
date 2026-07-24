import { apiFetch } from '@/lib/api-client'
import type { PlayerValidationRequest, PlayerValidationResponse } from '@/types/player-validation'

export const PlayerService = {
  async validate(request: PlayerValidationRequest): Promise<PlayerValidationResponse> {
    return apiFetch<PlayerValidationResponse>('/validate-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player_id: request.playerId,
        zone_id: request.zoneId,
        game_slug: request.gameSlug,
      }),
    })
  },
}

// Client-side cache key generator
function getCacheKey(playerId: string, zoneId: string, gameSlug: string): string {
  return `player-validation:${playerId}:${zoneId}:${gameSlug}`
}

// Session storage cache for client-side deduplication
export const PlayerValidationCache = {
  get(request: PlayerValidationRequest): PlayerValidationResponse | null {
    if (typeof window === 'undefined') return null

    const key = getCacheKey(request.playerId, request.zoneId, request.gameSlug)
    const cached = sessionStorage.getItem(key)

    if (cached) {
      try {
        return JSON.parse(cached) as PlayerValidationResponse
      } catch {
        return null
      }
    }
    return null
  },

  set(request: PlayerValidationRequest, response: PlayerValidationResponse) {
    if (typeof window === 'undefined') return

    const key = getCacheKey(request.playerId, request.zoneId, request.gameSlug)
    sessionStorage.setItem(key, JSON.stringify(response))
  },

  clear() {
    if (typeof window === 'undefined') return

    const keys = Object.keys(sessionStorage).filter((k) => k.startsWith('player-validation:'))
    keys.forEach((k) => sessionStorage.removeItem(k))
  },
}
