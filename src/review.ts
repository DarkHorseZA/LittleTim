import { Platform } from 'react-native';
import * as StoreReview from 'expo-store-review';

// In-app store rating, asked once at a good moment and never after a failure.
// The OS rate-limits its own sheet, so our job is only to pick the moment: a
// fresh stitch that pushes the reader past a few days of real use. We never
// show a custom "please rate" prompt first (Apple discourages gating the OS
// sheet behind one).

// How many stitches signal the reader has genuinely settled into the practice.
export const REVIEW_STITCH_THRESHOLD = 5;

// Whether a just-completed stitch is a good moment to ask for a review. Pure so
// it can be unit-tested; the caller passes `grew` (did the quilt just grow this
// session), so a cold start with many existing stitches never triggers on
// launch.
export function reachedReviewMoment(args: {
  ready: boolean;
  isWeb: boolean;
  ratingAsked: boolean;
  grew: boolean;
  stitches: number;
}): boolean {
  const { ready, isWeb, ratingAsked, grew, stitches } = args;
  if (!ready || isWeb) return false;
  if (ratingAsked) return false;
  if (!grew) return false;
  return stitches >= REVIEW_STITCH_THRESHOLD;
}

// Ask the OS to present its rating sheet. Best-effort: unavailable platforms
// (web, or a device without the capability) and any error are silent, never
// blocking the app.
export async function askForReview(): Promise<void> {
  try {
    if (Platform.OS === 'web') return;
    const available = await StoreReview.isAvailableAsync();
    if (!available) return;
    await StoreReview.requestReview();
  } catch {
    // best-effort; a rating is never worth interrupting the practice for
  }
}
