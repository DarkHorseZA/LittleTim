/**
 * PatchworkQuilt — full interactive quilt page used in the
 * Journal tab → "Your Quilt" sub-tab.
 *
 * Self-contained: pulls QuiltEntry data from DayContext,
 * manages its own scroll, selection state, and gentle-note
 * dismissal via AsyncStorage.
 */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, layout, radius, shadows } from '../theme/colors';
import { fonts, text } from '../theme/type';
import { tap, pressScale, webFocus } from '../theme/interactions';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useDay } from '../store/DayContext';
import { todayKey } from '../store/storage';
import { QuiltEntry } from '../types';
import { CloseButton } from './CloseButton';
import { Button } from './Button';

// ─── Constants ────────────────────────────────────────────────────────────────

const QUILT_NOTE_KEY = 'littletim:quiltnote:v1';
const GAP = 8;
const CELL_RADIUS = 9;

// Today-ring: 1.5px cream gap + 2.5px clay border
const RING_GAP = 1.5;
const RING_WIDTH = 2.5;
const RING_OFFSET = RING_GAP + RING_WIDTH; // 4px beyond patch edge

const TODAY_RING_COLOR = colors.q4;

// Chip colours for the inline detail card
const CHIP_CFG: Record<QuiltEntry['type'], { label: string; bg: string; fg: string; prefix: string }> = {
  ritual:  { label: 'Five Gestures',   bg: colors.chipNeutralBg, fg: colors.chipNeutralFg, prefix: '✦' },
  msg:     { label: 'MSG',             bg: colors.chipNeutralBg, fg: colors.chipNeutralFg, prefix: '✦' },
  see:     { label: 'SEE',             bg: colors.chipNeutralBg, fg: colors.chipNeutralFg, prefix: '✦' },
  belief:  { label: 'Belief',          bg: colors.chipNeutralBg, fg: colors.chipNeutralFg, prefix: '✦' },
  journal: { label: 'Sewed with love', bg: colors.chipLoveBg,    fg: colors.chipLoveFg,    prefix: '♥' },
};

// Legend swatches: unsewn + 4 sewn levels
const LEGEND_SWATCHES = [
  { bg: colors.q0, dashed: true },
  { bg: colors.q1, dashed: false },
  { bg: colors.q2, dashed: false },
  { bg: colors.q3, dashed: false },
  { bg: colors.q4, dashed: false },
] as const;

// ─── Grid helpers ─────────────────────────────────────────────────────────────

/** Returns the Monday of the week containing `date`. */
function mondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

type CellData = {
  date: string;
  dayEntries: QuiltEntry[];
  isFuture: boolean;
};

export type PatchworkQuiltSize = 'compact' | 'full';

