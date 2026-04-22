import React, { useMemo, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabsParamList } from '../navigation/types';
import { colors, radius, shadows } from '../theme/colors';
import { fonts, text } from '../theme/type';
import { useDay } from '../store/DayContext';
import { DailyEntry } from '../types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabsParamList, 'Journal'>,
  NativeStackScreenProps<RootStackParamList>
>;

function prettyDate(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function shortDate(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function JournalScreen() {
  const { today, updateToday, entries } = useDay();
  const [sewedWith, setSewedWith] = useState(today.journal?.sewedWith ?? '');
  const [threadPulled, setThreadPulled] = useState(
    today.journal?.threadPulled ?? ''
  );
  const [savedJustNow, setSavedJustNow] = useState(false);

  const pastEntries = useMemo(() => {
    return Object.values(entries)
      .filter(
        (e) =>
          e.date !== today.date &&
          e.journal &&
          (e.journal.sewedWith?.trim() || e.journal.threadPulled?.trim())
      )
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [entries, today.date]);

  const save = async () => {
    Keyboard.dismiss();
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    } catch {}
    await updateToday({
      journal: {
        sewedWith: sewedWith.trim() || undefined,
        threadPulled: threadPulled.trim() || undefined,
        updatedAt: new Date().toISOString(),
      },
    });
    setSavedJustNow(true);
    setTimeout(() => setSavedJustNow(false), 2000);
  };

  const canSave =
    (sewedWith.trim().length > 0 || threadPulled.trim().length > 0) &&
    (sewedWith.trim() !== (today.journal?.sewedWith ?? '') ||
      threadPulled.trim() !== (today.journal?.threadPulled ?? ''));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={text.eyebrow}>Patchwork Journal</Text>
          <Text style={styles.title}>Tonight's stitch</Text>
          <Text style={styles.body}>
            Two sentences. Don't try to be eloquent. Just be honest.
          </Text>

          <View style={styles.card}>
            <View style={styles.promptHead}>
              <View style={styles.promptIcon}>
                <Ionicons name="heart" size={14} color={colors.done} />
              </View>
              <Text style={styles.promptLabel}>Sewed with love</Text>
            </View>
            <TextInput
              value={sewedWith}
              onChangeText={setSewedWith}
              placeholder="Today I sewed with love when I…"
              placeholderTextColor={colors.inkFaint}
              multiline
              style={styles.input}
            />

            <View style={styles.divider} />

            <View style={styles.promptHead}>
              <View
                style={[
                  styles.promptIcon,
                  { backgroundColor: colors.clayWash },
                ]}
              >
                <Ionicons name="pulse" size={14} color={colors.clayDeep} />
              </View>
              <Text style={styles.promptLabel}>When the old thread pulled</Text>
            </View>
            <TextInput
              value={threadPulled}
              onChangeText={setThreadPulled}
              placeholder="Today, when the old thread pulled, I…"
              placeholderTextColor={colors.inkFaint}
              multiline
              style={styles.input}
            />
          </View>

          <Pressable
            onPress={canSave ? save : undefined}
            disabled={!canSave && !savedJustNow}
            style={({ pressed }) => [
              styles.saveBtn,
              {
                backgroundColor: savedJustNow
                  ? colors.done
                  : canSave
                  ? colors.clay
                  : colors.lineSoft,
                opacity: pressed ? 0.92 : 1,
              },
            ]}
          >
            <Ionicons
              name={savedJustNow ? 'checkmark' : 'save-outline'}
              size={16}
              color={savedJustNow || canSave ? '#FFFFFF' : colors.inkFaint}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.saveText,
                { color: savedJustNow || canSave ? '#FFFFFF' : colors.inkFaint },
              ]}
            >
              {savedJustNow
                ? 'Stitched'
                : canSave
                ? 'Save stitch'
                : 'Saved'}
            </Text>
          </Pressable>

          <View style={{ height: 32 }} />

          <Text style={text.eyebrow}>Past stitches</Text>
          <Text style={styles.pastSub}>
            {pastEntries.length === 0
              ? 'Your previous entries will appear here.'
              : 'Read them aloud at the end of the week — you will see the quilt.'}
          </Text>

          {pastEntries.map((e) => (
            <PastStitch key={e.date} entry={e} />
          ))}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function PastStitch({ entry }: { entry: DailyEntry }) {
  const j = entry.journal;
  if (!j) return null;
  return (
    <View style={styles.pastCard}>
      <Text style={styles.pastDate}>{shortDate(entry.date)}</Text>
      {j.sewedWith ? (
        <View style={styles.pastLine}>
          <View
            style={[styles.pastDot, { backgroundColor: colors.done }]}
          />
          <Text style={styles.pastText}>{j.sewedWith}</Text>
        </View>
      ) : null}
      {j.threadPulled ? (
        <View style={styles.pastLine}>
          <View
            style={[styles.pastDot, { backgroundColor: colors.clay }]}
          />
          <Text style={styles.pastText}>{j.threadPulled}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 20, paddingBottom: 40 },
  title: { ...text.h1, marginTop: 8, marginBottom: 6 },
  body: { ...text.body, marginBottom: 18 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 18,
    ...shadows.sm,
  },
  promptHead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  promptIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.doneSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  promptLabel: {
    ...text.eyebrow,
    marginBottom: 0,
  },
  input: {
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 22,
    color: colors.ink,
    minHeight: 60,
    textAlignVertical: 'top',
    paddingVertical: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
    marginVertical: 14,
  },
  saveBtn: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: radius.pill,
    alignSelf: 'flex-end',
  },
  saveText: {
    fontFamily: fonts.sansBold,
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  pastSub: {
    ...text.body,
    marginTop: 4,
    marginBottom: 14,
  },
  pastCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 10,
    ...shadows.sm,
  },
  pastDate: {
    fontFamily: fonts.serifBold,
    fontSize: 15,
    color: colors.ink,
    marginBottom: 8,
  },
  pastLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  pastDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 8,
    marginRight: 10,
  },
  pastText: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.ink,
  },
});
