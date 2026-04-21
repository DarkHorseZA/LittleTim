import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { colors } from '../theme/colors';

type Props = {
  label: string;
  emoji: string;
  value: number;
  onChange: (v: number) => void;
};

export function ScoreSlider({ label, emoji, value, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.label}>
          <Text style={styles.emoji}>{emoji}  </Text>
          {label}
        </Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <Slider
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={colors.accent}
        maximumTrackTintColor={colors.line}
        thumbTintColor={colors.accent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    color: colors.ink,
    fontWeight: '500',
  },
  emoji: {
    fontSize: 18,
  },
  value: {
    fontSize: 18,
    color: colors.accent,
    fontWeight: '700',
    minWidth: 26,
    textAlign: 'right',
  },
});
