import React, { useRef, useState } from 'react';
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
import { blend, colors, gradients, layout, radius, shadows } from '../theme/colors';
import { fonts, text } from '../theme/type';
import { webFocus } from '../theme/interactions';
import { Button } from '../components/Button';
import { firstRunRoute } from '../onboarding';
import { useDay } from '../store/DayContext';
import { useReducedMotion } from '../hooks/useReducedMotion';

type Props = NativeStackScreenProps<RootStackParamList, 'Tour'>;

type Stop = {
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  tintSoft: string;
  eyebrow: string;
  title: string;
  body: string;
};

// A short, warm walk through where things live. An invitation, not a manual.
const STOPS: Stop[] = [
  {
    icon: 'sunny-outline',
    tint: colors.clay,
    tintSoft: colors.claySoft,
    eyebrow: 'Today',
    title: 'Your anchor each morning',
    body: 'The day’s belief and the Five Gestures live here. Three minutes, one small stitch, the gentle start to a day.',
  },
  {
    icon: 'leaf-outline',
    tint: colors.health,
    tintSoft: colors.healthSoft,
    eyebrow: 'Practice',
    title: 'A library to return to',
    body: 'Every MSG and SEE practice, gathered by chapter. Come back to any of them whenever the moment calls.',
  },
  {
    icon: 'moon-outline',
    tint: colors.relationships,
    tintSoft: colors.relationshipsSoft,
    eyebrow: 'Journal',
    title: 'Watch the quilt grow',
    body: 'Two short sentences each evening: one stitch you sewed with Love, one moment the old thread pulled. Each day becomes a patch.',
  },
  {
    icon: 'ellipsis-horizontal',
    tint: colors.wealth,
    tintSoft: colors.wealthSoft,
    eyebrow: 'More',
    title: 'Everything else, gently',
    body: 'Tell the app which chapter you’re reading, set a daily reminder, read how it all works, or reach out. You can take this tour again from here anytime.',
  },
];

export function TourScreen({ navigation, route }: Props) {
  const firstRun = route.params?.firstRun === true;
  const { settings, updateSettings } = useDay();
  const reducedMotion = useReducedMotion();

  const [idx, setIdx] = useState(0);
  const stop = STOPS[idx];
  const isLast = idx === STOPS.length - 1;

  const fade = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;

  // Gentle cross-fade on each stop. Instant under reduced motion.
  React.useEffect(() => {
    if (reducedMotion) {
      fade.setValue(1);
      return;
    }
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: 360,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [idx, fade, reducedMotion]);

  // Where the tour hands off. On first run it continues the onboarding flow; on
  // the skip path the account hasn't been captured yet, so go there next.
  // Otherwise (re-taken from More, or offered after the account) it just closes
  // or continues to the next first-run step.
  const finish = async () => {
    if (!settings.tourSeen) await updateSettings({ tourSeen: true });
    if (!firstRun) {
      navigation.goBack();
      return;
    }
    if (!settings.registeredEmail) {
      navigation.replace('EmailSignup', { firstRun: true, afterTour: true });
      return;
    }
    const next = firstRunRoute(settings);
    if (next === 'Tracker') navigation.replace('Tracker');
    else navigation.replace('Tabs', { screen: 'Today' });
  };

  const onNext = () => {
    if (isLast) finish();
    else setIdx((i) => i + 1);
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[stop.tintSoft, blend(stop.tintSoft, colors.bg, 0.5), colors.bg]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.6, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topRow}>
          <View style={styles.dots}>
            {STOPS.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === idx && { backgroundColor: stop.tint, width: 18 },
                  i < idx && { backgroundColor: stop.tint },
                ]}
              />
            ))}
          </View>
          <Pressable
            onPress={finish}
            accessibilityRole="button"
            accessibilityLabel={firstRun ? 'Skip the tour' : 'Close the tour'}
            hitSlop={12}
            style={({ pressed, focused }: any) => [
              styles.skip,
              pressed && { opacity: 0.6 },
              focused && webFocus,
            ]}
          >
            <Text style={styles.skipText}>{firstRun ? 'Skip' : 'Close'}</Text>
          </Pressable>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fade, alignItems: 'center' }}>
            <View style={styles.iconWrap}>
              <View style={[styles.iconHalo, { backgroundColor: stop.tintSoft }]} />
              <View style={[styles.iconCircle, { backgroundColor: stop.tint }]}>
                <Ionicons name={stop.icon} size={40} color={colors.white} />
              </View>
            </View>

            <Text style={[styles.eyebrow, { color: stop.tint }]}>
              {stop.eyebrow}
            </Text>
            <Text style={styles.title}>{stop.title}</Text>
            <Text style={styles.body}>{stop.body}</Text>
          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={isLast ? (firstRun ? 'Begin' : 'Done') : 'Next'}
            trailingIcon={isLast ? 'checkmark' : 'arrow-forward'}
            onPress={onNext}
            size="lg"
            haptic={isLast ? 'success' : 'selection'}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 4,
  },
  dots: {
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
  skip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
  },
  skipText: {
    fontFamily: fonts.sansSemi,
    fontSize: 14,
    color: colors.inkSoft,
  },
  container: {
    flexGrow: 1,
    padding: 28,
    paddingBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
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
  eyebrow: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  title: {
    ...text.hero,
    textAlign: 'center',
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    color: colors.ink,
    textAlign: 'center',
    marginTop: 14,
    paddingHorizontal: 8,
  },
  footer: {
    padding: 20,
    paddingTop: 6,
  },
});
