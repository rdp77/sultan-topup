export interface GameFormConfig {
  idLabel: string
  idPlaceholder: string
  needsZone: boolean
}

// TEMPORARY: field ini belum ada di model Game API.
// Idealnya pindah ke backend (kolom baru di tabel games) begitu daftar game bertambah.
const GAME_FORM_CONFIG: Record<string, GameFormConfig> = {
  'mobile-legends': { idLabel: 'User ID', idPlaceholder: 'Contoh: 123456789', needsZone: true },
  'free-fire': { idLabel: 'Player ID', idPlaceholder: 'Contoh: 123456789', needsZone: false },
}

const DEFAULT_FORM_CONFIG: GameFormConfig = {
  idLabel: 'User ID',
  idPlaceholder: 'Masukkan User ID kamu',
  needsZone: false,
}

export function getGameFormConfig(slug: string): GameFormConfig {
  return GAME_FORM_CONFIG[slug] ?? DEFAULT_FORM_CONFIG
}
