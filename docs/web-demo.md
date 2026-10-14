# re-Genesis — public web demo

A no-sign-up, seeded demo of the app for **theunispienaar.com**, hosted on GitHub
Pages. Mirrors the Next Entry (`traders-companion-preview`) pattern: a separate
public repo holds the built web app; the code lives here.

- **Live URL:** https://tjpienaar.github.io/re-genesis-preview/
- **Preview repo (built app only):** https://github.com/tjpienaar/re-genesis-preview
- **Source:** this repo, branch `feat/web-demo` (demo mode in `src/demo.ts`).

## What demo mode does

Triggered by the `EXPO_PUBLIC_DEMO=1` build flag (or a `?demo` / `/demo` URL for
local testing). Web only — it does nothing in the native store app.

- Seeds a lived-in state before anything reads storage: a "Friend" roughly ten
  weeks in and about halfway through the book (Chapter 5), ~2.5 months of varied
  quilt history (around 47 patches / 106 stitches) with believable gaps,
  including a mid-stretch week off, plus six saved journal stitches. **Today is
  left open** so a visitor can do a ritual / sew a stitch and feel the real app.
  (The exact counts shift slightly with the day the page is opened.)
- Opens straight into **Today** — no Welcome splash, no email ask.
- Suppresses the once-per-launch chapter check-in and reminder nudges.
- Turns off React Navigation URL syncing (the app sits on a subpath, so this
  keeps the address bar on the base and makes refresh work).
- Everything is on-device; nothing a visitor does leaves their browser.

## Rebuild / refresh the demo

From this repo, on the branch with the latest app + demo code (`feat/web-demo`,
or merge it forward first):

```bash
# 1. Point the build at the preview repo's subpath, build the demo, prep for Pages
node -e "const fs=require('fs');const j=JSON.parse(fs.readFileSync('./app.json','utf8'));j.expo.experiments.baseUrl='/re-genesis-preview';fs.writeFileSync('./app.json',JSON.stringify(j,null,2));"
rm -rf dist
EXPO_PUBLIC_DEMO=1 npx expo export --platform web
node scripts/web-demo-polish.js    # inject font preloads + cream pre-paint (no cold-load flash)
cp dist/index.html dist/404.html   # SPA fallback (after the polish, so 404 gets it too)
touch dist/.nojekyll               # let Pages serve the _expo/ folder
git checkout app.json              # restore baseUrl to /LittleTim

# 2. Publish the built app to the preview repo (replaces the previous build)
git -C dist init -q
git -C dist symbolic-ref HEAD refs/heads/main
git -C dist add -A
git -C dist -c user.name="Theunis Pienaar" -c user.email="tjpienaar1@gmail.com" \
  commit -q -m "re-Genesis web demo (preview build)"
git -C dist remote add origin https://github.com/tjpienaar/re-genesis-preview.git
git -C dist push -f origin main
```

GitHub Pages rebuilds automatically (~1–2 min). The first time only, Pages was
enabled from `main` / root (`gh api -X POST repos/tjpienaar/re-genesis-preview/pages -f "source[branch]=main" -f "source[path]=/"`).

## Embed on the website

The web build already centres a phone-sized frame, so either works.

Iframe (recommended):
```html
<iframe
  src="https://tjpienaar.github.io/re-genesis-preview/"
  title="re-Genesis app demo"
  style="width:100%; max-width:480px; height:860px; border:0; border-radius:24px; box-shadow:0 10px 40px rgba(0,0,0,.08);"
  loading="lazy">
</iframe>
```

Link / button:
```html
<a href="https://tjpienaar.github.io/re-genesis-preview/" target="_blank" rel="noopener">Try the re-Genesis app →</a>
```
