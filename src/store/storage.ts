import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaselineRecord, DailyEntry, JournalStitch, QuiltEntry, ReflectionEntry } from '../types';

const KEY_ENTRIES = 'littletim:entries:v1';
const KEY_SETTINGS = 'littletim:settings:v1';
const KEY_QUILT = 'littletim:quilt:v1';
const KEY_REFLECTION = 'littletim:reflection:v1';
const KEY_STITCHES  = 'littletim:stitches:v1';

export type Profile = {
  displayName?: string;
  email?: string;
};

export type Settings = {
  reminderHour: number; // 0-23, when the daily belief pops up in-app
  keepScreenAwakeDuringAudio?: boolean; // opt-in: hold the screen on while a practice plays
  lastBeliefSeenOn?: string; // YYYY-MM-DD
  profile?: Profile;
  currentChapter?: number; // 0 = Introduction, 1-9 = chapters. Undefined = day-of-year rotation.
  hasSeenHowTo?: boolean; // true after the "How to use" screen has been shown once
  seenTours?: Record<string, boolean>; // which per-tab tour cards have been dismissed
  baseline?: BaselineRecord; // first wellness reading, captured once for delta tracking
  lastCheckInDate?: string; // YYYY-MM-DD of most recent tracker completion
  // DORMANT: kept in the schema so existing users' stored values survive.
  // The Connect tab now sends newsletter opt-in to the website form; these
  // fields are no longer written. TODO(v1.1-supabase): migrate any leftover
  // `notifyOnNewBook: true` into the Supabase subscription list, then remove.
  notifyOnNewBook?: boolean;
  hasSeenNewBookPrompt?: boolean;
  registeredEmail?: string; // set once the reader registers on first open
  registeredAt?: string; // ISO timestamp of registration
  bookCompleted?: boolean; // true once the reader taps "I've completed the book"; permanently hides the launch chapter check-in
  practiceHintSeen?: boolean;     // true once the "earlier chapters" hint has been shown after a Today-tab completion
  practiceHintDisabled?: boolean; // true = permanent opt-out; hint never shows regardless of practiceHintSeen
};

const defaultSettings: Settings = {
  reminderHour: 8,
  keepScreenAwakeDuringAudio: false,
  profile: {},
  currentChapter: undefined,
  hasSeenHowTo: false,
  seenTours: {},
  baseline: undefined,
  lastCheckInDate: undefined,
  notifyOnNewBook: false,
  hasSeenNewBookPrompt: false,
  bookCompleted: false,
  practiceHintSeen: false,
  practiceHintDisabled: false,
};

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export async function loadEntries(): Promise<Record<string, DailyEntry>> {
  const raw = await AsyncStorage.getItem(KEY_ENTRIES);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, DailyEntry>;
  } catch {
    return {};
  }
}

export async function saveEntries(
  entries: Record<string, DailyEntry>
): Promise<void> {
  await AsyncStorage.setItem(KEY_ENTRIES, JSON.stringify(entries));
}

export async function getEntry(date: string): Promise<DailyEntry> {
  const entries = await loadEntries();
  return (
    entries[date] ?? {
      date,
      msgDone: false,
      seeDone: false,
    }
  );
}

export async function upsertEntry(entry: DailyEntry): Promise<void> {
  const entries = await loadEntries();
  entries[entry.date] = entry;
  await saveEntries(entries);
}

// Deletes every key this app owns: the whole `littletim:*` namespace. Backs the
// account-deletion flow (App Store Guideline 5.1.1(v)). Reads all keys and
// multiRemoves the matching ones, so it stays correct even if new `littletim:*`
// keys are added later. The whole namespace goes, nothing is preserved.
export async function clearAllData(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const ours = keys.filter((k) => k.startsWith('littletim:'));
  if (ours.length > 0) {
    await AsyncStorage.multiRemove(ours);
  }
}

export async function loadSettings(): Promise<Settings> {
  const raw = await AsyncStorage.getItem(KEY_SETTINGS);
  if (!raw) return defaultSettings;
  try {
    return { ...defaultSettings, ...(JSON.parse(raw) as Settings) };
  } catch {
    return defaultSettings;
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  await AsyncStorage.setItem(KEY_SETTINGS, JSON.stringify(settings));
}

export async function loadQuiltEntries(): Promise<QuiltEntry[]> {
  const raw = await AsyncStorage.getItem(KEY_QUILT);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as QuiltEntry[];
  } catch {
    return [];
  }
}

export async function saveQuiltEntries(entries: QuiltEntry[]): Promise<void> {
  await AsyncStorage.setItem(KEY_QUILT, JSON.stringify(entries));
}

// Adds a QuiltEntry, deduplicating by date + type. Returns the updated list.
export async function addQuiltEntry(entry: QuiltEntry): Promise<QuiltEntry[]> {
  const existing = await loadQuiltEntries();
  const isDuplicate = existing.some(
    (e) => e.date === entry.date && e.type === entry.type
  );
  if (isDuplicate) return existing;
  const next = [...existing, entry];
  await saveQuiltEntries(next);
  return next;
}

// ─── Reflection entries ───────────────────────────────────────────────────────

export async function loadReflections(): Promise<Record<string, ReflectionEntry>> {
  const raw = await AsyncStorage.getItem(KEY_REFLECTION);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, ReflectionEntry>;
  } catch {
    return {};
  }
}

export async function saveReflection(entry: ReflectionEntry): Promise<void> {
  const all = await loadReflections();
  all[entry.date] = entry;
  await AsyncStorage.setItem(KEY_REFLECTION, JSON.stringify(all));
}

export async function getTodayReflection(date: string): Promise<ReflectionEntry | null> {
  const all = await loadReflections();
  return all[date] ?? null;
}

// ─── Journal stitches ─────────────────────────────────────────────────────────

export async function loadStitches(): Promise<JournalStitch[]> {
  const raw = await AsyncStorage.getItem(KEY_STITCHES);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as JournalStitch[];
  } catch {
    return [];
  }
}

export async function appendStitch(stitch: JournalStitch): Promise<JournalStitch[]> {
  const all = await loadStitches();
  const next = [...all, stitch];
  await AsyncStorage.setItem(KEY_STITCHES, JSON.stringify(next));
  return next;
}
