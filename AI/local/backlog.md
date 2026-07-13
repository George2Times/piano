# Piano — backlog

**Status:** dormant · **Path:** `C:\Users\George\Documents\Projekty\Piano`

## Must-have
_None._

## Nice-to-have
- Decide on the two repo-bloat findings from the 2026-07-12 hardening pass (see `HARDENING.md`): an unreferenced 87MB `samples/*.zip` (already `.gitignore`d against recurrence, but still tracked in the current tree and in history) and 47 unused `.mp3` files the sampler never loads. If you want the current tree cleaned up, remove the tracked zip and unused samples from `samples/`; a full space reclaim from `.git` itself would additionally need a history rewrite (`git filter-repo` + force-push), which needs your explicit go-ahead first.

## Reference
- Browser-based virtual piano with real sampled note playback (Tone.js). Committed audio assets are heavy but functional, not clutter.
- A hardening pass already fixed a real cross-octave note-tracking bug and added a test suite (`npm test`) — see `HARDENING.md` for the full report.
