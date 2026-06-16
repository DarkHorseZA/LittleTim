import React, { useEffect, useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabsParamList } from '../navigation/types';
import { colors, gradients, layout, radius, shadows } from '../theme/colors';
import { nav, pressScale, webFocus } from '../theme/interactions';
import { fonts, text } from '../theme/type';
import { Button } from '../components/Button';
import { PatchworkQuilt } from '../components/PatchworkQuilt';
import { PulsingMark } from '../components/PulsingMark';
import { TourCard } from '../components/TourCard';
import { APP_NAME_DISPLAY_CAPS } from '../config';
import { beliefForDate } from '../data/beliefs';
import { msgPractices, seePractices } from '../data/practices';
import { Practice } from '../types';
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
  const { ready, today, settings, updateSettings } = useDay();
  const now = useMemo(() => new Date(), []);
  const belief = useMemo(
    () => beliefForDate(now, settings.currentChapter),
    [now, settings.currentChapter]
  );
  const firstName = (settings.profile?.displayName ?? '').split(' ')[0];

  useEffect(() => {
    // Wait for the initial load to hydrate before reading/writing settings, so a
    // cold-start mount here cannot persist defaults over the stored values.
    if (!ready) return;
    const key = todayKey(now);
    if (settings.lastBeliefSeenOn !== key) {
      updateSettings({ lastBeliefSeenOn: key });
      const t = setTimeout(() => navigation.navigate('Belief'), 320);
      return () => clearTimeout(t);
    }
  }, [ready, navigation, settings.lastBeliefSeenOn, now, updateSettings]);

  const msgDone = today.msgDone;
  const seeDone = today.seeDone;
  const ritualDone = !!today.morningRitualDone;
  const trackerDoneToday = settings.lastCheckInDate === todayKey(now);

  const currentChapter = settings.currentChapter;
  const bookCompleted = !!settings.bookCompleted;
  const whenUnlocked = currentChapter === 9 || bookCompleted;

  // The practice for today is the one matching the current chapter, or the
  // Introduction practice as a fallback when no chapter is selected.
  const todayMsg = practiceForChapter(msgPractices, currentChapter);
  const todaySee = practiceForChapter(seePractices, currentChapter);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={gradients.dawnDeep}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.hero}
      />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView
        showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={styles.container}>
          <View style={styles.topRow}>
            <Text style={styles.brand}>{APP_NAME_DISPLAY_CAPS}</Text>
            <Pressable
              onPress={() => {
                nav();
                navigation.navigate('Belief');
              }}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Open today’s belief reminder"
              style={({ pressed, focused }: any) => [
                pressed && pressScale,
                focused && webFocus,
              ]}
            >
              <PulsingMark size={56} accessibilityLabel="re-Genesis mark, today’s belief" />
            </Pressable>
          </View>

          <Text style={styles.greeting}>
            {greet(now)}
            {firstName ? `, ${firstName}` : ''}
          </Text>
          <Text style={styles.date}>{prettyDate(now)}</Text>
          <Text style={styles.quiltLine}>
            {'\u201C'}One stitch today. Small stitches become the quilt.{'\u201D'}
          </Text>

          <TourCard
            storageKey="today"
            title="This is Today."
            tips={[
              'Tap the Morning Ritual to begin the Five Gestures, under five minutes, the anchor of your day.',
              'Your streak grows when you complete the ritual, an MSG, or an SEE.',
              'Tap today’s belief card for its somatic embedding, a small thing to do with your body.',
            ]}
          />

          <Pressable
            onPress={() => {
              nav();
              navigation.navigate('MorningRitual');
            }}
            accessibilityRole="button"
            accessibilityLabel={ritualDone ? 'Practice the morning ritual again' : 'Begin the morning ritual, the Five Gestures'}
            style={({ pressed, focused }: any) => [
              pressed && pressScale,
              focused && webFocus,
            ]}
          >
            <LinearGradient
              colors={ritualDone ? gradients.sage : gradients.clay}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ritualHero}
            >
              <View style={styles.ritualTop}>
                <Text style={styles.ritualEyebrow}>
                  {ritualDone ? 'Sewn today' : 'Morning ritual'}
                </Text>
                <View style={styles.ritualBadge}>
                  <Ionicons
                    name={ritualDone ? 'checkmark-circle' : 'sunny'}
                    size={18}
                    color={colors.white}
                  />
                </View>
              </View>
              <Text style={styles.ritualTitle}>
                {ritualDone ? 'One more stitch.' : 'The Five Gestures'}
              </Text>
              <Text style={styles.ritualBody}>
                {ritualDone
                  ? 'You met the day with love. Return any time to sew another stitch.'
                  : 'Feel · whisper · touch · breathe · bless. Under five minutes.'}
              </Text>
              <View style={styles.ritualCta}>
                <Text style={styles.ritualCtaText}>
                  {ritualDone ? 'Practice again' : 'Begin'}
                </Text>
                <Ionicons name="arrow-forward" size={16} color={colors.white} />
              </View>
            </LinearGradient>
          </Pressable>

          <View style={{ height: 16 }} />

          {/* Patchwork Quilt — compact (4-week grid, stats, tap-to-detail) */}
          <View style={styles.quiltSection}>
            <Text style={styles.quiltOverline}>YOUR PATCHWORK QUILT</Text>
            <Text style={styles.quiltTagline}>
              {'“'}Stitch by little stitch, it becomes beautiful.{'”'}
            </Text>
          </View>
          <PatchworkQuilt size="compact" />

          <Pressable
            onPress={() => {
              nav();
              navigation.navigate('Belief');
            }}
            accessibilityRole="button"
            accessibilityLabel={`Open belief reminder: ${belief.statement}`}
            style={({ pressed, focused }: any) => [
              pressed && pressScale,
              focused && webFocus,
            ]}
          >
            <LinearGradient
              colors={gradients.heart}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.beliefCard}
            >
              <Text style={text.eyebrow}>{'Today’s belief'}</Text>
              <Text style={styles.beliefStatement}>
                {'“'}{belief.statement}{'”'}
              </Text>
              <View style={styles.beliefFooter}>
                <Text style={styles.beliefFooterText}>Open reminder</Text>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={colors.clayDeep}
                />
              </View>
            </LinearGradient>
          </Pressable>

          <View style={styles.sectionHead}>
            <Text style={text.eyebrow}>Go deeper</Text>
            <Text style={styles.sectionTitle}>Soul Technologies</Text>
            <Text style={styles.sectionBody}>
              Small and daily beats big and rare.
            </Text>
          </View>

          <PracticeTile
            kind="MSG"
            title="Meditative Somatic Gestures"
            body="Gentle, repeatable shapes the body remembers."
            done={msgDone}
            onPress={() =>
              navigation.navigate('PracticeDetail', { practiceId: todayMsg.id, source: 'today' })
            }
          />
          <View style={{ height: 12 }} />
          <PracticeTile
            kind="SEE"
            title="Somatic Experiencing Exercises"
            body="Complete what the body started. Rebuild capacity."
            done={seeDone}
            onPress={() =>
              navigation.navigate('PracticeDetail', { practiceId: todaySee.id, source: 'today' })
            }
          />
          {whenUnlocked && (
            <>
              <View style={{ height: 12 }} />
              <PracticeTile
                kind="WHEN"
                title="For the moment"
                body="Trigger-specific gestures. A gesture for every kind of ache."
                done={false}
                onPress={() =>
                  navigation.navigate('Practice', { initialKind: 'WHEN' })
                }
              />
            </>
          )}

          <View style={styles.sectionHead}>
            <Text style={text.eyebrow}>How are we sewing?</Text>
            <Text style={styles.sectionTitle}>
              {trackerDoneToday
                ? 'Reflection complete'
                : 'A moment to notice'}
            </Text>
            <Text style={styles.sectionBody}>
              {trackerDoneToday
                ? 'You\u2019ve already reflected today. Come back tomorrow, the thread moves slowly.'
                : 'Not a survey. Just a gentle pause, whenever you\u2019re ready.'}
            </Text>
          </View>
          <Button
            title={
              trackerDoneToday
                ? 'See today\u2019s reflection'
                : 'A moment to notice'
            }
            onPress={() => navigation.navigate('Tracker')}
            size="lg"
            trailingIcon="arrow-forward"
          />

          <View style={styles.sectionHead}>
            <Text style={text.eyebrow}>Connect</Text>
            <Text style={styles.sectionTitle}>Stay with the thread</Text>
            <Text style={styles.sectionBody}>
              Work with T, find the book, or hear when the next one lands.
            </Text>
          </View>
          <Pressable
            onPress={() => {
              nav();
              navigation.navigate('Connect');
            }}
            style={({ pressed, focused }: any) => [
              styles.connectCard,
              pressed && pressScale,
              focused && webFocus,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Connect with T: sessions, talks, reader circle, and the book"
          >
            <View style={styles.connectIcon}>
              <Ionicons
                name="heart-circle-outline"
                size={22}
                color={colors.clay}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.connectTitle}>Connect with T</Text>
              <Text style={styles.connectBody}>
                Sessions, talks, reader circle, the book in every format.
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.inkFaint}
            />
          </Pressable>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// Returns the practice for the given chapter, falling back to the Introduction
