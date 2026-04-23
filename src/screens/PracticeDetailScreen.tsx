import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radius, shadows } from '../theme/colors';
import { fonts, text } from '../theme/type';
import { Button } from '../components/Button';
import { CloseButton } from '../components/CloseButton';
import { findPractice } from '../data/practices';
import { useDay } from '../store/DayContext';

type Props = NativeStackScreenProps<RootStackParamList, 'PracticeDetail'>;

export function PracticeDetailScreen({ navigation, route }: Props) {
  const practice = useMemo(
    () => findPractice(route.params.practiceId),
    [route.params.practiceId]
  );
  const { today, updateToday } = useDay();

  if (!practice) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.missing}>Practice not found.</Text>
      </SafeAreaView>
    );
  }

  const isDone =
    practice.kind === 'MSG'
      ? today.msgDone && today.msgPracticeId === practice.id
      : today.seeDone && today.seePracticeId === practice.id;

  const complete = async () => {
    // Completion haptic is fired by the Button (haptic="success"). No manual call.
    if (practice.kind === 'MSG') {
      await updateToday({ msgDone: true, msgPracticeId: practice.id });
    } else {
      await updateToday({ seeDone: true, seePracticeId: practice.id });
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topRow}>
        <CloseButton
          onPress={() => navigation.goBack()}
          variant="solid"
          accessibilityLabel="Close practice"
        />
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        <View style={styles.kindPill}>
          <Text style={styles.kindPillText}>{practice.kind}</Text>
        </View>
        <Text style={styles.title}>{practice.title}</Text>
        <View style={styles.metaRow}>
          <View style={styles.meta}>
            <Ionicons name="time-outline" size={14} color={colors.inkSoft} />
            <Text style={styles.metaText}>{practice.durationMin} min</Text>
          </View>
          <Text style={styles.metaSep}>·</Text>
          <Text style={styles.cue}>{practice.cue}</Text>
        </View>

        <View style={styles.stepsCard}>
          {practice.steps.map((step, i) => (
            <View key={i} style={styles.step}>
              <View style={styles.stepNumWrap}>
                <Text style={styles.stepNum}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 28 }} />
        <Button
          title={isDone ? 'Marked done' : 'Mark practice complete'}
          icon={isDone ? 'checkmark-circle' : undefined}
          onPress={complete}
          disabled={isDone}
          size="lg"
          haptic="success"
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 8,
    paddingBottom: 48,
  },
  missing: { padding: 24, color: colors.inkSoft },
  kindPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.clayWash,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.pill,
    marginBottom: 14,
  },
  kindPillText: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.clayDeep,
  },
  title: {
    ...text.display,
    fontSize: 34,
    lineHeight: 42,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontFamily: fonts.sansMed,
    color: colors.inkSoft,
    marginLeft: 4,
    fontSize: 13,
  },
  metaSep: {
    color: colors.inkFaint,
    marginHorizontal: 8,
  },
  cue: {
    ...text.body,
    flexShrink: 1,
  },
  stepsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 22,
    ...shadows.sm,
  },
  step: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  stepNumWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.clay,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    marginTop: 1,
  },
  stepNum: {
    color: colors.white,
    fontFamily: fonts.sansBold,
    fontSize: 13,
  },
  stepText: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    color: colors.ink,
  },
});
