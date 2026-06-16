import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, gradients, layout, radius, shadows } from '../theme/colors';
import { fonts, text } from '../theme/type';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import { ScoreSlider } from '../components/ScoreSlider';
import { focusAreaOrder, focusAreas } from '../data/focusAreas';
import { FocusArea, TrackerScores } from '../types';
import { useDay } from '../store/DayContext';
import { todayKey } from '../store/storage';

// BaselineScreen is no longer in the navigator — replaced by TrackerScreen.
// Kept as an archive. Props typed loosely so the file continues to compile.
type Props = { navigation: any; route: any };

const INITIAL_SCORES: TrackerScores = {
  happiness: 5,
  loved: 5,
  health: 5,
  wealth: 5,
  relationships: 5,
};

export function BaselineScreen({ navigation, route }: Props) {
  const firstRun = route.params?.firstRun !== false;
  const { settings, updateSettings } = useDay();
  const [scores, setScores] = useState<TrackerScores>(
    settings.baseline?.scores ?? INITIAL_SCORES
  );
  const [saving, setSaving] = useState(false);

  const setArea = (area: FocusArea, value: number) => {
    setScores((prev) => ({ ...prev, [area]: value }));
  };

  const save = async () => {
    if (saving) return;
    setSaving(true);
    // Completion haptic is fired by the Button (haptic="success"). No manual call.
    await updateSettings({
      baseline: {
        scores,
        capturedOn: todayKey(),
      },
    });
    if (firstRun) {
      navigation.replace('Tabs', { screen: 'Today' });
    } else {
      navigation.goBack();
    }
  };

  const areaTint = (area: FocusArea) => {
    switch (area) {
      case 'happiness':
        return { tint: colors.happiness, tintSoft: colors.happinessSoft };
      case 'loved':
        return { tint: colors.loved, tintSoft: colors.lovedSoft };
      case 'health':
        return { tint: colors.health, tintSoft: colors.healthSoft };
      case 'wealth':
        return { tint: colors.wealth, tintSoft: colors.wealthSoft };
      case 'relationships':
        return {
          tint: colors.relationships,
          tintSoft: colors.relationshipsSoft,
        };
    }
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={gradients.dawnDeep}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.hero}
      />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {!firstRun ? (
          <View style={styles.topRow}>
            <BackButton
              onPress={() => navigation.goBack()}
              accessibilityLabel="Go back"
            />
          </View>
        ) : null}

        <ScrollView
        showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={styles.container}>
          <Text style={styles.eyebrow}>First reading</Text>
          <Text style={styles.title}>Where are you today?</Text>
          <Text style={styles.subtitle}>
            {`\u201CFive gentle readings, your starting thread.\u201D`}
          </Text>

          <View style={styles.lead}>
            <Ionicons
              name="leaf-outline"
              size={18}
              color={colors.clayDeep}
              style={{ marginBottom: 8 }}
            />
            <Text style={styles.leadText}>
              Not where you wish to be, where you are right now. Every day
              after this is measured against this first stitch.
            </Text>
          </View>

          <View style={styles.card}>
            {focusAreaOrder.map((area, i) => {
              const meta = focusAreas[area];
              const { tint, tintSoft } = areaTint(area);
              return (
                <View
                  key={area}
                  style={i === 0 ? undefined : styles.sliderDivider}
                >
                  <ScoreSlider
                    label={meta.label}
                    emoji={meta.emoji}
                    value={scores[area]}
                    onChange={(v) => setArea(area, v)}
                    tint={tint}
                    tintSoft={tintSoft}
                  />
                </View>
              );
            })}
          </View>

          <Text style={styles.footnote}>
            You can revisit your baseline any time from Settings.
          </Text>

          <View style={{ height: 24 }} />
          <Button
            title={firstRun ? 'Set my baseline' : 'Save baseline'}
            icon={firstRun ? 'arrow-forward' : 'checkmark'}
            onPress={save}
            size="lg"
            loading={saving}
            haptic="success"
            accessibilityHint="Saves these five readings as your starting point"
          />
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  hero: {
    ...StyleSheet.absoluteFillObject,
    height: 320,
    bottom: undefined,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 16,
    paddingBottom: 40,
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
  },
  eyebrow: {
    ...text.eyebrow,
    marginBottom: 4,
  },
  title: {
    ...text.hero,
  },
  subtitle: {
    fontFamily: fonts.serifItalic,
    fontSize: 16,
    lineHeight: 24,
    color: colors.inkSoft,
    marginTop: 8,
    marginBottom: 24,
  },
  lead: {
    backgroundColor: colors.claySoft,
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: 24,
  },
  leadText: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 23,
    color: colors.ink,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 20,
    paddingBottom: 8,
    ...shadows.sm,
    marginBottom: 16,
  },
  sliderDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.lineSoft,
    paddingTop: 14,
    marginTop: 4,
  },
  footnote: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.inkFaint,
    textAlign: 'center',
    marginTop: 4,
  },
});
