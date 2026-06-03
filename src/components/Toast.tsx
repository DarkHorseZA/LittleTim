import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows } from '../theme/colors';
import { fonts } from '../theme/type';
import { useReducedMotion } from '../hooks/useReducedMotion';

// Lightweight imperative toast. Keeps two concerns in one file:
//   1. A module-level queue (`toast`, `dismiss`) so any call site can raise
//      a message without threading a context or ref everywhere.
//   2. `<ToastHost />` — the visual component mounted once at the root,
//      subscribed to the queue, that renders the messages.
//
// Designed to be quiet: bottom-centered pill, single line, auto-dismisses
// after ~4s, respects reduced-motion, tap-to-dismiss. No swipe gestures so
// it never fights scroll.

export type ToastVariant = 'error' | 'success' | 'info';

type ToastMessage = {
  id: number;
  text: string;
  variant: ToastVariant;
};

type Listener = (messages: ToastMessage[]) => void;

const listeners = new Set<Listener>();
let queue: ToastMessage[] = [];
let nextId = 1;
const AUTO_DISMISS_MS = 4000;

function emit() {
  const snapshot = [...queue];
  listeners.forEach((l) => l(snapshot));
}

export function toast(text: string, variant: ToastVariant = 'info') {
  const id = nextId++;
  queue = [...queue, { id, text, variant }];
  emit();
  // Fire-and-forget; if the user has already dismissed, `dismiss` is a no-op.
  setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
}

export function dismiss(id: number) {
  const before = queue.length;
  queue = queue.filter((m) => m.id !== id);
  if (queue.length !== before) emit();
}

function subscribe(l: Listener): () => void {
  listeners.add(l);
  l([...queue]);
  return () => {
    listeners.delete(l);
  };
}

const iconFor: Record<ToastVariant, keyof typeof Ionicons.glyphMap> = {
  error: 'warning-outline',
  success: 'checkmark-circle',
  info: 'information-circle-outline',
};

const tintFor: Record<ToastVariant, string> = {
  error: colors.danger,
  success: colors.done,
  info: colors.ink,
};

export function ToastHost() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  useEffect(() => subscribe(setMessages), []);

  if (messages.length === 0) return null;

  return (
    <View
      pointerEvents="box-none"
      style={styles.host}
      // On web this maps to aria-live="polite" so screen readers announce
      // each new toast without interrupting the user.
      accessibilityLiveRegion="polite"
    >
      {messages.map((m) => (
        <ToastPill key={m.id} message={m} />
      ))}
    </View>
  );
}

function ToastPill({ message }: { message: ToastMessage }) {
  const reducedMotion = useReducedMotion();
  const fade = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;
  const rise = useRef(new Animated.Value(reducedMotion ? 0 : 10)).current;

  useEffect(() => {
    if (reducedMotion) return;
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(rise, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, rise, reducedMotion]);

  return (
    <Animated.View
      style={[styles.pillWrap, { opacity: fade, transform: [{ translateY: rise }] }]}
    >
      <Pressable
        onPress={() => dismiss(message.id)}
        accessibilityRole="alert"
        accessibilityLabel={message.text}
        style={styles.pill}
      >
        <Ionicons
          name={iconFor[message.variant]}
          size={18}
          color={tintFor[message.variant]}
        />
        <Text style={styles.text} numberOfLines={2}>
          {message.text}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: Platform.OS === 'web' ? 24 : 48,
    alignItems: 'center',
  },
  pillWrap: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: 520,
    ...shadows.md,
  },
  text: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.ink,
    marginLeft: 10,
    flex: 1,
  },
});
