import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, layout, radius, shadows } from '../theme/colors';
import { fonts, text } from '../theme/type';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import { findTrigger } from '../data/triggers';
import { chapterById } from '../data/chapters';

type Props = NativeStackScreenProps<RootStackParamList, 'TriggerDetail'>;

export function TriggerDetailScreen({ navigation, route }: Props) {
  const gesture = useMemo(
    () => findTrigger(route.params.triggerId),
    [route.params.triggerId]
  );

  if (!gesture) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.missing}>Gesture not found.</Text>
      </SafeAreaView>
    );
  }

  const chapter = chapterById(gesture.chapter);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topRow}>
        <BackButton
          onPress={() => navigation.goBack()}
          variant="solid"
          accessibilityLabel="Go back"
        />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={styles.container}>
        <View style={styles.kindPill}>
          <Text style={styles.kindPillText}>WHEN</Text>
        </View>
        <Text style={styles.trigger}>{gesture.trigger}</Text>
        <Text style={styles.title}>{gesture.title}</Text>
        <View style={styles.metaRow}>
          <View style={styles.meta}>
            <Ionicons name="time-outline" size={14} color={colors.inkSoft} />
            <Text style={styles.metaText}>{gesture.durationMin} min</Text>
          </View>
          <Text style={styles.metaSep}>·</Text>
          <View style={styles.meta}>
            <Ionicons name="book-outline" size={14} color={colors.inkSoft} />
            <Text style={styles.metaText}>
              {chapter?.shortTitle ?? 'Ch.'} · {gesture.theme}
            </Text>
          </View>
        </View>

        <View style={styles.framingCard}>
          <Text style={styles.framing}>{gesture.framing}</Text>
        </View>

        <View style={styles.stepsCard}>
          {gesture.steps.map((step, i) => (
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
          title="Close"
          variant="ghost"
          onPress={() => navigation.goBack()}
          size="lg"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 8,
    paddingBottom: 48,
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
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
  trigger: {
    fontFamily: fonts.serifItalic,
    fontSize: 17,
    color: colors.inkSoft,
    marginBottom: 6,
  },
  title: {
    ...text.display,
    fontSize: 32,
    lineHeight: 40,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 22,
    flexWrap: 'wrap',
    gap: 4,
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
  framingCard: {
    backgroundColor: colors.clayWash,
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: 16,
  },
  framing: {
    fontFamily: fonts.serifItalic,
    fontSize: 16,
    lineHeight: 24,
    color: colors.clayDeep,
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
