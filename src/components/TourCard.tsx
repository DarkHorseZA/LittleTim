import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows } from '../theme/colors';
import { fonts, text } from '../theme/type';
import { useDay } from '../store/DayContext';

type Props = {
  storageKey: string;
  eyebrow?: string;
  title: string;
  tips: string[];
};

/**
 * A dismissible, once-only card shown the first time a user visits a tab.
 * A "gentle note" — not a modal, not a coachmark. Appears inline, can be
 * dismissed with the small close button, and never shows again for that
 * storageKey.
 */
export function TourCard({
  storageKey,
  eyebrow = 'A gentle note',
  title,
  tips,
}: Props) {
  const { settings, updateSettings, ready } = useDay();
  const [dismissed, setDismissed] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(12)).current;

  const seen = settings.seenTours?.[storageKey] === true;
  const shouldShow = ready && !seen && !dismissed;

  useEffect(() => {
    if (shouldShow) {
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(rise, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [shouldShow, fade, rise]);

  if (!shouldShow) return null;

  const dismiss = async () => {
    setDismissed(true);
    await updateSettings({
      seenTours: { ...(settings.seenTours ?? {}), [storageKey]: true },
    });
  };

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fade,
          transform: [{ translateY: rise }],
        },
      ]}
    >
      <View style={styles.headRow}>
        <View style={styles.iconCircle}>
          <Ionicons name="sparkles" size={14} color={colors.clayDeep} />
        </View>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Pressable
          onPress={dismiss}
          style={styles.closeBtn}
          hitSlop={12}
        >
          <Ionicons name="close" size={16} color={colors.inkSoft} />
        </Pressable>
      </View>

      <Text style={styles.title}>{title}</Text>

      {tips.map((tip, i) => (
        <View key={i} style={styles.tipRow}>
          <View style={styles.tipDot} />
          <Text style={styles.tipText}>{tip}</Text>
        </View>
      ))}

      <Pressable onPress={dismiss} style={styles.gotItBtn}>
        <Text style={styles.gotItText}>Got it</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.claySoft,
    ...shadows.sm,
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.clayWash,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  eyebrow: {
    ...text.eyebrow,
    marginBottom: 0,
    flex: 1,
  },
  closeBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.serifBold,
    fontSize: 20,
    color: colors.ink,
    marginBottom: 10,
    lineHeight: 26,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.clay,
    marginTop: 8,
    marginRight: 10,
  },
  tipText: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.inkSoft,
  },
  gotItBtn: {
    alignSelf: 'flex-end',
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.claySoft,
  },
  gotItText: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    letterSpacing: 1.2,
    color: colors.clayDeep,
    textTransform: 'uppercase',
  },
});
