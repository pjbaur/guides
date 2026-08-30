# Guides

Single-file HTML guides for command-line tools. Each one is a complete study
course and a long-term reference in the same document.

Every guide is **one `.html` file**. Open it in a browser — no build step, no
server, no install. They make **zero external network requests**: no CDN, no
fonts, no analytics, no tracking. Diagrams are inline SVG, the theme toggle and
quiz state live in `localStorage`, and the whole thing works offline and on a
plane.

## The hub page

[`index.html`](index.html) is a terminal-themed home page linking every guide,
with per-guide verification badges. Open it locally like any other guide, or
host the whole directory as a static site — [`infra/`](infra/README.md) has an
OpenTofu config for S3 static website hosting and the deploy commands.

### Adding a guide

1. Add an entry to [`guides.json`](guides.json) (file, name, subject,
   verified-against, accent).
2. Run `node scripts/build-index.mjs` — it re-bakes the cards into
   `index.html` and warns about guide files missing from `guides.json`.
3. Add the row to the table below and commit all three files.

`node scripts/build-index.mjs --check` exits non-zero if `index.html` is
stale, for use as a pre-commit check.

## The guides

| Guide | Subject | Verified against |
|---|---|---|
| [`atuin-user-guide.html`](atuin-user-guide.html) | Shell history as a queryable, syncing SQLite database | atuin 18.19.0 · 2026-08-07 |
| [`rsync-user-guide.html`](rsync-user-guide.html) | The trailing slash, the delta algorithm, filter rules, SSH and daemon transports, `--link-dest` snapshots | rsync 3.4.4 (protocol 32) · 2026-08-07 |
| [`chezmoi-user-guide.html`](chezmoi-user-guide.html) | Declaring your home directory once and applying it everywhere | chezmoi v2.72.0 · 2026-08-06 |
| [`syncthing-user-guide.html`](syncthing-user-guide.html) | Continuous file sync across devices with no cloud in the middle | Syncthing v2.1.3 · 2026-08-06 |
| [`fzf-user-guide.html`](fzf-user-guide.html) | Fuzzy finding as a composable shell primitive | fzf 0.74.2 · 2026-08-06 |
| [`lazygit-user-guide.html`](lazygit-user-guide.html) | Daily Git through a terminal UI, without losing the plot | lazygit 0.63.0 |
| [`sqlite-shell-guide.html`](sqlite-shell-guide.html) | Opening, triaging, profiling and maintaining any SQLite database from the shell | — |
| [`git-workflows-user-guide.html`](git-workflows-user-guide.html) | GitHub Flow, Git Flow, trunk-based and GitLab Flow — and choosing deliberately | — |
| [`gastown-user-guide.html`](gastown-user-guide.html) | Steve Yegge's multi-agent coding orchestration system | 2026-07-11 |
| [`gascity-user-guide.html`](gascity-user-guide.html) | Go orchestration-builder SDK for multi-agent workflows, successor to Gas Town | gascity ≈ v1.3.0 · 2026-07-09 |
| [`cmux-user-guide.html`](cmux-user-guide.html) | Terminal workspace and pane orchestration | 2026-07-09 |
| [`tmux-user-guide.html`](tmux-user-guide.html) | Terminal multiplexing — sessions that outlive your connection, the client/server model, panes, copy-mode, scripting | tmux 3.7b · 2026-08-22 |

## How they are built

Each guide follows the same structure: a mental-model section that reframes the
tool before defining it, a prerequisite floor with self-assessment, install and
verification, numbered modules that each depend only on what came before,
hands-on labs, a cumulative capstone, troubleshooting, a cheat sheet, glossary,
index, and a self-scored retrieval quiz.

Two working documents drive that:

- **[`create-guide-prompt.md`](create-guide-prompt.md)** — the phased workflow:
  orient, clarify, establish ground truth, build, QA.
- **[`instructional-design-guidance.md`](instructional-design-guidance.md)** —
  the pedagogy companion covering progressive layering, misconception handling
  and assessment design.

The rule that matters most: **labs quote real output.** Commands were run in
disposable sandboxes and the transcripts pasted in. Where a documented feature
behaved differently in practice, the guide says so rather than repeating the
documentation. The atuin guide, for example, records eight such discrepancies
found by running the tool.

## Known gaps

[`guide-ui-review.md`](guide-ui-review.md) is a measured UI audit of the eleven
guides that predate the tmux guide — rendered in headless Chromium, not inferred from source. It documents
five open issues, the most significant being that four guides render **no
navigation at all** below their mobile breakpoint. It includes the re-runnable
audit script and an explicit list of what the audit does not cover.

Treat the audit as current as of 2026-08-07 and re-run it before acting on it.

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
