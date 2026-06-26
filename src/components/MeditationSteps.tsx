import React from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows } from '../theme/colors';
import { fonts } from '../theme/type';
import { TranscriptSegment } from '../types';

// Renders the meditation steps card with optional synced word/phrase
// highlighting. Memoised so it only re-renders when the active segment or step
// changes (a few times per minute), not on every audio status tick.

type Token = { text: string; idx: number | null };

// Split a step's text into contiguous tokens: highlightable spans (tagged with
// their global transcript index) interleaved with the plain gaps between them.
function buildTokens(
  stepText: string,
  segs: { text: string; idx: number }[]
): Token[] {
  const tokens: Token[] = [];
  let cursor = 0;
  for (const s of segs) {
    const at = stepText.indexOf(s.text, cursor);
    if (at < 0) continue; // safety: segment text not found in step
    if (at > cursor) tokens.push({ text: stepText.slice(cursor, at), idx: null });
    tokens.push({ text: s.text, idx: s.idx });
    cursor = at + s.text.length;
  }
  if (cursor < stepText.length) {
    tokens.push({ text: stepText.slice(cursor), idx: null });
  }
  if (tokens.length === 0) tokens.push({ text: stepText, idx: null });
  return tokens;
}

type Props = {
  steps: string[];
  transcript?: TranscriptSegment[];
  activeSegIdx: number; // global index of the active segment, -1 if none yet
  activeStep: number; // which step is current (for the subtle background)
  synced: boolean; // markers present -> show active-step bg + enable tap-to-seek
  onStepPress: (i: number) => void;
  registerStepOffset: (i: number, y: number) => void;
  onCardLayout: (y: number) => void;
};

function MeditationStepsBase({
  steps,
  transcript,
  activeSegIdx,
  activeStep,
  synced,
  onStepPress,
  registerStepOffset,
  onCardLayout,
}: Props) {
  const hasTranscript = !!transcript && transcript.length > 0;

  // group segments by step, preserving their global index
  const segsByStep: { text: string; idx: number }[][] = steps.map(() => []);
  if (hasTranscript) {
    transcript!.forEach((s, idx) => {
      if (s.pageIndex >= 0 && s.pageIndex < segsByStep.length) {
        segsByStep[s.pageIndex].push({ text: s.text, idx });
      }
    });
  }

  return (
    <View
      style={styles.stepsCard}
      onLayout={(e: LayoutChangeEvent) => onCardLayout(e.nativeEvent.layout.y)}
    >
      {steps.map((step, i) => {
        const isActiveStep = synced && i === activeStep;
        const onLayout = (e: LayoutChangeEvent) =>
          registerStepOffset(i, e.nativeEvent.layout.y);

        const textNode =
          hasTranscript && segsByStep[i].length > 0 ? (
            <Text style={styles.stepText}>
              {buildTokens(step, segsByStep[i]).map((t, k) =>
                t.idx !== null && t.idx === activeSegIdx ? (
                  <Text key={k} style={styles.highlight}>
                    {t.text}
                  </Text>
                ) : (
                  <Text key={k}>{t.text}</Text>
                )
              )}
            </Text>
          ) : (
            <Text style={styles.stepText}>{step}</Text>
          );

        const inner = (
          <>
            <View
              style={[styles.stepNumWrap, isActiveStep && styles.stepNumWrapActive]}
            >
              <Text style={styles.stepNum}>{i + 1}</Text>
            </View>
            {textNode}
          </>
        );

        return synced ? (
          <Pressable
            key={i}
            onLayout={onLayout}
            onPress={() => onStepPress(i)}
            accessibilityRole="button"
            accessibilityLabel={`Jump to step ${i + 1}`}
            style={[styles.step, isActiveStep && styles.stepActive]}
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
  );
}

export const MeditationSteps = React.memo(MeditationStepsBase);

const styles = StyleSheet.create({
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
  highlight: {
    color: colors.clay,
    fontFamily: fonts.sansSemi,
  },
});
