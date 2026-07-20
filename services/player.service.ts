import { apiFetch } from '@/lib/api-client'
import type { PlayerValidationRequest, PlayerValidationResponse } from '@/types/player-validation'

export const PlayerService = {
  /**
   * Validate player by UID, Zone ID, Game ID, and SKU.
   * Caching is handled at the hook level using sessionStorage.
   */
  async validate(request: PlayerValidationRequest): Promise<PlayerValidationResponse> {
    const body = {
      user_id: request.userId,
      zone_id: request.zoneId,
      game_id: request.gameId,
      sku: request.sku,
    }

    return apiFetch<PlayerValidationResponse>('/player/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      next: { revalidate: 300 }, // Cache for 5 minutes when called from server
    })
  },
}

// Client-side cache key generator
function getCacheKey(gameId: number, userId: string, zoneId: string, sku: string): string {
  return `player-validation:${gameId}:${userId}:${zoneId}:${sku}`
}

// Session storage cache for client-side deduplication
export const PlayerValidationCache = {
  get(request: PlayerValidationRequest): PlayerValidationResponse | null {
    if (typeof window === 'undefined') return null

    const key = getCacheKey(request.gameId, request.userId, request.zoneId, request.sku)
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

    const key = getCacheKey(request.gameId, request.userId, request.zoneId, request.sku)
    sessionStorage.setItem(key, JSON.stringify(response))
  },

  clear() {
    if (typeof window === 'undefined') return

    const keys = Object.keys(sessionStorage).filter((k) => k.startsWith('player-validation:'))
    keys.forEach((k) => sessionStorage.removeItem(k))
  },
}
