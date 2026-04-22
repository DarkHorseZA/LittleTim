import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyEntry } from '../types';

const KEY_ENTRIES = 'littletim:entries:v1';
const KEY_SETTINGS = 'littletim:settings:v1';

export type Profile = {
  displayName?: string;
  email?: string;
};

export type Settings = {
  reminderHour: number; // 0-23, when the daily belief pops up in-app
  lastBeliefSeenOn?: string; // YYYY-MM-DD
  profile?: Profile;
  currentChapter?: number; // 0 = Introduction, 1-9 = chapters. Undefined = day-of-year rotation.
  hasSeenHowTo?: boolean; // true after the "How to use" screen has been shown once
  seenTours?: Record<string, boolean>; // which per-tab tour cards have been dismissed
};

const defaultSettings: Settings = {
  reminderHour: 8,
  profile: {},
  currentChapter: undefined,
  hasSeenHowTo: false,
  seenTours: {},
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

export function computeStreak(entries: Record<string, DailyEntry>): number {
  let streak = 0;
  const cursor = new Date();
  while (true) {
    const key = todayKey(cursor);
    const e = entries[key];
    const completed =
      !!e && (e.morningRitualDone || e.msgDone || e.seeDone);
    if (!completed) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
