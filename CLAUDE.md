# CLAUDE.md

Guidance for Claude Code (and any contributor) working in this repository.

## What this is

re-Genesis is an offline-first Expo (React Native) + TypeScript app, the daily
companion to the re-Genesis book by Theunis Pienaar. It ships to iOS, Android,
and web from one codebase. There is no backend: all state lives on-device in
AsyncStorage.

Read `README.md` for the feature overview and `PROJECT_BRIEF.md` for the product
intent before making product decisions.

## Commands

```bash
npm install          # install deps
npm start            # Expo dev server (scan QR with Expo Go)
npm run ios          # iOS simulator
npm run android      # Android emulator
npm run web          # browser (GitHub Pages target)
npm run typecheck    # tsc --noEmit — RUN THIS BEFORE EVERY COMMIT
```

There is no test suite and no linter script. `npm run typecheck` is the gate.
Keep it at zero errors.

## Architecture

```
App.tsx                       # font loading, providers (SafeArea, Day, Toast)
index.ts                      # root registration + web scrollbar-hiding CSS
src/
  navigation/
    RootNavigator.tsx         # native stack + bottom tabs, deep-link config,
                              #   web phone-frame wrapper, ChapterCheckInGate
    types.ts                  # RootStackParamList, TabsParamList
  screens/                    # one file per screen (incl. JournalPostScreen,
                              #   the in-app WebView reader for T's posts)
  components/                 # reusable UI (Button, BackButton, PatchworkQuilt,
                              #   ChapterCheckInGate, Toast, ChapterPicker, etc.)
  store/
    DayContext.tsx            # the single source of app state (React context)
    storage.ts               # AsyncStorage read/write + Settings type
  data/                       # all content: beliefs, practices, triggers,
                              #   chapters, focusAreas, glossary, journalFeed
                              #   (fetch + cache of T's posts from the site)
  theme/
    colors.ts                 # colors, radius, shadows, gradients, layout tokens
    type.ts                   # fonts + text styles
    interactions.ts           # haptics (nav/tap), press scale, web focus ring
  types.ts                    # shared domain types
  config.ts                   # external URLs + app/author strings
```

### State: DayContext

`src/store/DayContext.tsx` is the heart. It loads everything once on mount,
exposes `today`, `entries`, `quiltEntries`, `settings`, and mutators
(`updateToday`, `updateSettings`, `addQuiltEntry`, `refresh`).

Critical invariant: **the `ready` hydration guard.** `updateToday` and
`updateSettings` early-return when `!ready`. This prevents a cold-start
mount-time write (e.g. a deep link straight into a screen) from clobbering
stored values with defaults. Never remove this guard. Never write settings from
a component's mount effect without checking `ready`.

### Persistence

AsyncStorage keys are namespaced and versioned: `littletim:*:v1`
(`entries`, `settings`, `quilt`, `reflection`, `stitches`). The brand changed
from "LittleTim" to "re-Genesis" but the storage keys stayed for back-compat —
do not rename them or you orphan existing users' data.

### Navigation

Native stack at the root, bottom tabs (`Today`, `Practice`, `Journal`, `More`)
nested under the `Tabs` route. Modals (`Belief`, `PracticeDetail`,
`TriggerDetail`, `FocusArea`, `Connect`, `Settings`, `Account`, `JournalPost`)
use `presentation: 'modal'`. Deep links are mapped in `linking` in
`RootNavigator.tsx`.

`ChapterCheckInGate` is an overlay rendered above the whole nav tree. It only
shows for returning readers once per launch. It auto-closes when the user
leaves the Tabs area (a backdrop left open would swallow touches on the next
screen — this was a real bug, keep the auto-close effect).

### Chapter gating

`isChapterUnlocked(chapter, currentChapter, bookCompleted)` in
`src/data/chapters.ts` is the single source of truth. The Intro (chapter 0) is
always unlocked. `bookCompleted` unlocks everything. WHEN gestures open only at
Chapter 9 or `bookCompleted`. Today and Practice both read this — keep them
consistent.

## Conventions

### Voice (content and UI copy)

- Warm, gentle, never clinical. It is an invitation, not an interruption.
- **Smart curly quotes** `‘ ’ “ ”`, never straight quotes in user-facing copy.
- **No em-dashes.** Use commas.
- Capital **Love** and **Fear** where they carry the book's meaning.
- "Beautifully sewn" not "Well done". "stitch", "thread", "quilt", "sew" are the
  governing metaphor.

