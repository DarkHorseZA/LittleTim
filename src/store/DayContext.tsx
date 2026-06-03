import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { DailyEntry, QuiltEntry } from '../types';
import {
  addQuiltEntry as addQuiltEntryStorage,
  getEntry,
  loadEntries,
  loadQuiltEntries,
  loadSettings,
  saveSettings,
  Settings,
  todayKey,
  upsertEntry,
} from './storage';
import { toast } from '../components/Toast';

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

  const refresh = useCallback(async () => {
    const [allEntries, s, allQuilt] = await Promise.all([
      loadEntries(),
      loadSettings(),
      loadQuiltEntries(),
    ]);
    setEntries(allEntries);
    setSettings(s);
    setQuiltEntries(allQuilt);
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
      try {
        await upsertEntry(next);
        setToday(next);
        setEntries((prev) => ({ ...prev, [next.date]: next }));
      } catch {
        toast("Couldn't save your entry. Your device storage may be full.", 'error');
      }
    },
    [today]
  );

  const updateSettings = useCallback(
    async (patch: Partial<Settings>) => {
      const next = { ...settings, ...patch };
      try {
        await saveSettings(next);
        setSettings(next);
      } catch {
        toast("Couldn't save your settings. Your device storage may be full.", 'error');
      }
    },
    [settings]
  );

  const addQuiltEntry = useCallback(
    async (entry: Omit<QuiltEntry, 'date'>) => {
      const full: QuiltEntry = { date: todayKey(), ...entry };
      try {
        const next = await addQuiltEntryStorage(full);
        setQuiltEntries(next);
      } catch {
        toast("Couldn't save your stitch. Your device storage may be full.", 'error');
      }
    },
    []
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
