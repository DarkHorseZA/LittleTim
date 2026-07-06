import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/colors';
import { fonts } from '../theme/type';
import { useLargeScreen } from '../hooks/useLargeScreen';

// Haptic vocabulary, mapped to Expo Haptics primitives. Expo Haptics on web
// is a no-op, so these calls are safe to fire unconditionally.
export type ButtonHaptic = 'selection' | 'light' | 'success' | 'warning' | 'none';

async function fireHaptic(kind: ButtonHaptic) {
  try {
    switch (kind) {
      case 'selection':
        await Haptics.selectionAsync();
        return;
      case 'light':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        return;
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return;
      case 'warning':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        return;
      case 'none':
      default:
        return;
    }
  } catch {
    // Haptics can reject on unsupported hardware. Swallow and move on.
  }
}

// Web-only focus ring. On native, Pressable ignores unknown style props,
// but we keep the object gated to Platform.OS === 'web' to be explicit.
const webFocusStyle: any =
  Platform.OS === 'web'
    ? {
        outlineWidth: 2,
        outlineStyle: 'solid',
        outlineColor: colors.clayDeep,
        outlineOffset: 2,
      }
    : {};

type Variant = 'primary' | 'soft' | 'ghost' | 'dark';

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  trailingIcon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
  size?: 'md' | 'lg';
  accessibilityLabel?: string;
  accessibilityHint?: string;
  // Tactile feedback fired on press. Defaults: ghost = none (dismissal should
  // be silent), all other variants = selection (a gentle tap). Pass `success`
  // for completion CTAs (mark-as-done, save baseline). Pass `none` to opt out.
  haptic?: ButtonHaptic;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  icon,
  trailingIcon,
  style,
  size = 'md',
  accessibilityLabel,
  accessibilityHint,
  haptic,
}: Props) {
  const palette = palettes[variant];
  // On tablets every button gets bigger padding, bigger label, and bigger
  // leading/trailing icons so the interactive surface matches the iPad canvas.
  const { isLarge } = useLargeScreen();
  const resolvedHaptic: ButtonHaptic =
    haptic ?? (variant === 'ghost' ? 'none' : 'selection');
  const handlePress = () => {
    // Fire haptic before handler so it overlaps with the state transition.
    fireHaptic(resolvedHaptic);
    onPress();
  };
  const iconSize = isLarge ? 22 : 18;
  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!(disabled || loading), busy: !!loading }}
      style={({ pressed, focused }: any) => [
        styles.btn,
        size === 'lg' && styles.btnLg,
        isLarge && (size === 'lg' ? styles.btnLgLarge : styles.btnLarge),
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          opacity: disabled ? 0.5 : pressed ? 0.88 : 1,
          transform: [{ scale: pressed ? 0.99 : 1 }],
        },
        focused && webFocusStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <View style={styles.row}>
          {icon ? (
            <Ionicons
              name={icon}
              size={iconSize}
              color={palette.fg}
              style={{ marginRight: 8 }}
            />
          ) : null}
          <Text
            style={[
              styles.label,
              isLarge && styles.labelLarge,
              { color: palette.fg },
            ]}
          >
            {title}
          </Text>
          {trailingIcon ? (
            <Ionicons
              name={trailingIcon}
              size={iconSize}
              color={palette.fg}
              style={{ marginLeft: 8 }}
            />
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

const palettes = {
  primary: {
    bg: colors.clay,
    fg: colors.white,
    border: 'transparent',
  },
  soft: {
    bg: colors.claySoft,
    fg: colors.clayDeep,
    border: 'transparent',
  },
  ghost: {
    bg: 'transparent',
    fg: colors.ink,
    border: colors.line,
  },
  dark: {
    bg: colors.ink,
    fg: colors.white,
    border: 'transparent',
  },
} as const;

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLg: {
    paddingVertical: 16,
  },
  btnLarge: {
    paddingVertical: 18,
    paddingHorizontal: 28,
  },
  btnLgLarge: {
    paddingVertical: 22,
    paddingHorizontal: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontFamily: fonts.sansSemi,
    fontSize: 15,
    letterSpacing: 0.2,
  },
  labelLarge: {
    fontSize: 19,
    letterSpacing: 0.3,
  },
});
