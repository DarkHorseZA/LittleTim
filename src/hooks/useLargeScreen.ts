import { useWindowDimensions } from 'react-native';

// Large screens (tablets, wide web) get a roomier composition: content is
// centred in a column and hero elements scale up so the layout doesn't read as
// a small phone cluster floating in a big canvas. Width-based, not
// platform-based, per the app's responsive convention.
//
// `scale` is a mild multiplier for touch targets, hero art, and the biggest
// headings on tablet, leaving body copy and cards intact so we don't blanket-
// multiply every style. Add a 700pt breakpoint below and it flows through.
const LARGE_MIN = 700;
const LARGE_SCALE = 1.15;

export function useLargeScreen() {
  const { width } = useWindowDimensions();
  const isLarge = width >= LARGE_MIN;
  const scale = isLarge ? LARGE_SCALE : 1;
  return { isLarge, scale };
}

// Multiplies a base value by the large-screen scale. Kept as a helper so
// styles that need a couple of scaled numbers stay readable at the call site.
export function scaled(base: number, scale: number): number {
  return Math.round(base * scale);
}
