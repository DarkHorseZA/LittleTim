import React from 'react';
import {
  Image,
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
import { RootStackParamList } from '../navigation/types';
import { colors, gradients, radius, shadows } from '../theme/colors';
import { fonts, text } from '../theme/type';
import { Button } from '../components/Button';
import { AUTHOR_NAME, BOOK_TITLE } from '../config';
import { useDay } from '../store/DayContext';

type Props = NativeStackScreenProps<RootStackParamList, 'HowToUse'>;

export function HowToUseScreen({ navigation, route }: Props) {
  const firstRun = route.params?.firstRun === true;
  const { settings, updateSettings } = useDay();

  const done = async () => {
    await updateSettings({ hasSeenHowTo: true });
    if (firstRun) {
      if (!settings.baseline) {
        navigation.replace('Baseline', { firstRun: true });
      } else {
        navigation.replace('Tabs', { screen: 'Today' });
      }
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={gradients.dawnDeep}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.hero}
      />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {!firstRun ? (
          <View style={styles.topRow}>
            <Pressable
              hitSlop={16}
              onPress={() => navigation.goBack()}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <Ionicons name="close" size={22} color={colors.ink} />
            </Pressable>
          </View>
        ) : null}

        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
          <View style={styles.masthead}>
            <Image
              source={require('../../assets/brand/icon.png')}
              style={styles.mark}
              resizeMode="contain"
              accessibilityLabel="re-Genesis mark"
            />
            <View style={styles.mastheadText}>
              <Text style={styles.eyebrow}>How to use</Text>
              <Text style={styles.title}>re-Genesis</Text>
              <Text style={styles.attribution}>
                Companion to {BOOK_TITLE} by {AUTHOR_NAME}
              </Text>
            </View>
          </View>

          <View style={styles.lead}>
            <Text style={styles.leadText}>
              {`\u201CThe book is the thread. This app is the needle you pick up each day.\u201D`}
            </Text>
          </View>

          <Section eyebrow="What this is">
            <Body>
              re-Genesis is a process, unravelling an inherited thread of
              Fear and resewing with Love, one small stitch at a time. The
              book holds the teaching. The app holds the daily rhythm.
            </Body>
          </Section>

          <Section eyebrow="Three soul technologies">
            <View style={styles.techRow}>
              <View style={styles.techCircle}>
                <Text style={styles.techLetter}>M</Text>
              </View>
              <View style={styles.techText}>
                <Text style={styles.techTitle}>
                  MSG · Meditative Somatic Gesture
                </Text>
                <Body>
                  Gentle gestures that let the body remember. Practice, not
                  performance. Repetition unravels and resews.
                </Body>
              </View>
            </View>

            <View style={{ height: 16 }} />

            <View style={styles.techRow}>
              <View
                style={[styles.techCircle, { backgroundColor: colors.relationships }]}
              >
                <Text style={styles.techLetter}>S</Text>
              </View>
              <View style={styles.techText}>
                <Text style={styles.techTitle}>
                  SEE · Somatic Experiencing Exercise
                </Text>
                <Body>
                  Simple sensual exercises, using sight, touch, smell, sound,
                  taste, to discover hidden belief and feel it shift.
                </Body>
              </View>
            </View>

            <View style={{ height: 16 }} />

            <View style={styles.techRow}>
              <View
                style={[styles.techCircle, { backgroundColor: colors.clayDeep }]}
              >
                <Text style={styles.techLetter}>W</Text>
              </View>
              <View style={styles.techText}>
                <Text style={styles.techTitle}>
                  WHEN · Trigger-specific gestures
                </Text>
                <Body>
                  For the moment the old thread pulls. Twenty-one gestures,
                  one for each kind of ache, unlocking as you move through
                  the book.
                </Body>
              </View>
            </View>
          </Section>

          <Section eyebrow="A day in re-Genesis">
            <Rhythm
              icon="sunny-outline"
              time="Morning"
              duration="5 min"
              title="The Five Gestures"
              body="Feel · whisper · touch · breathe · bless. The anchor of each day."
            />
            <Rhythm
              icon="sparkles-outline"
              time="Anytime"
              duration="1 min"
              title="Today's belief"
              body="A statement and a somatic embedding, tied to where you are in the book."
            />
            <Rhythm
              icon="moon-outline"
              time="Evening"
              duration="2 min"
              title="Patchwork Journal"
              body="Two short sentences: one stitch you sewed, one moment the old thread pulled."
            />
            <Rhythm
              icon="calendar-outline"
              time="Daily"
              duration="2 min"
              title="Wellness check-in"
              body="Five sliders, happiness, loved, health, wealth, relationships. One reading a day, measured against your baseline."
            />
          </Section>

          <Section eyebrow="Where are you in the book?">
            <Body>
              Each chapter has its own belief, MSG, and SEE. In Settings, tell
              the app which chapter you're reading, Today will follow that
              chapter until you move on. Leave it on Auto to let the app
              rotate through all chapters.
            </Body>
          </Section>

          <View style={styles.reminder}>
            <Ionicons
              name="leaf-outline"
              size={18}
              color={colors.clayDeep}
              style={{ marginBottom: 8 }}
            />
            <Text style={styles.reminderText}>
              {`\u201CRepetition unravels and resews. Small stitches make the quilt.\u201D`}
            </Text>
          </View>

          <View style={{ height: 24 }} />
          <Button
            title={firstRun ? 'Begin' : 'Got it'}
            icon={firstRun ? 'arrow-forward' : 'checkmark'}
            onPress={done}
            size="lg"
          />
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Section({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionEyebrow}>{eyebrow}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return <Text style={styles.body}>{children}</Text>;
}

function Rhythm({
  icon,
  time,
  duration,
  title,
  body,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  time: string;
  duration: string;
  title: string;
  body: string;
}) {
  return (
    <View style={styles.rhythmRow}>
      <View style={styles.rhythmIcon}>
        <Ionicons name={icon} size={18} color={colors.clayDeep} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.rhythmHead}>
          <Text style={styles.rhythmTime}>{time}</Text>
          <Text style={styles.rhythmDuration}>· {duration}</Text>
        </View>
        <Text style={styles.rhythmTitle}>{title}</Text>
        <Text style={styles.rhythmBody}>{body}</Text>
      </View>
    </View>
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  masthead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 24,
  },
  mark: {
    width: 88,
    height: 88,
    marginLeft: -8,
  },
  mastheadText: {
    flex: 1,
  },
  eyebrow: {
    ...text.eyebrow,
    marginBottom: 4,
  },
  title: {
    fontFamily: fonts.serifBold,
    fontSize: 44,
    lineHeight: 52,
    color: colors.ink,
  },
  attribution: {
    fontFamily: fonts.serifItalic,
    fontSize: 14,
    color: colors.inkSoft,
    marginTop: 6,
  },
  lead: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 20,
    ...shadows.sm,
    marginBottom: 24,
  },
  leadText: {
    fontFamily: fonts.serifItalic,
    fontSize: 18,
    lineHeight: 26,
    color: colors.ink,
  },
  section: {
    marginBottom: 24,
  },
  sectionEyebrow: {
    ...text.eyebrow,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 20,
    ...shadows.sm,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 23,
    color: colors.ink,
  },
  techRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  techCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.clay,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  techLetter: {
    fontFamily: fonts.serifBold,
    color: '#FFFFFF',
    fontSize: 20,
  },
  techText: {
    flex: 1,
  },
  techTitle: {
    fontFamily: fonts.sansSemi,
    fontSize: 15,
    color: colors.ink,
    marginBottom: 4,
  },
  rhythmRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  rhythmIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.clayWash,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  rhythmHead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  rhythmTime: {
    fontFamily: fonts.sansSemi,
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.clayDeep,
    textTransform: 'uppercase',
  },
  rhythmDuration: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.inkFaint,
    marginLeft: 4,
  },
  rhythmTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 16,
    color: colors.ink,
    marginTop: 2,
  },
  rhythmBody: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 19,
    color: colors.inkSoft,
    marginTop: 2,
  },
  reminder: {
    backgroundColor: colors.claySoft,
    borderRadius: radius.lg,
    padding: 20,
    alignItems: 'center',
    marginTop: 0,
  },
  reminderText: {
    fontFamily: fonts.serifItalic,
    fontSize: 17,
    lineHeight: 24,
    color: colors.ink,
    textAlign: 'center',
  },
});
