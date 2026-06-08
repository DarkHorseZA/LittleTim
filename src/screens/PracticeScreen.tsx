import React, { useEffect, useState } from 'react';
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
import { colors, layout, radius, shadows } from '../theme/colors';
import { nav, pressScale, tap, webFocus } from '../theme/interactions';
import { fonts, text } from '../theme/type';
import { msgPractices, seePractices } from '../data/practices';
import { triggerGestures } from '../data/triggers';
import { chapterById, isChapterUnlocked } from '../data/chapters';
import { PracticeKind } from '../types';
import { useDay } from '../store/DayContext';
import { TourCard } from '../components/TourCard';
import { PulsingMark } from '../components/PulsingMark';

type Kind = PracticeKind | 'WHEN';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabsParamList, 'Practice'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function PracticeScreen({ navigation, route }: Props) {
  const initialKind: Kind = route.params?.initialKind ?? 'MSG';
  const [kind, setKind] = useState<Kind>(initialKind);

  // Sync the active tab when this screen is navigated to with a new initialKind
  // param, e.g. when tapping a tile on the Today page that deep-links to WHEN.
  useEffect(() => {
    if (route.params?.initialKind) {
      setKind(route.params.initialKind);
    }
  }, [route.params?.initialKind]);

  const { today, settings } = useDay();
  const currentChapter = settings.currentChapter;
  const bookCompleted = !!settings.bookCompleted;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={styles.container}>
        <View style={styles.topRow}>
          <Text style={text.eyebrow}>Practice</Text>
          <PulsingMark size={56} />
        </View>
        <Text style={styles.title}>Choose your technology</Text>
        <Text style={styles.body}>
          One gentle dose. You can always come back for more.
        </Text>

        <TourCard
          storageKey="practice"
          title="Soul Technologies."
          tips={[
            'MSG, gestures the body remembers. SEE, sensual exercises that surface hidden belief.',
            'WHEN, trigger-specific gestures for a moment of shame, grief, fear, or joy.',
            'New practices arrive gently as you move through the book, one chapter at a time.',
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
          ? renderPracticeList({ kind, today, navigation, currentChapter, bookCompleted })
          : renderTriggerList({ currentChapter, bookCompleted, navigation })}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function renderPracticeList({
  kind,
  today,
  navigation,
  currentChapter,
  bookCompleted,
}: {
  kind: PracticeKind;
  today: ReturnType<typeof useDay>['today'];
  navigation: Props['navigation'];
  currentChapter: number | undefined;
  bookCompleted: boolean;
}) {
  const all = kind === 'MSG' ? msgPractices : seePractices;
  // Only the current chapter and earlier (plus the Introduction) are shown.
  // Future chapters stay hidden until the reader reaches them.
  const list = all.filter((p) =>
    isChapterUnlocked(p.chapter, currentChapter, bookCompleted)
  );
  const doneForKind = kind === 'MSG' ? today.msgDone : today.seeDone;
  const doneId = kind === 'MSG' ? today.msgPracticeId : today.seePracticeId;

  return list.map((p) => {
    const isDone = doneForKind && doneId === p.id;
    return (
      <Pressable
        key={p.id}
        onPress={() => {
          nav();
          navigation.navigate('PracticeDetail', { practiceId: p.id });
        }}
        accessibilityRole="button"
        accessibilityLabel={`Open practice: ${p.title}`}
        style={({ pressed, focused }: any) => [
          { marginBottom: 12 },
          pressed && pressScale,
          focused && webFocus,
        ]}
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
  bookCompleted,
  navigation,
}: {
  currentChapter: number | undefined;
  bookCompleted: boolean;
  navigation: Props['navigation'];
}) {
  // The WHEN gestures are a supplementary library, the whole of which opens
  // once the reader reaches Chapter Nine, or marks the book complete. Before
  // then nothing is rendered, no locked teasers.
  const libraryOpen = bookCompleted || currentChapter === 9;

  if (!libraryOpen) {
    return (
      <View style={styles.whenIntro}>
        <Text style={styles.whenIntroText}>
          When the old thread pulls, reach for the matching gesture.
        </Text>
        <Text style={[styles.whenIntroText, { marginTop: 8 }]}>
          This flowing library of gestures opens as you reach Chapter Nine, or
          when you mark the book complete.
        </Text>
      </View>
    );
  }

  const list = triggerGestures.filter((g) =>
    isChapterUnlocked(g.chapter, currentChapter, bookCompleted)
  );

  return (
    <>
      <View style={styles.whenIntro}>
        <Text style={styles.whenIntroText}>
          When the old thread pulls, reach for the matching gesture. A flowing
          library, for every kind of ache.
        </Text>
      </View>
      {list.map((g) => {
        const chapter = chapterById(g.chapter);
        return (
          <Pressable
            key={g.id}
            onPress={() => {
              nav();
              navigation.navigate('TriggerDetail', { triggerId: g.id });
            }}
            accessibilityRole="button"
            accessibilityLabel={`Open gesture: ${g.title}`}
            style={({ pressed, focused }: any) => [
              { marginBottom: 12 },
              pressed && pressScale,
              focused && webFocus,
            ]}
          >
            <View style={[styles.card, shadows.sm]}>
              <View style={styles.cardRow}>
                <View style={styles.cardLeft}>
                  <Text style={styles.triggerWhen}>{g.trigger}</Text>
                  <Text style={styles.cardTitle}>{g.title}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color={colors.inkFaint}
                />
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
                    {`${chapter?.shortTitle ?? 'Ch.'} · ${g.theme}`}
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
      onPress={() => {
        tap();
        onPress();
      }}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`${label}: ${description}`}
      style={({ pressed, focused }: any) => [
        styles.segBtn,
        active && styles.segBtnActive,
        pressed && pressScale,
        focused && webFocus,
      ]}
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
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 20,
  },
  cardDone: {
    backgroundColor: colors.doneSoft,
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
