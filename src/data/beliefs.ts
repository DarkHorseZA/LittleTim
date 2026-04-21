import { Belief } from '../types';

export const beliefs: Belief[] = [
  {
    id: 'b-01',
    statement: 'I am safe inside my own body.',
    embedding:
      'Place both palms over your heart and belly. Take three long exhales, whispering “safe” on each one.',
  },
  {
    id: 'b-02',
    statement: 'I am worthy of love, simply as I am.',
    embedding:
      'Wrap your arms around yourself. Squeeze gently and rock side to side for one minute.',
  },
  {
    id: 'b-03',
    statement: 'Abundance moves toward me when I relax.',
    embedding:
      'Open your hands on your thighs, palms up. Soften your jaw and let your shoulders drop twice.',
  },
  {
    id: 'b-04',
    statement: 'My body knows the way home.',
    embedding:
      'Feel the weight of your feet on the ground. Shift slowly side to side and notice what settles.',
  },
  {
    id: 'b-05',
    statement: 'I can trust what I feel.',
    embedding:
      'Place a hand on the part of your body that is asking for attention. Stay there for five breaths.',
  },
  {
    id: 'b-06',
    statement: 'I belong to this moment.',
    embedding:
      'Name three things you can see, two you can hear, one you can touch. Smile softly on the last one.',
  },
  {
    id: 'b-07',
    statement: 'Softness is a form of strength.',
    embedding:
      'Unclench your fists. Let the breath out through loose lips, like a horse sighing.',
  },
  {
    id: 'b-08',
    statement: 'I am allowed to take up space.',
    embedding:
      'Stand tall, reach your arms wide, and breathe into the space around your ribs for four rounds.',
  },
  {
    id: 'b-09',
    statement: 'Healing happens in small, gentle doses.',
    embedding:
      'Rest one hand on your chest. Tap slowly, left–right, like a lullaby, for a minute.',
  },
  {
    id: 'b-10',
    statement: 'I am connected to something larger than me.',
    embedding:
      'Look up to the horizon or ceiling. Let the gaze soften and feel the back of your head grow heavy.',
  },
  {
    id: 'b-11',
    statement: 'My yes is clear. My no is holy.',
    embedding:
      'Press your palms together at heart-height. Push gently, notice the boundary of your own strength.',
  },
  {
    id: 'b-12',
    statement: 'Joy is my natural state, returning.',
    embedding:
      'Bounce gently on your heels for thirty seconds. Let a small smile arrive without forcing it.',
  },
  {
    id: 'b-13',
    statement: 'I can be with what is hard without becoming it.',
    embedding:
      'Place one hand on a difficult sensation, the other on a neutral or pleasant spot. Breathe between them.',
  },
  {
    id: 'b-14',
    statement: 'Every breath is a quiet homecoming.',
    embedding:
      'Inhale for 4, hold for 2, exhale for 6. Three rounds, eyes closed.',
  },
];

export function beliefForDate(date: Date): Belief {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86_400_000
  );
  return beliefs[dayOfYear % beliefs.length];
}
