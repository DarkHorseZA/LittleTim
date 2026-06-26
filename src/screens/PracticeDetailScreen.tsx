import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
import { MeditationSteps } from '../components/MeditationSteps';
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
  const { available, isPlaying, currentTime, duration, toggle, seekTo, restart } =
    med;
  const markers = audio?.pageMarkers;
  const transcript = audio?.transcript;
  const hasTranscript = !!transcript && transcript.length > 0;
  const synced = available && !!markers && markers.length > 0;

  const [activeSegIdx, setActiveSegIdx] = useState(-1);
  const [activeStep, setActiveStep] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const stepOffsets = useRef<number[]>([]);
  const stepsCardY = useRef(0);

  // Active highlighted segment: the one covering the current time. When no
  // segment covers (a breath, an aside, or a paused player) the last segment
  // stays highlighted, so the highlight never blinks out.
  useEffect(() => {
    if (!hasTranscript) return;
    let cov = -1;
    for (let k = 0; k < transcript!.length; k++) {
      if (currentTime >= transcript![k].start && currentTime < transcript![k].end) {
        cov = k;
        break;
      }
    }
    if (cov !== -1) setActiveSegIdx((prev) => (prev === cov ? prev : cov));
  }, [hasTranscript, transcript, currentTime]);

  // Which step is current (drives the subtle background + auto-scroll). With a
  // transcript this follows the active segment's page; otherwise the markers.
  useEffect(() => {
    if (!synced) return;
    const s = hasTranscript
      ? activeSegIdx >= 0
        ? transcript![activeSegIdx].pageIndex
        : 0
      : stepIndexForTime(markers, currentTime);
    setActiveStep((prev) => (prev === s ? prev : s));
  }, [synced, hasTranscript, transcript, activeSegIdx, markers, currentTime]);

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

  // Move the highlight to a step's first segment immediately on a user action
  // (don't wait for the next status tick to catch up).
  const jumpHighlightToStep = useCallback(
    (stepIdx: number) => {
      if (!hasTranscript) return;
      const k = transcript!.findIndex((s) => s.pageIndex === stepIdx);
      if (k >= 0) setActiveSegIdx(k);
    },
    [hasTranscript, transcript]
  );

  const handleStepPress = useCallback(
    (i: number) => {
      if (markers) seekTo(markers[i]);
      setActiveStep(i);
      jumpHighlightToStep(i);
    },
    [markers, seekTo, jumpHighlightToStep]
  );

  const handleSeek = useCallback(
    (v: number) => {
      seekTo(v);
      const i = stepIndexForTime(markers, v);
      setActiveStep(i);
      jumpHighlightToStep(i);
    },
    [seekTo, markers, jumpHighlightToStep]
  );

  const handleReplay = useCallback(() => {
    restart();
    setActiveStep(0);
    setActiveSegIdx(hasTranscript ? 0 : -1);
  }, [restart, hasTranscript]);

  const registerStepOffset = useCallback((i: number, y: number) => {
    stepOffsets.current[i] = y;
  }, []);
  const handleCardLayout = useCallback((y: number) => {
    stepsCardY.current = y;
  }, []);

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
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
      >
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

        {available ? (
          <GuidedAudioControl
            isPlaying={isPlaying}
            onToggle={toggle}
            onReplay={handleReplay}
            onSeek={handleSeek}
            currentTime={currentTime}
            duration={duration}
            markers={markers}
          />
        ) : null}

        <MeditationSteps
          steps={practice.steps}
          transcript={transcript}
          activeSegIdx={activeSegIdx}
          activeStep={activeStep}
          synced={synced}
          onStepPress={handleStepPress}
          registerStepOffset={registerStepOffset}
          onCardLayout={handleCardLayout}
        />

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
