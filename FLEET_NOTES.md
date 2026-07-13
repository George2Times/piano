# Fleet Notes

Items that need a decision or information only you can provide.

## 1. History rewrite to reclaim the 87MB zip from `.git` — RESOLVED 2026-07-14: done

Rewrote history with `git filter-repo` (stripped the zip from every commit on both
`main` and `hardening-pass-2026-07-12`) and force-pushed both branches to `origin`.
Verified: the zip no longer appears anywhere in `git log --all` for either branch.
Local `Piano/` working copy's `main` and `hardening-pass-2026-07-12` are both reset
to match the rewritten `origin` exactly — no stale local branch left pointing at the
old pre-rewrite history. Nobody else had a clone or open PR against this repo.

Local `.git` itself won't shrink until garbage-collected (the old objects are still
present but unreferenced) — run `git reflog expire --expire=now --all && git gc
--prune=now` locally if you want the disk space back now; otherwise routine gc will
clean it up on its own over time.

## 2. The 47 unused `.mp3` files — RESOLVED 2026-07-14: keeping them

Decided: keep. They're the reserve for when the keyboard's range extends past the
current C3–B5 — confirmed intentional, not clutter. No action needed.
