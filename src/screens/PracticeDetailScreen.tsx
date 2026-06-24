import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
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
import { fonts, text } from '../theme/type';
import { webFocus } from '../theme/interactions';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import { BottomSheet } from '../components/BottomSheet';
import { GuidedAudioControl } from '../components/GuidedAudioControl';
import { findPractice } from '../data/practices';
import { useGuidedAudio, stepIndexForTime } from '../hooks/useGuidedAudio';
import { useDay } from '../store/DayContext';

type Props = NativeStackScreenProps<RootStackParamList, 'PracticeDetail'>;

export function PracticeDetailScreen({ navigation, route }: Props) {
  const practice = useMemo(
    () => findPractice(route.params.practiceId),
    [route.params.practiceId]
  );
  const source = route.params.source;
  const { today, settings, updateToday, updateSettings, addQuiltEntry } = useDay();
  const [showHint, setShowHint] = useState(false);

  // Optional guided audio. Inert (no control rendered) when the meditation has
  // no recording, so the screen looks identical to before for audio-less ones.
  const audio = practice?.audio;
  const med = useGuidedAudio(audio);
  const markers = audio?.pageMarkers;
  const synced = med.available && !!markers && markers.length > 0;
  const [activeStep, setActiveStep] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const stepOffsets = useRef<number[]>([]);
  const stepsCardY = useRef(0);

  // Auto-advance the highlighted step as audio crosses each page marker.
  useEffect(() => {
    if (!synced) return;
    const idx = stepIndexForTime(markers, med.currentTime);
    setActiveStep((prev) => (prev === idx ? prev : idx));
  }, [synced, markers, med.currentTime]);

  // Keep the active step in view once it changes.
  useEffect(() => {
    if (!synced) return;
    const y = stepOffsets.current[activeStep];
    if (y != null) {
      scrollRef.current?.scrollTo({
        y: Math.max(stepsCardY.current + y - 90, 0),
        animated: true,
      });
    }
  }, [activeStep, synced]);

  if (!practice) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.missing}>Practice not found.</Text>
      </SafeAreaView>
    );
  }

  const isDone =
    practice.kind === 'MSG'
      ? today.msgDone && today.msgPracticeId === practice.id
      : today.seeDone && today.seePracticeId === practice.id;

  const complete = async () => {
    if (practice.kind === 'MSG') {
      await updateToday({ msgDone: true, msgPracticeId: practice.id });
      await addQuiltEntry({ type: 'msg' });
    } else {
      await updateToday({ seeDone: true, seePracticeId: practice.id });
      await addQuiltEntry({ type: 'see' });
    }

    // Show the hint only when opened from the Today tab and the user hasn't
    // permanently opted out and hasn't already seen it.
    const shouldHint =
      source === 'today' &&
      !settings.practiceHintDisabled &&
      !settings.practiceHintSeen;

    if (shouldHint) {
      await updateSettings({ practiceHintSeen: true });
      setShowHint(true);
    } else {
      navigation.goBack();
    }
  };

  const dismissHint = () => {
    setShowHint(false);
    navigation.goBack();
  };

  const disableHint = async () => {
    await updateSettings({ practiceHintDisabled: true });
    setShowHint(false);
    navigation.goBack();
  };

  const goToPractice = () => {
    setShowHint(false);
    navigation.navigate('Tabs', { screen: 'Practice' });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topRow}>
        <BackButton
          onPress={() => navigation.goBack()}
          variant="solid"
          accessibilityLabel="Go back"
        />
      </View>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={styles.container}>
        <View style={styles.kindPill}>
          <Text style={styles.kindPillText}>{practice.kind}</Text>
        </View>
        <Text style={styles.title}>{practice.title}</Text>
        <View style={styles.metaRow}>
          <View style={styles.meta}>
            <Ionicons name="time-outline" size={14} color={colors.inkSoft} />
            <Text style={styles.metaText}>{practice.durationMin} min</Text>
          </View>
          <Text style={styles.metaSep}>·</Text>
          <Text style={styles.cue}>{practice.cue}</Text>
        </View>

        {med.available ? (
          <GuidedAudioControl
            isPlaying={med.isPlaying}
            onToggle={med.toggle}
            progress={med.duration ? med.currentTime / med.duration : 0}
          />
        ) : null}

        <View
          style={styles.stepsCard}
          onLayout={(e) => {
            stepsCardY.current = e.nativeEvent.layout.y;
          }}
        >
          {practice.steps.map((step, i) => {
            const isActive = synced && i === activeStep;
            const onLayout = (e: any) => {
              stepOffsets.current[i] = e.nativeEvent.layout.y;
            };
            const inner = (
              <>
                <View
                  style={[styles.stepNumWrap, isActive && styles.stepNumWrapActive]}
                >
                  <Text style={styles.stepNum}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </>
            );
            return synced ? (
              <Pressable
                key={i}
                onLayout={onLayout}
                onPress={() => {
                  med.seekTo(markers![i]);
                  setActiveStep(i);
                }}
                accessibilityRole="button"
                accessibilityLabel={`Jump to step ${i + 1}`}
                style={[styles.step, isActive && styles.stepActive]}
              >
                {inner}
              </Pressable>
            ) : (
              <View key={i} style={styles.step} onLayout={onLayout}>
                {inner}
              </View>
            );
          })}
        </View>

        <View style={{ height: 28 }} />
        <Button
          title={isDone ? 'Marked done' : 'Mark practice complete'}
          icon={isDone ? 'checkmark-circle' : undefined}
          onPress={complete}
          disabled={isDone}
          size="lg"
          haptic="success"
        />
        <View style={{ height: 10 }} />
        <Button
          title="Close"
          variant="ghost"
          onPress={() => navigation.goBack()}
        />
      </ScrollView>

      {/* Completion hint overlay — shown only on first Today-tab completion */}
      {showHint && (
        <BottomSheet onDismiss={dismissHint} dismissLabel="Dismiss">
          <View style={hintStyles.iconWrap}>
            <Ionicons name="leaf" size={26} color={colors.clay} />
          </View>
          <Text style={hintStyles.heading}>Beautifully sewn.</Text>
          <Text style={hintStyles.body}>
            {
              'You can always return to earlier chapters’ practices anytime, in the Practice tab.'
            }
          </Text>

          <Button
            title="Got it"
            onPress={dismissHint}
            size="lg"
            haptic="success"
          />
          <View style={{ height: 10 }} />
          <Button
            title="Take me there"
            variant="ghost"
            onPress={goToPractice}
          />

          <Pressable
            onPress={disableHint}
            accessibilityRole="button"
            accessibilityLabel="Don’t show this again"
            style={({ pressed, focused }: any) => [
              hintStyles.dontShow,
              pressed && { opacity: 0.6 },
              focused && webFocus,
            ]}
          >
            <Text style={hintStyles.dontShowText}>{'Don’t show this again'}</Text>
          </Pressable>
        </BottomSheet>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 8,
    paddingBottom: 48,
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
  },
  missing: { padding: 24, color: colors.inkSoft },
  kindPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.clayWash,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.pill,
    marginBottom: 14,
  },
  kindPillText: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.clayDeep,
  },
  title: {
    ...text.display,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontFamily: fonts.sansMed,
    color: colors.inkSoft,
    marginLeft: 4,
    fontSize: 13,
  },
  metaSep: {
    color: colors.inkFaint,
    marginHorizontal: 8,
  },
  cue: {
    ...text.body,
    flexShrink: 1,
  },
  stepsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 22,
    ...shadows.sm,
  },
  step: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  stepActive: {
    backgroundColor: colors.clayWash,
    borderRadius: radius.md,
    marginHorizontal: -8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: 8,
  },
  stepNumWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.clay,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    marginTop: 1,
  },
  stepNumWrapActive: {
    backgroundColor: colors.clayDeep,
  },
  stepNum: {
    color: colors.white,
    fontFamily: fonts.sansBold,
    fontSize: 13,
  },
  stepText: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    color: colors.ink,
  },
});

const hintStyles = StyleSheet.create({
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.clayWash,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  heading: {
    fontFamily: fonts.serifBold,
    fontSize: 26,
    lineHeight: 32,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: 10,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkSoft,
    textAlign: 'center',
    marginBottom: 24,
  },
  dontShow: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 6,
    borderRadius: radius.pill,
  },
  dontShowText: {
    fontFamily: fonts.sansSemi,
    fontSize: 13,
    color: colors.inkFaint,
    textDecorationLine: 'underline',
  },
});
