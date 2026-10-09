/**
 * A quiet banner shown only when a write couldn't be saved after its retries.
 * It offers "Try again", and also retries on its own when the app returns to the
 * foreground. Renders nothing the rest of the time.
 */
import React, { useEffect, useState } from 'react';
import { AppState, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, shadows } from '../theme/colors';
import { fonts } from '../theme/type';
import { hasUnsaved, retryUnsaved, subscribeUnsaved } from '../store/persist';

export function UnsavedNotice() {
  const [visible, setVisible] = useState(hasUnsaved());

  useEffect(() => {
    const unsub = subscribeUnsaved(() => setVisible(hasUnsaved()));
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') retryUnsaved();
    });
    return () => {
      unsub();
      sub.remove();
    };
  }, []);

  if (!visible) return null;

  return (
    <SafeAreaView pointerEvents="box-none" style={styles.wrap} edges={['bottom']}>
      <View style={styles.card}>
        <Text style={styles.text}>A change hasn&rsquo;t saved yet.</Text>
        <Pressable
          onPress={() => retryUnsaved()}
          accessibilityRole="button"
          accessibilityLabel="Try saving again"
          hitSlop={8}
          style={({ pressed }) => [styles.btn, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.btnText}>Try again</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 10,
    paddingHorizontal: 16,
    ...shadows.md,
  },
  text: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink,
  },
  btn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.clayWash,
  },
  btnText: {
    fontFamily: fonts.sansSemi,
    fontSize: 13,
    color: colors.clayDeep,
  },
});
