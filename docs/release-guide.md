# re-Genesis — release guide

A simple, repeatable checklist for shipping an update to the App Store and Google
Play. Works for every future version. Nothing here is one-off.

---

## Where 1.0.2 is right now (Oct 2026)

- **iOS 1.0.2 (build 20):** ✅ built **and** uploaded to App Store Connect.
  Finish it with the **iOS steps 4–6** below (test in TestFlight, then submit for
  review).
- **Android 1.0.2 (versionCode 29):** ✅ AAB built, ⏳ **not uploaded yet**.
  Finish it with the **Android steps 4–6** below.
  AAB download: https://expo.dev/artifacts/eas/Pw_9n7hFvVXS03pCDxS1YZV0O_uptTVqRX7o7POc7xk.aab
- "What's new" copy + changelog: `docs/release-notes-1.0.2.md`.

If you're just finishing 1.0.2, skip to **iOS step 4** and **Android step 4** —
the build is already done.

---

## Before any release (once)

- Be signed in to EAS: run `eas whoami` (should print `tjpienaar`). If not,
  `eas login`.
- Work from the project folder: `/Users/theuns/Desktop/re-Genesis`.
- Build numbers are automatic. EAS uses `appVersionSource: remote` with
  `autoIncrement`, so it bumps the iOS build number and Android versionCode for
  you. **You only ever set the marketing version** (e.g. 1.0.2 → 1.0.3) in
  `app.json`.

---

## iOS — step by step

1. **Set the version.** In `app.json`, change `"version"` to the new number
   (e.g. `"1.0.3"`). Skip for a build you've already made.
2. **Commit it.** `git add app.json && git commit -m "chore(release): bump to 1.0.3"`.
3. **Build + upload.** Run:
   ```bash
   eas build --platform ios --profile production --auto-submit
   ```
   This builds on EAS (~20–40 min) and uploads straight to App Store Connect.
   The iOS submit credentials live on EAS, so it just works.
4. **Wait for Apple to process** (~5–10 min after upload), then open
   [App Store Connect → TestFlight](https://appstoreconnect.apple.com/apps/6785836227/testflight/ios)
   and install the new build on your phone. Give it a quick run-through.
5. **Create the version for review.** In App Store Connect → the app →
   **+ Version or Platform** (or the existing prepared version) → set the new
   version number → under **Build**, pick the build you just uploaded →
   paste the **"What's new"** text (from `release-notes-*.md`) →
   update screenshots only if the look changed (usually not).
6. **Submit for review.** Click **Add for Review → Submit**. Choose automatic or
   manual release after approval. Done.

---

## Android — step by step

1. **Set the version.** Same `"version"` in `app.json` as iOS. Skip if already built.
2. **Commit it.** (Same commit as iOS is fine.)
3. **Build the AAB.** Run:
   ```bash
   eas build --platform android --profile production
   ```
   (~20–40 min.) When it finishes, copy the **Application Archive URL** (the
   `.aab` link) it prints, or grab it from the build page on expo.dev.
4. **Get the AAB.** Download the `.aab` from that link.
5. **Upload to Play.** Open [Play Console](https://play.google.com/console) →
   **re-Genesis** → **Testing → Closed testing (alpha)** (or Production when
   ready) → **Create new release** → upload the `.aab` → paste the **release
   notes** → Save.
6. **Review & roll out.** **Review release → Start rollout**. Done.

### Optional: let EAS submit Android for you
If the Google Play service-account key is in the project root as
`google-play-service-account.json` (it's gitignored, never committed), you can
skip steps 4–5 and submit automatically:
```bash
eas build --platform android --profile production --auto-submit
# or, for a build that already finished:
eas submit --platform android --profile production --latest
```
Without that key file present, the auto-submit is skipped and you upload the AAB
manually (steps 4–5). That's the normal path for now.

---

## Quick reference

| Thing | Where |
|---|---|
| Apple App ID | 6785836227 |
| Apple Team | W4454A896N |
| iOS TestFlight | appstoreconnect.apple.com/apps/6785836227/testflight/ios |
| Android package | com.theunispienaar.regenesis |
| Play track | alpha (closed testing) |
| EAS builds dashboard | expo.dev/accounts/tjpienaar/projects/re-genesis/builds |
| Marketing version | `app.json` → `expo.version` |
| Build numbers | automatic (EAS remote + autoIncrement) |

**Golden rule:** bump `version` in `app.json`, commit, `eas build … --profile
production`, then finish in the store console. The build numbers take care of
themselves.
