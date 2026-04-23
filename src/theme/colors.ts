export const colors = {
  // Surfaces
  bg: '#F5EFE6',
  bgDeep: '#EDE3D1',
  surface: '#FFFFFF',
  surfaceSoft: '#FBF6EF',
  overlay: 'rgba(27, 18, 9, 0.42)',

  // Ink
  ink: '#211A13',
  inkSoft: '#5E554B',
  // inkFaint meets WCAG AA (4.5:1) on bg `#F5EFE6`; used for captions, meta, subs.
  inkFaint: '#6A6058',
  // inkHush is decorative-only (legends, dots, borders). Not for readable text.
  inkHush: '#9A9086',
  line: '#E7DCC9',
  lineSoft: '#F1E8D9',

  // Brand — a warm, deliberate clay
  clay: '#B7572E',
  clayDeep: '#8E3F1F',
  claySoft: '#F2D6C2',
  clayWash: '#FBE9DB',

  // Semantic accent for completion
  done: '#6F8D5C',
  doneSoft: '#DCE6CF',

  // Area hues (used by tracker + focus area)
  happiness: '#D9A64A',
  happinessSoft: '#F6E7C4',
  loved: '#C95A78',
  lovedSoft: '#F4D2DC',
  health: '#6F9764',
  healthSoft: '#D9E6CF',
  wealth: '#B8833A',
  wealthSoft: '#EDDCBC',
  relationships: '#6E7FAE',
  relationshipsSoft: '#D7DEEB',

  // Heatmap intensities (History grid). 5 steps, on-brand clay ramp.
  heat0: '#F1E8D9', // same as lineSoft, for "no activity"
  heat1: '#F4D6C2',
  heat2: '#EDBB99',
  heat3: '#D99C6E',
  heat4: '#B7572E', // same as clay, full intensity

  // Misc
  amber: '#E0B872',
  danger: '#B5524C',

  // Semantic neutrals for on-brand foregrounds. Use `onClay` for text/icons
  // sitting on clay or gradient clay buttons. `white` is the universal alias
  // for pure white so we never hardcode #FFFFFF in components.
  white: '#FFFFFF',
  onClay: '#FFFFFF',

  // Translucent surface tokens. Use these instead of raw rgba() literals so
  // the alpha ramp is consistent across the app and survives a dark-mode pass.
  // `glass` sits over dawn gradients (close buttons on modal heroes).
  // `onClay*` variants sit on clay gradients (Today hero chips, subhead text).
  glass: 'rgba(255,255,255,0.70)',
  onClaySoft: 'rgba(255,255,255,0.85)',
  onClayStrong: 'rgba(255,255,255,0.92)',
  onClayChip: 'rgba(255,255,255,0.22)',
};

export type AreaColor =
  | 'happiness'
  | 'loved'
  | 'health'
  | 'wealth'
  | 'relationships';

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 30,
  pill: 999,
};

// 4pt spacing function (existing).
export const spacing = (n: number) => n * 4;

// Layout tokens. Keep screen padding consistent across every SafeAreaView container.
export const layout = {
  screen: 20, // horizontal/vertical padding on the scroll container
  screenTight: 16, // for dense pages
  screenLoose: 24, // for editorial / modal hero blocks
  maxWidth: 520, // cap content width on desktop/tablet web
};

// Icon circle sizes (avatar, list-item icon, hero icon, etc.).
// Use these any time you draw a round icon-in-a-disc.
export const iconSize = {
  xs: 24,
  sm: 30,
  md: 40,
  lg: 52,
  xl: 88,
};

export const shadows = {
  sm: {
    shadowColor: '#2B1F0F',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  md: {
    shadowColor: '#2B1F0F',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  lg: {
    shadowColor: '#2B1F0F',
    shadowOpacity: 0.12,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 14 },
    elevation: 6,
  },
} as const;

export const gradients = {
  dawn: ['#FBE9DB', '#F5EFE6'] as const,
  dawnDeep: ['#F5D1B1', '#EDE3D1'] as const,
  dusk: ['#E9D5B8', '#D6AD85'] as const,
  clay: ['#CF7148', '#A8441D'] as const,
  heart: ['#F4D2DC', '#F5EFE6'] as const,
  sage: ['#D9E6CF', '#F5EFE6'] as const,
};
