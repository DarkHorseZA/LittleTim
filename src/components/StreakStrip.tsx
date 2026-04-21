import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/type';
import { DailyEntry } from '../types';
import { todayKey } from '../store/storage';

type Props = {
  entries: Record<string, DailyEntry>;
};

const LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function StreakStrip({ entries }: Props) {
  const now = new Date();
  // Last 7 days ending today (right-most).
  const days: { key: string; date: Date; done: boolean; isToday: boolean }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = todayKey(d);
    const entry = entries[key];
    const done = !!entry && (entry.msgDone || entry.seeDone);
    days.push({ key, date: d, done, isToday: i === 0 });
  }
  return (
    <View style={styles.wrap}>
      {days.map((d) => {
        const weekday = LABELS[d.date.getDay()];
        return (
          <View key={d.key} style={styles.col}>
            <Text style={styles.weekday}>{weekday}</Text>
            <View
              style={[
                styles.dot,
                d.done && styles.dotDone,
                d.isToday && styles.dotToday,
                d.isToday && d.done && styles.dotTodayDone,
              ]}
            >
              {d.done ? <View style={styles.inner} /> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  col: {
    alignItems: 'center',
    flex: 1,
  },
  weekday: {
    fontFamily: fonts.sansMed,
    fontSize: 11,
    color: colors.inkFaint,
    marginBottom: 8,
    letterSpacing: 1,
  },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  dotDone: {
    borderColor: colors.clay,
    backgroundColor: colors.claySoft,
  },
  dotToday: {
    borderColor: colors.ink,
  },
  dotTodayDone: {
    borderColor: colors.clayDeep,
    backgroundColor: colors.clay,
  },
  inner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.clayDeep,
  },
});
