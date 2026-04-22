import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabsParamList } from '../navigation/types';
import { colors, radius, shadows } from '../theme/colors';
import { fonts, text } from '../theme/type';
import { msgPractices, seePractices } from '../data/practices';
import { triggerGestures, isTriggerUnlocked } from '../data/triggers';
import { chapterById } from '../data/chapters';
import { PracticeKind } from '../types';
import { useDay } from '../store/DayContext';
import { TourCard } from '../components/TourCard';

type Kind = PracticeKind | 'WHEN';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabsParamList, 'Practice'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function PracticeScreen({ navigation, route }: Props) {
  const initialKind: Kind = route.params?.initialKind ?? 'MSG';
  const [kind, setKind] = useState<Kind>(initialKind);
  const { today, settings } = useDay();
  const currentChapter = settings.currentChapter;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={text.eyebrow}>Practice</Text>
        <Text style={styles.title}>Choose your technology</Text>
        <Text style={styles.body}>
          One gentle dose. You can always come back for more.
        </Text>

        <TourCard
          storageKey="practice"
          title="Three soul technologies."
          tips={[
            'MSG, gestures the body remembers. SEE, sensual exercises that surface hidden belief.',
            'WHEN, trigger-specific gestures for a moment of shame, grief, fear, or joy.',
            'Each card shows which chapter unlocks it. WHEN gestures unlock as you progress.',
          ]}
        />

        <View style={styles.segment}>
          <SegmentButton
            label="MSG"
            description="Daily gestures"
            active={kind === 'MSG'}
            onPress={() => setKind('MSG')}
          />
          <SegmentButton
            label="SEE"
            description="Sensing exercises"
            active={kind === 'SEE'}
            onPress={() => setKind('SEE')}
          />
          <SegmentButton
            label="WHEN"
            description="For the moment"
            active={kind === 'WHEN'}
            onPress={() => setKind('WHEN')}
          />
        </View>

        {kind === 'MSG' || kind === 'SEE'
          ? renderPracticeList({ kind, today, navigation })
          : renderTriggerList({ currentChapter, navigation })}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function renderPracticeList({
  kind,
  today,
  navigation,
}: {
  kind: PracticeKind;
  today: ReturnType<typeof useDay>['today'];
  navigation: Props['navigation'];
}) {
  const list = kind === 'MSG' ? msgPractices : seePractices;
  const doneForKind = kind === 'MSG' ? today.msgDone : today.seeDone;
  const doneId = kind === 'MSG' ? today.msgPracticeId : today.seePracticeId;

  return list.map((p) => {
    const isDone = doneForKind && doneId === p.id;
    return (
      <Pressable
        key={p.id}
        onPress={() =>
          navigation.navigate('PracticeDetail', { practiceId: p.id })
        }
        style={{ marginBottom: 12 }}
      >
        <View style={[styles.card, shadows.sm, isDone && styles.cardDone]}>
          <View style={styles.cardRow}>
            <View style={styles.cardLeft}>
              <Text style={styles.cardTitle}>{p.title}</Text>
              <Text style={styles.cardCue}>{p.cue}</Text>
            </View>
            {isDone ? (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={colors.done}
              />
            ) : (
              <Ionicons
                name="chevron-forward"
                size={22}
                color={colors.inkFaint}
              />
            )}
          </View>
          <View style={styles.metaRow}>
            <View style={styles.pill}>
              <Ionicons
                name="time-outline"
                size={12}
                color={colors.clayDeep}
              />
              <Text style={styles.pillText}>{p.durationMin} min</Text>
            </View>
            <View style={[styles.pill, styles.chapterPill]}>
              <Ionicons
                name="book-outline"
                size={12}
                color={colors.inkSoft}
              />
              <Text style={styles.chapterPillText}>
                {chapterById(p.chapter)?.shortTitle ?? 'Ch.'}
              </Text>
            </View>
            {isDone ? (
              <Text style={styles.doneTag}>Completed today</Text>
            ) : null}
          </View>
        </View>
      </Pressable>
    );
  });
}

function renderTriggerList({
  currentChapter,
  navigation,
}: {
  currentChapter: number | undefined;
  navigation: Props['navigation'];
}) {
  return (
    <>
      <View style={styles.whenIntro}>
        <Text style={styles.whenIntroText}>
          When the old thread pulls, reach for the matching gesture. Each one
          unlocks as you reach its chapter.
        </Text>
        {currentChapter === undefined ? (
          <Text style={styles.whenIntroHint}>
            Set your chapter in Settings to unlock more gestures. The
            Introduction is open to everyone.
          </Text>
        ) : null}
      </View>
      {triggerGestures.map((g) => {
        const unlocked = isTriggerUnlocked(g, currentChapter);
        const chapter = chapterById(g.chapter);
        return (
          <Pressable
            key={g.id}
            disabled={!unlocked}
            onPress={() =>
              navigation.navigate('TriggerDetail', { triggerId: g.id })
            }
            style={{ marginBottom: 12 }}
          >
            <View
              style={[
                styles.card,
                shadows.sm,
                !unlocked && styles.cardLocked,
              ]}
            >
              <View style={styles.cardRow}>
                <View style={styles.cardLeft}>
                  <Text
                    style={[
                      styles.triggerWhen,
                      !unlocked && styles.lockedText,
                    ]}
                  >
                    {g.trigger}
                  </Text>
                  <Text
                    style={[
                      styles.cardTitle,
                      !unlocked && styles.lockedText,
                    ]}
                  >
                    {g.title}
                  </Text>
                </View>
                {unlocked ? (
                  <Ionicons
                    name="chevron-forward"
                    size={22}
                    color={colors.inkFaint}
                  />
                ) : (
                  <Ionicons
                    name="lock-closed"
                    size={18}
                    color={colors.inkFaint}
                  />
                )}
              </View>
              <View style={styles.metaRow}>
                <View style={styles.pill}>
                  <Ionicons
                    name="time-outline"
                    size={12}
                    color={colors.clayDeep}
                  />
                  <Text style={styles.pillText}>{g.durationMin} min</Text>
                </View>
                <View style={[styles.pill, styles.chapterPill]}>
                  <Ionicons
                    name="book-outline"
                    size={12}
                    color={colors.inkSoft}
                  />
                  <Text style={styles.chapterPillText}>
                    {unlocked
                      ? `${chapter?.shortTitle ?? 'Ch.'} · ${g.theme}`
                      : `Unlocks with ${chapter?.shortTitle ?? 'Ch.'}`}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        );
      })}
    </>
  );
}

function SegmentButton({
  label,
  description,
  active,
  onPress,
}: {
  label: string;
  description: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.segBtn, active && styles.segBtnActive]}
    >
      <Text style={[styles.segLabel, active && styles.segLabelActive]}>
        {label}
      </Text>
      <Text
        style={[styles.segDesc, active && styles.segDescActive]}
        numberOfLines={1}
      >
        {description}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 20, paddingBottom: 40 },
  title: {
    ...text.h1,
    marginTop: 8,
    marginBottom: 6,
  },
  body: {
    ...text.body,
    marginBottom: 20,
  },
  segment: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  segBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surfaceSoft,
  },
  segBtnActive: {
    borderColor: colors.clay,
    backgroundColor: colors.clayWash,
  },
  segLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
    letterSpacing: 2,
    color: colors.inkSoft,
  },
  segLabelActive: {
    color: colors.clayDeep,
  },
  segDesc: {
    fontFamily: fonts.sans,
    fontSize: 10,
    color: colors.inkFaint,
    marginTop: 4,
  },
  segDescActive: {
    color: colors.clayDeep,
  },
  whenIntro: {
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  whenIntroText: {
    ...text.body,
  },
  whenIntroHint: {
    ...text.caption,
    marginTop: 6,
    color: colors.clayDeep,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 20,
  },
  cardDone: {
    backgroundColor: colors.doneSoft,
  },
  cardLocked: {
    backgroundColor: colors.surfaceSoft,
    opacity: 0.72,
  },
  lockedText: {
    color: colors.inkFaint,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardLeft: {
    flex: 1,
    paddingRight: 12,
  },
  triggerWhen: {
    fontFamily: fonts.serifItalic,
    fontSize: 14,
    color: colors.inkSoft,
    marginBottom: 4,
  },
  cardTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 20,
    color: colors.ink,
  },
  cardCue: {
    ...text.body,
    marginTop: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 10,
    flexWrap: 'wrap',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.clayWash,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  pillText: {
    fontFamily: fonts.sansSemi,
    fontSize: 12,
    color: colors.clayDeep,
    marginLeft: 4,
  },
  chapterPill: {
    backgroundColor: colors.lineSoft,
  },
  chapterPillText: {
    fontFamily: fonts.sansSemi,
    fontSize: 12,
    color: colors.inkSoft,
    marginLeft: 4,
  },
  doneTag: {
    fontFamily: fonts.sansSemi,
    fontSize: 12,
    color: colors.done,
  },
});
