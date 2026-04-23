import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ImageStyle, StyleProp } from 'react-native';
import { useReducedMotion } from '../hooks/useReducedMotion';

// A small re-Genesis mark that breathes gently. Used as a brand touch in top
// bars and chrome where the old sparkles icon used to sit. Respects reduced
// motion: parks at mid-breath scale when the OS flag is on.
export function PulsingMark({
  size = 24,
  style,
  accessibilityLabel = 're-Genesis mark',
}: {
  size?: number;
  style?: StyleProp<ImageStyle>;
  accessibilityLabel?: string;
}) {
  const reducedMotion = useReducedMotion();
  const breath = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reducedMotion) {
      breath.setValue(0.5);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breath, {
          toValue: 1,
          duration: 2400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breath, {
          toValue: 0,
          duration: 2400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [breath, reducedMotion]);

  const scale = breath.interpolate({
    inputRange: [0, 1],
    outputRange: [0.94, 1.06],
  });

  return (
    <Animated.Image
      source={require('../../assets/brand/icon.png')}
      style={[
        { width: size, height: size, transform: [{ scale }] },
        style,
      ]}
      resizeMode="contain"
      accessibilityLabel={accessibilityLabel}
    />
  );
}
