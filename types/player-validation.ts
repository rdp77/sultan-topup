export interface PlayerValidationRequest {
  gameSlug: string;
  playerId: string;
  zoneId: string;
}

export interface PlayerValidationError {
  message: string;
  code: string;
}

export interface PlayerValidationResponse {
  success: boolean;
  data: PlayerValidationData | null;
  error: string | PlayerValidationError | null;
  provider: string;
}

export interface PlayerValidationData {
  id: string;
  username: string;
  zone_name: string;
  level: number | null;
  country: string | null;
}
