# re-Genesis hardening plan

Bringing re-Genesis to the same security / speed / UX standard as Next Entry,
adapted to how re-Genesis is actually built (Expo SDK 56, **React Navigation 6**
— not Expo Router, **AsyncStorage** — not expo-sqlite, **React Context** — not
zustand, **@expo/vector-icons** — not lucide, no payments, offline-first,
**intentionally light-only**).

- **Branch:** `chore/hardening`, based on `v2` (the live 1.0.1 baseline). Ships as
  a normal store build. re-Genesis does **not** use over-the-air updates.
- **Gate before every commit:** `npm run typecheck`, `npm test`, `npm run lint`,
  and `npm run deadcode` when removing/replacing code.

## Status

Legend: ☐ todo · ◑ in progress · ☑ done · ⊘ not applicable · ⏸ deferred (see backlog)

### Foundation
- ☑ Test runner (jest-expo + @react-native/jest-preset, AsyncStorage mock),
  ESLint (eslint-config-expo flat), knip. Scripts: `test`, `lint`, `deadcode`.
- ☑ CLAUDE.md rules added ("Hardening rules (Next Entry standard)").

### Security & resilience
- ☑ Calm error screens: root `ErrorBoundary` + production-only
  `ErrorUtils.setGlobalHandler` modal (`FatalErrorHandler`), a self-contained
  `ErrorScreen` (no theme/fonts), a "send this to us" report (no user data,
  shortened stack), a hidden long-press trigger on the Settings version row.
  `NotFoundScreen` already calm. Tested: shortenStack/buildReport. (On-device:
  long-press the version row on the TestFlight build to see the screen.)
