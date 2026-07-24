export interface PlayerValidationRequest {
  gameSlug: string
  playerId: string
  zoneId: string
}

export interface PlayerValidationResponse {
  data: PlayerValidationData | null
  error: string | null
}

export interface PlayerValidationData {
  playerId: string
  zoneId: string
  playerName: string
  level: number | null
  avatar: string | null
}
