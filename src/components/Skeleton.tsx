import React, { useEffect, useRef } from 'react';
import {
  Animated,
  DimensionValue,
  Easing,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { colors, radius as radii, shadows } from '../theme/colors';
import { useReducedMotion } from '../hooks/useReducedMotion';

// A calm loading placeholder: a soft block that breathes gently rather than a
// spinner. Respects Reduce Motion (parks at a steady soft opacity, no pulse).
// Used to sketch the shape of content that's on its way, so the screen never
// freezes or flashes a spinner.
export function Skeleton({
  width = '100%',
  height = 16,
  radius = 8,
  style,
}: {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const reducedMotion = useReducedMotion();
  const pulse = useRef(new Animated.Value(reducedMotion ? 0.5 : 0)).current;

  useEffect(() => {
    if (reducedMotion) {
      pulse.setValue(0.5);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 850,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 850,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, reducedMotion]);

  const opacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.85],
  });

  return (
    <Animated.View
      // Decorative only; screen readers hear the surrounding "loading" copy.
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        { width, height, borderRadius: radius, backgroundColor: colors.lineSoft, opacity },
        style,
      ]}
    />
  );
}

// A card-shaped placeholder that echoes a PostCard / StitchCard: a title line
// and a couple of body lines. `lines` controls the body line count.
export function SkeletonCard({ lines = 2 }: { lines?: number }) {
  return (
    <View style={styles.card}>
      <Skeleton width="70%" height={18} radius={6} />
      <View style={{ height: 12 }} />
      {Array.from({ length: lines }).map((_, i) => (
        <View key={i} style={{ marginBottom: 8 }}>
          <Skeleton width={i === lines - 1 ? '55%' : '100%'} height={12} radius={6} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: 18,
    marginBottom: 14,
    ...shadows.sm,
  },
});
