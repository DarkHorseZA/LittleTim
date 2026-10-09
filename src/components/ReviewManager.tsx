import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { useDay } from '../store/DayContext';
import { askForReview, reachedReviewMoment } from '../review';

// Asks for an app-store rating once, at a good moment: a fresh stitch that
// pushes the reader past a few days of real use. Renders nothing. Never asks on
// launch (a baseline is captured on the first ready render without firing) and
// never after a failure (it only reacts to the quilt growing).
export function ReviewManager() {
  const { ready, settings, quiltEntries, updateSettings } = useDay();
  const prevLenRef = useRef<number | null>(null);

  useEffect(() => {
    if (!ready) return;
    const len = quiltEntries.length;

    // First ready render: set the baseline, never fire. This is what keeps a
    // cold start with many existing stitches from asking on launch.
    if (prevLenRef.current === null) {
      prevLenRef.current = len;
      return;
    }

    const grew = len > prevLenRef.current;
    prevLenRef.current = len;

    const moment = reachedReviewMoment({
      ready,
      isWeb: Platform.OS === 'web',
      ratingAsked: !!settings.ratingAsked,
      grew,
      stitches: len,
    });
    if (!moment) return;

    // Mark first so a re-render mid-await can't ask twice, then ask.
    (async () => {
      await updateSettings({ ratingAsked: true });
      await askForReview();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, quiltEntries.length, settings.ratingAsked]);

  return null;
}
