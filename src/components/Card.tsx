import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { colors, radius } from '../theme/colors';

type Props = ViewProps & {
  tint?: keyof typeof colors;
};

export function Card({ style, tint = 'card', children, ...rest }: Props) {
  return (
    <View
      {...rest}
      style={[styles.card, { backgroundColor: colors[tint] }, style]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
});
