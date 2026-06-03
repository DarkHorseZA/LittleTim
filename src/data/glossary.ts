export type GlossaryTerm = {
  id: string;
  term: string;
  origin?: string; // e.g. "Hebrew", "Greek", etc.
  definition: string;
};

// Short definitions in T's voice, distilled from the manuscript.
export const glossary: GlossaryTerm[] = [
  {
    id: 're-genesis',
    term: 're-Genesis',
    definition:
      'A process. Unravelling the inherited thread of Fear and resewing with Love, one small stitch at a time.',
  },
  {
    id: 'msg',
    term: 'MSG · Meditative Somatic Gesture',
    definition:
      'A gentle, repeatable gesture that lets the body remember. Not performance. Practice. Repetition unravels and resews.',
  },
  {
    id: 'see',
    term: 'SEE · Somatic Experiencing Exercise',
    definition:
      'A simple sensual exercise, engaging sight, touch, smell, sound, taste, to discover hidden belief and feel it shift.',
  },
  {
    id: 'five-gestures',
    term: 'The Five Gestures',
    definition:
      'Feel · Whisper · Touch · Breathe · Bless. The creative gestures of The Divine, and ours to practice, every morning, under five minutes.',
  },
  {
    id: 'imagio-dei',
    term: 'Imagio Dei',
    origin: 'Latin',
    definition:
      'Image of God. The picture of The Divine sewn into us through ancestors and childhood, often invisible, always influential.',
  },
  {
    id: 'imagio-animi',
    term: 'Imagio Animi',
    origin: 'Latin',
    definition:
      'Image of Self. Your Imagio Dei gives you a clue to your Imagio Animi, and the other way around. Change one, change the other.',
  },
  {
    id: 'aboriginal-i-am',
    term: 'Aboriginal I Am',
    definition:
      'The original you, your essence, held in the Great Library of your atoms. Folded and stored for safekeeping. Waiting to unfold.',
  },
  {
    id: 'coarse-black-thread',
    term: 'The coarse black thread',
    definition:
      'The inherited thread of Fear, sewn through generations. Used to stitch our wounds in place. We come bent over the quilt to unravel it, stitch by stitch.',
  },
  {
    id: 'barak',
    term: 'Bārak',
    origin: 'Hebrew (בָּרַךְ)',
    definition:
      'Blessing. Not a wish. An infusion of permission and ability, empowerment, resources, flourishing. \u201CI am blessed. I may. I can.\u201D',
  },
  {
    id: 'ruach',
    term: 'Ruach',
    origin: 'Hebrew (רוּחַ)',
    definition:
      'Spirit. Breath. In the beginning, Ruach hovered over the waters, leaning in, like a lover.',
  },
  {
    id: 'nephesh',
    term: 'Nephesh',
    origin: 'Hebrew (נֶפֶשׁ)',
    definition:
      'Soul. Your living, breathing, emotional Life Force, spirit and earth woven together. Mind and body, at one.',
  },
  {
    id: 'nishmat-chayyim',
    term: 'Nishmat Chayyim',
    origin: 'Hebrew (נִשְׁמַ֣ת חַיִּ֑ים)',
    definition:
      'The breath of lives, plural, eternal. What was breathed into you. You are not a candle burning once.',
  },
  {
    id: 'tov-me-od',
    term: 'Tov me’od',
    origin: 'Hebrew (טוֹב מְאֹד)',
    definition:
      'Exceedingly good. Pleasing. Delicious. What They say when They see you, every time.',
  },
  {
    id: 'let-there-be',
    term: '\u201CLet there be\u201D',
    definition:
      'A creative whisper. Not a shout. A lover\'s instruction to the field. The second of the Five Gestures.',
  },
  {
    id: 'i-am',
    term: '\u201CI am\u201D',
    definition:
      'A power-code. A declaration of the present moment that speaks your reality into being. Filled with emotion, it creates.',
  },
  {
    id: 'patchwork-quilt',
    term: 'The patchwork quilt',
    definition:
      'Your life, spread out on the black-wood table. Little fabric squares, the essence of you, held together by thread. Ours to unravel and resew.',
  },
  {
    id: 'god-wound',
    term: 'The God-Wound',
    definition:
      'Shame, abandonment, betrayal, experienced in association with The Divine and passed down through generations. The wound that holds other wounds in place.',
  },
];
