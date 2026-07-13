# Piano — backlog

**Status:** dormant · **Path:** `C:\Users\George\Documents\Projekty\Piano`

## Must-have
- Stuck/unresponsive notes when Shift's held state differs between a key's keydown and
  keyup. `handleKeyDown`/`handleKeyUp` in `script.js` look up notes via
  `KEY_MAP[event.key.toLowerCase()]` (case-insensitive) but track held notes in
  `activeSynths` keyed by the raw, case-sensitive `event.key` — so keydown `'s'` then
  keyup `'S'` (easy to hit incidentally while playing chords) leaves the note sustaining
  forever and blocks that key from retriggering. Verified live in a running browser
  session. Fix: normalize `event.key` to lowercase once and use that same value for both
  the `KEY_MAP` lookup and the `activeSynths` tracking key in both handlers.

## Nice-to-have
- `styles.css` (lines ~51-56) defines `.black-key span`/`.white-key span` color rules, but
  no `<span>` is ever created anywhere in the app — key labels are colored via inline
  `style.color` directly on the `.key` div. Dead, misleading CSS; safe to delete.

(Both repo-bloat findings from the 2026-07-12 hardening pass are also resolved — the
87MB zip was stripped from `.git` via history rewrite 2026-07-14 (force-pushed to
`origin`, both `main` and `hardening-pass-2026-07-12`); the 47 unused `.mp3` files are
being kept deliberately as the reserve for a future range extension. See `FLEET_NOTES.md`.)

## Reference
- Browser-based virtual piano with real sampled note playback (Tone.js). Committed audio assets are heavy but functional, not clutter.
- A hardening pass already fixed a real cross-octave note-tracking bug and added a test suite (`npm test`) — see `HARDENING.md` for the full report.
