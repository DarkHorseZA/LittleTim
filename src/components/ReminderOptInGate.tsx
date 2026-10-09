import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme/colors';
import { fonts } from '../theme/type';
import { useDay } from '../store/DayContext';
import { beliefForDate } from '../data/beliefs';
import {
  ensureNotificationPermission,
  getNotificationStatus,
  shouldOfferReminder,
  syncDailyBeliefNotification,
} from '../notifications';
import { BottomSheet } from './BottomSheet';
import { Button } from './Button';
import { toast } from './Toast';

// Offers the daily-belief reminder at an earned moment, never on launch: after
// the reader has sewn at least one stitch and only while the OS permission is
// still undetermined. Shown at most once (settings.notifyOffered). "Not now"
// never calls the OS, so iOS's single permission prompt is preserved for the
// Settings path later.
//
// Like ChapterCheckInGate, this is an overlay above the whole nav tree, so it
// MUST auto-close when the reader leaves the Tabs area, or its backdrop would
// swallow touches on the next screen (keep the leave-Tabs effect).
export function ReminderOptInGate({ active }: { active: boolean }) {
  const { ready, settings, quiltEntries, updateSettings } = useDay();
  const [status, setStatus] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const shownRef = useRef(false);

  const isWeb = Platform.OS === 'web';

  // Read the current OS status once, only while an offer is still possible.
  // Never requests permission here, so nothing pops on launch.
  useEffect(() => {
    if (!ready || isWeb || settings.notifyOffered) return;
    let alive = true;
    getNotificationStatus().then((s) => {
      if (alive) setStatus(s);
    });
    return () => {
      alive = false;
    };
  }, [ready, isWeb, settings.notifyOffered]);

  // Open once when the earned-moment condition is first met on the Tabs area.
  useEffect(() => {
    if (shownRef.current || status === null) return;
    const should = shouldOfferReminder({
      ready,
      isWeb,
      status,
      notifyOffered: !!settings.notifyOffered,
      stitches: quiltEntries.length,
    });
    if (active && should) {
      shownRef.current = true;
      setOpen(true);
    }
  }, [active, status, ready, isWeb, settings.notifyOffered, quiltEntries.length]);

  // Leave-Tabs auto-close (see note above). Never reopens; shownRef stays set.
  useEffect(() => {
    if (!active) setOpen(false);
  }, [active]);

  if (!open) return null;

  const hour = settings.reminderHour;

  // "Yes": close, then ask the OS at this intentional moment. On a grant, put
  // the schedule in place right away. Either way we mark it offered so we never
  // ask again from here.
  const handleYes = async () => {
    setOpen(false);
    const result = await ensureNotificationPermission();
    if (result === 'granted') {
      const belief = beliefForDate(new Date(), settings.currentChapter);
      await syncDailyBeliefNotification(hour, belief);
      toast('Lovely. Today’s belief will find you each morning.', 'success', {
        haptic: 'confirm',
      });
    }
    await updateSettings({ notifyOffered: true });
  };

  // "Not now": never touches the OS, so the one-time iOS ask is saved for later.
  const handleNotNow = async () => {
    setOpen(false);
    await updateSettings({ notifyOffered: true });
  };

  return (
    <BottomSheet onDismiss={handleNotNow} dismissLabel="Not now">
      <Text style={styles.heading}>A gentle daily nudge?</Text>
      <Text style={styles.subtext}>
        {`We can bring you the day’s belief each morning around ${hour}:00, a soft invitation to sew one small stitch. No noise, no streaks. You can change the time or turn it off anytime in Settings.`}
      </Text>

      <Button
        title="Yes, remind me gently"
        onPress={handleYes}
        size="lg"
        haptic="success"
        style={styles.primaryBtn}
      />
      <View style={{ height: 10 }} />
      <Button title="Not now" variant="ghost" onPress={handleNotNow} size="lg" />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontFamily: fonts.serifBold,
    fontSize: 24,
    lineHeight: 30,
    color: colors.ink,
    marginBottom: 8,
  },
  subtext: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkSoft,
    marginBottom: 20,
  },
  primaryBtn: {
    width: '100%',
  },
});
