# Piano — backlog

**Status:** dormant · **Path:** `C:\Users\George\Documents\Projekty\Piano`

## Must-have
_None._

## Nice-to-have
_None._ (Both repo-bloat findings from the 2026-07-12 hardening pass are resolved — the
87MB zip was stripped from `.git` via history rewrite 2026-07-14 (force-pushed to
`origin`, both `main` and `hardening-pass-2026-07-12`); the 47 unused `.mp3` files are
being kept deliberately as the reserve for a future range extension. See `FLEET_NOTES.md`.)

## Reference
- Browser-based virtual piano with real sampled note playback (Tone.js). Committed audio assets are heavy but functional, not clutter.
- A hardening pass already fixed a real cross-octave note-tracking bug and added a test suite (`npm test`) — see `HARDENING.md` for the full report.
