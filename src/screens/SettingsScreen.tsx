import React from 'react';
import {
  Alert,
  Linking,
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
import { Button } from '../components/Button';
import {
  APP_NAME,
  ATTRIBUTION,
  COACHING_URL,
  hasCoachingUrl,
} from '../config';
import { useDay } from '../store/DayContext';
import { chapters } from '../data/chapters';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabsParamList, 'Settings'>,
  NativeStackScreenProps<RootStackParamList>
>;

const HOURS = [6, 7, 8, 9, 10, 12, 18, 20];

function initials(name?: string): string {
  if (!name) return '✴︎';
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('') || '✴︎';
}

export function SettingsScreen({ navigation }: Props) {
  const { settings, updateSettings } = useDay();
  const profile = settings.profile ?? {};
  const signedIn = !!profile.displayName;

  const openCoaching = async () => {
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
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={text.eyebrow}>Settings</Text>
        <Text style={styles.title}>{APP_NAME}</Text>
        <Text style={styles.body}>
          Calibrate the quiet rhythm of your day.
        </Text>

        <Pressable onPress={() => navigation.navigate('Account')}>
          <View style={styles.accountCard}>
            <View
              style={[
                styles.avatar,
                !signedIn && { backgroundColor: colors.clayWash },
              ]}
            >
              <Text
                style={[
                  styles.avatarText,
                  !signedIn && { color: colors.clay },
                ]}
              >
                {initials(profile.displayName)}
              </Text>
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

        <Pressable onPress={() => navigation.navigate('HowToUse')}>
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
          <View style={styles.chapters}>
            <Pressable
              onPress={() => updateSettings({ currentChapter: undefined })}
              style={[
                styles.chapterChip,
                settings.currentChapter === undefined && styles.chapterChipOn,
              ]}
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
            {chapters.map((ch) => {
              const on = settings.currentChapter === ch.id;
              return (
                <Pressable
                  key={ch.id}
                  onPress={() => updateSettings({ currentChapter: ch.id })}
                  style={[styles.chapterChip, on && styles.chapterChipOn]}
                >
                  <Text
                    style={[
                      styles.chapterChipText,
                      on && styles.chapterChipTextOn,
                    ]}
                  >
                    {ch.shortTitle}
                  </Text>
                </Pressable>
              );
            })}
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

        <View style={[styles.card, { backgroundColor: colors.clayWash }]}>
          <View style={styles.cardHead}>
            <View
              style={[styles.iconCircle, { backgroundColor: colors.surface }]}
            >
              <Ionicons name="calendar-outline" size={16} color={colors.clay} />
            </View>
            <Text style={styles.cardTitle}>Working with a coach</Text>
          </View>
          <Text style={[styles.cardBody, { color: colors.ink }]}>
            {hasCoachingUrl()
              ? 'The check-in flow ends with an option to book a session. Edit the link any time in src/config.ts.'
              : 'Placeholder for now. Add a COACHING_URL in src/config.ts and the check-in flow plus the button below will open it.'}
          </Text>
          <View style={{ height: 12 }} />
          <Button
            title={
              hasCoachingUrl()
                ? 'Open coaching link'
                : 'Coaching link (coming soon)'
            }
            icon="open-outline"
            onPress={openCoaching}
          />
        </View>

        <View style={{ height: 24 }} />
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
  container: { padding: 20, paddingBottom: 40 },
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
