import { Practice } from '../types';

export const msgPractices: Practice[] = [
  {
    id: 'msg-heart-open',
    kind: 'MSG',
    title: 'Heart Opening',
    durationMin: 5,
    cue: 'For when the chest feels tight or guarded.',
    steps: [
      'Stand or sit tall. Place palms together at the sternum.',
      'On an inhale, draw the elbows wide, opening the front of the chest.',
      'On an exhale, return to center. Whisper a word of welcome to yourself.',
      'Repeat slowly for 2–3 minutes, letting the gesture lead the breath.',
      'Close by resting one hand on the heart. Feel the beat beneath the palm.',
    ],
  },
  {
    id: 'msg-grounding-tree',
    kind: 'MSG',
    title: 'Rooted Tree',
    durationMin: 4,
    cue: 'For when the mind is racing.',
    steps: [
      'Stand with feet hip-width apart. Press evenly into all four corners of each foot.',
      'Inhale, lift arms slowly overhead like branches reaching for light.',
      'Exhale, sway gently from side to side, roots holding.',
      'Continue for ten breaths, then lower the arms and rest.',
    ],
  },
  {
    id: 'msg-offering',
    kind: 'MSG',
    title: 'Offering & Receiving',
    durationMin: 6,
    cue: 'When something feels too heavy to carry alone.',
    steps: [
      'Seated or standing, cup both hands in front of the belly as if holding water.',
      'Inhale, lift the hands forward and up, offering what is heavy.',
      'Turn palms upward and wait. Let the exhale arrive on its own.',
      'Inhale, draw hands back to the belly, receiving.',
      'Repeat for six rounds with reverence.',
    ],
  },
  {
    id: 'msg-bowing',
    kind: 'MSG',
    title: 'Soft Bow',
    durationMin: 3,
    cue: 'A short reset between tasks.',
    steps: [
      'Stand with feet parallel. Place palms together at the forehead.',
      'Slowly bow forward from the hips, letting the head hang.',
      'Stay for three breaths. Let the exhale be longer than the inhale.',
      'Rise on an inhale, crown of head leading the way.',
    ],
  },
];

export const seePractices: Practice[] = [
  {
    id: 'see-orienting',
    kind: 'SEE',
    title: 'Orienting',
    durationMin: 4,
    cue: 'Signals the nervous system: I am here, and it is now.',
    steps: [
      'Sit comfortably. Let the gaze wander around the room, slowly, without goal.',
      'Notice colors, edges, light. Let the neck turn as it wants.',
      'Pause when something pleasing catches the eye. Let yourself linger.',
      'Notice any sigh, yawn, or softening. These are signs of completion.',
    ],
  },
  {
    id: 'see-pendulation',
    kind: 'SEE',
    title: 'Pendulation',
    durationMin: 6,
    cue: 'Moves attention between a charged sensation and a neutral resource.',
    steps: [
      'Notice an area of discomfort. Rate its intensity 1–10.',
      'Find a neutral or pleasant place in the body (often palms, feet, back).',
      'Rest attention there for a few breaths.',
      'Return to the charged area briefly. Back again to the resource.',
      'Swing gently between the two. End on the resource.',
    ],
  },
  {
    id: 'see-voo',
    kind: 'SEE',
    title: 'Voo Sound',
    durationMin: 3,
    cue: 'Gentle vagal toning through sound.',
    steps: [
      'Sit with an upright spine. Take a slow breath in through the nose.',
      'On the exhale, make a low “voooo” sound, long and even.',
      'Feel the vibration spread into the belly and ribs.',
      'Rest silently after each round. Repeat five times.',
    ],
  },
  {
    id: 'see-self-hold',
    kind: 'SEE',
    title: 'Containing Hold',
    durationMin: 5,
    cue: 'Creates a felt sense of boundary and safety.',
    steps: [
      'Place one hand under the opposite armpit, the other across the upper arm.',
      'Let the weight of the hands settle. Feel contained.',
      'Breathe normally. Notice the space between your hands.',
      'Stay for three to five minutes. End slowly.',
    ],
  },
];

export function allPractices(): Practice[] {
  return [...msgPractices, ...seePractices];
}

export function findPractice(id?: string): Practice | undefined {
  if (!id) return undefined;
  return allPractices().find((p) => p.id === id);
}
