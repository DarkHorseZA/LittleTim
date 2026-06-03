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
import { RootStackParamList } from '../navigation/types';
import { colors, layout, radius, shadows } from '../theme/colors';
import { nav, pressScale, tap, webFocus } from '../theme/interactions';
import { fonts, text } from '../theme/type';
import { APP_NAME, ATTRIBUTION } from '../config';
import { useDay } from '../store/DayContext';
import { chapters } from '../data/chapters';
import { PulsingMark } from '../components/PulsingMark';
import { BackButton } from '../components/BackButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

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
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed, focused }: any) => [
        styles.chapterChip,
        selected && styles.chapterChipOn,
        pressed && { transform: [{ scale: 0.97 }] },
        focused && webFocus,
      ]}
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
      <View style={styles.navRow}>
        <BackButton onPress={() => navigation.navigate('Tabs', { screen: 'More' })} variant="solid" />
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        <View style={styles.topRow}>
          <Text style={text.eyebrow}>Settings</Text>
          <PulsingMark size={56} />
        </View>
        <Text style={styles.title}>{APP_NAME}</Text>
        <Text style={styles.body}>
          Calibrate the quiet rhythm of your day.
        </Text>

        <Pressable
          onPress={() => {
            nav();
            navigation.navigate('Account');
          }}
          accessibilityRole="button"
          accessibilityLabel={signedIn ? `Account: ${profile.displayName}` : 'Open account to sign in or set a display name'}
          style={({ pressed, focused }: any) => [
            pressed && pressScale,
            focused && webFocus,
          ]}
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
                  color={signedIn ? colors.white : colors.clay}
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


        <View style={{ height: 10 }} />

        <Pressable
          onPress={() => {
            nav();
            navigation.navigate('Tracker');
          }}
          accessibilityRole="button"
          accessibilityLabel="Open reflection"
          style={({ pressed, focused }: any) => [
            pressed && pressScale,
            focused && webFocus,
          ]}
        >
          <View style={styles.linkCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="leaf-outline" size={16} color={colors.clay} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>How are we sewing?</Text>
              <Text style={styles.linkSub}>
                A moment to notice. Always optional.
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
              onPress={() => {
                tap();
                updateSettings({ currentChapter: undefined });
              }}
              style={({ pressed, focused }: any) => [
                styles.chapterChip,
                settings.currentChapter === undefined && styles.chapterChipOn,
                pressed && { transform: [{ scale: 0.97 }] },
                focused && webFocus,
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
                  onPress={() => {
                    tap();
                    updateSettings({ reminderHour: h });
                  }}
                  style={({ pressed, focused }: any) => [
                    styles.hour,
                    on && styles.hourOn,
                    pressed && { transform: [{ scale: 0.97 }] },
                    focused && webFocus,
                  ]}
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
          onPress={() => {
            nav();
            navigation.navigate('Connect');
          }}
          accessibilityRole="button"
          accessibilityLabel="Connect with T: sessions, talks, reader circle, and the book"
          style={({ pressed, focused }: any) => [
            pressed && pressScale,
            focused && webFocus,
          ]}
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
  navRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 4,
  },
  container: { flexGrow: 1, padding: layout.screen, paddingBottom: 40 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
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
    color: colors.white,
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
  hourTextOn: { color: colors.white },
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
    color: colors.white,
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
