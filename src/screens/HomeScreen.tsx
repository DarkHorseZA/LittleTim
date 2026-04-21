import React, { useEffect, useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabsParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { SectionHeader } from '../components/SectionHeader';
import { APP_NAME } from '../config';
import { beliefForDate } from '../data/beliefs';
import { useDay } from '../store/DayContext';
import { todayKey } from '../store/storage';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabsParamList, 'Today'>,
  NativeStackScreenProps<RootStackParamList>
>;

function prettyDate(d: Date): string {
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function HomeScreen({ navigation }: Props) {
  const { today, streak, settings, updateSettings } = useDay();
  const now = useMemo(() => new Date(), []);
  const belief = useMemo(() => beliefForDate(now), [now]);

  useEffect(() => {
    // Show the belief modal once per day, on first entry to Home.
    const key = todayKey(now);
    if (settings.lastBeliefSeenOn !== key) {
      updateSettings({ lastBeliefSeenOn: key });
      const t = setTimeout(() => navigation.navigate('Belief'), 250);
      return () => clearTimeout(t);
    }
  }, [navigation, settings.lastBeliefSeenOn, now, updateSettings]);

  const msgDone = today.msgDone;
  const seeDone = today.seeDone;
  const trackerDone = !!today.tracker;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.brand}>{APP_NAME}</Text>
        <Text style={styles.date}>{prettyDate(now)}</Text>

        <Card style={styles.streakCard} tint="accentSoft">
          <Text style={styles.streakLabel}>Current streak</Text>
          <View style={styles.streakRow}>
            <Text style={styles.streakValue}>{streak}</Text>
            <Text style={styles.streakUnit}>
              {streak === 1 ? 'day' : 'days'}
            </Text>
          </View>
          <Text style={styles.streakHint}>
            A day counts when you complete MSG or SEE.
          </Text>
        </Card>

        <SectionHeader
          eyebrow="Today's belief"
          title={belief.statement}
          subtitle={belief.embedding}
        />
        <Button
          title="Open belief reminder"
          variant="soft"
          onPress={() => navigation.navigate('Belief')}
        />

        <View style={{ height: 28 }} />

        <SectionHeader
          eyebrow="Daily practice"
          title="Two soul technologies"
          subtitle="Small and daily beats big and rare."
        />

        <Pressable
          onPress={() =>
            navigation.navigate('Practice', { initialKind: 'MSG' })
          }
        >
          <Card style={[styles.practiceCard, msgDone && styles.practiceDone]}>
            <Text style={styles.practiceKind}>MSG</Text>
            <Text style={styles.practiceTitle}>Meditative Somatic Gestures</Text>
            <Text style={styles.practiceBody}>
              Gentle, repeatable gestures that settle the nervous system and
              open the heart.
            </Text>
            <Text style={[styles.practiceStatus, msgDone && styles.statusDone]}>
              {msgDone ? '✓ Done for today' : 'Tap to begin'}
            </Text>
          </Card>
        </Pressable>

        <View style={{ height: 12 }} />

        <Pressable
          onPress={() =>
            navigation.navigate('Practice', { initialKind: 'SEE' })
          }
        >
          <Card style={[styles.practiceCard, seeDone && styles.practiceDone]}>
            <Text style={styles.practiceKind}>SEE</Text>
            <Text style={styles.practiceTitle}>
              Somatic Experiencing Exercises
            </Text>
            <Text style={styles.practiceBody}>
              Short exercises to complete stuck responses and rebuild capacity.
            </Text>
            <Text style={[styles.practiceStatus, seeDone && styles.statusDone]}>
              {seeDone ? '✓ Done for today' : 'Tap to begin'}
            </Text>
          </Card>
        </Pressable>

        <View style={{ height: 28 }} />

        <SectionHeader
          eyebrow="Wellness tracker"
          title={trackerDone ? 'Checked in today' : 'How are you, really?'}
          subtitle={
            trackerDone
              ? 'You can update your check-in any time.'
              : 'Five quick sliders, then a reflection prompt.'
          }
        />
        <Button
          title={trackerDone ? 'Update today’s check-in' : 'Start check-in'}
          onPress={() => navigation.navigate('Tracker')}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 20, paddingBottom: 40 },
  brand: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
    letterSpacing: 2,
  },
  date: {
    fontSize: 24,
    color: colors.ink,
    fontWeight: '700',
    marginTop: 6,
    marginBottom: 18,
  },
  streakCard: {
    marginBottom: 24,
  },
  streakLabel: {
    color: colors.inkSoft,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 4,
  },
  streakValue: {
    fontSize: 44,
    fontWeight: '800',
    color: colors.accent,
  },
  streakUnit: {
    fontSize: 18,
    color: colors.accent,
    marginLeft: 8,
    marginBottom: 8,
    fontWeight: '600',
  },
  streakHint: {
    marginTop: 6,
    color: colors.inkSoft,
    fontSize: 13,
  },
  practiceCard: {
    borderWidth: 1,
    borderColor: colors.line,
  },
  practiceDone: {
    borderColor: colors.sage,
    backgroundColor: colors.sageSoft,
  },
  practiceKind: {
    fontSize: 11,
    letterSpacing: 2,
    color: colors.accent,
    fontWeight: '800',
  },
  practiceTitle: {
    fontSize: 20,
    color: colors.ink,
    fontWeight: '700',
    marginTop: 4,
  },
  practiceBody: {
    fontSize: 14,
    color: colors.inkSoft,
    marginTop: 8,
    lineHeight: 20,
  },
  practiceStatus: {
    marginTop: 12,
    fontSize: 13,
    color: colors.inkFaint,
    fontWeight: '600',
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 10,
  },
  statusDone: {
    color: '#4F7A4E',
  },
});
