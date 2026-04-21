import React, { useState } from 'react';
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
import { colors, radius } from '../theme/colors';
import { Card } from '../components/Card';
import { SectionHeader } from '../components/SectionHeader';
import { msgPractices, seePractices } from '../data/practices';
import { PracticeKind } from '../types';
import { useDay } from '../store/DayContext';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabsParamList, 'Practice'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function PracticeScreen({ navigation, route }: Props) {
  const initialKind = route.params?.initialKind ?? 'MSG';
  const [kind, setKind] = useState<PracticeKind>(initialKind);
  const { today } = useDay();
  const list = kind === 'MSG' ? msgPractices : seePractices;
  const doneForKind = kind === 'MSG' ? today.msgDone : today.seeDone;
  const doneId = kind === 'MSG' ? today.msgPracticeId : today.seePracticeId;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <SectionHeader
          eyebrow="Practice"
          title="Choose your technology"
          subtitle="One gentle dose. You can always come back for more."
        />

        <View style={styles.toggle}>
          <Pressable
            style={[styles.toggleBtn, kind === 'MSG' && styles.toggleOn]}
            onPress={() => setKind('MSG')}
          >
            <Text
              style={[styles.toggleText, kind === 'MSG' && styles.toggleTextOn]}
            >
              MSG
            </Text>
          </Pressable>
          <Pressable
            style={[styles.toggleBtn, kind === 'SEE' && styles.toggleOn]}
            onPress={() => setKind('SEE')}
          >
            <Text
              style={[styles.toggleText, kind === 'SEE' && styles.toggleTextOn]}
            >
              SEE
            </Text>
          </Pressable>
        </View>

        <Text style={styles.blurb}>
          {kind === 'MSG'
            ? 'Meditative Somatic Gestures — small shapes the body remembers.'
            : 'Somatic Experiencing Exercises — completing what the body started.'}
        </Text>

        {list.map((p) => {
          const isDone = doneForKind && doneId === p.id;
          return (
            <Pressable
              key={p.id}
              onPress={() =>
                navigation.navigate('PracticeDetail', { practiceId: p.id })
              }
              style={{ marginBottom: 12 }}
            >
              <Card style={[styles.card, isDone && styles.cardDone]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{p.title}</Text>
                  <Text style={styles.cardDur}>{p.durationMin} min</Text>
                </View>
                <Text style={styles.cardCue}>{p.cue}</Text>
                {isDone ? (
                  <Text style={styles.cardDoneLabel}>✓ Completed today</Text>
                ) : null}
              </Card>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 20, paddingBottom: 40 },
  toggle: {
    flexDirection: 'row',
    backgroundColor: colors.line,
    borderRadius: radius.md,
    padding: 4,
    marginBottom: 16,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  toggleOn: {
    backgroundColor: colors.card,
  },
  toggleText: {
    color: colors.inkSoft,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  toggleTextOn: {
    color: colors.accent,
  },
  blurb: {
    color: colors.inkSoft,
    marginBottom: 16,
    lineHeight: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.line,
  },
  cardDone: {
    backgroundColor: colors.sageSoft,
    borderColor: colors.sage,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
  },
  cardDur: {
    color: colors.inkFaint,
    fontWeight: '600',
  },
  cardCue: {
    marginTop: 6,
    color: colors.inkSoft,
    lineHeight: 20,
  },
  cardDoneLabel: {
    marginTop: 10,
    color: '#4F7A4E',
    fontWeight: '700',
    fontSize: 12,
  },
});
