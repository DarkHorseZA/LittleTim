# LittleTim

A gentle iOS + Android app for tracking daily **soul technologies**:

- **MSG** — Meditative Somatic Gestures
- **SEE** — Somatic Experiencing Exercises

Plus a daily **belief reminder** with a somatic-embedding cue, and a 5-slider
**wellness tracker** (happiness · loved · health · wealth · relationships) that
ends by asking which area matters most today, offering a guiding question, and
a link to book a coaching session.

Think: a fasting-tracker loop, applied to inner practice.

---

## Stack

- Expo (React Native) + TypeScript — one codebase, ships to iOS and Android
- React Navigation (bottom tabs + native stack)
- AsyncStorage for local, offline-first persistence

---

## Run it

```bash
npm install
npm run ios       # iOS simulator (requires Xcode on macOS)
npm run android   # Android emulator (requires Android Studio)
npm start         # Then scan the QR code with the Expo Go app on your phone
```

First run with Expo Go on a physical device is the fastest way to try it.

---

## Configure

Before shipping, open `src/config.ts` and set:

```ts
export const COACHING_URL = 'https://your-booking-link';
```

This is the link the check-in flow opens after the user picks their focus
area and answers the guiding question.

---

## What's included

| Screen          | What it does                                                        |
| --------------- | ------------------------------------------------------------------- |
| Today           | Brand, date, streak, today's belief, MSG/SEE tiles, tracker CTA.    |
| Belief (modal)  | Fires once per day. Belief statement + somatic-embedding suggestion.|
| Practice        | MSG / SEE toggle, list of short practices with cues.                |
| PracticeDetail  | Step-by-step instructions, one-tap "mark complete".                 |
| Tracker (modal) | Five 1–10 sliders, then "which area matters most?".                 |
| FocusArea       | Guiding question, reflection textbox, coaching link CTA.            |
| History         | Per-day badges (MSG / SEE / Belief / Check-in) + avg score.         |
| Settings        | Daily belief reminder hour, coaching link.                          |

---

## Data model

All data is stored locally (AsyncStorage). One entry per day:

```ts
type DailyEntry = {
  date: string;                // YYYY-MM-DD
  msgDone: boolean;
  msgPracticeId?: string;
  seeDone: boolean;
  seePracticeId?: string;
  beliefId?: string;
  beliefAcknowledged?: boolean;
  tracker?: {
    scores: { happiness; loved; health; wealth; relationships }; // 1–10
    focusArea?: 'happiness' | 'loved' | 'health' | 'wealth' | 'relationships';
    reflection?: string;
  };
};
```

Streak = consecutive days (ending today) with MSG **or** SEE completed.

---

## Extending

- **Add a belief** — edit `src/data/beliefs.ts`.
- **Add a practice** — edit `src/data/practices.ts` (MSG or SEE array).
- **Tweak focus-area questions** — edit `src/data/focusAreas.ts`.
- **True push notifications** — wire up `expo-notifications` and schedule a
  daily local notification using `settings.reminderHour`. The current build
  uses an in-app modal triggered on first open of the day.

---

## Roadmap ideas

- Audio guidance for each practice (short voice clips).
- Optional weekly trend chart of the 5 tracker dimensions.
- iCloud / Google Drive backup.
- Coach-side companion view (simple web dashboard) for paired clients.
