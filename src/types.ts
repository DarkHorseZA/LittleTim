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
  tracker?: TrackerEntry;
};

export type Practice = {
  id: string;
  kind: PracticeKind;
  title: string;
  durationMin: number;
  cue: string;
  steps: string[];
};

export type Belief = {
  id: string;
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
