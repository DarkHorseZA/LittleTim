import { FocusArea, FocusAreaPrompt } from '../types';

// Guiding questions are written in the voice of re-Genesis:
// coarse black thread / Fear, and the new thread of Love.
export const focusAreas: Record<FocusArea, FocusAreaPrompt> = {
  happiness: {
    area: 'happiness',
    label: 'Happiness',
    emoji: '☀️',
    question:
      'When you picture being happy, what belief is under the feeling, is it sewn with Fear, or with Love?',
    coachingTeaser:
      'A coach can help you trace that thread, unravel what does not belong, and resew with Love.',
  },
  loved: {
    area: 'loved',
    label: 'Feeling loved',
    emoji: '💗',
    question:
      'Where in your body do you feel loved today? Can you place your hand there and whisper, “I am Love from Love.”',
    coachingTeaser:
      'Together we can expand that felt-sense of being loved into more of your day.',
  },
  health: {
    area: 'health',
    label: 'Health',
    emoji: '🌿',
    question:
      'Your immune function follows your emotional state. What emotion have you been instructing your body with today?',
    coachingTeaser:
      'A coach can help you build gentle somatic routines that teach your body Rest, Digest, Reproduce.',
  },
  wealth: {
    area: 'wealth',
    label: 'Wealth',
    emoji: '🌾',
    question:
      'What belief sits under your relationship with “enough”? Where might the coarse black thread of Fear still be sewing?',
    coachingTeaser:
      'Let’s explore the Imagio Dei that shapes your relationship with abundance, and find a softer thread.',
  },
  relationships: {
    area: 'relationships',
    label: 'Relationships',
    emoji: '🤝',
    question:
      'Which relationship mirrors back to you an Image of God you still carry? What one stitch of Love could you sew into it today?',
    coachingTeaser:
      'A coach can help you see the thread between Image and relationship, and choose a new stitch with grounded care.',
  },
};

export const focusAreaOrder: FocusArea[] = [
  'happiness',
  'loved',
  'health',
  'wealth',
  'relationships',
];
