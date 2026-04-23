import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radius, shadows } from '../theme/colors';
import { fonts, text } from '../theme/type';
import { Button } from '../components/Button';
import { PulsingMark } from '../components/PulsingMark';
import { ScoreSlider } from '../components/ScoreSlider';
import { focusAreaOrder, focusAreas } from '../data/focusAreas';
import { FocusArea, TrackerScores } from '../types';
import { useDay } from '../store/DayContext';
import { todayKey } from '../store/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Tracker'>;

const defaultScores: TrackerScores = {
  happiness: 5,
  loved: 5,
  health: 5,
  wealth: 5,
  relationships: 5,
};

type Step = 'scores' | 'chooseArea' | 'doneToday';

const tintFor = (area: FocusArea) => colors[area];
const tintSoftFor = (area: FocusArea) =>
  colors[(area + 'Soft') as keyof typeof colors] as string;

export function TrackerScreen({ navigation }: Props) {
  const { today, settings, updateToday, updateSettings } = useDay();
  const today3 = todayKey();
  const alreadyDoneToday =
    settings.lastCheckInDate === today3 && !!today.tracker?.scores;

  const [step, setStep] = useState<Step>(
    alreadyDoneToday ? 'doneToday' : 'scores'
  );
  const [scores, setScores] = useState<TrackerScores>(
    today.tracker?.scores ?? defaultScores
  );

  const setScore = (area: FocusArea, v: number) =>
    setScores((s) => ({ ...s, [area]: v }));

  const next = async () => {
    const completedAt = new Date().toISOString();
    await updateToday({
      tracker: {
        scores,
        focusArea: today.tracker?.focusArea,
        reflection: today.tracker?.reflection,
        completedAt,
      },
    });

    const patch: Parameters<typeof updateSettings>[0] = {
      lastCheckInDate: today3,
    };
    if (!settings.baseline) {
      patch.baseline = { scores, capturedOn: today3 };
    }
    await updateSettings(patch);

    setStep('chooseArea');
  };

  const chooseArea = async (area: FocusArea) => {
    await updateToday({
      tracker: {
        scores,
        focusArea: area,
        reflection: today.tracker?.reflection,
        completedAt: today.tracker?.completedAt ?? new Date().toISOString(),
      },
    });
    navigation.replace('FocusArea', { focusArea: area });
  };

  const deltas = useMemo(() => {
    if (!settings.baseline) return null;
    const base = settings.baseline.scores;
    const current = today.tracker?.scores ?? scores;
    return focusAreaOrder.map((area) => ({
      area,
      delta: current[area] - base[area],
      current: current[area],
      base: base[area],
    }));
  }, [settings.baseline, today.tracker?.scores, scores]);

  if (step === 'doneToday') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.topRow}>
          <Pressable
            hitSlop={16}
            onPress={() => navigation.goBack()}
            style={styles.closeBtn}
            accessibilityRole="button"
            accessibilityLabel="Close check-in"
          >
            <Ionicons name="close" size={22} color={colors.ink} />
          </Pressable>
        </View>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
          <View style={styles.headerRow}>
            <Text style={text.eyebrow}>Today's check-in</Text>
            <PulsingMark size={26} />
          </View>
          <Text style={styles.title}>You've checked in today</Text>
          <Text style={styles.body}>
            One reading per day is enough. Come back tomorrow, the thread
            moves slowly.
          </Text>

          {deltas ? (
            <View style={styles.card}>
              <View style={styles.cardHead}>
                <Ionicons
                  name="pulse-outline"
                  size={16}
                  color={colors.clayDeep}
                />
                <Text style={styles.cardTitle}>Since your baseline</Text>
              </View>
              <Text style={styles.baselineMeta}>
                Baseline captured {settings.baseline?.capturedOn}
              </Text>

              <View style={{ height: 8 }} />

              {deltas.map(({ area, delta, current, base }) => {
                const fa = focusAreas[area];
                const sign = delta > 0 ? '+' : '';
                const deltaColor =
                  delta > 0
                    ? colors.done
                    : delta < 0
                    ? colors.danger
                    : colors.inkFaint;
                return (
                  <View key={area} style={styles.deltaRow}>
                    <Text style={styles.deltaEmoji}>{fa.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.deltaLabel}>{fa.label}</Text>
                      <Text style={styles.deltaNums}>
                        {base}/10  →  {current}/10
                      </Text>
                    </View>
                    <Text style={[styles.deltaValue, { color: deltaColor }]}>
                      {sign}
                      {delta}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : null}

          <View style={{ height: 16 }} />
          <Button
            title="Pick a focus area"
            icon="compass-outline"
            onPress={() => setStep('chooseArea')}
          />
          <View style={{ height: 10 }} />
          <Button
            title="Close"
            variant="ghost"
            onPress={() => navigation.goBack()}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (step === 'scores') {
    const isBaseline = !settings.baseline;
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.topRow}>
          <Pressable
            hitSlop={16}
            onPress={() => navigation.goBack()}
            style={styles.closeBtn}
            accessibilityRole="button"
            accessibilityLabel="Close check-in"
          >
            <Ionicons name="close" size={22} color={colors.ink} />
          </Pressable>
        </View>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
          <View style={styles.headerRow}>
            <Text style={text.eyebrow}>
              {isBaseline ? 'Baseline check-in' : 'Today\u2019s check-in'}
            </Text>
            <PulsingMark size={26} />
          </View>
          <Text style={styles.title}>
            {isBaseline
              ? 'Where are you starting from?'
              : 'Rate where you are today'}
          </Text>
          <Text style={styles.body}>
            {isBaseline
              ? 'This first reading becomes your baseline. Every future check-in is measured against it.'
              : 'No need to think hard. First number, gently. Once a day is enough.'}
          </Text>

          <View style={styles.card}>
            {focusAreaOrder.map((area) => {
              const fa = focusAreas[area];
              return (
                <ScoreSlider
                  key={area}
                  label={fa.label}
                  emoji={fa.emoji}
                  value={scores[area]}
                  onChange={(v) => setScore(area, v)}
                  tint={tintFor(area)}
                  tintSoft={tintSoftFor(area)}
                />
              );
            })}
          </View>

          <View style={{ height: 20 }} />
          <Button
            title={isBaseline ? 'Set baseline' : 'Continue'}
            onPress={next}
            trailingIcon="arrow-forward"
            size="lg"
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topRow}>
        <Pressable
          hitSlop={16}
          onPress={() => navigation.popToTop()}
          style={styles.closeBtn}
          accessibilityRole="button"
          accessibilityLabel="Close and return to Today"
        >
          <Ionicons name="close" size={22} color={colors.ink} />
        </Pressable>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Text style={text.eyebrow}>Focus</Text>
          <PulsingMark size={26} />
        </View>
        <Text style={styles.title}>
          Which area is most important right now?
        </Text>
        <Text style={styles.body}>
          Pick the one asking for your attention today.
        </Text>

        <View style={{ height: 16 }} />

        {focusAreaOrder.map((area) => {
          const fa = focusAreas[area];
          const tint = tintFor(area);
          const tintSoft = tintSoftFor(area);
          return (
            <Pressable
              key={area}
              onPress={() => chooseArea(area)}
              style={({ pressed }) => [
                { marginBottom: 10 },
                pressed && { opacity: 0.92 },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Focus on ${fa.label}, currently ${scores[area]} out of 10`}
            >
              <View style={[styles.areaRow, { backgroundColor: tintSoft }]}>
                <View style={styles.areaLeft}>
                  <Text style={styles.areaEmoji}>{fa.emoji}</Text>
                  <View>
                    <Text style={styles.areaLabel}>{fa.label}</Text>
                    <Text style={[styles.areaScore, { color: tint }]}>
                      {scores[area]}/10
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={tint} />
              </View>
            </Pressable>
          );
        })}

        <View style={{ height: 16 }} />
        <Button
          title="Skip"
          variant="ghost"
          onPress={() => navigation.popToTop()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  container: { flexGrow: 1, padding: 20, paddingTop: 8, paddingBottom: 40 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...text.h1,
    marginTop: 8,
    marginBottom: 6,
  },
  body: {
    ...text.body,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 18,
    paddingBottom: 12,
    ...shadows.sm,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  cardTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 16,
    color: colors.ink,
  },
  baselineMeta: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.inkFaint,
    marginBottom: 6,
  },
  deltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lineSoft,
  },
  deltaEmoji: {
    fontSize: 22,
    marginRight: 12,
  },
  deltaLabel: {
    fontFamily: fonts.serifBold,
    fontSize: 15,
    color: colors.ink,
  },
  deltaNums: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.inkSoft,
    marginTop: 2,
  },
  deltaValue: {
    fontFamily: fonts.sansSemi,
    fontSize: 16,
    marginLeft: 12,
  },
  areaRow: {
    borderRadius: radius.lg,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  areaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  areaEmoji: {
    fontSize: 26,
    marginRight: 14,
  },
  areaLabel: {
    fontFamily: fonts.serifBold,
    fontSize: 18,
    color: colors.ink,
  },
  areaScore: {
    fontFamily: fonts.sansSemi,
    fontSize: 13,
    marginTop: 2,
  },
});
