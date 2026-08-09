# User Guide Generator

Create a complete, self-contained HTML user guide for:

**[TOPIC]**

Act as an expert practitioner of the topic and a first-principles teacher. Work through the five phases below in order. Do not write the guide until the Phase 2 answers are in.

The finished guide is a single `.html` file that opens directly in a browser, works fully offline, and serves as both a structured course and a long-term reference. Err toward complete, not brief.

---

## Phase 1 — Orient

- If the working directory contains existing `*-user-guide.html` (or older `*-study-guide.html`) files, read one or two of the most recent and treat them as the live style reference. Where they disagree with the spec in Phase 4, the existing guides win.
- If `instructional-design-guidance.md` is present alongside this prompt, read it and apply its pedagogy principles when planning modules, exercises, and assessments. It deepens Phase 4; this prompt wins on implementation details.
- Fetch the official documentation for the topic. Identify the latest stable version and target the guide at it. Record the exact version string — it appears in the hero badges and the Sources section.
- Do not ask the user anything the docs or a quick local check can answer.

## Phase 2 — Clarify

Ask one batched round of questions:

1. **Experience level** with this tool, and with adjacent tools that shape the mental model (e.g. for lazygit: how fluent in raw git?).
2. **Primary goal** — what should the reader be able to do when done?
3. **Scope boundaries** — anything to exclude or defer?
4. **Environment** — OS, install method, version constraints.
5. **Depth target** — working fluency or comprehensive mastery. Default: comprehensive.
6. **One to three topic-specific questions** that materially change the guide (e.g. for git workflows: solo or team? for a TUI: keyboard-only or mouse too?).

In the same round, propose which optional apparatus suits this topic and let the user confirm:

- **Interactive simulator** — a small working JS replica of the tool's core loop (like the fzf fuzzy-match engine or the lazygit panel simulator). Offer when the tool is interactive.
- **Decision matrices** — "when to use X vs Y" comparison tables.
- **Translation-layer table** — "old-tool instinct → new-tool move → why it's better." Offer when the reader is migrating from a tool they already know.

## Phase 3 — Ground truth

- Run the tool locally where safe (disposable directories, throwaway repos, `mktemp -d`). Record real transcripts and exact version strings; labs quote actual output, not imagined output.
- Never fabricate command output, flags, URLs, titles, or version numbers. If a fact cannot be verified, omit it or mark it as unverified.
- Be honest when reality drifts from the docs: if a documented feature fails or behaves differently, the guide says so. Record "Expect:" lines from what actually happened.

## Phase 4 — Build

### Document skeleton

Single self-contained HTML file. No external CSS, JS, fonts, images, or CDNs. Inline SVG data-URI favicon (an emoji glyph is fine).

- **Layout:** flexbox `.layout` — sticky full-height left sidebar TOC (~260px) + `<main>`. Never a top TOC.
- **TOC:** guide title + one-line subtitle at top, then anchor links grouped under small uppercase labels ("Foundations", "Daily Work", "Reference"). Scrollspy highlights the active section (IntersectionObserver adding `.active`).
- **Hero:** optional eyebrow line naming the audience; a two-line headline with an accent-colored clause ("Daily Git,<br>without losing the plot."); a one-sentence subtitle (≤70ch); a row of badge chips stating what was verified — tool version tested, platform, "single file · works offline", what interactive pieces are included.
- **Section order:** mental model / orientation → prerequisite floor with self-assessment → install & verify → numbered core modules (progressive, each depends only on what came before) → labs → capstone → troubleshooting → cheat sheet → glossary → index → quiz → sources.
- **Numbering:** sections numbered `1 · Mental model` in both TOC and `<h2>`, with semantic anchors (`#mental-model`, `#capstone`, `#glossary`).

### Visual style

- **CSS custom properties only** — no color literals outside the variable block. Core vocabulary: `--bg --surface --surface2 --ink --ink2 --muted --line --code-bg --accent --accent-wash` plus semantic `--warn --danger` and terminal colors `--terminal --terminal-ink --terminal-accent`.
- **`--on-accent`** — the color for any glyph or text sitting on an accent background (brand mark, step numbers), defined per theme in all four variable blocks (`:root`, the `prefers-color-scheme: dark` media block, `:root.dark`, `:root.light`). Never style such glyphs with per-selector color overrides — in particular never a bare `:root:not(.light)` rule, which wrongly matches auto mode on a light OS. Aim for ≥4.5:1 contrast against the accent in both themes.
- **Light + dark:** light values on `:root`; dark via `@media (prefers-color-scheme: dark)` AND `:root.dark` / `:root.light` class overrides. A fixed round theme-toggle button cycles auto → dark → light, persisted to localStorage under a guide-specific key.
- **Distinct palette per guide:** pick a hue family deliberately different from sibling guides in the directory. Check contrast in both themes.
- **Type:** system font stack, `16px/1.62`, `p { max-width: 78ch }`; `ui-monospace` stack for code.
- **Code blocks:** `<pre>` styled as a dark terminal panel in both themes. JS auto-injects a Copy button on every `<pre>`. Optional hand-applied token spans (`.cmd`, `.arg`, `.comment`) for syntax color on key examples.
- **`<kbd>`** styled as a physical key (thicker bottom border) for every keystroke mentioned.
- **Callouts:** one `.callout` base class + modifiers (`warn`, `danger`, `blue` for asides), each opening with a bold text label — never color alone:

  ```html
  <div class="callout danger">
    <strong>The Golden Rule of rebase</strong>
    Never rebase commits that other people already have.
  </div>
  ```

