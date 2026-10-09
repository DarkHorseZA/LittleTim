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
- ☐ Test runner (jest-expo), ESLint (eslint-config-expo), knip
- ☐ CLAUDE.md rules added

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
- ☐ No secrets in the bundle — audit (the one shipped key is a documented gate,
  not a secret).
- ☑ Privacy by default — offline, opt-in, no analytics. Already true.

### Speed & efficiency
- ☐ React Compiler (app.json `experiments.reactCompiler`) + react-compiler lint,
  smoke-tested per screen.
- ☐ Ship only what's used — audit the web bundle / icon imports.
- ⊘ Batch DB writes (SQLite transactions) — AsyncStorage, not SQLite.
- ☐ Scale-test heavy compute (quilt / discovery) with a 5k-record test, 50ms ceiling.
- ☑ No polling — no `setInterval`; sync runs on foreground.
- ⏸ Web caching headers — only if web hosting moves off GitHub Pages. **See backlog.**
- ☐ Dead code — knip to zero.

### Haptics
- ☐ `src/components/feedback.ts` owns every feel, named by moment
  (`tapFeedback` / `confirmFeedback` / `savedFeedback` / snap / achievement),
  Android `performAndroidHapticsAsync`, a Settings "Haptics" toggle (on by
  default, off on web), fire-and-forget. Remove haptics baked into generic
  components. (expo-haptics already installed — no new native module.)

### UI
- ☐ Confirmation toasts on every completion/save that closes a screen, in the
  re-Genesis style (light, calm), paired with the matching haptic.
- ☐ Notifications asked at an earned moment (not on launch); "Not now" preserves
  the one-time iOS ask; lives in Settings afterward.
- ☐ Ratings asked late (`expo-store-review` — **new native module, this build**),
  only after a good moment, never after a failure.
- ⊘ "What's new" after an update — re-Genesis has no OTA updates.
- ☐ Onboarding before the account screen: swap the order so the value is shown
  before the email ask. Onboarding offers "skip & take the tour"; after either
  the onboarding **or** the tour, prompt for the account; then offer the tour if
  not yet taken.
- ☐ First-run tour ("Show me around"), restartable from Settings.
- ☐ Skeletons (soft shimmer, respects Reduce Motion), never spinners.
- ☐ Empty-state audit — say what will appear + the one action to add the first item.
- ◑ Pressed states — `pressScale` exists; audit coverage + disabled 40%.
- ☐ Keyboard — "Done" bar on number pads; scroll focused field into view.
- ☐ Destructive confirm in-UI (not a system alert) + Undo where cheap.
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
