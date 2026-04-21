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
import { colors, radius, shadows } from '../theme/colors';
import { fonts, text } from '../theme/type';
import { Button } from '../components/Button';
import { APP_NAME, COACHING_URL, hasCoachingUrl } from '../config';
import { useDay } from '../store/DayContext';

const HOURS = [6, 7, 8, 9, 10, 12, 18, 20];

export function SettingsScreen() {
  const { settings, updateSettings } = useDay();

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
            <View style={[styles.iconCircle, { backgroundColor: colors.surface }]}>
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
              hasCoachingUrl() ? 'Open coaching link' : 'Coaching link (coming soon)'
            }
            icon="open-outline"
            onPress={openCoaching}
          />
        </View>

        <View style={{ height: 24 }} />
        <Text style={styles.footer}>
          v0.2 · Local-only. Your entries stay on this device.
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
  footer: {
    ...text.caption,
    textAlign: 'center',
  },
});
