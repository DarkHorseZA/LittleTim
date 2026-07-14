import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import type { Belief } from './types';

// Real daily-belief notifications. The in-app prompt (HomeScreen) stays as the
// fallback for readers who deny permission and for web, where scheduled local
// notifications are not delivered the same way. Everything here is best-effort:
// a failure never blocks the app, it just leaves the in-app prompt in charge.

// Tapping the notification deep-links into the Belief modal via the existing
// linking config (RootNavigator maps `belief` -> the Belief screen).
export const BELIEF_DEEP_LINK = 'littletim://belief';

const ANDROID_CHANNEL_ID = 'daily-belief';

// Foreground presentation: a quiet banner, no sound. Gentle by design, an
// invitation rather than an interruption.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// The permission status as a plain string ('granted' | 'denied' | 'undetermined').
// Read fresh every time; never trust a persisted grant.
export async function getNotificationStatus(): Promise<string> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  } catch {
    return 'undetermined';
  }
}

// Ask for permission only when it has not been decided yet. Returns the status.
export async function ensureNotificationPermission(): Promise<string> {
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.status !== 'undetermined') return current.status;
    const requested = await Notifications.requestPermissionsAsync();
    return requested.status;
  } catch {
    return 'undetermined';
  }
}

// The first sentence of the belief, trimmed to sit on one line. Beliefs are
// written in curly quotes with capital Love/Fear, so we keep the text as-is and
// only clip length, ending on an ellipsis when a clip is needed.
export function firstSentence(text: string, max = 90): string {
  const trimmed = text.trim();
  const match = trimmed.match(/^[^.!?]*[.!?]/);
  let sentence = (match ? match[0] : trimmed).trim();
  if (sentence.length > max) {
    sentence = sentence.slice(0, max - 1).trimEnd() + '…';
  }
  return sentence;
}

// Cancel any existing schedule and register today's belief to fire daily at the
// reminder hour. Call this whenever the reminder hour or the current belief
// changes. No-op on web (scheduled local notifications are not supported there).
export async function syncDailyBeliefNotification(
  reminderHour: number,
  belief: Belief
): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
        name: 'Daily belief',
        importance: Notifications.AndroidImportance.DEFAULT,
        sound: null,
      });
    }
    // We only ever schedule this one reminder, so clearing all is the simplest
    // correct way to avoid stacking duplicates on reschedule.
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Today’s belief is waiting.',
        body: firstSentence(belief.statement),
        data: { url: BELIEF_DEEP_LINK },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: reminderHour,
        minute: 0,
        ...(Platform.OS === 'android'
          ? { channelId: ANDROID_CHANNEL_ID }
          : {}),
      },
    });
  } catch {
    // Best-effort: the in-app prompt remains the fallback.
  }
}
