import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';
import { nav, webFocus } from '../theme/interactions';

type Variant = 'glass' | 'solid';

type Props = {
  onPress: () => void;
  // `glass` sits on gradient heroes (translucent white disc).
  // `solid` sits on plain backgrounds (opaque surface + soft shadow).
  variant?: Variant;
  accessibilityLabel?: string;
};

export function BackButton({
  onPress,
  variant = 'glass',
  accessibilityLabel = 'Go back',
}: Props) {
  return (
    <Pressable
      hitSlop={16}
      onPress={() => {
        nav();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed, focused }: any) => [
        styles.btn,
        variant === 'glass' ? styles.glass : styles.solid,
        pressed && { transform: [{ scale: 0.95 }], opacity: 0.9 },
        focused && webFocus,
      ]}
    >
      <Ionicons name="arrow-back" size={22} color={colors.ink} />
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
