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

  // Misc
  amber: '#E0B872',
  danger: '#B5524C',
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

export const spacing = (n: number) => n * 4;

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
