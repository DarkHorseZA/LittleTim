import React from 'react';
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { colors, radius, shadows } from '../theme/colors';

type Props = ViewProps & {
  tint?: keyof typeof colors;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  padded?: boolean;
};

export function Card({
  style,
  tint = 'surface',
  elevation = 'sm',
  padded = true,
  children,
  ...rest
}: Props) {
  const elevStyle =
    elevation === 'none' ? undefined : (shadows[elevation] as ViewStyle);
  return (
    <View
      {...rest}
      style={[
        styles.card,
        padded && styles.padded,
        { backgroundColor: (colors as any)[tint] },
        elevStyle,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
  },
  padded: {
    padding: 20,
  },
});