function buildCells(quiltEntries: QuiltEntry[], size: PatchworkQuiltSize = 'full'): CellData[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const todayStr = todayKey(now);

  // Compact: fixed 4-week window (7 × 4 = 28 days). Full: from earliest entry.
  let gridStart: Date;
  if (size === 'compact') {
    gridStart = new Date(mondayOfWeek(now));
    gridStart.setDate(gridStart.getDate() - 21); // 3 prior weeks + current = 4 weeks
  } else if (quiltEntries.length === 0) {
    gridStart = mondayOfWeek(now);
  } else {
    const earliest = quiltEntries.reduce((a, b) => (a.date < b.date ? a : b)).date;
    const [y, m, d] = earliest.split('-').map(Number);
    gridStart = mondayOfWeek(new Date(y, m - 1, d));
  }

  // Grid ends at Sunday of current week
  const curMonday = mondayOfWeek(now);
  const endDate = new Date(curMonday);
  endDate.setDate(endDate.getDate() + 6);

  // Group quilt entries by date
  const map: Record<string, QuiltEntry[]> = {};
  for (const e of quiltEntries) {
    if (!map[e.date]) map[e.date] = [];
    map[e.date].push(e);
  }

  const cells: CellData[] = [];
  const cursor = new Date(gridStart);
  while (cursor <= endDate) {
    const key = todayKey(cursor);
    cells.push({
      date: key,
      dayEntries: map[key] ?? [],
      isFuture: key > todayStr,
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return cells;
}

function patchBg(count: number): string {
  if (count === 0) return colors.q0;
  if (count === 1) return colors.q1;
  if (count === 2) return colors.q2;
  if (count === 3) return colors.q3;
  return colors.q4;
}

function formatDetailDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const weekday = date.toLocaleDateString(undefined, { weekday: 'long' });
  const month = date.toLocaleDateString(undefined, { month: 'long' });
  return `${weekday} ${d} ${month}`;
}

function thisWeekCount(quiltEntries: QuiltEntry[], now: Date): number {
  const monday = mondayOfWeek(now);
  const seen = new Set<string>();
  for (const e of quiltEntries) {
    const [y, m, d] = e.date.split('-').map(Number);
    if (new Date(y, m - 1, d) >= monday) seen.add(e.date);
  }
  return seen.size;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function GentleNote({ onDismiss }: { onDismiss: () => void }) {
  return (
    <View style={noteStyles.card}>
      <View style={noteStyles.topRow}>
        <View style={noteStyles.starCircle}>
          <Text style={noteStyles.starText}>✦</Text>
        </View>
        <Text style={noteStyles.overline}>A GENTLE NOTE</Text>
        <CloseButton onPress={onDismiss} variant="solid" accessibilityLabel="Dismiss note" />
      </View>

      <Text style={noteStyles.heading}>The squares were always there.</Text>
      <Text style={noteStyles.body}>
        In Chapter Nine, the patchwork is sewn from invisible squares. Here they become
        visible, one for each day. A patch fills the day you complete the ritual, an MSG,
        a SEE, or a journal stitch. The pale ones aren’t failures. They’re simply waiting.
      </Text>

      <View style={noteStyles.footer}>
        <Button title="Got it" variant="soft" onPress={onDismiss} />
      </View>
    </View>
  );
}

const noteStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.noteBg,
    borderRadius: radius.lg,
    padding: 18,
    marginBottom: 20,
    ...shadows.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  starCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.noteStar,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  starText: {
    color: colors.clay,
    fontSize: 14,
  },
  overline: {
    flex: 1,
    fontFamily: fonts.sansBold,
    fontSize: 10,
    letterSpacing: 2,
    color: colors.inkFaint,
  },
  heading: {
    fontFamily: fonts.serifBold,
    fontSize: 18,
    lineHeight: 24,
    color: colors.ink,
    marginBottom: 8,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    color: colors.inkSoft,
    marginBottom: 14,
  },
  footer: {
    alignItems: 'flex-end',
  },
});

function StatCard({
  icon,
  value,
  suffix,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  suffix?: string;
  label: string;
}) {
  return (
    <View style={statStyles.card}>
      <Ionicons name={icon} size={16} color={colors.clay} style={statStyles.icon} />
      <View style={statStyles.valueRow}>
        <Text style={statStyles.value}>{value}</Text>
        {suffix ? <Text style={statStyles.suffix}>{suffix}</Text> : null}
      </View>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 14,
    ...shadows.sm,
  },
  icon: {
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  value: {
    fontFamily: fonts.serifBold,
    fontSize: 30,
    lineHeight: 34,
    color: colors.ink,
  },
  suffix: {
    fontFamily: fonts.sansMed,
    fontSize: 14,
    color: colors.inkFaint,
    marginBottom: 4,
    marginLeft: 1,
  },
  label: {
    ...text.caption,
    color: colors.inkFaint,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

function DetailCard({
  selectedDate,
  entries,
  today,
}: {
  selectedDate: string;
  entries: QuiltEntry[];
  today: string;
}) {
  const isToday = selectedDate === today;
  const count = entries.length;
  const isSewn = count > 0;

  return (
    <View style={detailStyles.card}>
      <Text style={detailStyles.date}>
        {formatDetailDate(selectedDate)}
        {isToday ? (
          <Text style={detailStyles.todaySuffix}>{' · today'}</Text>
        ) : null}
      </Text>

      {isSewn ? (
        <>
          <Text style={detailStyles.subtitle}>
            {count} {count === 1 ? 'stitch' : 'stitches'} this day
          </Text>
          <View style={detailStyles.chips}>
            {entries.map((e, i) => {
              const cfg = CHIP_CFG[e.type];
              return (
                <View key={i} style={[detailStyles.chip, { backgroundColor: cfg.bg }]}>
                  <Text style={[detailStyles.chipText, { color: cfg.fg }]}>
                    {cfg.prefix} {cfg.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </>
      ) : (
        <>
          <Text style={detailStyles.subtitle}>a patch still waiting</Text>
          <View style={detailStyles.unsewnChip}>
            <Text style={detailStyles.unsewnChipText}>
              unsewn, and that’s alright
            </Text>
          </View>
          <Text style={detailStyles.unsewnBody}>
            No stitch here yet. You are not failing, the power is in the now, not the perfect.
          </Text>
        </>
      )}
    </View>
  );
}

const detailStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 18,
    marginTop: 16,
    ...shadows.sm,
  },
  date: {
    fontFamily: fonts.serifBold,
    fontSize: 21,
    lineHeight: 27,
    color: colors.ink,
    marginBottom: 4,
  },
  todaySuffix: {
    fontFamily: fonts.serif,
    fontSize: 17,
    color: colors.clay,
  },
  subtitle: {
    ...text.caption,
    color: colors.inkFaint,
    marginBottom: 12,
    fontSize: 13,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },
  chipText: {
    fontFamily: fonts.sansSemi,
    fontSize: 13,
    letterSpacing: 0.2,
  },
  unsewnChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    borderWidth: 1.2,
    borderStyle: 'dashed',
    borderColor: colors.thread,
    marginBottom: 10,
  },
  unsewnChipText: {
    fontFamily: fonts.sansMed,
    fontSize: 13,
    color: colors.inkSoft,
  },
  unsewnBody: {
    ...text.body,
    fontSize: 14,
    lineHeight: 20,
  },
});

// ─── Main component ───────────────────────────────────────────────────────────

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function PatchworkQuilt({ size = 'full' }: { size?: PatchworkQuiltSize }) {
  const isCompact = size === 'compact';
  const { quiltEntries } = useDay();
  const { width: windowWidth } = useWindowDimensions();
  const reducedMotion = useReducedMotion();

  const now = useMemo(() => new Date(), []);
  const today = todayKey(now);

  // Gentle note
  const [noteVisible, setNoteVisible] = useState(false);
  useEffect(() => {
    AsyncStorage.getItem(QUILT_NOTE_KEY).then((val) => {
      if (!val) setNoteVisible(true);
    });
  }, []);
  const dismissNote = useCallback(async () => {
    await AsyncStorage.setItem(QUILT_NOTE_KEY, 'dismissed');
    setNoteVisible(false);
  }, []);

  // Selected patch (defaults to today)
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const selectedEntries = useMemo(
    () => quiltEntries.filter((e) => e.date === selectedDate),
    [quiltEntries, selectedDate]
  );

  // Stats
  const patches = useMemo(
    () => new Set(quiltEntries.map((e) => e.date)).size,
    [quiltEntries]
  );
  const stitches = quiltEntries.length;
  const weekDays = useMemo(() => thisWeekCount(quiltEntries, now), [quiltEntries, now]);

  // Grid cells
  const cells = useMemo(() => buildCells(quiltEntries, size), [quiltEntries, size]);

  // Content width measurement (screen padding 20×2 = 40)
  const [contentWidth, setContentWidth] = useState(
    Math.min(windowWidth, layout.contentMaxWidth) - 40
  );
  const cellSize = Math.floor((contentWidth - 6 * GAP) / 7);

  // ── Entrance animation ──────────────────────────────────────────────────────
  // Single Animated.Value goes from 0 → totalMs at a linear rate.
  // Each cell uses interpolate with its own [start, end] window.
  const totalMs = useMemo(
    () => Math.max(40 + (cells.length - 1) * 16 + 300, 300),
    [cells.length]
  );
  const mountAnim = useRef(new Animated.Value(reducedMotion ? totalMs : 0)).current;
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current || reducedMotion) {
      mountAnim.setValue(totalMs);
      return;
    }
    hasAnimated.current = true;
    Animated.timing(mountAnim, {
      toValue: totalMs,
      duration: totalMs,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cell interpolations — memoised so they don't regenerate on every render
  const cellAnims = useMemo(() => {
    return cells.map((_, i) => {
      const start = 40 + i * 16;
      const end = start + 300;
      return {
        opacity: mountAnim.interpolate({
          inputRange: [Math.max(0, start - 1), start, end],
          outputRange: [0, 0, 1],
          extrapolate: 'clamp',
        }),
        scale: mountAnim.interpolate({
          inputRange: [Math.max(0, start - 1), start, end],
          outputRange: [0.4, 0.4, 1],
          extrapolate: 'clamp',
        }),
      };
    });
  // Only recompute if cell count changes — value changes don't need new interpolations
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cells.length, mountAnim]);

  // ── Pop animation (new stitch added today) ──────────────────────────────────
  const todayCount = useMemo(
    () => quiltEntries.filter((e) => e.date === today).length,
    [quiltEntries, today]
  );
  const popAnim = useRef(new Animated.Value(1)).current;
  const prevTodayCount = useRef(todayCount);

  useEffect(() => {
    const prev = prevTodayCount.current;
    prevTodayCount.current = todayCount;
    if (prev < todayCount && todayCount > 0 && !reducedMotion) {
      Animated.sequence([
        Animated.timing(popAnim, { toValue: 0.5, duration: 0, useNativeDriver: true }),
        Animated.timing(popAnim, { toValue: 1.15, duration: 200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(popAnim, { toValue: 1.0, duration: 200, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ]).start();
    }
  }, [todayCount, popAnim, reducedMotion]);

  // ── Selection lift animation ────────────────────────────────────────────────
  // Single shared value: only the currently selected cell applies it,
  // so there is no per-cell allocation overhead.
  const selScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reducedMotion) {
      selScale.setValue(1);
      return;
    }
    selScale.setValue(1); // reset before the new patch animates in
    Animated.timing(selScale, {
      toValue: 1.12,
      duration: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [selectedDate, selScale, reducedMotion]);

  const handlePatchPress = useCallback((date: string) => {
    tap();
    setSelectedDate(date);
  }, []);

  // Shared grid + detail content — rendered in both compact and full modes.
  const sharedContent = (
    <>
      {/* Gentle note — full mode only */}
      {!isCompact && noteVisible && <GentleNote onDismiss={dismissNote} />}

      {/* Stats row — both modes */}
      <View style={styles.statsRow}>
        <StatCard icon="grid" value={String(patches)} label="Patches sewn" />
        <StatCard icon="sparkles" value={String(stitches)} label="Stitches" />
        <StatCard
          icon="time-outline"
          value={String(weekDays)}
          suffix=" / 7"
          label="This week"
        />
      </View>

      {/* Section header — full mode only (compact uses HomeScreen's header) */}
      {!isCompact && (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionOverline}>YOUR PATCHWORK QUILT</Text>
          <Text style={styles.sectionSub}>each patch is a day</Text>
        </View>
      )}

      {/* Quilt grid */}
      <View
        onLayout={(e) => setContentWidth(e.nativeEvent.layout.width)}
        style={styles.quiltWrap}
      >
        {/* Day labels Mon → Sun */}
        <View style={styles.dayLabelRow}>
          {DAY_LABELS.map((lbl, i) => (
            <Text
              key={i}
              style={[styles.dayLabel, { width: cellSize, marginRight: i < 6 ? GAP : 0 }]}
            >
              {lbl}
            </Text>
          ))}
        </View>

        {/* Patches */}
        <View style={styles.grid}>
          {cells.map((cell, i) => {
            const count = cell.dayEntries.length;
            const sewn = count > 0;
            const isToday = cell.date === today;
            const isSelected = cell.date === selectedDate;
            // Ring is today-only — selected state is shown via lift (scale + shadow)
            const showRing = isToday;
            const anim = cellAnims[i] ?? { opacity: new Animated.Value(1), scale: new Animated.Value(1) };

            // Invisible spacer for future dates
            if (cell.isFuture) {
              return (
                <View
                  key={cell.date}
                  style={{ width: cellSize, height: cellSize, opacity: 0 }}
                />
              );
            }

            const patchView = (
              <View
                style={[
                  {
                    width: cellSize,
                    height: cellSize,
                    borderRadius: CELL_RADIUS,
                    backgroundColor: patchBg(count),
                    overflow: 'hidden',
                    // Border: dashed thread for unsewn, solid for sewn
                    borderWidth: !sewn ? 1.5 : 1,
                    borderStyle: !sewn ? ('dashed' as const) : ('solid' as const),
                    borderColor: !sewn
                      ? colors.thread
                      : count >= 3
                      ? colors.patchEdgeRich
                      : colors.patchEdge,
                  },
                ]}
              >
                {/* Inner stitch border (level 2+) */}
                {sewn && count >= 2 && (
                  <View
                    style={[
                      styles.innerStitch,
                      {
                        borderColor: colors.patchStitch,
                        borderRadius: 5,
                        borderWidth: 1.4,
                      },
                    ]}
                  />
                )}

                {/* Fabric sheen — top-left radial approximation */}
                <LinearGradient
                  colors={[colors.sheen, 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[StyleSheet.absoluteFill, { opacity: 0.55, borderRadius: CELL_RADIUS }]}
                  pointerEvents="none"
                />
              </View>
            );

            const ring = showRing ? (
              <View
                pointerEvents="none"
                style={[
                  styles.ringOuter,
                  {
                    top: -RING_OFFSET,
                    left: -RING_OFFSET,
                    right: -RING_OFFSET,
                    bottom: -RING_OFFSET,
                    borderRadius: CELL_RADIUS + RING_OFFSET,
                    borderWidth: RING_WIDTH,
                    borderColor: TODAY_RING_COLOR,
                  },
                ]}
              />
            ) : null;

            // For today, wrap in pop animation; for all cells, wrap in entrance animation
            const innerContent = (
              <View style={{ width: cellSize, height: cellSize }}>
                {ring}
                {isToday ? (
                  <Animated.View style={{ transform: [{ scale: popAnim }] }}>
                    {patchView}
                  </Animated.View>
                ) : (
                  patchView
                )}
              </View>
            );

            const pressable = (
              <Pressable
                onPress={() => handlePatchPress(cell.date)}
                style={({ pressed }: any) => [
                  pressed && { transform: [{ scale: 0.9 }] },
                ]}
                accessibilityRole="button"
                accessibilityLabel={
                  sewn
                    ? `${formatDetailDate(cell.date)}: ${count} stitch${count !== 1 ? 'es' : ''}`
                    : `${formatDetailDate(cell.date)}: unsewn`
                }
              >
                {innerContent}
              </Pressable>
            );

            return (
              <Animated.View
                key={cell.date}
                style={{
                  opacity: anim.opacity,
                  transform: [{ scale: anim.scale }],
                }}
              >
                {isSelected ? (
                  // Lift effect: scale up + elevation shadow. Shadow is applied
                  // statically (not animated) — compatible with useNativeDriver.
                  <Animated.View
                    style={[shadows.md, { transform: [{ scale: selScale }] }]}
                  >
                    {pressable}
                  </Animated.View>
                ) : (
                  pressable
                )}
              </Animated.View>
            );
          })}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendEdge}>waiting</Text>
          <View style={styles.legendSwatches}>
            {LEGEND_SWATCHES.map((s, i) => (
              <View
                key={i}
                style={[
                  styles.legendSwatch,
                  { backgroundColor: s.bg },
                  s.dashed && styles.legendSwatchDashed,
                ]}
              />
            ))}
          </View>
          <Text style={styles.legendEdge}>richly sewn</Text>
        </View>
      </View>

      {/* Selected patch detail card */}
      <DetailCard
        selectedDate={selectedDate}
        entries={selectedEntries}
        today={today}
      />

      {/* Chapter 9 note — full mode only */}
      {!isCompact && (
        <Text style={styles.chapterNote}>
          {'\u201c'}The quilt is sewn from invisible squares, now made visible, one per day.{'\u201d'} (Chapter 9)
        </Text>
      )}

      {!isCompact && <View style={{ height: 40 }} />}
    </>
  );

  // Compact: plain View so it embeds in HomeScreen's ScrollView without nesting.
  // Full: owns its own ScrollView (fills the Journal → Your Quilt tab).
  if (isCompact) {
    return <View>{sharedContent}</View>;
  }
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {sharedContent}
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    padding: layout.screen,
    paddingTop: 12,
    paddingBottom: 40,
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionOverline: {
    fontFamily: fonts.sansBold,
    fontSize: 10,
    letterSpacing: 2.2,
    color: colors.inkFaint,
    textTransform: 'uppercase',
  },
  sectionSub: {
    fontFamily: fonts.serifItalic,
    fontSize: 13,
    color: colors.inkFaint,
  },
  quiltWrap: {
    // overflow must be visible so the today/selection rings bleed outside cells
  },
  dayLabelRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayLabel: {
    fontFamily: fonts.sansMed,
    fontSize: 10,
    color: colors.inkFaint,
    textAlign: 'center',
    letterSpacing: 0.6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  innerStitch: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    borderStyle: 'dashed',
  },
  ringOuter: {
    position: 'absolute',
    borderStyle: 'solid',
    zIndex: 2,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 14,
    gap: 6,
  },
  legendEdge: {
    ...text.caption,
    fontSize: 11,
    color: colors.inkFaint,
  },
  legendSwatches: {
    flexDirection: 'row',
    gap: 4,
  },
  legendSwatch: {
    width: 13,
    height: 13,
    borderRadius: 4,
  },
  legendSwatchDashed: {
    backgroundColor: colors.q0,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.thread,
  },
  chapterNote: {
    ...text.caption,
    fontFamily: fonts.serifItalic,
    fontStyle: Platform.OS === 'web' ? 'italic' : undefined,
    color: colors.inkFaint,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 18,
    paddingHorizontal: 8,
  },
});
