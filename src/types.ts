export type PracticeKind = 'MSG' | 'SEE';

export type FocusArea =
  | 'happiness'
  | 'loved'
  | 'health'
  | 'wealth'
  | 'relationships';

export type TrackerScores = Record<FocusArea, number>;

export type TrackerEntry = {
  scores: TrackerScores;
  focusArea?: FocusArea;
  reflection?: string;
};

export type DailyEntry = {
  date: string; // YYYY-MM-DD
  msgDone: boolean;
  msgPracticeId?: string;
  seeDone: boolean;
  seePracticeId?: string;
  beliefId?: string;
  beliefAcknowledged?: boolean;
  morningRitualDone?: boolean;
  tracker?: TrackerEntry;
};

export type Practice = {
  id: string;
  chapter: number; // 0 = Introduction, 1-9 = chapters
  kind: PracticeKind;
  title: string;
  durationMin: number;
  cue: string;
  steps: string[];
};

export type Belief = {
  id: string;
  chapter: number; // 0 = Introduction, 1-9 = chapters
  statement: string;
  embedding: string; // a somatic embedding suggestion
};

export type FocusAreaPrompt = {
  area: FocusArea;
  label: string;
  emoji: string;
  question: string;
  coachingTeaser: string;
};
