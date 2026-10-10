# re-Genesis 1.0.2 — release notes

A quiet, steadying release. Nothing changes what re-Genesis asks of you; it just
makes every part of it calmer, faster, and more trustworthy. This is the same
hardening standard as the Next Entry app, adapted to how re-Genesis is built
(offline, light-only, no accounts required).

---

## App Store / Play Store “What’s new” (paste this)

A gentler, steadier re-Genesis.

• A warmer first run: see what the app offers before any sign-up, and take a
  short “show me around” tour whenever you like.
• Calm confirmations and soft, optional haptics as you sew each stitch, with a
  new Haptics toggle in Settings.
• Reminders and the occasional rating now only ask at a moment you’ve earned,
  never on opening, never after a stumble.
• Loading feels calm, not frozen, and your stitches are never lost, even if a
  save hiccups.
• Clearer, gentler confirmations before anything is cleared, with Undo where it’s
  safe.

Thank you for sewing with us. — Theunis

---

## Fuller changelog (for your records)

**Calmer, more trustworthy**
- Calm error screens instead of a crash, with an optional “send this to us”
  report that never includes your personal writing.
- Saves never fail silently: an optimistic update first, then a quiet retry, with
  a gentle notice (and a retry) if the device ever refuses.
- Every completion that closes a screen now gives a short, warm confirmation and
  the matching feel; errors never buzz.

**Onboarding & guidance**
- Onboarding now comes before the email ask, so the value is shown first.
- A new “Skip, show me around” path and a restartable first-run tour (More →
  “Take the tour”).

**Gentle by default**
- One haptics vocabulary, named by moment, with a Settings toggle (on by default,
  off on web).
- Notifications and ratings ask only at an earned moment.
- Skeletons with a soft shimmer while things load, never spinners; warmer empty
  states that say what will appear.
- In-app confirmations (not system alerts) for destructive actions, with Undo on
  sign-out.
- Inputs stay above the keyboard on every form.

**Faster & leaner**
- React Compiler enabled for fewer needless re-renders.
- Dead code removed, icon imports trimmed to only the sets actually used, and the
  quilt’s heavy compute scale-tested (a 5,000-day grid builds in ~5ms).

**Under the hood**
- Test runner, linter, and dead-code tooling added; typecheck, tests, lint, and
  knip all green.
- No secrets in the app bundle (audited).

---

## Build & submit (version 1.0.2)

`appVersionSource` is **remote** with `autoIncrement`, so EAS bumps the iOS
build number and Android versionCode automatically; only the marketing version
(1.0.2, set in `app.json`) is manual.

```bash
# iOS: build on EAS, then submit to App Store Connect (app 6785836227)
eas build --platform ios --profile production
eas submit --platform ios --profile production --latest

# Android: build the AAB (download the artifact, or submit to the alpha track)
eas build --platform android --profile production
eas submit --platform android --profile production --latest
```

Notes:
- The Android submit uses `./google-play-service-account.json` (gitignored). If
  that key isn’t set up, download the `.aab` from the EAS build page and upload
  it to the Play Console manually.
- React Compiler was smoke-tested on web; do a quick pass on the TestFlight build
  before promoting it to App Store review.
