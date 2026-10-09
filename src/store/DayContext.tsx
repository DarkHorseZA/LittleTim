import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DailyEntry, QuiltEntry } from '../types';
import {
  getEntry,
  KEY_ENTRIES,
  KEY_QUILT,
  KEY_SETTINGS,
  loadEntries,
  loadQuiltEntries,
  loadSettings,
  Settings,
  todayKey,
} from './storage';
import { persist } from './persist';

type DayContextValue = {
  ready: boolean;
  today: DailyEntry;
  entries: Record<string, DailyEntry>;
  quiltEntries: QuiltEntry[];
  settings: Settings;
  updateToday: (patch: Partial<DailyEntry>) => Promise<void>;
  updateSettings: (patch: Partial<Settings>) => Promise<void>;
  addQuiltEntry: (entry: Omit<QuiltEntry, 'date'>) => Promise<void>;
  refresh: () => Promise<void>;
};

const DayContext = createContext<DayContextValue | undefined>(undefined);

export function DayProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [entries, setEntries] = useState<Record<string, DailyEntry>>({});
  const [quiltEntries, setQuiltEntries] = useState<QuiltEntry[]>([]);
  const [today, setToday] = useState<DailyEntry>({
    date: todayKey(),
    msgDone: false,
    seeDone: false,
  });
  const [settings, setSettings] = useState<Settings>({ reminderHour: 8 });

  // Refs mirror the latest state so a retried write always serialises the
  // newest value (an older write can never clobber a newer edit).
  const entriesRef = useRef(entries);
  const quiltRef = useRef(quiltEntries);
  const settingsRef = useRef(settings);

  const refresh = useCallback(async () => {
    const [allEntries, s, allQuilt] = await Promise.all([
      loadEntries(),
      loadSettings(),
      loadQuiltEntries(),
    ]);
    entriesRef.current = allEntries;
    settingsRef.current = s;
    quiltRef.current = allQuilt;
    setEntries(allEntries);
    setSettings(s);
    setQuiltEntries(allQuilt);
    setToday(await getEntry(todayKey()));
  }, []);

  useEffect(() => {
    (async () => {
      await refresh();
      setReady(true);
    })();
  }, [refresh]);

  const updateToday = useCallback(
    async (patch: Partial<DailyEntry>) => {
      // Hydration guard: never persist before the initial load, or a cold-start
      // mount-time write would overwrite the stored entry with defaults.
      if (!ready) return;
      const date = todayKey();
      const base = entriesRef.current[date] ?? { date, msgDone: false, seeDone: false };
      const next = { ...base, ...patch, date };
      const nextEntries = { ...entriesRef.current, [date]: next };
      entriesRef.current = nextEntries;
      setToday(next); // optimistic: the screen updates first
      setEntries(nextEntries);
      persist(KEY_ENTRIES, () => JSON.stringify(entriesRef.current));
    },
    [ready]
  );

  const updateSettings = useCallback(
    async (patch: Partial<Settings>) => {
      if (!ready) return;
      const next = { ...settingsRef.current, ...patch };
      settingsRef.current = next;
      setSettings(next); // optimistic
      persist(KEY_SETTINGS, () => JSON.stringify(settingsRef.current));
    },
    [ready]
  );

  const addQuiltEntry = useCallback(
    async (entry: Omit<QuiltEntry, 'date'>) => {
      if (!ready) return;
      const full: QuiltEntry = { date: todayKey(), ...entry };
      // One patch per day per type — don't stack duplicates.
      if (quiltRef.current.some((e) => e.date === full.date && e.type === full.type)) return;
      const next = [...quiltRef.current, full];
      quiltRef.current = next;
      setQuiltEntries(next); // optimistic
      persist(KEY_QUILT, () => JSON.stringify(quiltRef.current));
    },
    [ready]
  );

  const value = useMemo<DayContextValue>(
    () => ({
      ready,
      today,
      entries,
      quiltEntries,
      settings,
      updateToday,
      updateSettings,
      addQuiltEntry,
      refresh,
    }),
    [ready, today, entries, quiltEntries, settings, updateToday, updateSettings, addQuiltEntry, refresh]
  );

  return <DayContext.Provider value={value}>{children}</DayContext.Provider>;
}

export function useDay(): DayContextValue {
  const ctx = useContext(DayContext);
  if (!ctx) throw new Error('useDay must be used within DayProvider');
  return ctx;
}
