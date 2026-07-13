# Piano — backlog

**Status:** dormant · **Path:** `C:\Users\George\Documents\Projekty\Piano`

## Must-have
- ~~Stuck/unresponsive notes when Shift's held state differs between a key's keydown and
  keyup.~~ **Resolved 2026-07-14.** `handleKeyDown`/`handleKeyUp` looked notes up via
  `KEY_MAP[event.key.toLowerCase()]` but tracked held notes in `activeSynths` under the
  raw, case-sensitive `event.key`, so keydown `'s'` + keyup `'S'` left the note sustaining
  forever and blocked that key from retriggering. Both handlers now normalize `event.key`
  to lowercase once and use that value for the lookup and the tracking key.

## Nice-to-have
- ~~Dead `.black-key span`/`.white-key span` color rules in `styles.css`.~~
  **Resolved 2026-07-14.** No `<span>` is ever created — labels are set via `textContent`
  and colored with inline `style.color` on the `.key` div — so the rules were deleted.

(Both repo-bloat findings from the 2026-07-12 hardening pass are also resolved — the
87MB zip was stripped from `.git` via history rewrite 2026-07-14 (force-pushed to
`origin`, both `main` and `hardening-pass-2026-07-12`); the 47 unused `.mp3` files are
being kept deliberately as the reserve for a future range extension. See `FLEET_NOTES.md`.)

## Reference
- Browser-based virtual piano with real sampled note playback (Tone.js). Committed audio assets are heavy but functional, not clutter.
- A hardening pass already fixed a real cross-octave note-tracking bug and added a test suite (`npm test`) — see `HARDENING.md` for the full report.
