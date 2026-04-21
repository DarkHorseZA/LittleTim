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
import { colors, radius } from '../theme/colors';
import { Card } from '../components/Card';
import { SectionHeader } from '../components/SectionHeader';
import { Button } from '../components/Button';
import { APP_NAME, COACHING_URL } from '../config';
import { useDay } from '../store/DayContext';

const HOURS = [6, 7, 8, 9, 10, 12, 18, 20];

export function SettingsScreen() {
  const { settings, updateSettings } = useDay();

  const openCoaching = async () => {
    const supported = await Linking.canOpenURL(COACHING_URL);
    if (!supported) {
      Alert.alert(
        'Coaching link not set',
        'Edit src/config.ts and set COACHING_URL to your booking page.'
      );
      return;
    }
    Linking.openURL(COACHING_URL);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <SectionHeader
          eyebrow="Settings"
          title={APP_NAME}
          subtitle="Calibrate the quiet rhythm of your day."
        />

        <Card>
          <Text style={styles.label}>Belief reminder hour</Text>
          <Text style={styles.hint}>
            The daily belief appears the first time you open the app on or after
            this hour.
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
                  <Text
                    style={[styles.hourText, on && styles.hourTextOn]}
                  >
                    {h}:00
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        <View style={{ height: 16 }} />

        <Card tint="accentSoft">
          <Text style={styles.coachTitle}>Working with a coach</Text>
          <Text style={styles.coachBody}>
            The check-in flow ends with an option to book a session. You can
            set your own link in {`src/config.ts`}.
          </Text>
          <View style={{ height: 12 }} />
          <Button title="Open coaching link" onPress={openCoaching} />
        </Card>

        <View style={{ height: 24 }} />
        <Text style={styles.footer}>
          v0.1 · Local-only. Your entries stay on this device.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 16, fontWeight: '700', color: colors.ink },
  hint: { color: colors.inkSoft, marginTop: 4, marginBottom: 10, lineHeight: 20 },
  hours: { flexDirection: 'row', flexWrap: 'wrap' },
  hour: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    backgroundColor: colors.line,
    marginRight: 8,
    marginBottom: 8,
  },
  hourOn: { backgroundColor: colors.accent },
  hourText: { color: colors.inkSoft, fontWeight: '700' },
  hourTextOn: { color: '#fff' },
  coachTitle: { fontWeight: '700', fontSize: 16, color: colors.ink },
  coachBody: { marginTop: 6, color: colors.ink, lineHeight: 22 },
  footer: { color: colors.inkFaint, textAlign: 'center', fontSize: 12 },
});
