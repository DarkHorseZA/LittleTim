import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { fonts } from '../theme/type';
import { Button } from '../components/Button';
import {
  APP_NAME,
  APP_NAME_DISPLAY_CAPS,
  AUTHOR_NAME,
} from '../config';
import { useDay } from '../store/DayContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const TAGLINES = [
  'One stitch at a time.',
  'The power is in the now.',
  'Sew with Love.',
  'Unravel. Resew.',
  'I am earth, wrapped in light.',
  'I am Love, creating.',
  'Small stitches make the quilt.',
  'A breath, then a day.',
  'You are not alone.',
  'Repetition unravels and resews.',
];

function tagForToday(): string {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) /
      86_400_000
  );
  return TAGLINES[dayOfYear % TAGLINES.length];
}

const RING_DOTS = 12;
const RING_RADIUS = 118;

export function WelcomeScreen({ navigation }: Props) {
  const { settings } = useDay();
  const firstName = (settings.profile?.displayName ?? '').split(' ')[0];

  const breath = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const riseCta = useRef(new Animated.Value(0)).current;

  const tagline = useMemo(() => tagForToday(), []);

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.timing(riseCta, {
      toValue: 1,
      duration: 1200,
      delay: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const breathLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breath, {
          toValue: 1,
          duration: 4200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breath, {
          toValue: 0,
          duration: 4200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    breathLoop.start();

    const spinLoop = Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 42000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinLoop.start();

    return () => {
      breathLoop.stop();
      spinLoop.stop();
    };
  }, [breath, rotate, fade, riseCta]);

  const outerScale = breath.interpolate({
    inputRange: [0, 1],
    outputRange: [0.88, 1.16],
  });
  const outerOpacity = breath.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 0.9],
  });
  const innerScale = breath.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1.08],
  });
  const coreOpacity = breath.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  });
  const ringSpin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const ctaRise = riseCta.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.claySoft, colors.bg, colors.surfaceSoft]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={[colors.claySoft, 'rgba(255,255,255,0)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.topWash}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <Animated.View style={[styles.content, { opacity: fade }]}>
          <Text style={styles.brand}>{APP_NAME_DISPLAY_CAPS}</Text>

          <View style={styles.symbolWrap}>
            {/* Slow-rotating ring of breath markers */}
            <Animated.View
              style={[
                styles.ringLayer,
                { transform: [{ rotate: ringSpin }] },
              ]}
            >
              {Array.from({ length: RING_DOTS }).map((_, i) => {
                const angle = (i * 360) / RING_DOTS;
                const emphasized = i % 3 === 0;
                return (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      emphasized && styles.dotStrong,
                      {
                        transform: [
                          { rotate: `${angle}deg` },
                          { translateY: -RING_RADIUS },
                        ],
                      },
                    ]}
                  />
                );
              })}
            </Animated.View>

            {/* Outer breathing halo */}
            <Animated.View
              style={[
                styles.halo,
                {
                  transform: [{ scale: outerScale }],
                  opacity: outerOpacity,
                },
              ]}
            />

            {/* Inner breathing disc */}
            <Animated.View
              style={[
                styles.inner,
                {
                  transform: [{ scale: innerScale }],
                },
              ]}
            />

            {/* Core */}
            <Animated.View
              style={[
                styles.core,
                {
                  opacity: coreOpacity,
                },
              ]}
            />
          </View>

          <Text style={styles.tagline}>"{tagline}"</Text>
          <Text style={styles.breathHint}>
            Inhale.  Settle.  Begin{firstName ? `, ${firstName}` : ''}.
          </Text>
          <Text style={styles.attribution}>
            Companion to {APP_NAME} by {AUTHOR_NAME}
          </Text>

          <View style={{ flex: 1, minHeight: 24 }} />

          <Animated.View
            style={{
              opacity: riseCta,
              transform: [{ translateY: ctaRise }],
              width: '100%',
            }}
          >
            <Button
              title="Enter"
              onPress={() => navigation.replace('Tabs')}
              size="lg"
              trailingIcon="arrow-forward"
            />
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const SYMBOL = 260;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topWash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 380,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 28,
  },
  brand: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    letterSpacing: 6,
    color: colors.clayDeep,
    marginBottom: 28,
  },
  symbolWrap: {
    width: SYMBOL,
    height: SYMBOL,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 36,
  },
  ringLayer: {
    position: 'absolute',
    width: SYMBOL,
    height: SYMBOL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.clay,
    opacity: 0.45,
  },
  dotStrong: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.clayDeep,
    opacity: 0.85,
  },
  halo: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.claySoft,
  },
  inner: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.claySoft,
  },
  core: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.clay,
    shadowColor: colors.clayDeep,
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  tagline: {
    fontFamily: fonts.serifItalic,
    fontSize: 26,
    lineHeight: 34,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: 14,
    paddingHorizontal: 8,
  },
  breathHint: {
    fontFamily: fonts.sansMed,
    fontSize: 12,
    letterSpacing: 2,
    color: colors.inkSoft,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  attribution: {
    fontFamily: fonts.serifItalic,
    fontSize: 12,
    color: colors.inkFaint,
    textAlign: 'center',
    marginTop: 16,
  },
});
