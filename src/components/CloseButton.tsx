import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';
import { tap, webFocus } from '../theme/interactions';

type Variant = 'glass' | 'solid';

type Props = {
  onPress: () => void;
  // `glass` (default) sits on dawn / dawnDeep / clay gradient heroes and
  // uses a translucent white disc. `solid` sits on plain `colors.bg` and
  // uses an opaque surface with a soft shadow.
  variant?: Variant;
  // Defaults to 'close'. Passing another icon (e.g. 'help-circle-outline')
  // reuses the same disc/press-scale/focus treatment for header utility
  // actions, so every icon-pill button in the app feels identical.
  icon?: keyof typeof Ionicons.glyphMap;
  accessibilityLabel?: string;
};

export function CloseButton({
  onPress,
  variant = 'glass',
  icon = 'close',
  accessibilityLabel = 'Close',
}: Props) {
  return (
    <Pressable
      hitSlop={16}
      onPress={() => {
        tap();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed, focused }: any) => [
        styles.btn,
        variant === 'glass' ? styles.glass : styles.solid,
        // CloseButton keeps a slightly stronger press scale (0.95) than
        // the shared `pressScale` card tokens (0.98) because icons are small.
        pressed && { transform: [{ scale: 0.95 }], opacity: 0.9 },
        focused && webFocus,
      ]}
    >
      <Ionicons name={icon} size={22} color={colors.ink} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glass: {
    backgroundColor: colors.glass,
  },
  solid: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
});
