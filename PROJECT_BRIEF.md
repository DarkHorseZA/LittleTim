# Project Brief: re-Genesis

## In one line

A gentle, offline-first daily-practice app that carries the rhythm of the
re-Genesis book, so a reader keeps practicing between covers.

## The book and the app

re-Genesis is a book by Theunis Pienaar about unravelling an inherited thread of
Fear and resewing with Love, one small stitch at a time. The book holds the
teaching. The app holds the daily practice.

> "The book is the thread. This app is the needle you pick up each day."

The app does not retell the book. It gives the reader a small daily loop: a
morning ritual, today's belief, a somatic practice tied to where they are in the
book, an evening journal stitch, and a patchwork quilt that records the days.

The app also surfaces T's journal posts from theunispienaar.com so readers can
hear from him between book chapters.

## Who it is for

Readers of re-Genesis. People doing slow, inner work who want a kind, quiet
daily anchor rather than a productivity tracker. The tone is an invitation, not
a streak you can fail.

## Core experience

1. **Morning ritual** — the Five Gestures (feel, whisper, touch, breathe,
   bless). Under five minutes. The anchor of the day.
2. **Today's belief** — one statement plus a somatic embedding, tied to the
   reader's current chapter. Surfaces once a day.
3. **Practice** — MSG and SEE for the current chapter, with the WHEN library
   opening at Chapter 9 or on book completion.
4. **Evening journal** — two short sentences: one stitch you sewed, one moment
   the old thread pulled.
5. **The quilt** — one patch per day, darkening with each stitch. Visible proof
   that small and daily beats big and rare.
6. **Reflection** — an optional somatic check-in: a word, where you feel it in
   the body, how warm life feels.

## The three soul technologies

| Code | Name | Purpose |
| --- | --- | --- |
| MSG | Meditative Somatic Gesture | Gestures the body remembers. |
| SEE | Somatic Experiencing Exercise | Sensual exercises that surface hidden belief. |
| WHEN | Gesture Library | A gesture for each kind of ache, for the moment the thread pulls. |

## Where the reader is in the book

Content unlocks chapter by chapter (Introduction, then Chapters 1 to 9). The
reader sets their chapter in Settings or via a gentle check-in prompt on open.
Today and Practice follow that chapter. Marking the book complete unlocks
everything, including the full WHEN library.

## Design principles

- **Gentle over gamified.** No punishment, no nagging. A pale patch "is simply
  waiting", not a failure.
- **Small and daily.** The whole loop is minutes, not an hour.
- **The thread metaphor governs everything:** stitch, sew, thread, quilt, unravel,
  resew.
- **Warm editorial craft.** Fraunces serif for warmth, Inter for clarity, a
  clay-and-oat palette, soft shadows, calm motion.
- **Voice:** curly quotes, no em-dashes, capital Love and Fear. "Beautifully
  sewn", never "Well done".

## Platforms

One Expo codebase ships to iOS, Android, and web. The web build is the
shareable preview (linked from a QR code in the book). All three are
offline-first with no account required.

## What is intentionally NOT here

- No backend, no login, no cloud sync. Data is on-device only.
- No social features, no leaderboards, no streak pressure.
- No analytics or tracking.
- No reproduction of the book's text. The app points to the book; it does not
  replace it.

## Status

Feature-complete v1, version `1.0.0`. Branch `v2` on
`github.com/DarkHorseZA/LittleTim`. Web preview is live; native builds are
configured via EAS and ready to produce.

## Open items before public launch

- Fill in the external URLs in `src/config.ts` (coaching, talks, community, book
  formats, newsletter) as they become available.
- Produce and submit the native store builds (see `HANDOVER.md`).
- Optional: real push notifications via `expo-notifications` (the daily belief
  currently surfaces via an in-app prompt on first open of the day).
