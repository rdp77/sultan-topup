export interface PlayerValidationRequest {
  userId: string
  zoneId: string
  gameId: number
  sku: string
}

export interface PlayerValidationResponse {
  data: PlayerValidationData | null
  error: string | null
}

export interface PlayerValidationData {
  userId: string
  zoneId: string
  playerName: string
  level: number | null
  avatar: string | null
}
