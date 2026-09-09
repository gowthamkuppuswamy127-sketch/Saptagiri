/**
 * Storage access that cannot throw.
 *
 * Safari in private mode, embedded webviews and browsers with site data
 * blocked all throw on access rather than returning null, so every read and
 * write goes through here and every caller gets a usable value regardless.
 */

type Store = 'local' | 'session';

function backing(store: Store): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return store === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export function readRaw(store: Store, key: string): string | null {
  try {
    return backing(store)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function writeRaw(store: Store, key: string, value: string): boolean {
  try {
    backing(store)?.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeRaw(store: Store, key: string): void {
  try {
    backing(store)?.removeItem(key);
  } catch {
    /* nothing to do — the value was never stored */
  }
}

/**
 * Reads JSON and validates it with the supplied parser. Anything malformed,
 * truncated or written by an older version of the app is discarded rather
 * than crashing the page that reads it.
 */
export function readJson<T>(store: Store, key: string, parse: (value: unknown) => T): T | null {
  const raw = readRaw(store, key);
  if (!raw) return null;
  try {
    return parse(JSON.parse(raw));
  } catch {
    removeRaw(store, key);
    return null;
  }
}

export function writeJson(store: Store, key: string, value: unknown): boolean {
  try {
    return writeRaw(store, key, JSON.stringify(value));
  } catch {
    return false;
  }
}