### Code

- Reuse theme tokens (`colors`, `radius`, `shadows`, `gradients`, `layout`,
  `fonts`, `text`). Don't hardcode hex values or magic spacing.
- **Responsive via width, not platform.** Wide-screen layout uses
  `layout.contentMaxWidth` (640) with `alignSelf: 'center'` on the scroll
  container, so big tablets and phones are both handled. Avoid
  `Platform.OS === 'ios'/'android'` for layout; reserve platform checks for
  genuinely platform-specific APIs (e.g. web-only CSS in `index.ts`).
- All scrollables hide their indicators (`showsVerticalScrollIndicator={false}`).
  Web scrollbars are hidden globally via injected CSS in `index.ts`.
- New screens: copy the `SafeAreaView` + `ScrollView` + `styles.container`
  pattern (with the `width/maxWidth/alignSelf` trio) from an existing screen.

### Git

- Branch is `v2`, remote is `github.com/DarkHorseZA/LittleTim`.
- Run `npm run typecheck` before committing. Keep it green.
- Commit messages are descriptive and grouped by intent.

## Common tasks

- **Edit content** (words only): the relevant file in `src/data/`. No code change.
- **Add a chapter's practice:** add to `msgPractices`/`seePractices` in
  `practices.ts` with the right `chapter` number; gating is automatic.
- **Add an external link:** set it in `config.ts`; the UI reveals the relevant
  card automatically when the URL is non-empty.
- **Change first-run flow:** `Welcome` -> `EmailSignup` -> `HowToUse`, then into
  `Tabs`. Onboarding flags live in `Settings`.
- **Update T's Journal feed URL:** set `JOURNAL_FEED_URL` in `config.ts`. Blank
  hides the tab.

## Gotchas

- Don't remove the `ready` guard in DayContext.
- Don't rename `littletim:*:v1` storage keys.
- Don't add a second open path to `ChapterCheckInGate` without the leave-Tabs
  auto-close, or you reintroduce the touch-swallowing bug.
- The web build centres a phone-width frame (`layout.maxWidth` = 520) in
  `RootNavigator`; the per-screen `layout.contentMaxWidth` (640) governs native
  tablet width. They are different tokens on purpose.
- T's Journal is read-only and offline-tolerant: it falls back to cached posts
  on fetch failure. Posts open in an in-app WebView; on web this is an iframe
  with a `window.open` fallback. Don't try to write posts from the app; the
  site owns the journal.

## Hardening rules (Next Entry standard)

See `docs/hardening-plan.md` for the full plan and the deferred security backlog.

- **Replace, don't layer.** Change things in place and delete the old code. No V2
  beside V1, no fallbacks to old paths. The only compatibility code allowed is for
  data already on users' phones (migrations, settings readers).
- **Push, don't poll.** Nothing asks a server on a timer. Clocks tick only on the
  screen in view (pause when hidden); never read the clock during render.
- **Untrusted input.** Files from outside are untrusted (size check, validate
  structure, image filename + magic-byte checks, transactional restore). User
  text is never code (no `dangerouslySetInnerHTML`; CSV cells starting with
  `= + - @`/tab/CR get a leading `'`). Verify every webhook before it changes
  anything. No secrets in the bundle (server-side keys; hashes on device).
- **Never require an account to use the app.** Onboarding always comes before the
  account screen; onboarding answers carry over into the account.
- **Loading is a skeleton** with a gentle shimmer (respect Reduce Motion), never a
  spinner or a frozen screen. Empty states say what will appear + the one action.
- **Haptics come only from `src/components/feedback.ts`,** named by moment: light
  for choosing, firmer only for what matters, silent navigation, never an error
  buzz. Read the Settings toggle at call time; off on web; fire-and-forget.
- **Ask for notifications and ratings at a moment that earned it,** never on
  launch, never after something went wrong.
- **Every completion or save that closes the screen** gets a short, calm
  confirmation toast and the matching haptic (never a toast for what's on screen).
- **Light-only. No dark mode. No OTA updates** (ships as normal store builds).
- **Gate before every commit:** `npm run typecheck`, `npm test`, `npm run lint`
  (0 errors), and `npm run deadcode` when removing or replacing code. Add tests
  for anything with logic (validation, maths, retries).
