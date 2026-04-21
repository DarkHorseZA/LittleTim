import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { Card } from '../components/Card';
import { SectionHeader } from '../components/SectionHeader';
import { useDay } from '../store/DayContext';
import { DailyEntry } from '../types';

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

export function HistoryScreen() {
  const { entries, streak } = useDay();
  const ordered = useMemo(() => {
    return Object.values(entries).sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [entries]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <SectionHeader
          eyebrow="History"
          title="Your quiet progress"
          subtitle={`Current streak: ${streak} ${streak === 1 ? 'day' : 'days'}.`}
        />

        {ordered.length === 0 ? (
          <Card>
            <Text style={styles.empty}>
              No entries yet. Complete a practice or a check-in to see your
              rhythm appear here.
            </Text>
          </Card>
        ) : (
          ordered.map((e) => {
            const avg = sumScores(e);
            return (
              <Card key={e.date} style={styles.row}>
                <View style={styles.rowTop}>
                  <Text style={styles.date}>{prettyDate(e.date)}</Text>
                  {avg != null ? (
                    <Text style={styles.avg}>avg {avg}/10</Text>
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
                    Focus: {e.tracker.focusArea}
                  </Text>
                ) : null}
              </Card>
            );
          })
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Badge({ on, label }: { on: boolean; label: string }) {
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: on ? colors.sageSoft : colors.line },
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          { color: on ? '#4F7A4E' : colors.inkFaint },
        ]}
      >
        {on ? '✓ ' : ''}
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 20, paddingBottom: 40 },
  empty: { color: colors.inkSoft, lineHeight: 22 },
  row: { marginBottom: 10 },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: { fontSize: 16, fontWeight: '700', color: colors.ink },
  avg: { fontSize: 13, color: colors.accent, fontWeight: '700' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  badgeText: { fontSize: 12, fontWeight: '700' },
  focus: {
    marginTop: 6,
    color: colors.inkSoft,
    fontSize: 13,
    textTransform: 'capitalize',
  },
});
