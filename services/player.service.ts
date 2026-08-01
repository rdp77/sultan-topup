import { apiFetch } from '@/lib/api-client';
import type { PlayerValidationRequest, PlayerValidationResponse } from '@/types/player-validation';

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
    });
  },
};
