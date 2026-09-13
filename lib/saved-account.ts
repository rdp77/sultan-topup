// Persistence helpers for "Simpan Data Akun" (Save Account Data).
//
// Stored per-game in localStorage under a namespaced key so account data from
// different games never mixes. All storage access is defensive (try/catch) so a
// corrupted or unavailable localStorage never breaks the checkout flow.

export interface SavedAccount {
  playerId: string;
  zoneId: string;
}

// Namespace prefix. Keys are `saved-account:<gameSlug>` for per-game isolation.
const STORAGE_PREFIX = 'saved-account:';

function keyFor(gameSlug: string): string {
  return `${STORAGE_PREFIX}${gameSlug}`;
}

/** Runtime shape guard so malformed/corrupted values are treated as absent. */
function isSavedAccount(value: unknown): value is SavedAccount {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.playerId === 'string' && typeof record.zoneId === 'string';
}

/**
 * Read the saved account for a game, or `null` when none exists / data is
 * unavailable. Never throws.
 */
export function loadSavedAccount(gameSlug: string): SavedAccount | null {
  try {
    const raw = localStorage.getItem(keyFor(gameSlug));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return isSavedAccount(parsed) ? { playerId: parsed.playerId, zoneId: parsed.zoneId } : null;
  } catch (err) {
    console.error('Gagal membaca data akun dari localStorage:', err);
    return null;
  }
}

/**
 * Persist the given account for a game. Overwrites any previously saved value.
 * Best-effort: failures are logged and swallowed so checkout still proceeds.
 */
export function saveAccount(gameSlug: string, account: SavedAccount): void {
  try {
    localStorage.setItem(keyFor(gameSlug), JSON.stringify(account));
  } catch (err) {
    console.error('Gagal menyimpan data akun ke localStorage:', err);
  }
}

/**
 * Remove any saved account for a game. Safe to call when nothing is stored.
 * Best-effort: failures are logged and swallowed.
 */
export function deleteSavedAccount(gameSlug: string): void {
  try {
    localStorage.removeItem(keyFor(gameSlug));
  } catch (err) {
    console.error('Gagal menghapus data akun dari localStorage:', err);
  }
}
