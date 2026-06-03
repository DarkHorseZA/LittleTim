/**
 * QuiltPreview — compact heat-map grid used in the Today screen hero card.
 * Accepts entries as props and renders a small 4-week (or full) patch grid.
 *
 * The full, interactive quilt lives in PatchworkQuilt.tsx (Journal tab).
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
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, layout, radius, shadows } from '../theme/colors';
import { fonts, text } from '../theme/type';
import { nav, pressScale, webFocus } from '../theme/interactions';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { QuiltEntry } from '../types';
import { todayKey } from '../store/storage';
import { CloseButton } from './CloseButton';

const PATCH_TONES = ['#E8C4A0', '#D4956A', '#C07040', colors.clay] as const;
const CLAY_DEEP_30 = 'rgba(142,63,31,0.30)';

function patchColor(count: number): string {
  if (count === 0) return colors.bgDeep;
  return PATCH_TONES[Math.min(count - 1, 3)];
}

const CHIP: Record<QuiltEntry['type'], { label: string; bg: string; fg: string }> = {
  ritual:  { label: 'Five Gestures',   bg: colors.clay,      fg: colors.white },
  msg:     { label: 'MSG',             bg: colors.health,    fg: colors.white },
  see:     { label: 'SEE',             bg: colors.happiness, fg: colors.ink   },
  belief:  { label: 'Belief',          bg: colors.loved,     fg: colors.white },
  journal: { label: 'Sewed with love', bg: colors.done,      fg: colors.white },
};

function weekStart(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

type CellData = { date: string; dayEntries: QuiltEntry[]; isFuture: boolean };

function buildCells(entries: QuiltEntry[], size: 'compact' | 'full'): CellData[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const todayStr = todayKey(now);
  const curWeekStart = weekStart(now);

  let gridStart: Date;
  if (size === 'compact') {
    gridStart = new Date(curWeekStart);
    gridStart.setDate(gridStart.getDate() - 21);
  } else {
    if (entries.length === 0) {
      gridStart = new Date(curWeekStart);
    } else {
      const earliest = entries.reduce((a, b) => (a.date < b.date ? a : b)).date;
      const [y, m, d] = earliest.split('-').map(Number);
      gridStart = weekStart(new Date(y, m - 1, d));
    }
  }

  const endDate = new Date(curWeekStart);
  endDate.setDate(endDate.getDate() + 6);

  const map: Record<string, QuiltEntry[]> = {};
  for (const e of entries) {
    if (!map[e.date]) map[e.date] = [];
    map[e.date].push(e);
  }

  const cells: CellData[] = [];
  const cursor = new Date(gridStart);
  while (cursor <= endDate) {
    const key = todayKey(cursor);
    cells.push({ date: key, dayEntries: map[key] ?? [], isFuture: key > todayStr });
    cursor.setDate(cursor.getDate() + 1);
  }
  return cells;
}

function prettyDayDetail(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'long', day: 'numeric', month: 'long',
  });
}

export type QuiltPreviewProps = {
  entries: QuiltEntry[];
  size: 'compact' | 'full';
  onDayPress?: (date: string, entries: QuiltEntry[]) => void;
};

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function QuiltPreview({ entries, size, onDayPress }: QuiltPreviewProps) {
  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const today = todayKey();

  const [contentWidth, setContentWidth] = useState(
    Math.min(windowWidth, layout.maxWidth) - 76
  );
  const [modalDate, setModalDate] = useState<string | null>(null);
  const modalEntries = useMemo(
    () => (modalDate ? entries.filter((e) => e.date === modalDate) : []),
    [modalDate, entries]
  );
  const [showUnsewnNote, setShowUnsewnNote] = useState(false);
  const unsewnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const todayCount = useMemo(
    () => entries.filter((e) => e.date === today).length,
    [entries, today]
  );
  const patchAnim = useRef(new Animated.Value(todayCount > 0 ? 1 : 0)).current;
  const prevTodayCount = useRef(todayCount);

  useEffect(() => {
    const prev = prevTodayCount.current;
    prevTodayCount.current = todayCount;
    if (prev === 0 && todayCount > 0) {
      if (reducedMotion) { patchAnim.setValue(1); return; }
      patchAnim.setValue(0);
      Animated.timing(patchAnim, {
        toValue: 1, duration: 400,
        easing: Easing.out(Easing.quad), useNativeDriver: true,
      }).start();
    }
  }, [todayCount, patchAnim, reducedMotion]);

  const cells = useMemo(() => buildCells(entries, size), [entries, size]);
  const cellSize = Math.floor((contentWidth - 6 * 3) / 7);

  const handlePress = useCallback(
    (date: string, dayEntries: QuiltEntry[]) => {
      if (dayEntries.length > 0) {
        nav();
        setShowUnsewnNote(false);
        if (unsewnTimer.current) clearTimeout(unsewnTimer.current);
        setModalDate(date);
        onDayPress?.(date, dayEntries);
      } else {
        nav();
        setModalDate(null);
        setShowUnsewnNote(true);
        if (unsewnTimer.current) clearTimeout(unsewnTimer.current);
        unsewnTimer.current = setTimeout(() => setShowUnsewnNote(false), 3000);
      }
    },
    [onDayPress]
  );

  const patchScale = patchAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });
  const isTodayNewlySewn = todayCount > 0;

  return (
    <View>
      <View style={[styles.dayLabelRow, { paddingHorizontal: 0 }]}>
        {DAY_LABELS.map((label, i) => (
          <Text key={i} style={[styles.dayLabel, { width: cellSize, marginRight: i < 6 ? 3 : 0 }]}>
            {label}
          </Text>
        ))}
      </View>

      <View onLayout={(e) => setContentWidth(e.nativeEvent.layout.width)} style={styles.grid}>
        {cells.map((cell) => {
          const count = cell.dayEntries.length;
          const sewn = count > 0;
          const isToday = cell.date === today;
          const animateThisCell = isToday && isTodayNewlySewn;

          const patch = (
            <View style={[
              styles.cell,
              {
                width: cellSize, height: cellSize, borderRadius: radius.sm,
                backgroundColor: cell.isFuture ? 'transparent' : patchColor(count),
                borderWidth: !sewn && !cell.isFuture ? 1 : 0,
                borderStyle: !sewn && !cell.isFuture ? ('dashed' as const) : undefined,
                borderColor: !sewn && !cell.isFuture ? colors.inkFaint : undefined,
              },
            ]}>
              {sewn && count >= 3 && (
                <View style={[styles.innerStitch, { borderRadius: Math.max(radius.sm - 2, 2), borderColor: CLAY_DEEP_30 }]} />
              )}
            </View>
          );

          if (cell.isFuture) return <View key={cell.date} style={{ width: cellSize, height: cellSize }} />;

          const pressable = (
            <Pressable
              onPress={() => handlePress(cell.date, cell.dayEntries)}
              style={({ pressed, focused }: any) => [pressed && pressScale, focused && webFocus]}
              accessibilityRole="button"
              accessibilityLabel={sewn
                ? `${prettyDayDetail(cell.date)}: ${count} stitch${count !== 1 ? 'es' : ''} sewn`
                : `${prettyDayDetail(cell.date)}: unsewn`}
            >
              {patch}
            </Pressable>
          );

          if (animateThisCell) {
            return (
              <Animated.View key={cell.date} style={{ opacity: patchAnim, transform: [{ scale: patchScale }] }}>
                {pressable}
              </Animated.View>
            );
          }
          return <View key={cell.date}>{pressable}</View>;
        })}
      </View>

      {showUnsewnNote && (
        <View style={styles.unsewnNote}>
          <Text style={styles.unsewnText}>
            {'“'}Unsewn, and that’s alright. The power is in the now, not the perfect.{'”'}
          </Text>
        </View>
      )}

      <View style={styles.legend}>
        <Text style={styles.legendEdge}>waiting</Text>
        <View style={styles.legendSwatches}>
          {PATCH_TONES.map((c, i) => (
            <View key={i} style={[styles.legendSwatch, { backgroundColor: c }]} />
          ))}
        </View>
        <Text style={styles.legendEdge}>richly sewn</Text>
      </View>

      {size === 'full' && (
        <Text style={styles.chapterNote}>
          {'“'}The quilt is sewn from invisible squares, now made visible, one per day. (Chapter 9){'”'}
        </Text>
      )}

      <Modal visible={modalDate !== null} transparent animationType="slide" onRequestClose={() => setModalDate(null)}>
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setModalDate(null)} accessibilityLabel="Close" accessibilityRole="button" />
          <View style={[styles.modalSheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalDate}>{modalDate ? prettyDayDetail(modalDate) : ''}</Text>
                <Text style={styles.modalSubhead}>Stitches sewn that day</Text>
              </View>
              <CloseButton onPress={() => setModalDate(null)} variant="solid" accessibilityLabel="Close" />
            </View>
            <View style={styles.chips}>
              {modalEntries.map((e, i) => {
                const cfg = CHIP[e.type];
                return (
                  <View key={i} style={[styles.chip, { backgroundColor: cfg.bg }]}>
                    <Text style={[styles.chipText, { color: cfg.fg }]}>{cfg.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  dayLabelRow: { flexDirection: 'row', marginBottom: 6 },
  dayLabel: { fontFamily: fonts.sansMed, fontSize: 10, color: colors.inkFaint, textAlign: 'center', letterSpacing: 0.8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 3 },
  cell: { overflow: 'hidden' },
  innerStitch: { position: 'absolute', top: 2, left: 2, right: 2, bottom: 2, borderWidth: 1 },
  unsewnNote: { marginTop: 12, paddingHorizontal: 4 },
  unsewnText: { fontFamily: fonts.serifItalic, fontSize: 13, lineHeight: 19, color: colors.inkSoft },
  legend: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 14, gap: 8 },
  legendEdge: { ...text.caption, fontSize: 11, color: colors.inkFaint },
  legendSwatches: { flexDirection: 'row', gap: 3 },
  legendSwatch: { width: 14, height: 14, borderRadius: 3 },
  chapterNote: {
    ...text.caption, color: colors.inkFaint,
    fontStyle: Platform.OS === 'web' ? 'italic' : undefined,
    fontFamily: fonts.serifItalic, marginTop: 14, lineHeight: 18,
  },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.overlay },
  modalSheet: { backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, paddingTop: 24, paddingHorizontal: 24, ...shadows.lg },
  modalHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  modalDate: { fontFamily: fonts.serifBold, fontSize: 22, color: colors.ink, lineHeight: 28 },
  modalSubhead: { ...text.caption, marginTop: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill },
  chipText: { fontFamily: fonts.sansSemi, fontSize: 13, letterSpacing: 0.2 },
});
