/**
 * Resilient, optimistic persistence. The screen updates first; this writes after
 * and never throws into an unhandled promise.
 *
 * Each write is retried (0.5s, then 1s). Every attempt re-reads the value from
 * memory (`getJson()`), so a retry can only ever write the newest version — an
 * older write can never overwrite a newer edit. If every attempt fails the key
 * is held as "unsaved" and listeners are told, so the UI can show a calm notice
 * with "Try again" (also retried when the app returns to the foreground).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

type KV = { setItem(key: string, value: string): Promise<void> };

// Injectable so tests can simulate a failing device store.
let storage: KV = AsyncStorage;
export function __setPersistStorage(s: KV) {
  storage = s;
}

type Job = { key: string; getJson: () => string };

const unsaved = new Map<string, Job>();
const listeners = new Set<() => void>();
const RETRY_DELAYS = [500, 1000];

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export function subscribeUnsaved(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function hasUnsaved(): boolean {
  return unsaved.size > 0;
}

function notify() {
  listeners.forEach((l) => l());
}

async function attempt(job: Job): Promise<boolean> {
  try {
    await storage.setItem(job.key, job.getJson());
    return true;
  } catch {
    return false;
  }
}

function clearUnsaved(key: string) {
  if (unsaved.delete(key)) notify();
}

// Fire-and-forget. Writes now, retries on failure, then parks as unsaved.
export function persist(key: string, getJson: () => string): void {
  const job: Job = { key, getJson };
  void (async () => {
    if (await attempt(job)) {
      clearUnsaved(key);
      return;
    }
    for (const ms of RETRY_DELAYS) {
      await delay(ms);
      if (await attempt(job)) {
        clearUnsaved(key);
        return;
      }
    }
    unsaved.set(key, job); // overwrites any earlier pending job for this key
    notify();
  })();
}

// Re-attempt every parked write (the "Try again" button, and on foreground).
export async function retryUnsaved(): Promise<void> {
  const jobs = [...unsaved.values()];
  let changed = false;
  for (const job of jobs) {
    if (await attempt(job)) {
      unsaved.delete(job.key);
      changed = true;
    }
  }
  if (changed) notify();
}
