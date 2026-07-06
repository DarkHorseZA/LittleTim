import { Dimensions, TextStyle } from 'react-native';
import { colors } from './colors';

export const fonts = {
  serif: 'Fraunces_400Regular',
  serifItalic: 'Fraunces_400Regular_Italic',
  serifMed: 'Fraunces_500Medium',
  serifBold: 'Fraunces_600SemiBold',
  sans: 'Inter_400Regular',
  sansMed: 'Inter_500Medium',
  sansSemi: 'Inter_600SemiBold',
  sansBold: 'Inter_700Bold',
};

// Snapshot the launch window width for a tablet check. This runs once at module
// load, not per render, because these styles are consumed inside StyleSheet
// factories that can't participate in React state. The trade-off is that
// rotation from portrait to landscape mid-session won't reflow type sizes; the
// tab bar, Welcome hero, and other useLargeScreen()-driven pieces still do
// react to width changes at render time.
const LAUNCH_WIDTH = Dimensions.get('window').width;
const IS_TABLET = LAUNCH_WIDTH >= 700;

// Per-token type ramp: hero/display grow the most, body copy grows moderately,
// caption grows least. Multipliers stay below 1.4× so line lengths remain
// readable inside the contentMaxWidth column.
const s = IS_TABLET
  ? { hero: 1.35, display: 1.32, h1: 1.30, h2: 1.28, quote: 1.30, title: 1.22, body: 1.20, label: 1.20, caption: 1.15, eyebrow: 1.18, number: 1.20 }
  : { hero: 1, display: 1, h1: 1, h2: 1, quote: 1, title: 1, body: 1, label: 1, caption: 1, eyebrow: 1, number: 1 };
const px = (n: number, k: number) => Math.round(n * k);

export const text = {
  eyebrow: {
    fontFamily: fonts.sansSemi,
    fontSize: px(11, s.eyebrow),
    letterSpacing: IS_TABLET ? 2.6 : 2.2,
    color: colors.inkFaint,
    textTransform: 'uppercase',
  } as TextStyle,
  // Full-screen editorial hero titles (Baseline, Morning Ritual).
  hero: {
    fontFamily: fonts.serifBold,
    fontSize: px(40, s.hero),
    lineHeight: px(48, s.hero),
    color: colors.ink,
  } as TextStyle,
  // Modal / detail screen titles, and the Today date. The single largest
  // title most readers see day to day.
  display: {
    fontFamily: fonts.serifBold,
    fontSize: px(34, s.display),
    lineHeight: px(40, s.display),
    color: colors.ink,
  } as TextStyle,
  h1: {
    fontFamily: fonts.serifBold,
    fontSize: px(30, s.h1),
    lineHeight: px(36, s.h1),
    color: colors.ink,
  } as TextStyle,
  h2: {
    fontFamily: fonts.serifBold,
    fontSize: px(22, s.h2),
    lineHeight: px(28, s.h2),
    color: colors.ink,
  } as TextStyle,
  quote: {
    fontFamily: fonts.serifItalic,
    fontSize: px(26, s.quote),
    lineHeight: px(36, s.quote),
    color: colors.ink,
  } as TextStyle,
  title: {
    fontFamily: fonts.sansSemi,
    fontSize: px(18, s.title),
    color: colors.ink,
  } as TextStyle,
  body: {
    fontFamily: fonts.sans,
    fontSize: px(15, s.body),
    lineHeight: px(22, s.body),
    color: colors.inkSoft,
  } as TextStyle,
  bodyInk: {
    fontFamily: fonts.sans,
    fontSize: px(15, s.body),
    lineHeight: px(22, s.body),
    color: colors.ink,
  } as TextStyle,
  label: {
    fontFamily: fonts.sansMed,
    fontSize: px(14, s.label),
    color: colors.ink,
  } as TextStyle,
  caption: {
    fontFamily: fonts.sans,
    fontSize: px(12, s.caption),
    color: colors.inkFaint,
  } as TextStyle,
  number: {
    fontFamily: fonts.serifBold,
    fontSize: px(56, s.number),
    lineHeight: px(60, s.number),
    color: colors.clay,
  } as TextStyle,
  numberSm: {
    fontFamily: fonts.serifBold,
    fontSize: px(22, s.number),
    color: colors.clay,
  } as TextStyle,
};
