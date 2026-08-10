import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AppState } from 'react-native';
import { Belief, Practice, TriggerGesture } from '../types';
import { beliefs } from '../data/beliefs';
import { msgPractices, seePractices } from '../data/practices';
import { triggerGestures } from '../data/triggers';
import { useDay } from './DayContext';

// "Something new" for readers who have finished the book. Once `bookCompleted`
// is set, the daily belief and the featured practices stop following a single
// chapter and instead surface a fresh, random draw from the whole library.
//
// The draw is chosen once per app open (mount, and again whenever the app
// returns to the foreground) and shared through this context, so the Today
// screen and the belief card that auto-opens from it always agree within a
// session. It re-rolls on the next open, which is the "fresh each time" feel.
//
// Non-completed readers get `null` here; their chapter-based selection in the
// screens is left exactly as it was.

export type Discovery = {
  belief: Belief;
  msg: Practice;
  see: Practice;
  when: TriggerGesture;
};

const DiscoveryContext = createContext<Discovery | null>(null);

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function DiscoveryProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useDay();
  const completed = !!settings.bookCompleted;

  // Bumping `roll` re-draws. We start at 0 (the draw made on mount) and bump
  // each time the app comes back to the foreground: each return is a new "open".
  const [roll, setRoll] = useState(0);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') setRoll((n) => n + 1);
    });
    return () => sub.remove();
  }, []);

  const value = useMemo<Discovery | null>(() => {
    if (!completed) return null;
    return {
      belief: pick(beliefs),
      msg: pick(msgPractices),
      see: pick(seePractices),
      when: pick(triggerGestures),
    };
    // `roll` is the intentional re-draw trigger; the libraries are static.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed, roll]);

  return (
    <DiscoveryContext.Provider value={value}>
      {children}
    </DiscoveryContext.Provider>
  );
}

// Returns the current random draw for a completed reader, or null otherwise.
export function useDiscovery(): Discovery | null {
  return useContext(DiscoveryContext);
}
