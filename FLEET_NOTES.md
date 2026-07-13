# Fleet Notes

Items that need a decision or information only you can provide.

## 1. History rewrite to actually reclaim the 87MB zip from `.git` — needs your go-ahead

**Status: blocked on you. Nothing has been force-pushed or rewritten.**

I untracked the accidental sample-pack zip (commit `92836cf`, via `git rm --cached`),
which removes 83MB from every *fresh checkout*. But the blob is still in history —
it was added in `f00d58a` — so `.git` itself is still ~55MB and `git clone` still
transfers the zip. Removing it for real means rewriting history:

```sh
git filter-repo --path 'samples/nbrosowsky tonejs-instruments master samples-piano.zip' --invert-paths
git push --force origin main hardening-pass-2026-07-12
```

I did **not** do this, and I won't without you saying so explicitly, because it is
destructive and outward-facing:

- It **rewrites every commit SHA** from `f00d58a` (the 3rd of 11 commits) onward.
- It requires a **force-push to `origin`** (`https://github.com/George2Times/piano.git`),
  where both `main` and `hardening-pass-2026-07-12` are already pushed.
- Anyone else with a clone (or any open PR / fork) would have to re-clone or hard-reset;
  their existing branches would no longer share history with the remote.
- `git filter-repo` is not currently installed here, so it would also need installing.

**What I need from you:** an explicit "yes, rewrite history and force-push" — plus
confirmation that nobody else has a clone or open PR against this repo. If you'd
rather not, doing nothing is a perfectly fine outcome: the tree is clean now, the
zip can't be re-added (`.gitignore`), and 55MB of `.git` is not a real problem for
a repo this size. The only cost of leaving it is clone time.

**Note:** your local copy of the zip is still on disk at
`samples/nbrosowsky tonejs-instruments master samples-piano.zip` (83MB). It's
gitignored now, so git will leave it alone. Delete it by hand if you want the disk
space back — but it's the archive the gitignored `.ogg`/`.wav` files came from, so
you may want to keep it.

## 2. The 47 unused `.mp3` files — I left them; overrule me if you disagree

The 2026-07-12 hardening pass flagged that the `Tone.Sampler` in `script.js` only
loads 38 of the 85 tracked `.mp3` files (`B2` plus `C3`–`C6`); the other 47 (octaves
1, 7, 8 and most of 2) are never requested. I confirmed that's accurate.

**I chose not to delete them**, because the numbers don't justify it:

| | files | size |
|---|---|---|
| Used by the sampler | 38 | 6.5 MB |
| Unused | 47 | **8.75 MB** |

Deleting the unused ones reclaims **nothing** from `.git` (the blobs stay in history
either way, exactly as with the zip) — it would only trim 8.75MB from a checkout.
Against that: unlike the zip, these aren't an accident. They're the deliberate,
complete C1–C8 sample pack, and they're precisely what you'd need the day the piano
grows beyond its current C3–B5 range. That's a product decision, not repo hygiene,
so I didn't make it for you.

**If you want them gone anyway**, say so and it's a one-liner — or if you'd rather
go the other way and *widen* the keyboard's range, the samples are already sitting
there ready to be wired into the sampler's `urls` map.
