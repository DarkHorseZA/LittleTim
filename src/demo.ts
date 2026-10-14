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
    // A reader about ten weeks in, roughly halfway through the book. Joined
    // ~82 days ago; reflected yesterday, so today's check-in is still open.
    const settings: Settings = {
      reminderHour: 8,
      hapticsEnabled: true,
      hasSeenHowTo: true,
      tourSeen: true,
      profile: { displayName: 'Friend', email: 'friend@example.com' },
      currentChapter: 5,
      lastCheckInDate: dateKey(daysAgo(1)),
      registeredEmail: 'friend@example.com',
      registeredAt: daysAgo(82).toISOString(),
      notifyOffered: true,
      ratingAsked: true,
      bookCompleted: false,
      practiceHintSeen: true,
      practiceHintDisabled: false,
    };

    // ~2.5 months of a believable rhythm: an eager start, a mid dip with a
    // real week-long gap (around days 39-49), then a steady recent run.
    // Density varies day to day, so the patches aren't a uniform block. Today
    // (day 0) is left open on purpose, so a visitor can sew their own stitch.
    const quilt: QuiltEntry[] = [];
    const push = (n: number, type: QuiltEntry['type']) =>
      quilt.push({ date: dateKey(daysAgo(n)), type });

    const ritualDays = [
      1, 2, 3, 4, 6, 7, 8, 9, 11, 12,
      14, 16, 17, 19, 21, 22, 24, 26, 27, 29,
      31, 33, 36, 38, 50, 52, 54,
      56, 57, 58, 60, 61, 63, 64, 66, 68, 69,
      71, 72, 74, 75, 77, 78, 80, 82,
    ];
    const beliefDays = [
      1, 2, 3, 6, 7, 9, 10, 12,
      14, 16, 18, 21, 24, 27, 29,
      33, 38, 52,
      56, 58, 60, 63, 64, 66, 69, 71, 74, 77, 80, 82,
    ];
    const msgDays = [2, 4, 7, 9, 11, 16, 22, 27, 36, 52, 57, 61, 66, 72, 78];
    const seeDays = [3, 8, 12, 19, 26, 54, 58, 64, 74, 80];
    const journalDays = [1, 6, 17, 24, 38, 68]; // each also carries a saved stitch

    ritualDays.forEach((n) => push(n, 'ritual'));
    beliefDays.forEach((n) => push(n, 'belief'));
    msgDays.forEach((n) => push(n, 'msg'));
    seeDays.forEach((n) => push(n, 'see'));
    journalDays.forEach((n) => push(n, 'journal'));

    // The saved stitches that pair with the journal days above. A couple have
    // only one line filled, the way a real reader leaves them some mornings.
    const stitchText: Record<number, { love?: string; pulled?: string }> = {
      1: {
        love: 'I let the morning be slow. I breathed before I reached for the day.',
        pulled: 'A message sat unanswered and I felt the old need to chase it. I let it rest.',
      },
      6: {
        love: 'I told my son I was proud of him, and I watched it land in his shoulders.',
        pulled: 'When the work piled up, Fear whispered I was failing. I kept stitching anyway.',
      },
      17: {
        love: 'I forgave myself for the day I missed. The quilt did not mind the gap.',
      },
      24: {
        love: 'I said no, gently, and the sky did not fall.',
        pulled: 'I reached for my phone out of Fear, not need. I set it down.',
      },
      38: {
        pulled: 'An old voice said I was behind. I thanked it, and carried on from Love.',
      },
      68: {
        love: 'I spoke to myself as kindly as I would to a dear friend.',
        pulled: 'I wanted to be further along. I remembered small and daily beats big and rare.',
      },
    };
    const stitches: JournalStitch[] = journalDays.map((n) => ({
      id: String(daysAgo(n).getTime()),
      date: dateKey(daysAgo(n)),
      sewedWithLove: stitchText[n]?.love,
      oldThreadPulled: stitchText[n]?.pulled,
      savedAt: daysAgo(n).toISOString(),
    }));

    // Daily entries mirror the quilt so every past day is internally
    // consistent. Today is absent, so it opens fresh.
    const entries: Record<string, DailyEntry> = {};
    for (const q of quilt) {
      const e = entries[q.date] ?? {
        date: q.date,
        msgDone: false,
        seeDone: false,
        beliefAcknowledged: false,
        morningRitualDone: false,
      };
      if (q.type === 'msg') e.msgDone = true;
      if (q.type === 'see') e.seeDone = true;
      if (q.type === 'belief') e.beliefAcknowledged = true;
      if (q.type === 'ritual') e.morningRitualDone = true;
      entries[q.date] = e;
    }

    ls.setItem(KEY_SETTINGS, JSON.stringify(settings));
    ls.setItem(KEY_QUILT, JSON.stringify(quilt));
    ls.setItem(KEY_STITCHES, JSON.stringify(stitches));
    ls.setItem(KEY_ENTRIES, JSON.stringify(entries));
  } catch {
    // best-effort; the normal first-run flow is a fine fallback
  }
}
