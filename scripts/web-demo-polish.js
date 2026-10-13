// Post-processes the exported web demo's index.html so the first paint is calm:
//   1. A cream background before the JS mounts (no white flash).
//   2. <link rel="preload"> for the fonts the app gate waits on, so they fetch
//      immediately in parallel with the JS bundle instead of only after React
//      mounts. That's what removes the blank-then-pop on a cold load.
// Run after `expo export --platform web`, before copying index.html to 404.html.
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');
const INDEX = path.join(DIST, 'index.html');

// The fonts AppInner's useFonts() blocks on (Fraunces + Inter), plus Ionicons
// for the first-paint icons. FontAwesome6 (Connect only) and the unused Inter
// weights are left to load normally.
const WANTED = [
  /^Fraunces_400Regular\./,
  /^Fraunces_400Regular_Italic\./,
  /^Fraunces_500Medium\./,
  /^Fraunces_600SemiBold\./,
  /^Inter_400Regular\./,
  /^Inter_500Medium\./,
  /^Inter_600SemiBold\./,
  /^Inter_700Bold\./,
  /^Ionicons\./,
];

let html = fs.readFileSync(INDEX, 'utf8');

// Derive the served base path (e.g. /re-genesis-preview) from the script src.
const m = html.match(/src="([^"]*)\/_expo\//);
const base = m ? m[1] : '';

const files = fs
  .readdirSync(DIST, { recursive: true })
  .filter((f) => typeof f === 'string' && f.endsWith('.ttf'))
  .filter((f) => WANTED.some((re) => re.test(path.basename(f))));

const preloads = files
  .map((f) => {
    const href = `${base}/${f.split(path.sep).join('/')}`;
    return `    <link rel="preload" as="font" type="font/ttf" href="${href}" crossorigin />`;
  })
  .join('\n');

const inject = `${preloads}
    <style id="demo-prepaint">html,body{background-color:#F5EFE6;}</style>
`;

if (!html.includes('demo-prepaint')) {
  html = html.replace('</head>', `${inject}</head>`);
  fs.writeFileSync(INDEX, html);
}

console.log(
  `web-demo-polish: ${files.length} font preloads + cream pre-paint (base: ${base || '/'}).`
);
