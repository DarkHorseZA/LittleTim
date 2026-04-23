import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, gradients, radius, shadows } from '../theme/colors';
import { fonts, text } from '../theme/type';
import { Button } from '../components/Button';
import { beliefForDate } from '../data/beliefs';
import { useDay } from '../store/DayContext';
import { useReducedMotion } from '../hooks/useReducedMotion';

type Props = NativeStackScreenProps<RootStackParamList, 'MorningRitual'>;

type StepId = 'feel' | 'whisper' | 'touch' | 'breathe' | 'bless';

type RitualStep = {
  id: StepId;
  title: string;
  cue: string;
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  tintSoft: string;
  body: string;
};

const STEPS: RitualStep[] = [
  {
    id: 'feel',
    title: 'Feel',
    cue: 'Hand on heart',
    icon: 'heart',
    tint: colors.loved,
    tintSoft: colors.lovedSoft,
    body: 'Place your hand on your heart. Ask gently: "What do I feel right now?" Do not judge. Just feel.',
  },
  {
    id: 'whisper',
    title: 'Whisper',
    cue: '"Let there be…"',
    icon: 'sparkles',
    tint: colors.clay,
    tintSoft: colors.claySoft,
    body: 'Whisper your intention, a lover\'s whisper, not a shout. "Let there be ..." Let today\'s belief land as you say it.',
  },
  {
    id: 'touch',
    title: 'Touch',
    cue: 'Palms together',
    icon: 'hand-left',
    tint: colors.happiness,
    tintSoft: colors.happinessSoft,
    body: 'One small action. Press your palms together at your heart. Smile softly. Let the emotion flow into your hands.',
  },
  {
    id: 'breathe',
    title: 'Breathe',
    cue: 'The breath of lives',
    icon: 'leaf',
    tint: colors.health,
    tintSoft: colors.healthSoft,
    body: 'Three slow breaths. Inhale: "I breathe the breath of lives." Exhale: "I am eternal. I am earth."',
  },
  {
    id: 'bless',
    title: 'Bless',
    cue: '"I am blessed."',
    icon: 'sunny',
    tint: colors.wealth,
    tintSoft: colors.wealthSoft,
    body: 'Hands on heart. Whisper: "I am blessed. I have permission to be me. I have the ability to create my Life."',
  },
];

export function MorningRitualScreen({ navigation }: Props) {
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  const { updateToday, settings } = useDay();
  const reducedMotion = useReducedMotion();
  const step = STEPS[idx];

  const belief = useMemo(
    () => beliefForDate(new Date(), settings.currentChapter),
    [settings.currentChapter]
  );

  const fade = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const breath = useRef(new Animated.Value(0)).current;

  // Step entrance fade. Shorter under reduced motion, but never snapped,
  // so the text still feels intentional when you land on a step.
  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: reducedMotion ? 180 : 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [idx, fade, reducedMotion]);

  // Gentle icon pulse (all steps except breathe, which has its own cycle).
  // Skipped entirely under reduced motion.
  useEffect(() => {
    if (step.id === 'breathe') return;
    if (reducedMotion) {
      pulse.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [step.id, pulse, reducedMotion]);

  // Breath pacer (4s inhale / 4s exhale). Reduced motion parks it mid-breath
  // so the visual stays, but nothing moves.
  useEffect(() => {
    if (step.id !== 'breathe') return;
    if (reducedMotion) {
      breath.setValue(0.5);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breath, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breath, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [step.id, breath, reducedMotion]);

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });
  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  });
  const breathScale = breath.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });
  const breathOpacity = breath.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });
  const breathLabel = breath.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });

  const next = async () => {
    // Haptic is fired by the Button (selection for step advance, success for
    // completion). No manual call needed here.
    if (idx < STEPS.length - 1) {
      setIdx(idx + 1);
    } else {
      await updateToday({ morningRitualDone: true });
      setDone(true);
    }
  };

  const close = () => navigation.goBack();

  if (done) {
    return <CompletionView onClose={close} beliefStatement={belief.statement} />;
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[step.tintSoft, colors.bg]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.6, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topRow}>
          <View style={styles.progressDots}>
            {STEPS.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === idx && { backgroundColor: step.tint, width: 18 },
                  i < idx && { backgroundColor: step.tint },
                ]}
              />
            ))}
          </View>
          <Pressable
            hitSlop={16}
            onPress={close}
            style={styles.closeBtn}
            accessibilityRole="button"
            accessibilityLabel="Close ritual"
          >
            <Ionicons name="close" size={22} color={colors.ink} />
          </Pressable>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fade, alignItems: 'center' }}>
            <Text style={[styles.stepLabel, { color: step.tint }]}>
              Step {idx + 1} of {STEPS.length}
            </Text>

            <View style={styles.iconWrap}>
              {step.id === 'breathe' ? (
                <>
                  <Animated.View
                    style={[
                      styles.breathHalo,
                      {
                        backgroundColor: step.tintSoft,
                        transform: [{ scale: breathScale }],
                        opacity: breathOpacity,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.breathCore,
                      { backgroundColor: step.tint },
                    ]}
                  >
                    <Ionicons name={step.icon} size={36} color="#FFFFFF" />
                  </View>
                </>
              ) : (
                <>
                  <View
                    style={[
                      styles.iconHalo,
                      { backgroundColor: step.tintSoft },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.iconCircle,
                      {
                        backgroundColor: step.tint,
                        transform: [{ scale: pulseScale }],
                        opacity: pulseOpacity,
                      },
                    ]}
                  >
                    <Ionicons name={step.icon} size={40} color="#FFFFFF" />
                  </Animated.View>
                </>
              )}
            </View>

            {step.id === 'breathe' ? (
              <Animated.Text
                style={[
                  styles.breathCue,
                  { color: step.tint, opacity: breathLabel },
                ]}
              >
                inhale
              </Animated.Text>
            ) : null}

            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.cue}>{step.cue}</Text>
            <Text style={styles.body}>{step.body}</Text>

            {step.id === 'whisper' ? (
              <View style={styles.beliefPanel}>
                <Text style={styles.beliefLabel}>Today's belief</Text>
                <Text style={styles.beliefStatement}>
                  {`\u201C${belief.statement}\u201D`}
                </Text>
              </View>
            ) : null}
          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={idx < STEPS.length - 1 ? 'Continue' : 'Complete'}
            trailingIcon={idx < STEPS.length - 1 ? 'arrow-forward' : 'checkmark'}
            onPress={next}
            size="lg"
            haptic={idx < STEPS.length - 1 ? 'selection' : 'success'}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

