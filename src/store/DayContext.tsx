import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { DailyEntry } from '../types';
import {
  computeStreak,
  getEntry,
  loadEntries,
  loadSettings,
  saveSettings,
  Settings,
  todayKey,
  upsertEntry,
} from './storage';

type DayContextValue = {
  ready: boolean;
  today: DailyEntry;
  entries: Record<string, DailyEntry>;
  streak: number;
  settings: Settings;
  updateToday: (patch: Partial<DailyEntry>) => Promise<void>;
  updateSettings: (patch: Partial<Settings>) => Promise<void>;
  refresh: () => Promise<void>;
};

const DayContext = createContext<DayContextValue | undefined>(undefined);

export function DayProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [entries, setEntries] = useState<Record<string, DailyEntry>>({});
  const [today, setToday] = useState<DailyEntry>({
    date: todayKey(),
    msgDone: false,
    seeDone: false,
  });
  const [settings, setSettings] = useState<Settings>({ reminderHour: 8 });

  const refresh = useCallback(async () => {
    const [allEntries, s] = await Promise.all([loadEntries(), loadSettings()]);
    setEntries(allEntries);
    setSettings(s);
    const t = await getEntry(todayKey());
    setToday(t);
  }, []);

  useEffect(() => {
    (async () => {
      await refresh();
      setReady(true);
    })();
  }, [refresh]);

  const updateToday = useCallback(
    async (patch: Partial<DailyEntry>) => {
      const next = { ...today, ...patch, date: todayKey() };
      await upsertEntry(next);
      setToday(next);
      setEntries((prev) => ({ ...prev, [next.date]: next }));
    },
    [today]
  );

  const updateSettings = useCallback(
    async (patch: Partial<Settings>) => {
      const next = { ...settings, ...patch };
      await saveSettings(next);
      setSettings(next);
    },
    [settings]
  );

  const streak = useMemo(() => computeStreak(entries), [entries]);

  const value = useMemo<DayContextValue>(
    () => ({
      ready,
      today,
      entries,
      streak,
      settings,
      updateToday,
      updateSettings,
      refresh,
    }),
    [ready, today, entries, streak, settings, updateToday, updateSettings, refresh]
  );

  return <DayContext.Provider value={value}>{children}</DayContext.Provider>;
}

export function useDay(): DayContextValue {
  const ctx = useContext(DayContext);
  if (!ctx) throw new Error('useDay must be used within DayProvider');
  return ctx;
}
