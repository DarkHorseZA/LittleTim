import { Platform } from 'react-native';
import type { DailyEntry, JournalStitch, QuiltEntry } from './types';
import type { Settings } from './store/storage';

// Public web demo. The preview build (EXPO_PUBLIC_DEMO=1) or a ?demo / /demo URL
// seeds a gentle, lived-in state the first time a visitor lands, so the app
// opens straight into Today, with history to look at and today left open to try,
// and never asks for an email. Web only; this file does nothing in the store app.

const KEY_ENTRIES = 'littletim:entries:v1';
const KEY_SETTINGS = 'littletim:settings:v1';
const KEY_QUILT = 'littletim:quilt:v1';
const KEY_STITCHES = 'littletim:stitches:v1';

function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
}

let cachedDemo: boolean | null = null;

function computeDemoMode(): boolean {
  if (Platform.OS !== 'web') return false;
  try {
    if (process.env.EXPO_PUBLIC_DEMO === '1') return true;
    const { search, pathname } = window.location;
    if (/[?&]demo\b/.test(search) || /\/demo\/?$/.test(pathname)) return true;
    // Once we route into the tabs the URL can drop ?demo, so remember it.
    return window.sessionStorage?.getItem('regenesis:demo') === '1';
  } catch {
    return false;
  }
}

// Sticky: computed once, so it stays true after the app navigates away from the
// ?demo URL. In the deployed preview EXPO_PUBLIC_DEMO=1 makes this always true.
export function isDemoMode(): boolean {
  if (cachedDemo === null) {
    cachedDemo = computeDemoMode();
    try {
      if (cachedDemo) window.sessionStorage?.setItem('regenesis:demo', '1');
    } catch {
      /* ignore */
    }
  }
  return cachedDemo;
}

// Seeds the demo state once (if storage is empty), so a returning visitor keeps
// whatever they explored. Best-effort: any failure just leaves the normal
// first-run flow in place.
export function seedDemoIfNeeded(): void {
  if (!isDemoMode()) return;

  let ls: Storage;
  try {
    ls = window.localStorage;
    if (ls.getItem(KEY_SETTINGS)) return;
  } catch {
    return;
  }

  try {
    const settings: Settings = {
      reminderHour: 8,
      hapticsEnabled: true,
      hasSeenHowTo: true,
      tourSeen: true,
      profile: { displayName: 'Friend', email: 'friend@example.com' },
      currentChapter: 3,
      lastCheckInDate: dateKey(daysAgo(1)),
      registeredEmail: 'friend@example.com',
      registeredAt: daysAgo(18).toISOString(),
      notifyOffered: true,
      ratingAsked: true,
      bookCompleted: false,
      practiceHintSeen: true,
      practiceHintDisabled: false,
    };

    // A committed-but-human rhythm over the past ~18 days, with gaps. Today is
    // left empty on purpose, so a visitor can sew their own first stitch.
    const quilt: QuiltEntry[] = [];
    const add = (n: number, type: QuiltEntry['type']) =>
      quilt.push({ date: dateKey(daysAgo(n)), type });
    for (const n of [1, 2, 3, 5, 6, 8, 9, 10, 12, 14, 15, 17]) add(n, 'ritual');
    for (const n of [1, 2, 3, 4, 6, 8, 9, 11, 14, 15, 17]) add(n, 'belief');
    for (const n of [2, 5, 9, 14]) add(n, 'msg');
    for (const n of [3, 8, 15]) add(n, 'see');
    for (const n of [4, 11]) add(n, 'journal');

    const stitches: JournalStitch[] = [
      {
        id: String(daysAgo(4).getTime()),
        date: dateKey(daysAgo(4)),
        sewedWithLove:
          'I let myself rest without earning it, and the guilt loosened its thread.',
        oldThreadPulled:
          'When my phone buzzed, I reached for it out of Fear, not need.',
        savedAt: daysAgo(4).toISOString(),
      },
      {
        id: String(daysAgo(11).getTime()),
        date: dateKey(daysAgo(11)),
        sewedWithLove:
          'I spoke to myself as gently as I would to a dear friend.',
        oldThreadPulled:
          'An old voice said I was behind. I thanked it, and kept sewing.',
        savedAt: daysAgo(11).toISOString(),
      },
    ];

    // One fully-sewn past day so progress is visible; today stays open.
    const past = dateKey(daysAgo(2));
    const entries: Record<string, DailyEntry> = {
      [past]: {
        date: past,
        msgDone: true,
        seeDone: false,
        beliefAcknowledged: true,
        morningRitualDone: true,
      },
    };

    ls.setItem(KEY_SETTINGS, JSON.stringify(settings));
    ls.setItem(KEY_QUILT, JSON.stringify(quilt));
    ls.setItem(KEY_STITCHES, JSON.stringify(stitches));
    ls.setItem(KEY_ENTRIES, JSON.stringify(entries));
  } catch {
    // best-effort; the normal first-run flow is a fine fallback
  }
}
