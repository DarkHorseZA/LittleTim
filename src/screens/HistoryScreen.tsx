import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, layout, radius, shadows } from '../theme/colors';
import { fonts, text } from '../theme/type';
import { useDay } from '../store/DayContext';
import { DailyEntry } from '../types';
import { todayKey } from '../store/storage';
import { TourCard } from '../components/TourCard';
import { PulsingMark } from '../components/PulsingMark';

function prettyDate(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function sumScores(entry: DailyEntry): number | null {
  if (!entry.tracker) return null;
  const s = entry.tracker.scores;
  return Math.round(
    (s.happiness + s.loved + s.health + s.wealth + s.relationships) / 5
  );
}

// 0..4 intensity based on completion
function intensity(entry?: DailyEntry): number {
  if (!entry) return 0;
  let n = 0;
  if (entry.beliefAcknowledged) n++;
  if (entry.msgDone) n++;
  if (entry.seeDone) n++;
  if (entry.tracker) n++;
  return n; // 0..4
}

// Five steps from "no activity" to "full". Values live in theme/colors.ts
// so the heatmap respects brand tokens if the palette ever shifts.
const INTENSITY_BG = [
  colors.heat0,
  colors.heat1,
  colors.heat2,
  colors.heat3,
  colors.heat4,
];

export function HistoryScreen() {
  const { entries, streak } = useDay();
  const ordered = useMemo(
    () => Object.values(entries).sort((a, b) => (a.date < b.date ? 1 : -1)),
    [entries]
  );

  // Build last 35 days (5 weeks) as a grid to feel like a breath rhythm.
  const cells = useMemo(() => {
    const now = new Date();
    const arr: { key: string; intensity: number; date: Date }[] = [];
    for (let i = 34; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = todayKey(d);
      arr.push({ key, intensity: intensity(entries[key]), date: d });
    }
    return arr;
  }, [entries]);

  const completedDays = Object.values(entries).filter(
    (e) => e.msgDone || e.seeDone
  ).length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        <View style={styles.topRow}>
          <Text style={text.eyebrow}>History</Text>
          <PulsingMark size={56} />
        </View>
        <Text style={styles.title}>Your quiet progress</Text>
        <Text style={styles.body}>
          Every dot is a day you showed up. Softness compounds.
        </Text>

        <TourCard
          storageKey="history"
          title="Your quiet progress."
          tips={[
            'The grid holds the last five weeks, each cell deepens as you practice more on that day.',
            'A day counts when the ritual, an MSG, or an SEE is complete.',
            'Scroll below for day-by-day entries, a small gallery of your sewing.',
          ]}
        />

        <View style={styles.statsRow}>
          <Stat label="Streak" value={String(streak)} suffix="d" icon="flame" />
          <Stat
            label="Days active"
            value={String(completedDays)}
            icon="checkmark-done"
          />
          <Stat
            label="Entries"
            value={String(ordered.length)}
            icon="book-outline"
          />
        </View>

        <View style={styles.gridCard}>
          <Text style={styles.gridTitle}>Last 5 weeks</Text>
          <View style={styles.grid}>
            {cells.map((c) => (
              <View
                key={c.key}
                style={[
                  styles.cell,
                  { backgroundColor: INTENSITY_BG[c.intensity] },
                ]}
              />
            ))}
          </View>
          <View style={styles.legend}>
            <Text style={styles.legendText}>less</Text>
            <View style={styles.legendRow}>
              {INTENSITY_BG.map((c, i) => (
                <View
                  key={i}
                  style={[styles.legendCell, { backgroundColor: c }]}
                />
              ))}
            </View>
            <Text style={styles.legendText}>more</Text>
          </View>
        </View>

        <Text style={[text.eyebrow, { marginTop: 24, marginBottom: 12 }]}>
          Entries
        </Text>

        {ordered.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="leaf-outline" size={24} color={colors.inkFaint} />
            <Text style={styles.emptyText}>
              No entries yet. Complete a practice or a check-in to see your
              rhythm appear here.
            </Text>
          </View>
        ) : (
          ordered.map((e) => {
            const avg = sumScores(e);
            return (
              <View key={e.date} style={styles.row}>
                <View style={styles.rowTop}>
                  <Text style={styles.date}>{prettyDate(e.date)}</Text>
                  {avg != null ? (
                    <View style={styles.avgPill}>
                      <Text style={styles.avgPillText}>avg {avg}/10</Text>
                    </View>
                  ) : null}
                </View>
                <View style={styles.badges}>
                  <Badge on={e.msgDone} label="MSG" />
                  <Badge on={e.seeDone} label="SEE" />
                  <Badge on={!!e.beliefAcknowledged} label="Belief" />
                  <Badge on={!!e.tracker} label="Check-in" />
                </View>
                {e.tracker?.focusArea ? (
                  <Text style={styles.focus}>
                    Focus: <Text style={styles.focusStrong}>{e.tracker.focusArea}</Text>
                  </Text>
                ) : null}
              </View>
            );
          })
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({
  label,
  value,
  suffix,
  icon,
}: {
  label: string;
  value: string;
  suffix?: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={16} color={colors.clayDeep} />
      <View style={styles.statNumRow}>
        <Text style={styles.statValue}>{value}</Text>
        {suffix ? <Text style={styles.statSuffix}>{suffix}</Text> : null}
      </View>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Badge({ on, label }: { on: boolean; label: string }) {
  return (
    <View style={[styles.badge, on ? styles.badgeOn : styles.badgeOff]}>
      {on ? (
        <Ionicons
          name="checkmark"
          size={12}
          color={colors.done}
          style={{ marginRight: 4 }}
        />
      ) : null}
      <Text
        style={[
          styles.badgeText,
          { color: on ? colors.done : colors.inkFaint },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flexGrow: 1, padding: layout.screen, paddingBottom: 40 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { ...text.h1, marginTop: 8, marginBottom: 6 },
  body: { ...text.body, marginBottom: 20 },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
    ...shadows.sm,
  },
  statNumRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 6,
  },
  statValue: {
    fontFamily: fonts.serifBold,
    fontSize: 28,
    color: colors.ink,
  },
  statSuffix: {
    fontFamily: fonts.sansMed,
    fontSize: 13,
    color: colors.inkSoft,
    marginLeft: 2,
    marginBottom: 4,
  },
  statLabel: {
    ...text.caption,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  gridCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 18,
    ...shadows.sm,
  },
  gridTitle: {
    ...text.eyebrow,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  cell: {
    width: `${(100 - 6 * 6) / 7}%`,
    aspectRatio: 1,
    borderRadius: 6,
    minWidth: 14,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 14,
    gap: 6,
  },
  legendText: { ...text.caption },
  legendRow: { flexDirection: 'row', gap: 3 },
  legendCell: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  empty: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 24,
    alignItems: 'center',
    ...shadows.sm,
  },
  emptyText: {
    ...text.body,
    textAlign: 'center',
    marginTop: 10,
  },
  row: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 10,
    ...shadows.sm,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontFamily: fonts.serifBold,
    fontSize: 17,
    color: colors.ink,
  },
  avgPill: {
    backgroundColor: colors.clayWash,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  avgPillText: {
    fontFamily: fonts.sansSemi,
    fontSize: 12,
    color: colors.clayDeep,
  },
  badges: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: 6 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeOn: { backgroundColor: colors.doneSoft },
  badgeOff: { backgroundColor: colors.lineSoft },
  badgeText: { fontFamily: fonts.sansSemi, fontSize: 12 },
  focus: {
    ...text.caption,
    marginTop: 8,
  },
  focusStrong: {
    fontFamily: fonts.sansSemi,
    color: colors.ink,
    textTransform: 'capitalize',
  },
});
