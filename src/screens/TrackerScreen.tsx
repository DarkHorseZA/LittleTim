import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radius, shadows } from '../theme/colors';
import { fonts, text } from '../theme/type';
import { Button } from '../components/Button';
import { ScoreSlider } from '../components/ScoreSlider';
import { focusAreaOrder, focusAreas } from '../data/focusAreas';
import { FocusArea, TrackerScores } from '../types';
import { useDay } from '../store/DayContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Tracker'>;

const defaultScores: TrackerScores = {
  happiness: 5,
  loved: 5,
  health: 5,
  wealth: 5,
  relationships: 5,
};

type Step = 'scores' | 'chooseArea';

const tintFor = (area: FocusArea) => colors[area];
const tintSoftFor = (area: FocusArea) =>
  colors[(area + 'Soft') as keyof typeof colors] as string;

export function TrackerScreen({ navigation }: Props) {
  const { today, updateToday } = useDay();
  const [step, setStep] = useState<Step>('scores');
  const [scores, setScores] = useState<TrackerScores>(
    today.tracker?.scores ?? defaultScores
  );

  const setScore = (area: FocusArea, v: number) =>
    setScores((s) => ({ ...s, [area]: v }));

  const next = async () => {
    await updateToday({
      tracker: { scores, focusArea: today.tracker?.focusArea },
    });
    setStep('chooseArea');
  };

  const chooseArea = async (area: FocusArea) => {
    await updateToday({
      tracker: { scores, focusArea: area },
    });
    navigation.replace('FocusArea', { focusArea: area });
  };

  if (step === 'scores') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.topRow}>
          <Pressable
            hitSlop={16}
            onPress={() => navigation.goBack()}
            style={styles.closeBtn}
          >
            <Ionicons name="close" size={22} color={colors.ink} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={text.eyebrow}>Check-in</Text>
          <Text style={styles.title}>Rate where you are today</Text>
          <Text style={styles.body}>
            No need to think hard. First number, gently.
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
          <Button title="Continue" onPress={next} trailingIcon="arrow-forward" size="lg" />
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
        >
          <Ionicons name="close" size={22} color={colors.ink} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={text.eyebrow}>Focus</Text>
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
              style={{ marginBottom: 10 }}
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  container: { padding: 20, paddingTop: 8, paddingBottom: 40 },
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
