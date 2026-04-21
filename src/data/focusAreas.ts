import { FocusArea, FocusAreaPrompt } from '../types';

export const focusAreas: Record<FocusArea, FocusAreaPrompt> = {
  happiness: {
    area: 'happiness',
    label: 'Happiness',
    emoji: '☀️',
    question:
      'When you picture a truly happy version of yourself, what is one small thing they do every morning?',
    coachingTeaser:
      'A coach can help you turn that morning image into a rhythm you actually live.',
  },
  loved: {
    area: 'loved',
    label: 'Feeling loved',
    emoji: '💗',
    question:
      'Where in your body do you feel loved? Who or what helps you feel it most?',
    coachingTeaser:
      'Together we can expand that felt-sense of being loved into more of your day.',
  },
  health: {
    area: 'health',
    label: 'Health',
    emoji: '🌿',
    question:
      'What is your body asking for right now that you have been too busy to hear?',
    coachingTeaser:
      'A coach can help you build gentle somatic routines that answer that ask.',
  },
  wealth: {
    area: 'wealth',
    label: 'Wealth',
    emoji: '🌾',
    question:
      'What would “enough” actually feel like in your nervous system? How would you know you were there?',
    coachingTeaser:
      'Let’s explore the beliefs that sit under your relationship with money and abundance.',
  },
  relationships: {
    area: 'relationships',
    label: 'Relationships',
    emoji: '🤝',
    question:
      'Which relationship needs a brave, loving sentence from you this week? What is the sentence?',
    coachingTeaser:
      'A coach can help you find and voice that sentence from a grounded place.',
  },
};

export const focusAreaOrder: FocusArea[] = [
  'happiness',
  'loved',
  'health',
  'wealth',
  'relationships',
];
