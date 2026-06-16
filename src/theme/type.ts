import { TextStyle } from 'react-native';
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

export const text = {
  eyebrow: {
    fontFamily: fonts.sansSemi,
    fontSize: 11,
    letterSpacing: 2.2,
    color: colors.inkFaint,
    textTransform: 'uppercase',
  } as TextStyle,
  // Full-screen editorial hero titles (Baseline, Morning Ritual).
  hero: {
    fontFamily: fonts.serifBold,
    fontSize: 40,
    lineHeight: 48,
    color: colors.ink,
  } as TextStyle,
  // Modal / detail screen titles, and the Today date. The single largest
  // title most readers see day to day.
  display: {
    fontFamily: fonts.serifBold,
    fontSize: 34,
    lineHeight: 40,
    color: colors.ink,
  } as TextStyle,
  h1: {
    fontFamily: fonts.serifBold,
    fontSize: 30,
    lineHeight: 36,
    color: colors.ink,
  } as TextStyle,
  h2: {
    fontFamily: fonts.serifBold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.ink,
  } as TextStyle,
  quote: {
    fontFamily: fonts.serifItalic,
    fontSize: 26,
    lineHeight: 36,
    color: colors.ink,
  } as TextStyle,
  title: {
    fontFamily: fonts.sansSemi,
    fontSize: 18,
    color: colors.ink,
  } as TextStyle,
  body: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkSoft,
  } as TextStyle,
  bodyInk: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.ink,
  } as TextStyle,
  label: {
    fontFamily: fonts.sansMed,
    fontSize: 14,
    color: colors.ink,
  } as TextStyle,
  caption: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.inkFaint,
  } as TextStyle,
  number: {
    fontFamily: fonts.serifBold,
    fontSize: 56,
    lineHeight: 60,
    color: colors.clay,
  } as TextStyle,
  numberSm: {
    fontFamily: fonts.serifBold,
    fontSize: 22,
    color: colors.clay,
  } as TextStyle,
};
