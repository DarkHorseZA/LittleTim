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
  completedAt?: string; // ISO timestamp, set when the day's check-in is saved
};

export type BaselineRecord = {
  scores: TrackerScores;
  capturedOn: string; // YYYY-MM-DD of first measurement
};

export type JournalEntry = {
  sewedWith?: string; // "Today I sewed with love when I..."
  threadPulled?: string; // "Today, when the old thread pulled, I..."
  updatedAt?: string; // ISO timestamp
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
  journal?: JournalEntry;
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

export type QuiltEntryType = 'ritual' | 'msg' | 'see' | 'journal' | 'belief';

export type JournalStitch = {
  id: string;               // timestamp string used as unique key
  date: string;             // YYYY-MM-DD
  sewedWithLove?: string;   // prompt 1 response
  oldThreadPulled?: string; // prompt 2 response
  savedAt: string;          // ISO timestamp
};

export type BodyZone = 'mind' | 'heart' | 'belly' | 'whole';

export type ReflectionEntry = {
  date: string;                  // YYYY-MM-DD
  word?: string;                 // Step 1 — one word
  aliveness?: BodyZone;          // Step 2 — where they feel most alive
  tension?: BodyZone[];          // Step 2 — where tension sits (multi)
  warmth?: number;               // Step 3 — 0-100
  reflection?: string;           // Step 4 — freeform sentence
  reflectionPrompt?: string;     // which prompt they chose
  sharedWithAuthor?: boolean;    // opt-in anonymous sharing
};

export type QuiltEntry = {
  date: string;           // YYYY-MM-DD
  type: QuiltEntryType;
  focusArea?: FocusArea;
};

export type TriggerGesture = {
  id: string;
  chapter: number; // 0 = Introduction (always unlocked), 1-9 = chapters (unlocked when settings.currentChapter >= this value)
  theme: string; // e.g. "Self-Acceptance"
  title: string; // T's name for the gesture, e.g. "Golden Seamstress"
  trigger: string; // the "when" phrase, e.g. "When I feel unworthy"
  durationMin: number;
  framing: string; // 2-3 lines in T's voice, setting the context
  steps: string[]; // 3-5 body-led steps, feel / whisper / touch / breathe / bless pattern
};
