# Handover: re-Genesis

Everything a new owner or developer needs to take this project forward.

## 1. Where everything lives

| Thing | Location |
| --- | --- |
| Source code | `github.com/DarkHorseZA/LittleTim`, branch `v2` |
| Live web preview | `https://darkhorseza.github.io/LittleTim/` (see `APP_URL` in `src/config.ts`) |
| Build config | `eas.json` (EAS Build profiles) |
| App identity | `app.json` (name, slug, bundle IDs, version, EAS projectId) |
| Content | `src/data/*.ts` |
| External links | `src/config.ts` |
| T's journal feed | `https://theunispienaar.com/journal.json` (served by the site repo) |

There is no backend, no database, no server, no API keys, no `.env` file.
The app is entirely self-contained and offline-first.

## 2. Accounts you will need to control

To ship and maintain this app, take ownership of:

1. **GitHub** — the `DarkHorseZA/LittleTim` repository (and the GitHub Pages
   setting that serves the web build).
2. **Expo / EAS** — the account that owns the `projectId` in `app.json`
   (`extra.eas.projectId`). Needed for `eas build` and `eas submit`.
3. **Apple Developer Program** ($99/year) — required to build and ship the iOS
   app to TestFlight or the App Store. The bundle ID is
   `com.theunispienaar.regenesis`.
4. **Google Play Console** ($25 once) — required to ship the Android app. The
   package is `com.theunispienaar.regenesis`.

> If you are the new owner and these accounts are held by someone else, get them
> transferred or recreate them and update `app.json` accordingly.

## 3. Get it running locally

Prerequisites: Node 18+ (developed on Node 26), the Expo Go app on a phone, and
for simulators: Xcode (macOS, iOS) and/or Android Studio (Android).

```bash
git clone https://github.com/DarkHorseZA/LittleTim.git
cd LittleTim
git checkout v2
npm install
npm start          # scan the QR with Expo Go — fastest path
# or: npm run ios / npm run android / npm run web
```

Before committing any change:

```bash
npm run typecheck  # must be zero errors
```

## 4. Before public launch — checklist

- [ ] Fill in external URLs in `src/config.ts` (coaching, talks, community, book
      formats, newsletter). Blank ones show a "coming soon" state, so this is
      safe to do incrementally.
- [ ] Confirm app icons and splash in `assets/brand/` are final.
- [ ] Bump `version` in `app.json` if needed (currently `1.0.0`).
- [ ] Take ownership of the four accounts above.
- [ ] Produce native builds (next section) and test on real devices.
- [ ] Decide on real push notifications (optional, see section 7).

## 5. Building and shipping

### Web (GitHub Pages)

```bash
npx expo export --platform web    # outputs to dist/
```

Publish the contents of `dist/` to whatever branch/folder GitHub Pages serves.
The `experiments.baseUrl` in `app.json` is set to `/LittleTim` to match the
Pages path — update it if you move to a different path or a custom domain.

### Android (.apk for direct install, or Play Store)

```bash
eas build --platform android --profile preview      # installable .apk
eas build --platform android --profile production    # Play Store .aab
eas submit --platform android --profile production   # upload to Play Console
```

The `preview` profile produces an APK you can send to anyone to sideload —
ideal for testing without the Play Store.

**Automated submit to the Closed testing track.** `eas.json` is configured to
push production builds to the `alpha` (Closed testing) track via a Google Play
service account. One-time setup:

1. Play Console -> Setup -> API access -> link a Google Cloud project, then
   create a service account and grant it access (Release manager role is
   enough to upload to a testing track).
2. In Google Cloud Console, create a JSON key for that service account and
   download it.
3. Save it in the repo root as `google-play-service-account.json`. It is
   git-ignored, so it never gets committed. Keep a backup somewhere safe.

After that, every release is just two commands:

```bash
eas build --platform android --profile production    # builds the .aab
eas submit --platform android --profile production   # uploads to Closed testing
```

`appVersionSource: "remote"` + `autoIncrement` means EAS bumps the Android
`versionCode` automatically, so you never hand-edit a version number. To target
a different track, change `submit.production.android.track` in `eas.json`
(`internal`, `alpha`, `beta`, `production`, or a custom track name).

### iOS (TestFlight / App Store)

```bash
eas build --platform ios --profile preview           # TestFlight build
eas build --platform ios --profile production         # App Store build
eas submit --platform ios                            # upload to App Store Connect
```

Requires the Apple Developer account and signing credentials (EAS will guide you
through credential setup the first time).

## 6. Editing content (no code skills needed)

All the words live in `src/data/`. Edit the text in these files, keep the
structure, run `npm run typecheck`, commit:

- `beliefs.ts` — the daily belief statements (one per chapter)
- `practices.ts` — MSG and SEE step-by-step instructions
- `triggers.ts` — the WHEN gestures
- `chapters.ts` — chapter titles and unlock order
- `focusAreas.ts` — the reflection guiding questions
- `glossary.ts` — term definitions

Keep the **voice**: curly quotes `‘ ’ “ ”`, no em-dashes (use commas), capital
Love and Fear where they carry meaning.

## 7. Known optional work (not blocking)

- **Real push notifications.** Today's belief currently surfaces via an in-app
  prompt on the first open of the day. To send true scheduled notifications,
  wire up `expo-notifications` and schedule a daily local notification from
  `settings.reminderHour`.
- **Cloud backup / sync.** Data is on-device only. iCloud/Drive backup or an
  account system would be a significant addition.
- **Analytics.** None is installed by design. Add if you need usage insight.

## 8. Maintenance notes / gotchas

- **Storage keys are `littletim:*:v1`.** The brand renamed from "LittleTim" to
  "re-Genesis" but the keys stayed for back-compat. Do not rename them or you
  orphan existing users' saved data.
- **Don't remove the `ready` hydration guard** in `src/store/DayContext.tsx`. It
  prevents cold-start writes from wiping stored data.
- **Git author identity.** Commits currently show
  `Theuns <theuns@MacBook-Pro.local>` (a default local identity). Set a real one:
  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "you@example.com"
  ```
- Run `npm run typecheck` before every commit. The project is kept at zero
  TypeScript errors.
- **T's Journal feed.** The app reads T's journal from the site's
  `/journal.json` endpoint and opens posts in an in-app WebView pointing at
  `post.php`. If the site moves domains, update `JOURNAL_FEED_URL` in
  `src/config.ts`. The site's coming-soon gate must allowlist `/journal.json`
  and `/post.php` for the app to work while the site is gated.

## 9. Further reading

- `README.md` — features, stack, run instructions, data model
- `PROJECT_BRIEF.md` — product intent and design principles
- `CLAUDE.md` — architecture deep-dive and contributor conventions
- `docs/AUTHOR_WEBSITE.md` — existing author-site notes