- ☑ Saves never fail silently: `store/persist.ts` — optimistic in-memory update
  first, then a background write retried (0.5s, 1s), each attempt re-reading the
  newest value via refs (an older write can't clobber a newer edit). Parks failed
  keys as "unsaved" and shows the calm `UnsavedNotice` with "Try again", also
  retried on foreground. DayContext rewritten to use it. Tested: persist retry +
  latest-value + DayContext hydrate/optimistic/ready-guard (react-test-renderer).
- ⊘ Untrusted files — no import/restore/upload exists. **See backlog.**
- ◑ User text is never code — RN `Text` is safe; no `dangerouslySetInnerHTML`; no
  CSV export today. **See backlog** for export. (Backend already parameterised.)
- ⊘ Payments trusted from store side — no payments. **See backlog.**
- ☑ No secrets in the bundle. Audited src + config + app.json: config holds only
  public URLs (the site, socials, the public journal.json), the journal fetch
  sends no auth header, and there are no API keys/tokens/passwords. The only
  secret, the Google Play service-account key, is gitignored and used only by
  `eas submit` at build time, never shipped in the app bundle.
- ☑ Privacy by default — offline, opt-in, no analytics. Already true.

### Speed & efficiency
- ☑ React Compiler enabled (`app.json` `experiments.reactCompiler: true`;
  `babel-plugin-react-compiler` was already installed, React 19 needs no runtime
  package). The healthcheck compiles 63/63 components with no incompatible
  libraries, so the Animated/ref patterns are fine. Build logs confirm "React
  Compiler enabled"; smoke-tested Today / Practice / gates / modals on web with
  zero console errors. The compiler lint is already active via react-hooks v5's
  compiler-aware rules (the `react-hooks/refs` warnings). Worth a native
  smoke-test pass on the TestFlight build before final submission.
- ☑ Ship only what's used. Icon audit: the app imports only two families,
  Ionicons (114 uses) and FontAwesome6 (6 social brand logos, incl. Threads/X
  which Ionicons lacks), both genuinely used. Converted all 26 barrel imports
  (`{ Ionicons } from '@expo/vector-icons'`) to per-family subpath imports
  (`@expo/vector-icons/Ionicons`, `/FontAwesome6`) so no other icon set can be
  pulled in. No heavy util libs (no lodash/moment/date-fns). Verified Connect
  (both families) and other screens still render every icon.
- ⊘ Batch DB writes (SQLite transactions) — AsyncStorage, not SQLite.
- ☑ Scale-test heavy compute. `buildCells` (the quilt grid builder, run on every
  quilt render) is now exported and covered by a 5,000-day test: it builds the
  full multi-year grid in ~5ms, far under the 50ms ceiling, plus a correctness
  test that entries land on the right day. Discovery just picks a few random
  items (not a scale concern).
- ☑ No polling — no `setInterval`; sync runs on foreground.
- ⏸ Web caching headers — only if web hosting moves off GitHub Pages. **See backlog.**
- ☑ Dead code — knip reports zero. Deleted 5 unused components (Card,
  QuiltPreview, ScoreSlider, SectionHeader, StreakStrip) and ~20 unused exports
  (superseded storage writers now that persist.ts owns writes; unused data/theme/
  config helpers; the unused `snapFeedback`/`achievementFeedback` feels, leaving
  the vocabulary at tap/saved/confirm). Removed the unused `expo-build-properties`
  dep, listed `react-test-renderer` as a devDep, and taught knip to ignore the two
  Expo-inferred, not-installed deps (expo-updates/expo-system-ui).

### Haptics
- ☑ `src/components/feedback.ts` owns every feel, named by moment (`tapFeedback`,
  `savedFeedback`, `confirmFeedback`, `snapFeedback`, `achievementFeedback`),
  Android `performAndroidHapticsAsync`, gated by a Settings "Haptics" toggle (on
  by default, off on web; synced via `HapticsSync`), fire-and-forget + swallow.
  `interactions.ts` `tap` now delegates here, `nav` is SILENT (navigation gets no
  haptic), and `Button` routes through it with no warning/error buzz. Tested:
  gating on/off + confirm mapping + never-throws. `confirmFeedback`/`savedFeedback`
  are wired into completion/save actions via the toasts cluster; `snapFeedback`
  stays reserved for toggle/segmented controls (consistency-pass audit).

### UI
- ☑ Confirmation toasts on every completion/save that closes a screen, in the
  re-Genesis style (light, calm): the `toast` queue now pairs a feel with every
  success message (gentle `saved` by default, warmer `confirm` for the one
  milestone — finishing the book — `none` when the press already fired a feel so
  the screen never double-buzzes). Dwell softened 4s → 2.5s. Added where a screen
  closed silently: Practice complete (returning readers), WHEN complete, Belief
  acknowledge, Focus-area reflection save. Morning ritual keeps its full-screen
  completion view (no toast — already visible). Errors/info never buzz. Tested.
- ☑ Notifications asked at an earned moment, never on launch. `NotificationsManager`
  no longer calls `ensureNotificationPermission` (it only reads status and
  schedules when already granted). A new `ReminderOptInGate` (overlay above the
  nav tree, with the same leave-Tabs auto-close as the chapter gate) offers the
  daily reminder once, only after the reader has sewn a stitch and only while the
  OS is still undetermined; "Not now" never calls the OS, so iOS's one-time ask is
  preserved for Settings. Settings gained a "Turn on daily reminder" card for the
  undetermined state (asks on tap) and keeps the "open system settings" card for
  denied. Logic is the pure, tested `shouldOfferReminder`.
- ☑ Ratings asked late via `expo-store-review` (new native module, this build).
  `ReviewManager` asks once, only when a *fresh* stitch pushes the quilt past a
  few days of use (`reachedReviewMoment`, tested) — never on launch (baseline
  captured on first ready render) and never after a failure (it only reacts to
  the quilt growing). Best-effort: unavailable/error is silent. No custom
  "please rate" prompt in front of the OS sheet.
- ⊘ "What's new" after an update — re-Genesis has no OTA updates.
- ☑ Onboarding before the account screen. First-run order is now
  Welcome → HowToUse (onboarding) → account, not the reverse. HowToUse offers
  "Skip, show me around" → the tour → then the account (afterTour). Going through
  onboarding instead → account → then the tour is offered. `firstRunRoute` (pure,
  tested) is the single source of truth for the resume cascade; the read/skip
  ordering is threaded through explicit nav params. Verified both paths on web.
- ☑ First-run tour ("Show me around"): a bounded four-stop carousel
  (`TourScreen`, Today/Practice/Journal/More) with progress dots, a Skip, and
  reduced-motion-aware fades. Restartable anytime from More → "Take the tour".
  `tourSeen` tracks it so first-run offers it once.
- ☑ Skeletons, never spinners. New `Skeleton`/`SkeletonCard` (gentle opacity
  breath, parks steady under Reduce Motion, a11y-hidden). The font-load gate now
  shows the breathing `PulsingMark` (image, no font) instead of an
  `ActivityIndicator`; the post reader (`JournalPostScreen`) sketches an article
  while the WebView loads; T’s Journal feed shows skeleton cards while fetching.
  The only remaining `ActivityIndicator` is the inline busy state inside
  `Button`, which is the right pattern there.
- ☑ Empty-state audit. Journal empties now lead with what will appear and point
  to the one action: Saved Stitches → "Your quilt starts here… sew on Today’s
  Stitches"; T’s Journal → "When Theunis shares a new reflection, it will appear
  here." The quilt already shows pale "waiting" patches with a legend, and the
  WHEN library already explains what unlocks it, so those stay.
- ◑ Pressed states — `pressScale` exists; audit coverage + disabled 40%.
- ☑ Keyboard — focused field scrolled into view. A reusable `KeyboardAvoider`
  (iOS padding, Android relies on adjustResize) now wraps every input screen's
  scroll (Account, Tracker, Focus area, Journal; EmailSignup already had it), so
  a field near the bottom is never covered. No "Done" bar needed: the app has no
  number pads (only email/text keyboards, which keep their return key, and the
  name→email chain already uses returnKeyType + onSubmitEditing). Verified the
  Journal input layout is unchanged.
- ☑ Destructive confirm in-UI (not a system alert) + Undo where cheap. New
  reusable `ConfirmSheet` (BottomSheet-based, with a `danger` Button variant)
  replaces the two destructive system Alerts on Account: sign-out (reversible,
  so the toast offers "Undo" to restore the profile) and delete-everything
  (irreversible, so a firm red confirm, no Undo). Toasts gained an optional
  action (6s dwell when present). The "Coming soon" informational alerts stay as
  system dialogs. Verified both sheets + Undo on web.
- ☐ Accessibility audit — 44×44 targets, roles/labels/state, 4.5:1 contrast,
  Dynamic Type without clipping.
- ◑ Motion — `useReducedMotion` exists; keep 150–250ms, honour Reduce Motion.
- ⊘ Light + dark theme — re-Genesis is **intentionally light-only**. Add
  tabular-nums where columns align.
- ◑ Consistency pass — spacing / radii / buttons / one primary action per screen.

## Deferred security backlog
These don't apply to re-Genesis today. **If the matching feature is ever added,
its security patch is required at the same time** — do not ship the feature
without it.

- **Backup / restore / import / file upload → untrusted-file handling.** Check
  size before reading (refuse oversize). Parse JSON in try/catch and validate
  structure (required fields, string ids, arrays are arrays) before replacing.
  Images: whitelist plain filenames `^[\w.-]+\.(jpe?g|png)$` (blocks `../`) and
  verify magic bytes (`/9j/` JPEG, `iVBORw0KGgo` PNG); drop the rest. Restore
  replaces data inside a single transaction so a failure changes nothing. If the
  server ever accepts files: same checks server-side + content-type + size limit
  + re-encode images + store outside any public path.
- **CSV / spreadsheet export → formula injection.** A string cell starting with
  `= + - @`, tab or CR gets a leading `'` so Sheets/Excel don't execute it
  (strings only, never numbers).
- **Payments / subscriptions → trust only the store side.** Entitlements from
  RevenueCat / store server APIs, never the app's word. Verify every webhook
  (RevenueCat auth header, Stripe signature) before it changes anything.
- **Any new on-device secret → store only a hash.** API keys live server-side;
  the app calls the server. Codes/passwords checked on device are hashed.
- **Web hosting moves off GitHub Pages (e.g. to Cloudflare) → caching headers.**
  A `_headers` file: hashed build files (`/_expo/static/*`, hashed assets) get
  `Cache-Control: public, max-age=31536000, immutable`; HTML revalidates. Confirm
  `content-encoding: br`/`gzip`.
