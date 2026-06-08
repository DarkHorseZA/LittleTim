import React, { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadows } from '../theme/colors';
import { webFocus } from '../theme/interactions';
import { fonts } from '../theme/type';
import { useDay } from '../store/DayContext';
import { ChapterPicker } from './ChapterPicker';
import { Button } from './Button';
import { toast } from './Toast';

// Gentle chapter check-in shown once per app open for a returning reader
// (after onboarding, never on the very first launch). Reuses the exact Settings
// chapter picker and the shared settings.currentChapter value. Tapping
// "I've completed the book" sets settings.bookCompleted and never shows again.
//
// `active` should be true only when the user is actually inside the app (the
// Tabs area), so the prompt does not cover the Welcome splash.
export function ChapterCheckInGate({ active }: { active: boolean }) {
  const { ready, settings, updateSettings } = useDay();
  const insets = useSafeAreaInsets();

  // Capture, once, whether this was already a returning reader at launch. If
  // onboarding completed earlier this same session, hasSeenHowTo flips to true
  // mid-session, but this ref stays false, so the prompt waits for next launch.
  const capturedRef = useRef(false);
  const returningRef = useRef(false);
  const shownRef = useRef(false);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number | undefined>(1);

  useEffect(() => {
    if (ready && !capturedRef.current) {
      capturedRef.current = true;
      returningRef.current = !!settings.hasSeenHowTo;
    }
  }, [ready, settings.hasSeenHowTo]);

  useEffect(() => {
    if (
      ready &&
      active &&
      !shownRef.current &&
      capturedRef.current &&
      returningRef.current &&
      !settings.bookCompleted
    ) {
      shownRef.current = true;
      // Pre-select the stored chapter, or Chapter 1 if nothing is stored yet.
      setSelected(settings.currentChapter ?? 1);
      setOpen(true);
    }
  }, [ready, active, settings.bookCompleted, settings.currentChapter]);

  // If the reader navigates away from the Tabs area while the gate is open
  // (e.g. tapping a menu item before dismissing), close it so the backdrop
  // does not block touches on the destination screen.
  useEffect(() => {
    if (!active) setOpen(false);
  }, [active]);

  if (!open) return null;

  const handleContinue = () => {
    // Choosing a chapter keeps the reader in the book, so "completed" stays off.
    updateSettings({ currentChapter: selected, bookCompleted: false });
    setOpen(false);
  };

  const handleCompleted = () => {
    updateSettings({ bookCompleted: true });
    toast('Lovely. You can always pick a chapter again in Settings.', 'success');
    setOpen(false);
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Dim backdrop, tapping it dismisses without changing anything. */}
      <Pressable
        style={styles.backdrop}
        accessibilityRole="button"
        accessibilityLabel="Dismiss chapter check-in"
        onPress={() => setOpen(false)}
      />

      <View style={styles.sheetWrap} pointerEvents="box-none">
        <View style={[styles.sheet, { paddingBottom: 22 + insets.bottom }]}>
          <Text style={styles.heading}>Where are you in the book?</Text>
          <Text style={styles.subtext}>
            {'Pick the chapter you’re sewing through right now. This helps us bring you the right practices.'}
          </Text>

          <ScrollView
            style={styles.pickerScroll}
            contentContainerStyle={styles.pickerContent}
            showsVerticalScrollIndicator={false}
          >
            <ChapterPicker value={selected} onChange={setSelected} />
          </ScrollView>

          <Button
            title="Continue"
            onPress={handleContinue}
            size="lg"
            haptic="success"
            style={styles.continueBtn}
          />

          <Pressable
            onPress={handleCompleted}
            accessibilityRole="button"
            accessibilityLabel="I've completed the book"
            style={({ pressed, focused }: any) => [
              styles.completedLink,
              pressed && { opacity: 0.7 },
              focused && webFocus,
            ]}
          >
            <Text style={styles.completedText}>
              {'I’ve completed the book'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(43, 31, 15, 0.45)',
  },
  sheetWrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 22,
    maxHeight: '86%',
    ...shadows.md,
  },
  heading: {
    fontFamily: fonts.serifBold,
    fontSize: 24,
    lineHeight: 30,
    color: colors.ink,
    marginBottom: 8,
  },
  subtext: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkSoft,
    marginBottom: 18,
  },
  pickerScroll: {
    flexGrow: 0,
    marginBottom: 18,
  },
  pickerContent: {
    paddingBottom: 4,
  },
  continueBtn: {
    width: '100%',
  },
  completedLink: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginTop: 6,
    borderRadius: radius.pill,
  },
  completedText: {
    fontFamily: fonts.sansSemi,
    fontSize: 14,
    letterSpacing: 0.2,
    color: colors.clayDeep,
    textDecorationLine: 'underline',
  },
});
