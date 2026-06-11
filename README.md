# re-Genesis

A gentle, offline-first iOS, Android, and web app. The daily companion to the
**re-Genesis** book by Theunis Pienaar. It carries the book's daily rhythm: a
morning ritual, a belief reminder, somatic practices tied to where you are in
the book, an evening journal, and a patchwork quilt that fills in one patch per
day.

> "The book is the thread. This app is the needle you pick up each day."

---

## The three soul technologies

| Code | Name | What it is |
| --- | --- | --- |
| **MSG** | Meditative Somatic Gesture | Gentle, repeatable gestures the body remembers. |
| **SEE** | Somatic Experiencing Exercise | Sensual exercises that surface hidden belief and let it shift. |
| **WHEN** | Gesture Library | Trigger-specific gestures for a moment of ache. Opens at Chapter 9 or once the book is marked complete. |

Practices unlock chapter by chapter. The reader tells the app which chapter
they are reading (Settings, or the check-in prompt on open), and Today plus the
Practice tab follow that chapter.

---

## Stack

- **Expo (React Native) + TypeScript** — one codebase, ships to iOS, Android, and web
- **React Navigation** — bottom tabs + native stack
- **AsyncStorage** — local, offline-first persistence (no backend, no accounts)
- **Fraunces** (serif) + **Inter** (sans) via `@expo-google-fonts`
- **EAS Build** — native binaries; web deploys to GitHub Pages

---

## Run it

```bash
npm install
npm start          # then scan the QR code with Expo Go on your phone
npm run ios        # iOS simulator (requires Xcode on macOS)
npm run android    # Android emulator (requires Android Studio)
npm run web        # browser (the GitHub Pages target)
npm run typecheck  # tsc --noEmit, run before every commit
```

First run with **Expo Go** on a physical device is the fastest way to try it.

---

## Configure

External links live in `src/config.ts`. Every URL is optional — any blank one
renders a friendly "coming soon" state in the UI. Fill them in as they become
available:

```ts
export const COACHING_URL = '';        // book a coaching session
export const TALK_BOOKING_URL = '';    // book T for a talk / event
export const READER_COMMUNITY_URL = '';// reader circle / private group
export const BOOK_EBOOK_URL = '';      // Kindle / Apple Books / Google Play
export const BOOK_AUDIOBOOK_URL = '';  // Audible / Spotify / Libro.fm
export const BOOK_PAPERBACK_URL = '';  // Amazon / Takealot / author store
export const NEWSLETTER_URL = '';      // opt-in for "new book" announcements
export const JOURNAL_FEED_URL = '...';  // T's posts from theunispienaar.com (read-only)
```

App name, tagline, author attribution, and the public web URL also live here.

---

## Screens

| Screen | What it does |
| --- | --- |
| **Today** (Home) | Greeting, date, morning ritual hero, compact quilt, today's belief, MSG/SEE tiles (WHEN when unlocked), reflection CTA, Connect card. |
| **Morning Ritual** | The Five Gestures: feel, whisper, touch, breathe, bless. |
| **Belief** (modal) | Fires once per day. Belief statement + somatic-embedding cue. |
| **Practice** | MSG / SEE / WHEN segmented list, filtered to unlocked chapters. |
| **Practice Detail** (modal) | Step-by-step instructions, one-tap "mark complete". |
| **Trigger Detail** (modal) | A single WHEN gesture in T's voice. |
| **Journal** | Tabs: Today's Stitches, Saved Stitches, Your Quilt (patchwork grid), T's Journal. |
| **Journal Post** (modal) | In-app WebView reader for a single post from theunispienaar.com. |
| **Tracker** | Somatic reflection: a word, body zones, a warmth dial, a sentence. |
| **Focus Area** (modal) | Guiding question + coaching link for a chosen life area. |
| **Settings** | Chapter picker, belief reminder hour, practice reminders toggle, account, connect. |
| **More** | Menu: How to use, Glossary, Settings, Connect. |
| **Connect** | Sessions, talks, reader circle, the book in every format. |
| **Glossary** | Plain-language definitions of the book's terms. |
| **Welcome / Email Signup / How to Use** | First-run onboarding flow. |

---

## Data model

Everything is stored locally via AsyncStorage. Keys are namespaced
`littletim:*:v1`. Core shapes (see `src/types.ts` and `src/store/storage.ts`):

```ts
type DailyEntry = {
  date: string;              // YYYY-MM-DD
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

type Settings = {
  reminderHour: number;          // 0-23, when the daily belief surfaces
  currentChapter?: number;       // 0 = Intro, 1-9 = chapters, undefined = rotate
  bookCompleted?: boolean;       // unlocks everything, hides the launch check-in
  practiceHintDisabled?: boolean;// permanent opt-out of the Today completion hint
  practiceHintSeen?: boolean;    // show-once tracking for that hint
  // ...onboarding flags, profile, baseline, etc.
};
```

The **quilt** is a separate list of `QuiltEntry` records, one per completed
action per day (ritual, msg, see, journal, belief). A day's patch darkens with
the number of stitches.

T's journal posts are cached in `littletim:journalFeed:v1`. They are read-only,
sourced from theunispienaar.com, never written by the app.

---

## Content lives in data files

No code change needed to edit the words:

- **Beliefs** — `src/data/beliefs.ts` (one per chapter)
- **Practices** — `src/data/practices.ts` (MSG and SEE arrays, one each per chapter)
- **WHEN gestures** — `src/data/triggers.ts`
- **Chapters** — `src/data/chapters.ts` (titles, unlock logic)
- **Focus-area questions** — `src/data/focusAreas.ts`
- **Glossary** — `src/data/glossary.ts`

---

## Build & deploy

```bash
# Native (requires an Expo account; iOS needs an Apple Developer account)
eas build --platform android --profile preview     # installable .apk
eas build --platform ios --profile preview         # TestFlight build
eas build --platform all --profile production       # store builds

# Web (GitHub Pages)
npx expo export --platform web                      # builds to dist/
# then publish dist/ to the gh-pages branch / Pages target
```

Build profiles are in `eas.json`. The web deploy lives at the `APP_URL` in
`src/config.ts`.

---

## Conventions

- **Voice:** warm and gentle. Smart curly quotes, no em-dashes (use commas),
  capital **Love** and **Fear** where they carry the book's meaning.
- **Run `npm run typecheck` before every commit.** The project keeps zero
  TypeScript errors.
- **Responsive, not platform-gated:** layouts use width breakpoints
  (`layout.contentMaxWidth`) so large tablets and phones are both handled.

See `CLAUDE.md` for the full architecture and contributor guide, and
`HANDOVER.md` for the operational handover checklist.
