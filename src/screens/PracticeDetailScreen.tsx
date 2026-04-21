import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
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
    if (practice.kind === 'MSG') {
      await updateToday({ msgDone: true, msgPracticeId: practice.id });
    } else {
      await updateToday({ seeDone: true, seePracticeId: practice.id });
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.kind}>{practice.kind}</Text>
        <Text style={styles.title}>{practice.title}</Text>
        <Text style={styles.meta}>
          {practice.durationMin} min · {practice.cue}
        </Text>

        <Card style={styles.card}>
          {practice.steps.map((step, i) => (
            <View key={i} style={styles.step}>
              <Text style={styles.stepNum}>{i + 1}</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </Card>

        <View style={{ height: 24 }} />
        <Button
          title={isDone ? 'Marked done ✓' : 'Mark practice complete'}
          onPress={complete}
          disabled={isDone}
        />
        <View style={{ height: 10 }} />
        <Button
          title="Back"
          variant="ghost"
          onPress={() => navigation.goBack()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 24, paddingBottom: 40 },
  missing: { padding: 24, color: colors.inkSoft },
  kind: {
    letterSpacing: 2,
    fontWeight: '800',
    color: colors.accent,
    fontSize: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.ink,
    marginTop: 4,
  },
  meta: {
    marginTop: 6,
    color: colors.inkSoft,
    marginBottom: 20,
  },
  card: {},
  step: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    textAlign: 'center',
    lineHeight: 26,
    backgroundColor: colors.accentSoft,
    color: colors.accent,
    fontWeight: '800',
    marginRight: 12,
    overflow: 'hidden',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: colors.ink,
  },
});
