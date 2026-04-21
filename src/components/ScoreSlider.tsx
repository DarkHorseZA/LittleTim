import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { colors } from '../theme/colors';
import { fonts } from '../theme/type';

type Props = {
  label: string;
  emoji: string;
  value: number;
  onChange: (v: number) => void;
  tint?: string;
  tintSoft?: string;
};

export function ScoreSlider({
  label,
  emoji,
  value,
  onChange,
  tint = colors.clay,
  tintSoft = colors.line,
}: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.labelRow}>
          <Text style={styles.emoji}>{emoji}</Text>
          <Text style={styles.label}>{label}</Text>
        </View>
        <View style={[styles.pill, { backgroundColor: tintSoft }]}>
          <Text style={[styles.pillText, { color: tint }]}>{value}</Text>
        </View>
      </View>
      <Slider
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={tint}
        maximumTrackTintColor={colors.line}
        thumbTintColor={tint}
        style={styles.slider}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 18,
    marginRight: 10,
  },
  label: {
    fontFamily: fonts.sansMed,
    fontSize: 16,
    color: colors.ink,
  },
  pill: {
    minWidth: 36,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
  },
  slider: {
    width: '100%',
    height: 32,
  },
});
