export interface GameFormConfig {
  idLabel: string;
  idPlaceholder: string;
  needsZone: boolean;
}

// Per-game field labels. The `needsZone` flag is NOT hardcoded here anymore —
// it comes from the API (`GameDetail.needs_zone_id`, see getGameFormConfig).
// Keep only presentation-ish config in this map.
const GAME_FORM_CONFIG: Record<string, Pick<GameFormConfig, 'idLabel' | 'idPlaceholder'>> = {
  'mobile-legends': { idLabel: 'User ID', idPlaceholder: 'Contoh: 123456789' },
  'free-fire': { idLabel: 'Player ID', idPlaceholder: 'Contoh: 123456789' },
};

const DEFAULT_FORM_CONFIG: Pick<GameFormConfig, 'idLabel' | 'idPlaceholder'> = {
  idLabel: 'User ID',
  idPlaceholder: 'Masukkan User ID kamu',
};

/**
 * Build the form config for a game.
 *
 * `needsZoneId` is `GameDetail.needs_zone_id` from the API and is the source of
 * truth for whether the Server / Zone ID field is shown (and required). It
 * defaults to `true` when missing/empty so the UI stays safe before the API
 * ships the field.
 */
export function getGameFormConfig(slug: string, needsZoneId: boolean): GameFormConfig {
  const base = GAME_FORM_CONFIG[slug] ?? DEFAULT_FORM_CONFIG;
  // Treat missing/empty as `true` — the field is shown (and required) unless the
  // API explicitly says the game doesn't need a zone, so the UI never silently
  // drops the input before the backend ships the flag.
  return { ...base, needsZone: needsZoneId !== false };
}
