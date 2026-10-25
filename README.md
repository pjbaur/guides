# Guides

Single-file HTML guides for command-line tools. Each one is a complete study
course and a long-term reference in the same document.

**Browse them live: <https://pjbaur.github.io/guides/>**

Every guide is **one `.html` file**. Open it in a browser — no build step, no
server, no install. They make **zero external network requests**: no CDN, no
fonts, no analytics, no tracking. Diagrams are inline SVG, the theme toggle and
quiz state live in `localStorage`, and the whole thing works offline and on a
plane.

## The hub page

[`index.html`](index.html) is a terminal-themed home page linking every guide,
with per-guide verification badges — it is what the live site serves. Open it
locally like any other guide, or host the directory as a static site.
([`infra/`](infra/README.md) has an unapplied OpenTofu config for S3 static
website hosting as an alternative to GitHub Pages.)

The guide cards inside `index.html` are **generated**: everything between the
`GUIDES:BEGIN/END` markers is overwritten by the build script, so never edit
that block by hand. Edit [`guides.json`](guides.json) instead and regenerate:

```sh
node scripts/build-index.mjs
```

Needs any recent Node (≥ 18), no packages. Each card is assembled from two
sources: `name`, `subject`, `verified` and `accent` come from `guides.json`,
while the card's italic title line is read from the guide file's own
`<title>` tag — if a card reads wrong, fix whichever of the two is off.

Fields per `guides.json` entry:

- `file` — the guide's filename. Cards appear in array order.
- `name` — short display name on the card.
- `subject` — one-line description.
- `verified` — badge text (e.g. `tmux 3.7b · 2026-08-22`), or `null` for the
  "checked when written" badge.
- `accent` — card color: one of `green`, `amber`, `cyan`, `magenta`, `blue`,
  `violet`, `red`, `lime`. Anything else silently falls back to green.

The script warns in both directions: a `*-guide.html` file with no
`guides.json` entry, and an entry whose file is missing from disk.

### Adding, renaming or removing a guide

1. Add, update or delete the entry in `guides.json`.
2. Run `node scripts/build-index.mjs`.
3. Update the table below, and commit `guides.json`, `index.html` and
   `README.md` together.

### Keeping the hub fresh

GitHub Pages deploys `main` on every push, so a stale `index.html` goes live
immediately. CI guards against that:
[`.github/workflows/check-hub.yml`](.github/workflows/check-hub.yml) runs
`node scripts/build-index.mjs --check` on every push and pull request. It
fails when the baked cards don't match `guides.json`; the mismatch warnings
above also fail the check (a plain run only prints them). The same `--check`
command works as a local pre-commit hook.

### Hosting on Vercel

[`vercel.json`](vercel.json) sets the security headers (CSP, HSTS, framing,
referrer, permissions). [`.vercelignore`](.vercelignore) is an **allowlist**:
it ignores everything in the repo root, then re-allows only `*.html`, `*.md`,
`fonts/`, `guides.json`, `LICENSE` and `vercel.json`. So `infra/`, `docs/`,
`scripts/`, `.github/` and other dot-directories are not deployed or served.

- **New root-level file type or directory** (an `.svg`, a stylesheet, an
  `assets/` folder): add a `!` line to `.vercelignore`, or it will 404 on
  Vercel while still working locally and on GitHub Pages.
- **CSP:** `vercel.json` allows only same-origin resources plus inline
  script/style and `data:` images. An external request added to a guide will be
  blocked on Vercel; keep guides self-contained.
- **Check after the first deploy:** `/infra/main.tf` and `/docs/` must return
  404, and `/index.html`, `/fonts/ibm-plex-mono-400.woff2` and a guide must
  load. The Vercel docs do not state whether Git-integration builds honor
  `.vercelignore`, so this check is the confirmation.

## Public vs private

This repo is public and served by GitHub Pages. Guides about my own AI setup,
sessions, quotas or measured data are personal and confidential and live in a
separate private repo, never here. `scripts/build-index.mjs` fails CI if a
private-marked guide or a known personal marker appears in this repo.

## The guides

