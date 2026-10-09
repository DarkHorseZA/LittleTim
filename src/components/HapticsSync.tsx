/**
 * Keeps the haptics vocabulary in sync with the Settings toggle, so feedback.ts
 * can stay a plain module (callable from any event handler) while still
 * respecting the reader's choice. Renders nothing.
 */
import { useEffect } from 'react';
import { useDay } from '../store/DayContext';
import { setHapticsEnabled } from './feedback';

export function HapticsSync() {
  const { settings } = useDay();
  useEffect(() => {
    setHapticsEnabled(settings.hapticsEnabled !== false);
  }, [settings.hapticsEnabled]);
  return null;
}
