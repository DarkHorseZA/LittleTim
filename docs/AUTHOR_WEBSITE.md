# re-Genesis app — author website & book QR

The app is a web app, so it works from any link. No app-store download needed.

## Live link

```
https://darkhorseza.github.io/LittleTim/
```

This is the address to put in the book and on the website. When the build
finishes (green check in the repo's Actions tab) the latest version is live
at that link automatically.

## QR code for the book

`assets/qr/` holds ready-to-place codes that point at the live link:

- `regenesis-app-qr.svg` — vector, use this for print (book, proposal). Scales
  to any size with no blur.
- `regenesis-app-qr.png` — 900×900, warm brand colours, for slides/docs.
- `regenesis-app-qr-bw.png` — plain black/white, highest scanner reliability
  if a printer struggles with the tinted version.

Print it at least 2 cm × 2 cm. Keep the pale margin around it (the "quiet
zone") — scanners need it. A short caption helps, e.g.
*"Scan to open the re-Genesis companion app."*

## Putting it on an author website

Option A — a button/link (simplest):

```html
<a href="https://darkhorseza.github.io/LittleTim/">Open the re-Genesis app</a>
```

Option B — embed it in a page so it lives inside the site:

```html
<iframe
  src="https://darkhorseza.github.io/LittleTim/"
  style="width:100%;max-width:480px;height:860px;border:0;border-radius:24px"
  title="re-Genesis companion app"
></iframe>
```

A phone-sized frame (around 480 px wide) looks best — the app is designed
for a phone screen.

## When the app moves to its own domain

If the app later lives at a custom address (e.g. `app.theunispienaar.com`):

1. Update `APP_URL` in `src/config.ts`.
2. Re-run the QR step so the printed code points to the new address.

Until then everything points at the GitHub Pages link above.
