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

  // Quilt patch ramp (q0 = unsewn, q4 = richly sewn)
  q0: '#e8ddc9',
  q1: '#ecceaa',
  q2: '#ddb083',
  q3: '#cb8a56',
  q4: '#b0542f',
  thread: '#cdbfa6', // dashed border on unsewn patches

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

  // Shadow base (also referenced by the `shadows` presets below).
  shadow: '#2B1F0F',

  // Modal scrim behind bottom sheets / dialog backdrops.
  scrim: 'rgba(43, 31, 15, 0.45)',

  // Text input placeholder (a quiet hint, not readable body copy).
  placeholder: '#9A9086', // alias of inkHush

  // Warmth dial: cold end. The warm end is `clay`.
  warmthCold: '#8aa0b0',

  // Quilt fabric highlights — specular sheen + woven edges on sewn patches.
  sheen: 'rgba(255,255,255,0.5)',
  patchEdge: 'rgba(255,255,255,0.6)',
  patchEdgeRich: 'rgba(255,253,248,0.7)',
  patchStitch: 'rgba(255,253,248,0.6)',
  thumbRing: 'rgba(255,255,255,0.8)',

  // Quilt detail-card chips (neutral stitches vs. a "sewed with love" stitch).
  chipNeutralBg: '#efe6d6',
  chipNeutralFg: '#6a5f4f',
  chipLoveBg: '#e4ead2',
  chipLoveFg: '#566b34',

  // Gentle-note surfaces (the quilt onboarding card).
  noteBg: '#fdf5ee',
  noteStar: '#f5e2d2',
  notePill: '#f0d8c5',

  // QuiltPreview decorative patch ramp (onboarding preview component only).
  previewPatch1: '#E8C4A0',
  previewPatch2: '#D4956A',
  previewPatch3: '#C07040',
  clayDeep30: 'rgba(142,63,31,0.30)', // clayDeep at 30% alpha
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
  maxWidth: 520, // cap content width on desktop/tablet web (phone-frame simulation)
  contentMaxWidth: 700, // max content column width on native iPad / large screens
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
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  lg: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 14 },
    elevation: 6,
  },
} as const;

// Mixes two solid hex colours (`#rgb` or `#rrggbb`) in RGB space. `t` is the
// weight of `b` (0 = all `a`, 1 = all `b`). Use it to synthesise an intermediate
// stop for a runtime two-colour gradient so the ramp stays smooth and band-free
// on Android. Alpha and non-hex values (e.g. `transparent`) are not supported,
// so only pass solid hex colours.
export function blend(a: string, b: string, t: number): string {
  const parse = (hex: string) => {
    let h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  };
  const pa = parse(a);
  const pb = parse(b);
  const mix = (x: number, y: number) => Math.round(x + (y - x) * t);
  return (
    '#' +
    [mix(pa.r, pb.r), mix(pa.g, pb.g), mix(pa.b, pb.b)]
      .map((n) => n.toString(16).padStart(2, '0'))
      .join('')
  );
}

// Every ramp carries 3+ intermediate stops. Two-stop gradients band visibly on
// Android; the extra stops (plus expo-linear-gradient's `dither`, on by default)
// keep the transition smooth. It costs nothing on iOS or web.
//
// `dawn`, `dawnDeep`, `heart`, and `sage` resolve to `colors.bg` at their final
// stop. That is deliberate: the fixed-height hero bands on Today, Account, and
// Connect sit on a `colors.bg` page, so ending the wash on the page colour is
// what removes the hard horizontal seam where the band met the scroll body.
export const gradients = {
  dawn: ['#FBE9DB', '#FAEBDE', '#F8ECE1', '#F7EEE3', colors.bg] as const,
  dawnDeep: ['#F5D1B1', '#F5D9BE', '#F5E0CC', '#F5E8D9', colors.bg] as const,
  dusk: ['#E9D5B8', '#E4CBAB', '#E0C19F', '#DBB792', '#D6AD85'] as const,
  clay: ['#CF7148', '#C5663D', '#BC5B33', '#B24F28', '#A8441D'] as const,
  heart: ['#F4D2DC', '#F4D9DF', '#F5E0E1', '#F5E8E4', colors.bg] as const,
  sage: ['#D9E6CF', '#E0E8D5', '#E7EBDB', '#EEEDE0', colors.bg] as const,
};