function CompletionView({
  onClose,
  beliefStatement,
}: {
  onClose: () => void;
  beliefStatement: string;
}) {
  const reducedMotion = useReducedMotion();
  const glow = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: reducedMotion ? 200 : 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    if (reducedMotion) {
      glow.setValue(0.6);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [glow, fade, reducedMotion]);

  const glowScale = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });
  const glowOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.85],
  });

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={gradients.dawnDeep}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <Animated.View
          style={[
            styles.completionWrap,
            { opacity: fade },
          ]}
        >
          <View style={styles.completionIcon}>
            <Animated.View
              style={[
                styles.completionHalo,
                {
                  transform: [{ scale: glowScale }],
                  opacity: glowOpacity,
                },
              ]}
            />
            <View style={styles.completionCore}>
              <Ionicons name="checkmark" size={44} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.completionEyebrow}>Sewn</Text>
          <Text style={styles.completionTitle}>One more stitch.</Text>
          <Text style={styles.completionBody}>
            {`\u201C${beliefStatement}\u201D`}
          </Text>
          <Text style={styles.completionSub}>
            Small stitches make the quilt.
          </Text>

          <View style={{ flex: 1 }} />

          <Button
            title="Back to Today"
            trailingIcon="arrow-forward"
            onPress={onClose}
            size="lg"
          />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 4,
  },
  progressDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.line,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    padding: 28,
    paddingBottom: 24,
    alignItems: 'center',
  },
  stepLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    marginBottom: 22,
  },
  iconWrap: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  iconHalo: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    opacity: 0.55,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  breathHalo: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  breathCore: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  breathCue: {
    fontFamily: fonts.sansMed,
    fontSize: 12,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: -12,
    marginBottom: 10,
  },
  title: {
    fontFamily: fonts.serifBold,
    fontSize: 40,
    lineHeight: 48,
    color: colors.ink,
    textAlign: 'center',
  },
  cue: {
    fontFamily: fonts.serifItalic,
    fontSize: 18,
    color: colors.inkSoft,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    color: colors.ink,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  beliefPanel: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 18,
    marginTop: 24,
    ...shadows.sm,
    alignSelf: 'stretch',
  },
  beliefLabel: {
    ...text.eyebrow,
    marginBottom: 8,
    textAlign: 'center',
  },
  beliefStatement: {
    fontFamily: fonts.serifItalic,
    fontSize: 18,
    lineHeight: 26,
    color: colors.ink,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    paddingTop: 6,
  },
  // Completion view
  completionWrap: {
    flex: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  completionIcon: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  completionHalo: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.claySoft,
  },
  completionCore: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.clay,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  completionEyebrow: {
    ...text.eyebrow,
    textAlign: 'center',
    color: colors.clayDeep,
    marginBottom: 6,
  },
  completionTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 36,
    lineHeight: 42,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: 22,
  },
  completionBody: {
    fontFamily: fonts.serifItalic,
    fontSize: 22,
    lineHeight: 30,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: 18,
    paddingHorizontal: 10,
  },
  completionSub: {
    fontFamily: fonts.sansMed,
    fontSize: 13,
    letterSpacing: 1.5,
    color: colors.inkSoft,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});
