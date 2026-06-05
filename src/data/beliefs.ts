import { Belief } from '../types';

// Eighteen affirming beliefs, all present-tense, all safe to land on any day.
// First ten map one-to-one with chapters 0–9 for chapter-gated display.
// The remaining eight carry chapter 0 (always unlocked) and enter the
// day-of-year rotation to broaden the daily welcome card.
export const beliefs: Belief[] = [
  {
    id: 'b-intro',
    chapter: 0,
    statement: 'I am safe. I am worthy. I am Love.',
    embedding:
      'Hands on your knees, then belly, then heart. Whisper each phrase as your hands arrive.',
  },
  {
    id: 'b-ch1',
    chapter: 1,
    statement: 'Fear was sewn in. Love is my own thread.',
    embedding:
      'Notice one old Fear-thought today. Breathe out slowly. Whisper: “This is not my original thread.”',
  },
  {
    id: 'b-ch2',
    chapter: 2,
    statement: 'When I feel safe and loved, my body heals.',
    embedding:
      'One hand on your heart, one on your belly. Breathe slowly. Whisper: “I am safe. I am loved. My body is healing.”',
  },
  {
    id: 'b-ch3',
    chapter: 3,
    statement: 'My belief, filled with emotion, creates my Life. I choose to believe from Love.',
    embedding:
      'Picture one thing you want to create today. Hold it with warm feeling. Whisper: “I believe this, from Love.”',
  },
  {
    id: 'b-ch4',
    chapter: 4,
    statement: 'I came from earth. She is home.',
    embedding:
      'Press your feet to the floor. Feel the earth beneath you. Whisper: “I am home. She is holding me.”',
  },
  {
    id: 'b-ch5',
    chapter: 5,
    statement: 'Spirit and Earth fell in Love, and from that Love They made me. They adore me.',
    embedding:
      'Hands resting on your heart. Feel that you are looked upon with adoration. Whisper: “They made me from Love. They adore me.”',
  },
  {
    id: 'b-ch6',
    chapter: 6,
    statement: 'I am blessed with permission and power.',
    embedding:
      'Hands on heart, belly, face. Three soft whispers: “I am blessed. I may. I can.”',
  },
  {
    id: 'b-ch7',
    chapter: 7,
    statement: 'Every breath is the breath of lives.',
    embedding:
      'Three slow breaths. With each inhale whisper inside: “I breathe the breath of lives.”',
  },
  {
    id: 'b-ch8',
    chapter: 8,
    statement: 'The power is in the now, not the perfect.',
    embedding:
      'Hand on heart. Whisper: “I am not that feeling. I am the one who feels it.” One breath. One stitch.',
  },
  {
    id: 'b-ch9',
    chapter: 9,
    statement: 'The quilt grows. Nothing here can be unstitched.',
    embedding:
      'Hold your hands open. Picture every stitch you have sewn. Whisper: “It is here. It is real.”',
  },
  {
    id: 'b-wrapped',
    chapter: 0,
    statement: 'I am wrapped in light.',
    embedding:
      'Close your eyes. Imagine soft light settling around your shoulders like a shawl. Rest there for one breath.',
  },
  {
    id: 'b-softness',
    chapter: 0,
    statement: 'Softness compounds. Every stitch counts.',
    embedding:
      'One hand on heart. Whisper: “This small thing I did today, it counts.” Let it be enough.',
  },
  {
    id: 'b-good',
    chapter: 0,
    statement: 'I am good. Very good.',
    embedding:
      'Hands on your face, palms warm. Whisper: “Very good.” Say it as if you mean it for someone you Love.',
  },
  {
    id: 'b-worthy',
    chapter: 0,
    statement: 'I am worthy of Love, also loving my Self.',
    embedding:
      'Arms across your chest, a gentle self-embrace. Whisper: “I am worthy of this.” Hold for three breaths.',
  },
  {
    id: 'b-sweat',
    chapter: 0,
    statement: 'The sweat is drying. I am remembering who I am.',
    embedding:
      'Rub your palms slowly down your arms. Breathe out. Whisper: “I am remembering.”',
  },
  {
    id: 'b-image',
    chapter: 0,
    statement: 'I came from Them. I am made in Their image.',
    embedding:
      'Look at your hands. Whisper: “These hands come from Love. They are Love’s hands.”',
  },
  {
    id: 'b-willing',
    chapter: 0,
    statement: 'I do not have to be perfect. I only have to be willing.',
    embedding:
      'One breath in through the nose. One slow breath out. Whisper: “Willing is enough.”',
  },
  {
    id: 'b-anticipation',
    chapter: 0,
    statement: 'I am earth, from Earth. She is waiting with anticipation.',
    embedding:
      'Feet on the floor, eyes soft. Whisper: “She knows me. She is glad I am here.”',
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