| Guide | Subject | Verified against |
|---|---|---|
| [`file-search-macos-user-guide.html`](file-search-macos-user-guide.html) | Finding files on macOS: `mdfind`, `fd`, `locate`, `find`, `grep`/`egrep`, `ripgrep`, plus Spotlight and Finder — index vs walk, name vs contents, four regex dialects | macOS 15.6 · fd 10.5.0 · rg 15.2.0 · ugrep 7.8.4 · 2026-09-10 |
| [`atuin-user-guide.html`](atuin-user-guide.html) | Shell history as a queryable, syncing SQLite database | atuin 18.19.0 · 2026-08-07 |
| [`rsync-user-guide.html`](rsync-user-guide.html) | The trailing slash, the delta algorithm, filter rules, SSH and daemon transports, `--link-dest` snapshots | rsync 3.4.4 (protocol 32) · 2026-08-07 |
| [`chezmoi-user-guide.html`](chezmoi-user-guide.html) | Declaring your home directory once and applying it everywhere | chezmoi v2.72.0 · 2026-08-06 |
| [`syncthing-user-guide.html`](syncthing-user-guide.html) | Continuous file sync across devices with no cloud in the middle | Syncthing v2.1.3 · 2026-08-06 |
| [`fzf-user-guide.html`](fzf-user-guide.html) | Fuzzy finding as a composable shell primitive | fzf 0.74.2 · 2026-08-06 |
| [`lazygit-user-guide.html`](lazygit-user-guide.html) | Daily Git through a terminal UI, without losing the plot | lazygit 0.63.0 |
| [`sqlite-shell-guide.html`](sqlite-shell-guide.html) | Opening, triaging, profiling and maintaining any SQLite database from the shell | — |
| [`git-workflows-user-guide.html`](git-workflows-user-guide.html) | GitHub Flow, Git Flow, trunk-based and GitLab Flow — and choosing deliberately | — |
| [`gastown-user-guide.html`](gastown-user-guide.html) | Steve Yegge's multi-agent coding orchestration system | 2026-07-11 |
| [`gascity-user-guide.html`](gascity-user-guide.html) | Go orchestration-builder SDK for multi-agent workflows, successor to Gas Town | gascity v1.4.0 · 2026-08-09 |
| [`cmux-user-guide.html`](cmux-user-guide.html) | Terminal workspace and pane orchestration | 2026-07-09 |
| [`tmux-user-guide.html`](tmux-user-guide.html) | Terminal multiplexing — sessions that outlive your connection, the client/server model, panes, copy-mode, scripting | tmux 3.7b · 2026-08-22 |
| [`bw150-user-guide.html`](bw150-user-guide.html) | ATorch BW150 electronic load — wiring, every mode, battery capacity and health, charger and cable tests, cycling, the apps | firmware 1.1.0 · screens 2026-09-05 |
| [`charging-protocols-user-guide.html`](charging-protocols-user-guide.html) | Charging protocols wire-level — BC 1.2, Type-C Current, USB PD through 3.2 (PPS, EPR, AVS), Quick Charge, VOOC and vendor protocols, UFCS, Qi/Qi2, negotiation simulator | USB PD R3.2 v1.2 · Qi 2.3 · 2026-09-25 |
| [`loudness-user-guide.html`](loudness-user-guide.html) | Loudness — every dB suffix, the BS.1770 meter model, EBU R128/ATSC A/85/AES TD1008, what YouTube/Rumble/Spotify/Apple Podcasts do to your audio, live and post workflows with YouLean, dpMeter5, FinalLoud and Audio Hijack | YouLean 2.5.15 · dpMeter5 5.3.9 · Audio Hijack 4.6.0 · ffmpeg 9.0.2 · 2026-09-29 |
| [`dictation-cheat-sheet.html`](dictation-cheat-sheet.html) | One-page Mac Dictation and Voice Control cheat sheet — layout words, punctuation, symbols, select/delete/move/correct, each command tagged tested, docs or reported from a spoken run | macOS 15.6 · spoken 2026-10-05 |

## How they are built

Each guide follows the same structure: a mental-model section that reframes the
tool before defining it, a prerequisite floor with self-assessment, install and
verification, numbered modules that each depend only on what came before,
hands-on labs, a cumulative capstone, troubleshooting, a cheat sheet, glossary,
index, and a self-scored retrieval quiz.

The rule that matters most: **labs quote real output.** Commands were run in
disposable sandboxes and the transcripts pasted in. Where a documented feature
behaved differently in practice, the guide says so rather than repeating the
documentation. The atuin guide, for example, records eight such discrepancies
found by running the tool.

## Staleness

Verification dates are in the table above and in each guide's Sources section.
Guides without a date target fast-moving tools and were checked when written;
the older ones predate the version-badge convention. **A guide is a snapshot,
not a subscription** — cross-check anything load-bearing against the tool's own
documentation, which every guide links to per-section.

## License

[MIT](LICENSE) — the guide text, diagrams and code in this repository.

The tools these guides describe are separate projects under their own licenses,
and quoted documentation belongs to those projects. Each guide links its sources
inline and in a Sources section.
