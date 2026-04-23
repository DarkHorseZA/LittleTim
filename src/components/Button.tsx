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
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/colors';
import { fonts } from '../theme/type';

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
}: Props) {
  const palette = palettes[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!(disabled || loading), busy: !!loading }}
      style={({ pressed, focused }: any) => [
        styles.btn,
        size === 'lg' && styles.btnLg,
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
              size={18}
              color={palette.fg}
              style={{ marginRight: 8 }}
            />
          ) : null}
          <Text style={[styles.label, { color: palette.fg }]}>{title}</Text>
          {trailingIcon ? (
            <Ionicons
              name={trailingIcon}
              size={18}
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
    fg: '#FFFFFF',
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
    fg: '#FFFFFF',
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontFamily: fonts.sansSemi,
    fontSize: 15,
    letterSpacing: 0.2,
  },
});
