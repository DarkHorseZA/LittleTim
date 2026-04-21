import React, { useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radius } from '../theme/colors';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { focusAreas } from '../data/focusAreas';
import { COACHING_URL } from '../config';
import { useDay } from '../store/DayContext';

type Props = NativeStackScreenProps<RootStackParamList, 'FocusArea'>;

export function FocusAreaScreen({ navigation, route }: Props) {
  const { focusArea } = route.params;
  const fa = focusAreas[focusArea];
  const { today, updateToday } = useDay();
  const [reflection, setReflection] = useState(today.tracker?.reflection ?? '');

  const saveReflection = async () => {
    if (!today.tracker) return;
    await updateToday({
      tracker: { ...today.tracker, reflection },
    });
  };

  const openCoaching = async () => {
    await saveReflection();
    const supported = await Linking.canOpenURL(COACHING_URL);
    if (!supported) {
      Alert.alert(
        'Coaching link not set',
        'Edit src/config.ts and set COACHING_URL to your booking page.'
      );
      return;
    }
    Linking.openURL(COACHING_URL);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>{fa.label.toUpperCase()}</Text>
        <Text style={styles.emoji}>{fa.emoji}</Text>

        <Text style={styles.question}>{fa.question}</Text>

        <Card style={styles.inputCard}>
          <Text style={styles.inputLabel}>Your reflection (private)</Text>
          <TextInput
            value={reflection}
            onChangeText={setReflection}
            placeholder="Let the first honest sentence land here…"
            placeholderTextColor={colors.inkFaint}
            multiline
            style={styles.input}
          />
        </Card>

        <View style={{ height: 16 }} />

        <Card tint="accentSoft">
          <Text style={styles.teaser}>{fa.coachingTeaser}</Text>
        </Card>

        <View style={{ height: 16 }} />

        <Button title="Book a coaching session" onPress={openCoaching} />
        <View style={{ height: 8 }} />
        <Button
          title="Save & close"
          variant="soft"
          onPress={async () => {
            await saveReflection();
            navigation.popToTop();
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 24, paddingBottom: 40 },
  eyebrow: {
    letterSpacing: 2,
    color: colors.inkFaint,
    fontWeight: '800',
    fontSize: 12,
  },
  emoji: {
    fontSize: 48,
    marginTop: 8,
    marginBottom: 8,
  },
  question: {
    fontSize: 22,
    color: colors.ink,
    fontWeight: '700',
    lineHeight: 30,
    marginBottom: 20,
  },
  inputCard: {},
  inputLabel: {
    color: colors.inkSoft,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    minHeight: 110,
    textAlignVertical: 'top',
    borderRadius: radius.sm,
    fontSize: 16,
    color: colors.ink,
    padding: 0,
  },
  teaser: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 22,
  },
});
