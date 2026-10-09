/**
 * The one place that owns every haptic, named by the moment it belongs to, so
 * the app feels consistent. Soft feedback on the moments that matter, never a
 * buzz on everything, and never a buzz when something goes wrong (failures are
 * said in words).
 *
 * - tapFeedback   choosing / ticking (chips, segments, checkboxes, tab switches)
 * - savedFeedback a quiet nod for an ordinary save (settings, a note)
 * - confirmFeedback the important moments (the main thing saved, a flow finished)
 * - snapFeedback  a "click into place" when a goal or valid state is reached
 * - achievementFeedback a rare milestone (success, then a light second tap)
 *
 * Android uses its own haptics engine (crisper, respects the phone's settings),
 * iOS the Taptic primitives. Read the Settings toggle at call time; off on web.
 * Every call is fire-and-forget and swallows device/permission errors.
 */
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

const isAndroid = Platform.OS === 'android';
const isWeb = Platform.OS === 'web';

// Synced from Settings (see HapticsSync). Default on, except web.
let enabled = !isWeb;
export function setHapticsEnabled(on: boolean) {
  enabled = on && !isWeb;
}

function run(fn: () => Promise<unknown>) {
  if (!enabled) return;
  // Fire-and-forget; a device without a haptic engine must never throw at a tap.
  Promise.resolve()
    .then(fn)
    .catch(() => {});
}

export function tapFeedback() {
  run(() =>
    isAndroid
      ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Clock_Tick)
      : Haptics.selectionAsync()
  );
}

export function savedFeedback() {
  run(() =>
    isAndroid
      ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Virtual_Key)
      : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  );
}

export function confirmFeedback() {
  run(() =>
    isAndroid
      ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm)
      : Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  );
}

export function snapFeedback() {
  run(() =>
    isAndroid
      ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Toggle_On)
      : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)
  );
}

export function achievementFeedback() {
  run(async () => {
    if (isAndroid) {
      await Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    await new Promise((r) => setTimeout(r, 260));
    if (isAndroid) {
      await Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Clock_Tick);
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  });
}
