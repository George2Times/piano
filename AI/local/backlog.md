# Piano — backlog

**Status:** attention · **Path:** `C:\Users\George\Documents\Projekty\Piano`

## Must-have
- ~~Stuck/unresponsive notes when Shift's held state differs between a key's keydown and
  keyup.~~ **Resolved 2026-07-14.** `handleKeyDown`/`handleKeyUp` looked notes up via
  `KEY_MAP[event.key.toLowerCase()]` but tracked held notes in `activeSynths` under the
  raw, case-sensitive `event.key`, so keydown `'s'` + keyup `'S'` left the note sustaining
  forever and blocked that key from retriggering. Both handlers now normalize `event.key`
  to lowercase once and use that value for the lookup and the tracking key.
- The Tone.js AudioContext is never explicitly started/resumed (`Tone.start()` appears
  nowhere in the repo). Per Tone.js's own docs the context begins `"suspended"`; without an
  explicit `Tone.start()` from a user-gesture handler, the first note(s) after page load can
  silently produce no sound at all — a known "source of a lot of weird Tone.js bugs."
- Piano keys are unlabeled, unfocusable `<div>` elements with no ARIA role or name.
  Confirmed live: the rendered 3-octave piano's accessibility tree exposes only the octave
  buttons and the GitHub link — none of the 36 key divs — so keyboard-only and screen-reader
  users cannot discover or play a single note.
- On mobile-width viewports, 3-octave keys shrink to unusably small touch targets.
  `.key`/`.white-key`/`.black-key` use fixed pixel widths with no `@media` handling; measured
  live at 375px, keys shrink to ~25px/~16px wide, well under standard ~44px touch-target
  guidance (the 1-octave default view is unaffected at the same width).
- The A/L keyboard shortcuts (B3/C5) stay live even in 1-octave view, where no on-screen key
  represents them, contradicting README's own description of when they apply.
  `piano-logic.js`'s `buildKeyMap()` merges them in unconditionally regardless of which view
  is rendered, so pressing `a`/`l` on the default (1-octave) load plays a note with zero
  visual key to show it happened.
- README's setup instructions still just say to open `index.html` directly, with no mention
  of serving it over a local HTTP server — even though `HARDENING.md` claims this was already
  fixed in the README. It wasn't: the live file has no "server"/"localhost" text at all, so a
  user following the actual documented steps gets silent audio failure (Tone.Sampler's
  `fetch()`-based sample loading fails under `file://` in most browsers).

## Nice-to-have
- ~~Dead `.black-key span`/`.white-key span` color rules in `styles.css`.~~
  **Resolved 2026-07-14.** No `<span>` is ever created — labels are set via `textContent`
  and colored with inline `style.color` on the `.key` div — so the rules were deleted.
- Keys are clickable/pressable before the 38 referenced mp3 samples finish loading, with no
  readiness check — `Tone.Sampler`'s own `loaded` property / `onload` callback is never used,
  so a fast click on a slow connection triggers `triggerAttack` on a not-yet-loaded buffer
  with no feedback.
- Keyboard handlers don't check Ctrl/Cmd/Alt modifiers, so common browser shortcuts also fire
  an unintended note — e.g. Ctrl+S (save) or Ctrl+F (find) plays C4/D4 at the same time as
  the browser's native action, since `s`/`f`/`d`/`a` are all mapped keys.
- The page has no heading or landmark elements (`<h1>`, `<main>`, `<header>`, `<nav>`) —
  screen-reader users have no page title or region to navigate to, only the `<title>` tag.
- Tone.js is loaded from the cdnjs CDN with no Subresource Integrity or `crossorigin`
  attribute. cdnjs publishes an SRI hash for this exact pinned version (14.8.34); adding
  `integrity`/`crossorigin` is a low-effort supply-chain hardening step.

(Both repo-bloat findings from the 2026-07-12 hardening pass are also resolved — the
87MB zip was stripped from `.git` via history rewrite 2026-07-14 (force-pushed to
`origin`, both `main` and `hardening-pass-2026-07-12`); the 47 unused `.mp3` files are
being kept deliberately as the reserve for a future range extension. See `FLEET_NOTES.md`.)

## Reference
- Browser-based virtual piano with real sampled note playback (Tone.js). Committed audio assets are heavy but functional, not clutter.
- A hardening pass already fixed a real cross-octave note-tracking bug and added a test suite (`npm test`) — see `HARDENING.md` for the full report.
