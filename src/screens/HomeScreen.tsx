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
import { colors, gradients, radius, shadows } from '../theme/colors';
import { fonts, text } from '../theme/type';
import { Button } from '../components/Button';
import { StreakStrip } from '../components/StreakStrip';
import { TourCard } from '../components/TourCard';
import { APP_NAME_DISPLAY_CAPS } from '../config';
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
  const { today, streak, entries, settings, updateSettings } = useDay();
  const now = useMemo(() => new Date(), []);
  const belief = useMemo(
    () => beliefForDate(now, settings.currentChapter),
    [now, settings.currentChapter]
  );
  const firstName = (settings.profile?.displayName ?? '').split(' ')[0];

  useEffect(() => {
    const key = todayKey(now);
    if (settings.lastBeliefSeenOn !== key) {
      updateSettings({ lastBeliefSeenOn: key });
      const t = setTimeout(() => navigation.navigate('Belief'), 320);
      return () => clearTimeout(t);
    }
  }, [navigation, settings.lastBeliefSeenOn, now, updateSettings]);

  const msgDone = today.msgDone;
  const seeDone = today.seeDone;
  const ritualDone = !!today.morningRitualDone;
  const trackerDone = !!today.tracker;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={gradients.dawnDeep}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.hero}
      />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.topRow}>
            <Text style={styles.brand}>{APP_NAME_DISPLAY_CAPS}</Text>
            <Pressable onPress={() => navigation.navigate('Belief')}>
              <Ionicons name="sparkles-outline" size={20} color={colors.clayDeep} />
            </Pressable>
          </View>

          <Text style={styles.greeting}>
            {greet(now)}
            {firstName ? `, ${firstName}` : ''}
          </Text>
          <Text style={styles.date}>{prettyDate(now)}</Text>

          <TourCard
            storageKey="today"
            title="This is Today."
            tips={[
              'Tap the Morning Ritual to begin the Five Gestures — under five minutes, the anchor of your day.',
              'Your streak grows when you complete the ritual, an MSG, or an SEE.',
              'Tap today\'s belief card for its somatic embedding — a small thing to do with your body.',
            ]}
          />

          <Pressable onPress={() => navigation.navigate('MorningRitual')}>
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
                    color="#FFFFFF"
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
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </View>
            </LinearGradient>
          </Pressable>

          <View style={{ height: 16 }} />

          <View style={styles.streakCard}>
            <View style={styles.streakTop}>
              <View>
                <Text style={text.eyebrow}>Current streak</Text>
                <View style={styles.streakNumRow}>
                  <Text style={text.number}>{streak}</Text>
                  <Text style={styles.streakUnit}>
                    {streak === 1 ? 'day' : 'days'}
                  </Text>
                </View>
              </View>
              <View style={styles.flameWrap}>
                <Ionicons
                  name="flame"
                  size={26}
                  color={streak > 0 ? colors.clay : colors.inkFaint}
                />
              </View>
            </View>
            <StreakStrip entries={entries} />
            <Text style={styles.streakHint}>
              A day counts when you complete the ritual, MSG, or SEE.
            </Text>
          </View>

          <Pressable onPress={() => navigation.navigate('Belief')}>
            <LinearGradient
              colors={gradients.heart}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.beliefCard}
            >
              <Text style={text.eyebrow}>Today's belief</Text>
              <Text style={styles.beliefStatement}>"{belief.statement}"</Text>
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
            <Text style={styles.sectionTitle}>Two soul technologies</Text>
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
              navigation.navigate('Practice', { initialKind: 'MSG' })
            }
          />
          <View style={{ height: 12 }} />
          <PracticeTile
            kind="SEE"
            title="Somatic Experiencing Exercises"
            body="Complete what the body started. Rebuild capacity."
            done={seeDone}
            onPress={() =>
              navigation.navigate('Practice', { initialKind: 'SEE' })
            }
          />

          <View style={styles.sectionHead}>
            <Text style={text.eyebrow}>Wellness tracker</Text>
            <Text style={styles.sectionTitle}>
              {trackerDone ? 'Checked in today' : 'How are you, really?'}
            </Text>
            <Text style={styles.sectionBody}>
              {trackerDone
                ? 'You can update your check-in any time.'
                : 'Five quick sliders, then a reflection prompt.'}
            </Text>
          </View>
          <Button
            title={trackerDone ? 'Update today’s check-in' : 'Start check-in'}
            onPress={() => navigation.navigate('Tracker')}
            size="lg"
            trailingIcon="arrow-forward"
          />

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
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
  kind: 'MSG' | 'SEE';
  title: string;
  body: string;
  done: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.9 }}>
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
    padding: 20,
    paddingBottom: 40,
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
    fontSize: 34,
    lineHeight: 40,
    marginTop: 2,
    marginBottom: 24,
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
    color: 'rgba(255,255,255,0.85)',
    textTransform: 'uppercase',
  },
  ritualBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ritualTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 30,
    lineHeight: 36,
    color: '#FFFFFF',
    marginTop: 12,
  },
  ritualBody: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.92)',
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
    color: '#FFFFFF',
    marginRight: 6,
    textTransform: 'uppercase',
  },
  streakCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 22,
    ...shadows.md,
    marginBottom: 20,
  },
  streakTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  streakNumRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 4,
  },
  streakUnit: {
    fontFamily: fonts.sansMed,
    fontSize: 14,
    color: colors.inkSoft,
    marginLeft: 8,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  flameWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.clayWash,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakHint: {
    ...text.caption,
    marginTop: 12,
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
    marginTop: 8,
    marginBottom: 12,
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
    color: '#FFFFFF',
    fontSize: 11,
    letterSpacing: 1.5,
  },
  kindBadgeTextDone: {
    color: '#FFFFFF',
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
