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

/**
 * Returns the browser localStorage reference, or `null` when running outside a
 * browser (e.g. SSR/prerender) or when storage is unavailable/blocked. Treating
 * an absent storage as "not available" avoids noisy ReferenceError/security logs
 * on the server while still returning `null` in the client.
 */
function getStorage(): Storage | null {
  if (typeof window === 'undefined' || window.localStorage === undefined) {
    return null;
  }
  try {
    return window.localStorage;
  } catch {
    // Accessing window.localStorage can throw (e.g. blocked third-party cookies,
    // disabled storage). Swallow it and treat storage as unavailable.
    return null;
  }
}

/** Runtime shape guard so malformed/corrupted values are treated as absent. */
function isSavedAccount(value: unknown): value is SavedAccount {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.playerId === 'string' && typeof record.zoneId === 'string';
}

/**
 * Read the saved account for a game, or `null` when none exists / data is
 * unavailable. Never throws and never touches storage outside a browser.
 */
export function loadSavedAccount(gameSlug: string): SavedAccount | null {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(keyFor(gameSlug));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return isSavedAccount(parsed) ? { playerId: parsed.playerId, zoneId: parsed.zoneId } : null;
  } catch (err) {
    console.error('Failed to read saved account from localStorage:', err);
    return null;
  }
}

/**
 * Persist the given account for a game. Overwrites any previously saved value.
 * Best-effort: failures are logged and swallowed so checkout still proceeds.
 * No-op when storage is unavailable (e.g. SSR).
 */
export function saveAccount(gameSlug: string, account: SavedAccount): void {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(keyFor(gameSlug), JSON.stringify(account));
  } catch (err) {
    console.error('Failed to save account to localStorage:', err);
  }
}

/**
 * Remove any saved account for a game. Safe to call when nothing is stored.
 * Best-effort: failures are logged and swallowed. No-op when storage is unavailable.
 */
export function deleteSavedAccount(gameSlug: string): void {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.removeItem(keyFor(gameSlug));
  } catch (err) {
    console.error('Failed to delete account from localStorage:', err);
  }
}
