import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from './colors';

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
//
//   <Pressable onPress={tapThen(doThing)} ... />

// Fire a subtle selection tick. Use for toggles, chips, segment buttons,
// anything where the tap changes a value within the current screen.
// Native-only; on web Haptics no-ops, and we swallow any device/permission
// errors so a tap never throws up to the user.
export function tap() {
  try {
    Haptics.selectionAsync();
  } catch {
    /* no haptic engine on this device, swallow */
  }
}

// Fire a gentle impact. Use for taps that navigate (open a modal, push a
// screen, dive into a tile). Slightly more substantial than `tap()` so the
// body reads "something is happening" vs "I toggled a thing". Light by
// default to stay inside re-Genesis' calm tone.
export function nav() {
  try {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    /* no haptic engine on this device, swallow */
  }
}

// Convenience: wrap an onPress so it fires a tick first, then the handler.
export function tapThen(fn: () => void | Promise<void>) {
  return () => {
    tap();
    return fn();
  };
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
