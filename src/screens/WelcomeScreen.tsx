import React, { useEffect, useMemo, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, layout } from '../theme/colors';
import { fonts } from '../theme/type';
import { Button } from '../components/Button';
import { useLargeScreen } from '../hooks/useLargeScreen';
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
  'Small stitches become the quilt.',
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


export function WelcomeScreen({ navigation }: Props) {
  const { settings } = useDay();
  const firstName = (settings.profile?.displayName ?? '').split(' ')[0];

  const { isLarge } = useLargeScreen();
  // roomier hero on tablets so it doesn't read as a small phone cluster
  const symbol = isLarge ? 320 : SYMBOL;
  const iconSize = isLarge ? 272 : 220;
  const haloSize = isLarge ? 296 : 240;

  const reducedMotion = useReducedMotion();

  const breath = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const riseCta = useRef(new Animated.Value(0)).current;

  const tagline = useMemo(() => tagForToday(), []);

  useEffect(() => {
    // Entrance fades still run, they are one-shot and brief.
    // Reduced motion trims them even shorter.
    Animated.timing(fade, {
      toValue: 1,
      duration: reducedMotion ? 200 : 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.timing(riseCta, {
      toValue: 1,
      duration: reducedMotion ? 200 : 1200,
      delay: reducedMotion ? 0 : 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    if (reducedMotion) {
      // Park the breath at its midpoint. Static, calm.
      breath.setValue(0.5);
      return;
    }

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

    return () => {
      breathLoop.stop();
    };
  }, [breath, fade, riseCta, reducedMotion]);

  const haloScale = breath.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1.12],
  });
  const haloOpacity = breath.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.7],
  });
  const iconScale = breath.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1.03],
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
          <View style={{ flex: 1, minHeight: 24 }} />

          <Text style={styles.brand}>{APP_NAME_DISPLAY_CAPS}</Text>

          <View style={[styles.symbolWrap, { width: symbol, height: symbol }]}>
            {/* Soft breathing halo behind the mark */}
            <Animated.View
              style={[
                styles.halo,
                {
                  width: haloSize,
                  height: haloSize,
                  borderRadius: haloSize / 2,
                  transform: [{ scale: haloScale }],
                  opacity: haloOpacity,
                },
              ]}
            />

            {/* The re-Genesis mark: needle, circle, sprout */}
            <Animated.Image
              source={require('../../assets/brand/icon.png')}
              style={[
                styles.iconImage,
                {
                  width: iconSize,
                  height: iconSize,
                  transform: [{ scale: iconScale }],
                },
              ]}
              resizeMode="contain"
              accessibilityLabel="re-Genesis mark"
            />
          </View>

          <Text style={[styles.tagline, isLarge && styles.taglineLarge]}>
            {`\u201C${tagline}\u201D`}
          </Text>
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
              onPress={() => {
                if (!settings.registeredEmail) {
                  navigation.replace('EmailSignup', { firstRun: true });
                } else if (!settings.hasSeenHowTo) {
                  navigation.replace('HowToUse', { firstRun: true });
                } else if (!settings.lastCheckInDate) {
                  navigation.navigate('Tracker');
                } else {
                  navigation.replace('Tabs', { screen: 'Today' });
                }
              }}
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
    paddingTop: 8,
    paddingBottom: 28,
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
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
  halo: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.claySoft,
  },
  iconImage: {
    width: 220,
    height: 220,
    shadowColor: colors.clayDeep,
    shadowOpacity: 0.24,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 6 },
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
  taglineLarge: {
    fontSize: 32,
    lineHeight: 42,
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
