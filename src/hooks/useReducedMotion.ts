import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Reads the platform "reduce motion" preference and subscribes to changes.
 *
 * - iOS/Android: honors the OS Accessibility setting.
 * - Web: honors prefers-reduced-motion.
 *
 * Screens should skip/shorten looping animations when this returns true.
 * WCAG 2.3.3, Apple HIG Reduced Motion, Material Design motion guidelines.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let cancelled = false;

    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (!cancelled) setReduced(enabled);
      })
      .catch(() => {
        // isReduceMotionEnabled can reject on older platforms, fall back to false.
      });

    const sub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        if (!cancelled) setReduced(enabled);
      }
    );

    return () => {
      cancelled = true;
      // RN >= 0.65 returns an EventSubscription with remove()
      sub?.remove?.();
    };
  }, []);

  return reduced;
}
