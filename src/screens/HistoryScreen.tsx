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
import { QuiltPreview } from '../components/QuiltPreview';

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

export function HistoryContent() {
  const { entries, quiltEntries } = useDay();
  const ordered = useMemo(
    () => Object.values(entries).sort((a, b) => (a.date < b.date ? 1 : -1)),
    [entries]
  );

  const patchesSewn = useMemo(
    () => new Set(quiltEntries.map((e) => e.date)).size,
    [quiltEntries]
  );
  const stitchesTotal = quiltEntries.length;

  return (
    <SafeAreaView style={styles.safe} edges={[]}>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        <Text style={styles.title}>Your quiet progress</Text>
        <Text style={styles.body}>
          Every patch is a day you showed up. Softness compounds.
        </Text>

        <TourCard
          storageKey="history"
          title="Your quiet progress."
          tips={[
            'The quilt holds every day you showed up, each patch deepens as you stitch more.',
            'Tap any sewn patch to see which stitches you added that day.',
            'Scroll below for day-by-day entries, a small gallery of your sewing.',
          ]}
        />

        <View style={styles.statsRow}>
          <Stat label="Patches sewn" value={String(patchesSewn)} icon="grid-outline" />
          <Stat label="Stitches" value={String(stitchesTotal)} icon="heart-outline" />
        </View>

        {/* Quilt section */}
        <View style={{ marginTop: 8, marginBottom: 4 }}>
          <Text style={styles.quiltTitle}>Your Patchwork Quilt</Text>
          <Text style={styles.quiltSubtitle}>
            Each square a stitch. Every stitch a day you showed up.
          </Text>
        </View>

        <View style={styles.quiltCard}>
          <QuiltPreview entries={quiltEntries} size="full" />
        </View>

        <Text style={[text.eyebrow, { marginTop: 28, marginBottom: 12 }]}>
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
  icon,
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={16} color={colors.clayDeep} />
      <View style={styles.statNumRow}>
        <Text style={styles.statValue}>{value}</Text>
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
  statLabel: {
    ...text.caption,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  quiltTitle: {
    ...text.h2,
    marginBottom: 4,
  },
  quiltSubtitle: {
    fontFamily: fonts.serifItalic,
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkSoft,
    marginBottom: 14,
  },
  quiltCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 18,
    ...shadows.sm,
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
