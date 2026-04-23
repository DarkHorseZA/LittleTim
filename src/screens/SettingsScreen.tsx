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
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabsParamList } from '../navigation/types';
import { colors, layout, radius, shadows } from '../theme/colors';
import { fonts, text } from '../theme/type';
import { APP_NAME, ATTRIBUTION } from '../config';
import { useDay } from '../store/DayContext';
import { chapters } from '../data/chapters';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabsParamList, 'Settings'>,
  NativeStackScreenProps<RootStackParamList>
>;

const HOURS = [6, 7, 8, 9, 10, 12, 18, 20];

function initials(name?: string): string | null {
  if (!name) return null;
  const parts = name.trim().split(/\s+/).slice(0, 2);
  const joined = parts.map((p) => p[0]?.toUpperCase() ?? '').join('');
  return joined.length > 0 ? joined : null;
}

function ChapterChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chapterChip, selected && styles.chapterChipOn]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`Chapter: ${label}`}
    >
      <Text
        style={[
          styles.chapterChipText,
          selected && styles.chapterChipTextOn,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function SettingsScreen({ navigation }: Props) {
  const { settings, updateSettings } = useDay();
  const profile = settings.profile ?? {};
  const signedIn = !!profile.displayName;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        <Text style={text.eyebrow}>Settings</Text>
        <Text style={styles.title}>{APP_NAME}</Text>
        <Text style={styles.body}>
          Calibrate the quiet rhythm of your day.
        </Text>

        <Pressable
          onPress={() => navigation.navigate('Account')}
          accessibilityRole="button"
          accessibilityLabel={signedIn ? `Account: ${profile.displayName}` : 'Open account to sign in or set a display name'}
        >
          <View style={styles.accountCard}>
            <View
              style={[
                styles.avatar,
                !signedIn && { backgroundColor: colors.clayWash },
              ]}
            >
              {initials(profile.displayName) ? (
                <Text
                  style={[
                    styles.avatarText,
                    !signedIn && { color: colors.clay },
                  ]}
                >
                  {initials(profile.displayName)}
                </Text>
              ) : (
                <Ionicons
                  name="person"
                  size={22}
                  color={signedIn ? '#FFFFFF' : colors.clay}
                />
              )}
            </View>
            <View style={styles.accountText}>
              <Text style={styles.accountName}>
                {profile.displayName || 'Guest'}
              </Text>
              <Text style={styles.accountSub}>
                {signedIn
                  ? profile.email || 'Local account'
                  : 'Tap to sign in or set a display name'}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.inkFaint}
            />
          </View>
        </Pressable>

        <View style={{ height: 14 }} />

        <Pressable
          onPress={() => navigation.navigate('HowToUse')}
          accessibilityRole="button"
          accessibilityLabel="How to use re-Genesis: the rhythm of a day in the practice"
        >
          <View style={styles.linkCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="compass-outline" size={16} color={colors.clay} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>How to use re-Genesis</Text>
              <Text style={styles.linkSub}>
                The rhythm of a day in the practice.
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.inkFaint}
            />
          </View>
        </Pressable>

        <View style={{ height: 10 }} />

        <Pressable
          onPress={() => navigation.navigate('Glossary')}
          accessibilityRole="button"
          accessibilityLabel="Open glossary of terms from the book"
        >
          <View style={styles.linkCard}>
            <View style={styles.iconCircle}>
              <Ionicons
                name="book-outline"
                size={16}
                color={colors.clay}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Glossary</Text>
              <Text style={styles.linkSub}>
                Words from the book, MSG, SEE, bārak, ruach, and more.
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.inkFaint}
            />
          </View>
        </Pressable>

        <View style={{ height: 10 }} />

        <Pressable
          onPress={() => navigation.navigate('Baseline', { firstRun: false })}
          accessibilityRole="button"
          accessibilityLabel={
            settings.baseline
              ? 'Retake your wellness baseline'
              : 'Set your wellness baseline'
          }
        >
          <View style={styles.linkCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="pulse-outline" size={16} color={colors.clay} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>
                {settings.baseline ? 'Retake baseline' : 'Set baseline'}
              </Text>
              <Text style={styles.linkSub}>
                {settings.baseline
                  ? `Captured ${settings.baseline.capturedOn}. Update it any time.`
                  : 'Five gentle readings that mark where you start.'}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.inkFaint}
            />
          </View>
        </Pressable>

        <View style={{ height: 14 }} />

        <View style={styles.card}>
          <View style={styles.cardHead}>
            <View style={styles.iconCircle}>
              <Ionicons name="book-outline" size={16} color={colors.clay} />
            </View>
            <Text style={styles.cardTitle}>Where are you in the book?</Text>
          </View>
          <Text style={styles.cardBody}>
            When you set your chapter, today's belief and practice follow the
            chapter. Leave it blank to let the app rotate a different one
            each day.
          </Text>
          {/* Top-level: Auto + Introduction. These two are always visible. */}
          <View style={styles.chapters}>
            <Pressable
              onPress={() => updateSettings({ currentChapter: undefined })}
              style={[
                styles.chapterChip,
                settings.currentChapter === undefined && styles.chapterChipOn,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: settings.currentChapter === undefined }}
              accessibilityLabel="Auto chapter, rotate through all chapters"
            >
              <Text
                style={[
                  styles.chapterChipText,
                  settings.currentChapter === undefined &&
                    styles.chapterChipTextOn,
                ]}
              >
                Auto
              </Text>
            </Pressable>
            {chapters
              .filter((ch) => ch.part === undefined)
              .map((ch) => (
                <ChapterChip
                  key={ch.id}
                  label={ch.shortTitle}
                  selected={settings.currentChapter === ch.id}
                  onPress={() => updateSettings({ currentChapter: ch.id })}
                />
              ))}
          </View>

          <Text style={styles.partLabel}>Part One</Text>
          <View style={styles.chapters}>
            {chapters
              .filter((ch) => ch.part === 'One')
              .map((ch) => (
                <ChapterChip
                  key={ch.id}
                  label={ch.shortTitle}
                  selected={settings.currentChapter === ch.id}
                  onPress={() => updateSettings({ currentChapter: ch.id })}
                />
              ))}
          </View>

          <Text style={styles.partLabel}>Part Two</Text>
          <View style={styles.chapters}>
            {chapters
              .filter((ch) => ch.part === 'Two')
              .map((ch) => (
                <ChapterChip
                  key={ch.id}
                  label={ch.shortTitle}
                  selected={settings.currentChapter === ch.id}
                  onPress={() => updateSettings({ currentChapter: ch.id })}
                />
              ))}
          </View>
        </View>

        <View style={{ height: 14 }} />

        <View style={styles.card}>
          <View style={styles.cardHead}>
            <View style={styles.iconCircle}>
              <Ionicons name="sparkles-outline" size={16} color={colors.clay} />
            </View>
            <Text style={styles.cardTitle}>Belief reminder hour</Text>
          </View>
          <Text style={styles.cardBody}>
            The daily belief appears the first time you open the app on or
            after this hour.
          </Text>
          <View style={styles.hours}>
            {HOURS.map((h) => {
              const on = settings.reminderHour === h;
              return (
                <Pressable
                  key={h}
                  onPress={() => updateSettings({ reminderHour: h })}
                  style={[styles.hour, on && styles.hourOn]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={`Reminder at ${h} o'clock`}
                >
                  <Text style={[styles.hourText, on && styles.hourTextOn]}>
                    {h}:00
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ height: 14 }} />

        <Pressable
          onPress={() => navigation.navigate('Connect')}
          accessibilityRole="button"
          accessibilityLabel="Connect with T: sessions, talks, reader circle, and the book"
        >
          <View style={[styles.card, { backgroundColor: colors.clayWash }]}>
            <View style={styles.cardHead}>
              <View
                style={[styles.iconCircle, { backgroundColor: colors.surface }]}
              >
                <Ionicons
                  name="heart-circle-outline"
                  size={16}
                  color={colors.clay}
                />
              </View>
              <Text style={styles.cardTitle}>Connect with T</Text>
              <View style={{ flex: 1 }} />
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.inkFaint}
              />
            </View>
            <Text style={[styles.cardBody, { color: colors.ink }]}>
              Book a session, invite T to speak, join the reader circle, get
              the book in any format, or be notified when the next one lands.
            </Text>
          </View>
        </Pressable>

        <View style={{ height: 28 }} />
        <Image
          source={require('../../assets/brand/logo-landscape.png')}
          style={styles.brandMark}
          resizeMode="contain"
          accessibilityLabel="re-Genesis wordmark"
        />
        <Text style={styles.footer}>{ATTRIBUTION}</Text>
        <Text style={styles.footerFaint}>
          v0.4 · Local-only. Your entries stay on this device.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flexGrow: 1, padding: layout.screen, paddingBottom: 40 },
  title: { ...text.h1, marginTop: 8, marginBottom: 6 },
  body: { ...text.body, marginBottom: 20 },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
    ...shadows.sm,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.clay,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontFamily: fonts.serifBold,
    fontSize: 22,
    color: '#FFFFFF',
  },
  accountText: {
    flex: 1,
  },
  accountName: {
    fontFamily: fonts.serifBold,
    fontSize: 17,
    color: colors.ink,
  },
  accountSub: {
    ...text.caption,
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 20,
    ...shadows.sm,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.clayWash,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 17,
    color: colors.ink,
  },
  cardBody: {
    ...text.body,
    marginBottom: 14,
  },
  hours: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  hour: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.lineSoft,
  },
  hourOn: { backgroundColor: colors.clay },
  hourText: {
    color: colors.inkSoft,
    fontFamily: fonts.sansSemi,
    fontSize: 13,
  },
  hourTextOn: { color: '#fff' },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
    ...shadows.sm,
  },
  linkSub: {
    ...text.caption,
    marginTop: 2,
  },
  chapters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  partLabel: {
    ...text.eyebrow,
    marginTop: 14,
    marginBottom: 10,
  },
  chapterChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.lineSoft,
  },
  chapterChipOn: {
    backgroundColor: colors.clay,
  },
  chapterChipText: {
    color: colors.inkSoft,
    fontFamily: fonts.sansSemi,
    fontSize: 13,
  },
  chapterChipTextOn: {
    color: '#fff',
  },
  brandMark: {
    width: 180,
    height: 72,
    alignSelf: 'center',
    marginBottom: 14,
    opacity: 0.9,
  },
  footer: {
    fontFamily: fonts.serifItalic,
    fontSize: 13,
    color: colors.inkSoft,
    textAlign: 'center',
    marginBottom: 6,
  },
  footerFaint: {
    ...text.caption,
    textAlign: 'center',
  },
});
