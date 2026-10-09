import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useDay } from '../store/DayContext';
import { beliefForDate } from '../data/beliefs';
import {
  getNotificationStatus,
  syncDailyBeliefNotification,
} from '../notifications';

// Owns the daily-belief notification lifecycle. Renders nothing. Mounted inside
// DayProvider so it can read the reminder hour and the current belief, and it
// only acts once hydration has finished (the `ready` guard), so a cold start
// never schedules from default settings.
//
// It never ASKS for permission; that would fire iOS's one-time dialog on
// launch. Permission is requested only at an earned moment (ReminderOptInGate)
// or from Settings. Here we just read the current status and keep the schedule
// in sync when the reader has already granted it.
export function NotificationsManager() {
  const { ready, settings } = useDay();
  const reminderHour = settings.reminderHour;
  const belief = beliefForDate(new Date(), settings.currentChapter);
  const statement = belief.statement;

  useEffect(() => {
    // Web keeps the in-app prompt as its reminder; scheduled local
    // notifications aren't delivered there.
    if (!ready || Platform.OS === 'web') return;
    let cancelled = false;
    (async () => {
      const status = await getNotificationStatus();
      if (cancelled || status !== 'granted') return;
      await syncDailyBeliefNotification(reminderHour, belief);
    })();
    return () => {
      cancelled = true;
    };
    // Reschedule whenever the reminder hour or the belief's text changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, reminderHour, statement]);

  return null;
}
