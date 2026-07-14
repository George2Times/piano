# Piano — backlog

**Status:** clear · **Path:** `C:\Users\George\Documents\Projekty\Piano`

All tracked items are resolved as of 2026-07-14. Every fix below was verified by driving the
real page in headless Chrome (Playwright + the installed browser) against a local HTTP server
— clicking keys, pressing shortcuts, reading the accessibility tree, and measuring key widths
at a 375px viewport — not just by reading the diff. `npm test` covers the pure logic (11 tests).

## Must-have
- ~~Stuck/unresponsive notes when Shift's held state differs between a key's keydown and
  keyup.~~ **Resolved 2026-07-14.** `handleKeyDown`/`handleKeyUp` looked notes up via
  `KEY_MAP[event.key.toLowerCase()]` but tracked held notes in `activeSynths` under the
  raw, case-sensitive `event.key`, so keydown `'s'` + keyup `'S'` left the note sustaining
  forever and blocked that key from retriggering. Both handlers now normalize `event.key`
  to lowercase once and use that value for the lookup and the tracking key.
- ~~The Tone.js AudioContext is never explicitly started/resumed (`Tone.start()` appears
  nowhere in the repo).~~ **Resolved 2026-07-14** (`2a25ee5`). `startAudioContext()` now calls
  `Tone.start()` from the gesture that plays the first note. Confirmed live in Chrome: the
  context really is `suspended` at load, and our call is what resumes it. One wrinkle found
  while verifying — deferring the attack until the context resumes meant a *quick* first tap
  (mousedown and mouseup both landing before the resume) got no attack at all, i.e. the exact
  silent-first-note symptom, just relocated. The attack now always fires once the context is
  up, and self-releases if the key is no longer held.
- ~~Piano keys are unlabeled, unfocusable `<div>` elements with no ARIA role or name.~~
  **Resolved 2026-07-14** (`2527111`, `2a25ee5`, `4f45588`). Keys are now `role="button"`,
  `tabindex="0"`, named after the note they play via a new `PianoLogic.getNoteLabel()`
  ("C#4" → "C sharp 4", so black keys don't read identically to white ones), carry
  `aria-keyshortcuts`, and are playable with Enter/Space. Verified live: all 12 keys appear in
  the accessibility tree as named buttons, are Tab-reachable, and sound on Enter.
- ~~On mobile-width viewports, 3-octave keys shrink to unusably small touch targets.~~
  **Resolved 2026-07-14** (`3f629f4`). Keys no longer flex-shrink; the piano scrolls sideways
  at full size instead, and a `@media (max-width: 600px)` block trims keys to 44px so there is
  less to scroll. Measured live at 375px: white keys 44px (was ~17px), and the page itself
  still doesn't overflow horizontally.
- ~~The A/L keyboard shortcuts (B3/C5) stay live even in 1-octave view.~~
  **Resolved 2026-07-14** (`2527111`, `2a25ee5`). `buildKeyMap()` takes the octave count and
  only merges the extras for the 3-octave view; `script.js` rebuilds the map on every render.
  Verified live: `a`/`l` play nothing in 1-octave view and B3/C5 in 3-octave view.
- ~~README's setup instructions still just say to open `index.html` directly.~~
  **Resolved 2026-07-14** (`90d7b44`). Setup now documents serving over a local HTTP server
  (`python3 -m http.server` / `npx serve`) and calls out explicitly why `file://` fails.
  `HARDENING.md` was left alone: it's a historical report, and rewriting it to match would
  paper over the fact that its claim was wrong at the time.

## Nice-to-have
- ~~Dead `.black-key span`/`.white-key span` color rules in `styles.css`.~~
  **Resolved 2026-07-14.** No `<span>` is ever created — labels are set via `textContent`
  and colored with inline `style.color` on the `.key` div — so the rules were deleted.
- ~~Keys are clickable/pressable before the 38 referenced mp3 samples finish loading, with no
  readiness check.~~ **Resolved 2026-07-14** (`2a25ee5`, `4f45588`, `3f629f4`). The Sampler's
  `onload` now drives a loading state: until it fires the keys are dimmed, marked
  `aria-disabled="true"`, and a `role="status"` region announces "Loading piano samples…";
  `startNotePlaying` refuses to attack an unloaded buffer. Verified live: a click during
  loading triggers no attack, and the state clears once the samples arrive.
- ~~Keyboard handlers don't check Ctrl/Cmd/Alt modifiers.~~ **Resolved 2026-07-14**
  (`2a25ee5`). `keydown` now ignores Ctrl/Cmd/Alt. `keyup` deliberately does *not* — checking
  there would strand a note if Ctrl went down mid-note, which is the same class of bug as the
  Shift one above. Verified live: Ctrl+S/Ctrl+F sound nothing, and pressing Ctrl mid-note
  still releases it.
- ~~The page has no heading or landmark elements.~~ **Resolved 2026-07-14** (`4f45588`).
  Added `<header>`/`<h1>`/`<main>`, and grouped the octave buttons under a labelled
  `role="group"`.
- ~~Tone.js is loaded from the cdnjs CDN with no Subresource Integrity or `crossorigin`.~~
  **Resolved 2026-07-14** (`334f465`). Added `integrity`/`crossorigin`/`referrerpolicy`. The
  hash is cdnjs's published SRI for 14.8.34, independently verified by downloading the file
  and recomputing its SHA-512 locally — not copied on trust. Verified live: Tone.js still
  loads and executes with the attribute in place.

(Both repo-bloat findings from the 2026-07-12 hardening pass are also resolved — the
87MB zip was stripped from `.git` via history rewrite 2026-07-14 (force-pushed to
`origin`, both `main` and `hardening-pass-2026-07-12`); the 47 unused `.mp3` files are
being kept deliberately as the reserve for a future range extension. See `FLEET_NOTES.md`.)

## Reference
- Browser-based virtual piano with real sampled note playback (Tone.js). Committed audio assets are heavy but functional, not clutter.
- A hardening pass already fixed a real cross-octave note-tracking bug and added a test suite (`npm test`) — see `HARDENING.md` for the full report.
