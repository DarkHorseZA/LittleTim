import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { text } from '../theme/type';

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export function SectionHeader({ eyebrow, title, subtitle }: Props) {
  return (
    <View style={styles.wrap}>
      {eyebrow ? <Text style={text.eyebrow}>{eyebrow}</Text> : null}
      <Text style={[text.h1, styles.title]}>{title}</Text>
      {subtitle ? <Text style={[text.body, styles.subtitle]}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 16,
  },
  title: {
    marginTop: 8,
  },
  subtitle: {
    marginTop: 8,
  },
});