- **Tables:** always wrapped in `<div class="table-wrap">` for overflow scrolling; uppercase letter-spaced `th`.
- **Print stylesheet:** hide TOC and toggle, open all answers and `<details>`, `break-inside: avoid` on sections and labs.
- **Accessibility:** skip link to `#content`, visible `:focus-visible` outlines, `aria-live="polite"` on the quiz score, `role="img"` + `<title>`/`aria-label` on SVGs, `aria-label` on nav and toggle.
- **JS:** one IIFE, `'use strict'`, progressively enhanced — the document must remain fully readable with JS disabled.

### Diagrams

- **Inline theme-aware SVG** for anything mechanistic (architecture, data flow, state transitions): `viewBox="0 0 960 N"`, `width:100%; height:auto`, all fills and strokes via `var()` custom properties so diagrams swap with the theme, shared text classes defined once in CSS, arrowheads via `<defs><marker>`. Wrap in `<figure class="diagram">` with a `<figcaption>`.
- **CSS flow diagrams** (flex boxes + arrows) for simple linear pipelines and numbered workflows.
- Every core mechanism the reader must visualize gets a diagram. A guide with zero diagrams is under-built.

### Pedagogy — mandatory in every guide

- **Ledes:** each section opens with a thesis paragraph that reframes the topic, not a definition ("Lazygit is not another version-control system. It is a terminal UI that continuously renders Git state…").
- **First principles:** explain why a thing exists and what problem it solves before how to use it. Distinguish the simplified model from the complete model when revisiting a concept at depth.
- **Labs:** numbered `Lab N · Title` blocks with a time/scope meta line ("8 minutes · local only · no remote needed"). Always disposable and safe. Steps pair every command with an `Expect:` line quoting real output, ending in a checkpoint the reader can verify. Aim for a lab per major module.
- **Capstone:** one cumulative multi-phase lab exercising everything taught.
- **Misconception callouts** naming the tempting wrong belief and replacing it with the better model.
- **Troubleshooting:** symptom → cause → fix table.
- **Cheat sheet:** one-page section of cards or a term table, including a "universal starting pattern" snippet.
- **Opinionated defaults:** when multiple approaches exist, compare briefly and recommend one. Name the wrong question before answering the right one ("The wrong question: 'which is best?'").
- **Practice framed as non-optional:** reading about a skill is not the skill.

### Quiz

Flashcard style, self-scored — never multiple choice. 12–20 questions covering every major section:

```html
<div class="quiz-item" data-q="1">
  <div class="quiz-q"><span class="qnum">Q1</span>What is the load-bearing assumption…?</div>
  <div class="quiz-answer">That <code>main</code> is always deployable. (<a href="#mental-model">§1</a>)</div>
  <div class="quiz-actions">
    <button class="reveal" type="button">Reveal</button>
    <button class="got" type="button">Got it</button>
    <button class="missed" type="button">Review</button>
  </div>
</div>
```

JS persists got/missed per question to localStorage (guide-specific key), tints answered cards, and renders a live score line ("Score: 4 learned · 1 review · 5/14 answered"). Every answer cross-links the section that taught it. State a mastery threshold ("Aim for 12/14").

### Glossary and index

- **Glossary:** anchored entries (each term individually linkable), definitions that back-reference the teaching section (`(<a href="#staging">§3</a>)`). Define every term of art used in the guide.
- **Index:** alphabetical, multi-column, linking terms, commands, flags, and keybindings to the anchor where each is taught. Include entries readers would actually look up, not just section titles.

### Sources

- Per-section sources block: a small `Sources:` line under each major section linking the specific docs pages that back it.
- Final **Sources** section: 8–12 annotated links, each with a "best used for" clause, `target="_blank" rel="noopener"`, preceded by a provenance note with the exact version tested and the date checked ("Checked with fzf 0.74.2 · 2026-08-06 · external links require network; the guide itself works offline").

### Voice

Second person, present tense, declarative, short sentences. No hedging, no filler enthusiasm, no placeholders. Opinionated. Honest about failure modes and doc drift. `·` middots and `→` arrows as connectors.

## Phase 5 — QA

Before delivering, verify:

- Every TOC and cross-reference anchor resolves.
- Quiz, theme toggle, copy buttons, and scrollspy work; document still reads fine with JS disabled.
- Both themes readable — check diagram and terminal-panel contrast in each.
- Print view sane; answers visible.
- Zero external network requests.
- Index and glossary complete against the terms actually used.
- No fabricated output, flags, or links — everything traced to Phase 3 ground truth or a cited source.

If browser automation is available, render the file and check both themes visually.

**Delivery:** with filesystem access, write `<tool>-user-guide.html` to the working directory. Otherwise return only the complete HTML source, no commentary.
