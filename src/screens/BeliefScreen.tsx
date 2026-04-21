import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { beliefForDate } from '../data/beliefs';
import { useDay } from '../store/DayContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Belief'>;

export function BeliefScreen({ navigation }: Props) {
  const belief = useMemo(() => beliefForDate(new Date()), []);
  const { today, updateToday } = useDay();

  const acknowledge = async () => {
    await updateToday({
      beliefId: belief.id,
      beliefAcknowledged: true,
    });
    navigation.goBack();
  };

  const already = today.beliefAcknowledged && today.beliefId === belief.id;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>BELIEF REMINDER</Text>
        <Text style={styles.statement}>{belief.statement}</Text>

        <Card style={styles.card} tint="sageSoft">
          <Text style={styles.cardLabel}>Somatic embedding</Text>
          <Text style={styles.cardBody}>{belief.embedding}</Text>
        </Card>

        <View style={{ height: 24 }} />

        <Button
          title={already ? 'Received ✓' : 'Let it land'}
          onPress={acknowledge}
        />
        <View style={{ height: 10 }} />
        <Button
          title="Not now"
          variant="ghost"
          onPress={() => navigation.goBack()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 24, paddingTop: 40 },
  eyebrow: {
    letterSpacing: 2,
    color: colors.inkFaint,
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 16,
  },
  statement: {
    fontSize: 30,
    color: colors.ink,
    fontWeight: '700',
    lineHeight: 38,
    marginBottom: 28,
  },
  card: {},
  cardLabel: {
    fontSize: 12,
    letterSpacing: 1.5,
    color: colors.inkSoft,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 16,
    color: colors.ink,
    lineHeight: 24,
  },
});