// practice (index 0) when no chapter is set or no match is found.
function practiceForChapter(practices: Practice[], chapter: number | undefined): Practice {
  if (chapter !== undefined) {
    const match = practices.find((p) => p.chapter === chapter);
    if (match) return match;
  }
  return practices[0];
}

function greet(d: Date): string {
  const h = d.getHours();
  if (h < 5) return 'Still up';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'Gentle night';
}

function PracticeTile({
  kind,
  title,
  body,
  done,
  onPress,
}: {
  kind: 'MSG' | 'SEE' | 'WHEN';
  title: string;
  body: string;
  done: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={() => {
        nav();
        onPress();
      }}
      style={({ pressed, focused }: any) => [
        pressed && pressScale,
        focused && webFocus,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${kind}: ${title}. ${done ? 'Complete for today.' : 'Tap to begin.'}`}
      accessibilityHint={`${body}`}
    >
      <View
        style={[
          styles.tile,
          shadows.sm,
          done && styles.tileDone,
        ]}
      >
        <View style={styles.tileRow}>
          <View
            style={[
              styles.kindBadge,
              done && styles.kindBadgeDone,
            ]}
          >
            <Text style={[styles.kindBadgeText, done && styles.kindBadgeTextDone]}>
              {kind}
            </Text>
          </View>
          <View style={styles.tileCheck}>
            {done ? (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={colors.done}
              />
            ) : (
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.inkFaint}
              />
            )}
          </View>
        </View>
        <Text style={styles.tileTitle}>{title}</Text>
        <Text style={styles.tileBody}>{body}</Text>
        <View style={styles.tileFooter}>
          <Text style={[styles.tileStatus, done && styles.tileStatusDone]}>
            {done ? 'Complete for today' : 'Tap to begin'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  connectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
    ...shadows.sm,
  },
  connectIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.clayWash,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  connectTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 17,
    color: colors.ink,
  },
  connectBody: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 18,
    color: colors.inkSoft,
    marginTop: 2,
  },
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  hero: {
    ...StyleSheet.absoluteFillObject,
    height: 320,
    bottom: undefined,
  },
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
    marginTop: 4,
  },
  brand: {
    fontFamily: fonts.sansBold,
    fontSize: 13,
    letterSpacing: 3,
    color: colors.clayDeep,
  },
  greeting: {
    ...text.body,
    marginTop: 20,
    fontSize: 14,
  },
  date: {
    ...text.display,
    marginTop: 2,
    marginBottom: 10,
  },
  quiltLine: {
    fontFamily: fonts.serifItalic,
    fontSize: 14,
    lineHeight: 20,
    color: colors.inkSoft,
    marginBottom: 22,
  },
  ritualHero: {
    borderRadius: radius.xl,
    padding: 22,
    overflow: 'hidden',
    ...shadows.md,
  },
  ritualTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ritualEyebrow: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 2.2,
    color: colors.onClaySoft,
    textTransform: 'uppercase',
  },
  ritualBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.onClayChip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ritualTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 30,
    lineHeight: 36,
    color: colors.white,
    marginTop: 12,
  },
  ritualBody: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.onClayStrong,
    marginTop: 8,
  },
  ritualCta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  ritualCtaText: {
    fontFamily: fonts.sansBold,
    fontSize: 13,
    letterSpacing: 1.2,
    color: colors.white,
    marginRight: 6,
    textTransform: 'uppercase',
  },
  quiltSection: {
    marginBottom: 12,
  },
  quiltOverline: {
    fontFamily: fonts.sansBold,
    fontSize: 10,
    letterSpacing: 2.2,
    color: colors.inkFaint,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  quiltTagline: {
    fontFamily: fonts.serifItalic,
    fontSize: 14,
    lineHeight: 20,
    color: colors.inkSoft,
  },
  beliefCard: {
    borderRadius: radius.lg,
    padding: 22,
    marginBottom: 28,
    overflow: 'hidden',
  },
  beliefStatement: {
    fontFamily: fonts.serifItalic,
    fontSize: 22,
    lineHeight: 30,
    color: colors.ink,
    marginTop: 10,
  },
  beliefFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  beliefFooterText: {
    fontFamily: fonts.sansSemi,
    fontSize: 13,
    color: colors.clayDeep,
    marginRight: 6,
    letterSpacing: 0.3,
  },
  sectionHead: {
    marginTop: 32,
    marginBottom: 16,
  },
  sectionTitle: {
    ...text.h2,
    marginTop: 6,
  },
  sectionBody: {
    ...text.body,
    marginTop: 4,
  },
  tile: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 20,
  },
  tileDone: {
    backgroundColor: colors.doneSoft,
  },
  tileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kindBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.clay,
  },
  kindBadgeDone: {
    backgroundColor: colors.done,
  },
  kindBadgeText: {
    fontFamily: fonts.sansBold,
    color: colors.white,
    fontSize: 11,
    letterSpacing: 1.5,
  },
  kindBadgeTextDone: {
    color: colors.white,
  },
  tileCheck: {
    width: 28,
    alignItems: 'center',
  },
  tileTitle: {
    ...text.h2,
    fontSize: 20,
    marginTop: 12,
  },
  tileBody: {
    ...text.body,
    marginTop: 6,
  },
  tileFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.lineSoft,
  },
  tileStatus: {
    ...text.caption,
    fontFamily: fonts.sansSemi,
    letterSpacing: 0.5,
    color: colors.inkFaint,
  },
  tileStatusDone: {
    color: colors.done,
  },
});
