import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export function SectionHeader({ eyebrow, title, subtitle }: Props) {
  return (
    <View style={styles.wrap}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow.toUpperCase()}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 16,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 1.4,
    color: colors.inkFaint,
    marginBottom: 6,
    fontWeight: '600',
  },
  title: {
    fontSize: 26,
    color: colors.ink,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: colors.inkSoft,
    lineHeight: 22,
  },
});
