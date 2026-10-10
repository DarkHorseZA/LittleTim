import { Platform } from 'react-native';
import { colors } from './colors';
import { tapFeedback } from '../components/feedback';

// Unified interaction primitives so every tappable surface (cards, rows,
// segment buttons, icon pills) feels identical:
//   - selection haptic on tap (native only, safely no-ops on web)
//   - subtle scale-down on press for tap feedback
//   - a visible 2px focus ring on web for keyboard users
//
// Consumers wire these into Pressable in one of two shapes:
//
//   <Pressable
//     onPress={() => { tap(); doThing(); }}
//     style={({ pressed, focused }: any) => [
//       styles.card,
//       pressed && pressScale,
//       focused && webFocus,
//     ]}
//   />

// The selection tick for choosing within a screen (toggles, chips, segments).
// All haptics live in `components/feedback.ts`; this is just the call-site name.
export const tap = tapFeedback;

// Plain navigation (open a modal, push a screen, a row tap) is intentionally
// SILENT, per the feel rules: a haptic is for choosing and for what matters, not
// for moving around. Kept as a no-op so existing call sites read clearly.
export function nav() {
  /* navigation is silent */
}

// Press-state transform. Applied only when `pressed` is true in Pressable's
// style callback. Slight scale + opacity drop that matches the Button/
// CloseButton feel (scale 0.98 for large surfaces, 0.95 for small icons).
export const pressScale = {
  transform: [{ scale: 0.98 as number }],
  opacity: 0.95,
};

// Web-only 2px focus ring, matches CloseButton/Button. Outline properties
// are ignored on native RN; gating on Platform.OS keeps the intent clear.
export const webFocus: any =
  Platform.OS === 'web'
    ? {
        outlineWidth: 2,
        outlineStyle: 'solid',
        outlineColor: colors.clayDeep,
        outlineOffset: 2,
      }
    : {};
