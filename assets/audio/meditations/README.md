# Meditation audio

Bundled guided-audio recordings for the meditations (MSG, SEE, WHEN). Bundling
keeps the app offline-first (no network needed to play).

## Naming

Name each file after the meditation's `id`, so the mapping is obvious:

| Meditation | id (in data file) | Audio file |
| --- | --- | --- |
| MSG, Introduction | `msg-intro` | `msg-intro.m4a` |
| MSG, Chapter 1 | `msg-ch1` | `msg-ch1.m4a` |
| SEE, Chapter 3 | `see-ch3` | `see-ch3.m4a` |
| WHEN, "Worthiness" | `tr-worthiness` | `tr-worthiness.m4a` |

(IDs live in `src/data/practices.ts` for MSG/SEE and `src/data/triggers.ts` for
WHEN.)

## Format

**`.m4a` (AAC)** is the recommended format: small, and supported on iOS,
Android, and web. Keep files reasonably compressed (mono, ~96 kbps is plenty for
voice).

## Wiring a recording in

Adding audio is a **data change only, no code change.** Add an `audio` field to
the meditation in its data file. The `require` path is relative to the data
file (`src/data/`), so it starts with `../../assets/audio/meditations/`.

```ts
// in src/data/practices.ts, on the relevant practice object:
audio: {
  source: require('../../assets/audio/meditations/msg-ch1.m4a'),
  duration: 312,            // total length in seconds
  pageMarkers: [0, 18, 47], // seconds each step begins; one entry per step
},
```

### `pageMarkers`

- One entry per step, in seconds, marking where that step begins in the audio.
- The first value is almost always `0`.
- For a single-page meditation, use `[0]` or omit `pageMarkers` entirely.
- These drive the step highlight + auto-scroll while the recording plays. Until
  you provide them, the audio still plays; it just won't move the steps.

Once the field is present, the play/pause control appears automatically. Remove
the field and the meditation goes back to no audio. Nothing else to change.
