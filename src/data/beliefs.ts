import { Belief } from '../types';

// One belief per chapter (Introduction + Chapters 1-9).
// Statements and embeddings are distilled in the book's voice — paraphrased
// from the manuscript's "Chapter Takeaway" sections, never lifted verbatim.
export const beliefs: Belief[] = [
  {
    id: 'b-intro',
    chapter: 0,
    statement: 'I am safe. I am worthy. I am Love. Let there be me.',
    embedding:
      'Hands on your knees, then belly, then heart. Whisper each word as your hands arrive.',
  },
  {
    id: 'b-ch1',
    chapter: 1,
    statement: 'I can change the memory with an other experience.',
    embedding:
      'Notice what scent, sound, or face pulls at you today. Pause. Ask: is this mine, or passed to me?',
  },
  {
    id: 'b-ch2',
    chapter: 2,
    statement: 'My immune function follows my emotional state.',
    embedding:
      'Hand on heart. Slow the breath. Whisper: “I feel safe, and my body listens.”',
  },
  {
    id: 'b-ch3',
    chapter: 3,
    statement: 'Emotion filled belief is my creative power.',
    embedding:
      'Remember one moment you created something from Love. Let the warmth return to your chest.',
  },
  {
    id: 'b-ch4',
    chapter: 4,
    statement: 'I am earth. Returning to earth is homecoming.',
    embedding:
      'Rub your palms together until they feel warm. Whisper: “I am earth, wrapped in light.”',
  },
  {
    id: 'b-ch5',
    chapter: 5,
    statement: 'I am Love from Love.',
    embedding:
      'Open your arms away from your body — “I let go of shame.” Bring them back to your heart — “I resew with Love.”',
  },
  {
    id: 'b-ch6',
    chapter: 6,
    statement: 'I am blessed. I may. I can.',
    embedding:
      'Hands on heart, belly, face. Three soft whispers of “I am blessed.”',
  },
  {
    id: 'b-ch7',
    chapter: 7,
    statement: 'I feel. I whisper. I touch. I breathe. I bless.',
    embedding:
      'Sixty seconds. One of each: feel a feeling, whisper a “let there be”, touch your palms, three breaths, bless yourself.',
  },
  {
    id: 'b-ch8',
    chapter: 8,
    statement: 'The power is in the now.',
    embedding:
      'Hand on heart. Whisper: “I am not that feeling. I am the one who feels it.” Take one breath. Sew one stitch.',
  },
  {
    id: 'b-ch9',
    chapter: 9,
    statement: 'They are here. They are weaving with me.',
    embedding:
      'Reach one hand out beside you. Whisper: “I am Love, creating — and I am not alone.”',
  },
];

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86_400_000);
}

export function beliefForDate(
  date: Date,
  currentChapter?: number | null
): Belief {
  if (
    currentChapter !== undefined &&
    currentChapter !== null &&
    currentChapter >= 0 &&
    currentChapter < beliefs.length
  ) {
    return beliefs[currentChapter];
  }
  return beliefs[dayOfYear(date) % beliefs.length];
}

export function beliefForChapter(chapter: number): Belief | undefined {
  return beliefs.find((b) => b.chapter === chapter);
}
