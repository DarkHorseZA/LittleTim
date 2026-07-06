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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, layout, radius, shadows } from '../theme/colors';
import { fonts, text } from '../theme/type';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import { focusAreas } from '../data/focusAreas';
import { COACHING_URL, hasCoachingUrl } from '../config';
import { useDay } from '../store/DayContext';
import { FocusArea } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'FocusArea'>;

const tintFor = (area: FocusArea) => colors[area];
const tintSoftFor = (area: FocusArea) =>
  colors[(area + 'Soft') as keyof typeof colors] as string;

export function FocusAreaScreen({ navigation, route }: Props) {
  const { focusArea } = route.params;
  const fa = focusAreas[focusArea];
  const tint = tintFor(focusArea);
  const tintSoft = tintSoftFor(focusArea);
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
    if (!hasCoachingUrl()) {
      Alert.alert(
        'Coming soon',
        'Coaching booking will open here once a link is added.'
      );
      return;
    }
    Linking.openURL(COACHING_URL);
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[tintSoft, colors.bg]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.6, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topRow}>
          <BackButton
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View style={[styles.emojiCircle, { backgroundColor: tintSoft }]}>
            <Text style={styles.emoji}>{fa.emoji}</Text>
          </View>
          <Text style={[styles.eyebrow, { color: tint }]}>{fa.label}</Text>
          <Text style={styles.question}>{fa.question}</Text>

          <View style={styles.inputCard}>
            <View style={styles.inputHeader}>
              <Ionicons name="create-outline" size={16} color={colors.inkSoft} />
              <Text style={styles.inputLabel}>Reflection (private)</Text>
            </View>
            <TextInput
              value={reflection}
              onChangeText={setReflection}
              placeholder="Let the first honest sentence land here\u2026"
              placeholderTextColor={colors.inkFaint}
              multiline
              style={styles.input}
              accessibilityLabel="Reflection, private"
              accessibilityHint={`Write about ${fa.label.toLowerCase()}`}
            />
          </View>

          <View style={[styles.teaserCard, { backgroundColor: tintSoft }]}>
            <Ionicons name="heart-circle-outline" size={22} color={tint} />
            <Text style={[styles.teaser, { color: colors.ink }]}>
              {fa.coachingTeaser}
            </Text>
          </View>

          <View style={{ height: 20 }} />

          <Button
            title={
              hasCoachingUrl()
                ? 'Book a coaching session'
                : 'Book a coaching session (coming soon)'
            }
            icon="calendar-outline"
            onPress={openCoaching}
            size="lg"
          />
          <View style={{ height: 10 }} />
          <Button
            title="Save & close"
            variant="ghost"
            onPress={async () => {
              await saveReflection();
              navigation.popToTop();
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  container: {
    flexGrow: 1,
    padding: 28,
    paddingTop: 12,
    paddingBottom: 40,
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
  },
  emojiCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 44,
  },
  eyebrow: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  question: {
    fontFamily: fonts.serifItalic,
    fontSize: 26,
    lineHeight: 34,
    color: colors.ink,
    marginBottom: 24,
  },
  inputCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 18,
    ...shadows.sm,
    marginBottom: 16,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputLabel: {
    ...text.eyebrow,
    marginLeft: 6,
  },
  input: {
    minHeight: 110,
    textAlignVertical: 'top',
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.ink,
    padding: 0,
  },
  teaserCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: radius.lg,
    gap: 10,
  },
  teaser: {
    fontFamily: fonts.sans,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
