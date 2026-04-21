import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { Button } from '../components/Button';
import { ScoreSlider } from '../components/ScoreSlider';
import { SectionHeader } from '../components/SectionHeader';
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
        <ScrollView contentContainerStyle={styles.container}>
          <SectionHeader
            eyebrow="Check-in"
            title="Rate where you are today"
            subtitle="No need to think hard. First number, gently."
          />

          {focusAreaOrder.map((area) => {
            const fa = focusAreas[area];
            return (
              <ScoreSlider
                key={area}
                label={fa.label}
                emoji={fa.emoji}
                value={scores[area]}
                onChange={(v) => setScore(area, v)}
              />
            );
          })}

          <View style={{ height: 16 }} />
          <Button title="Continue" onPress={next} />
          <View style={{ height: 8 }} />
          <Button
            title="Cancel"
            variant="ghost"
            onPress={() => navigation.goBack()}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <SectionHeader
          eyebrow="Focus"
          title="Which area is most important to you right now?"
          subtitle="Pick the one asking for your attention today."
        />
        {focusAreaOrder.map((area) => {
          const fa = focusAreas[area];
          return (
            <Button
              key={area}
              title={`${fa.emoji}  ${fa.label}  ·  ${scores[area]}/10`}
              variant="soft"
              style={{ marginBottom: 10 }}
              onPress={() => chooseArea(area)}
            />
          );
        })}
        <View style={{ height: 10 }} />
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
  container: { padding: 20, paddingBottom: 40 },
});
