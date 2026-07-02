import { useWindowDimensions } from 'react-native';

// Large screens (tablets, wide web) get a roomier composition: content is
// centred in a column and hero elements scale up so the layout doesn't read as
// a small phone cluster floating in a big canvas. Width-based, not
// platform-based, per the app's responsive convention.
export function useLargeScreen() {
  const { width } = useWindowDimensions();
  const isLarge = width >= 700;
  return { isLarge };
}
