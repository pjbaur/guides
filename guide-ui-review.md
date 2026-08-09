# Guide UI Review — Known Gaps

Working checklist for a comprehensive UI pass over the HTML guides in this
directory. Every status below was **measured in headless Chromium on
2026-08-07**, not inferred from grep — an earlier grep-based pass got three
answers wrong because breakpoints differ per guide (760 / 900 / 940 / 1000px)
and because `rsync` was fixed with a different technique than the others.

The re-runnable audit script is at the bottom. Re-run it before acting; these
numbers go stale as guides change.

---

## Summary table

| Guide | Mobile nav @390px | Quiz reset | Clipboard `.catch` | H-overflow @390px | Glyph contrast (light) |
|---|---|---|---|---|---|
| `atuin-user-guide.html` | **none** | **missing** | **missing** | 0 | 6.8:1 |
| `chezmoi-user-guide.html` | **none** | **missing** | **missing** | 0 | 7.3:1 |
| `cmux-user-guide.html` | 12 links | n/a (no quiz) | **missing** | 0 | — |
| `fzf-user-guide.html` | **none** | **missing** | **missing** | **10px** | **3.7:1** |
| `gascity-user-guide.html` | 11 links | **missing** | **missing** | 0 | — |
| `gastown-user-guide.html` | 14 links | **missing** | **missing** | **29px** | — |
| `git-workflows-user-guide.html` | 18 links | **missing** | **missing** | 0 | — |
| `lazygit-user-guide.html` | 20 links | **missing** | **missing** | 0 | — |
| `rsync-user-guide.html` | **none** | **missing** | **missing** | 0 | 5.0:1 |
| `sqlite-shell-guide.html` | 16 links | **missing** | **missing** | 0 | — |
| `syncthing-user-guide.html` | toggle ✓ | ✓ | ✓ | 0 | 5.5:1 |

`syncthing-user-guide.html` is the reference implementation for all four
standards — it went through the full review that produced them. Copy from it
rather than reinventing.

`—` in the contrast column means the guide has no `.brand-mark` / `.step-num`
element to measure; it uses different sidebar markup. Not a defect, just out of
scope for that check.

No JavaScript errors in any guide. No external network requests were introduced
by any of these gaps.

---

## Gap 1 · Mobile navigation disappears — **highest severity**

**Four guides render zero navigation below their mobile breakpoint:**
`atuin`, `chezmoi`, `fzf`, `rsync`.

The pattern is a media query that collapses the sidebar and then hides the nav
outright:

```css
@media (max-width:760px) {
  .layout { display:block; }
  .sidebar { position:relative; width:auto; height:auto; ... }
  .brand-sub,.sidebar nav { display:none; }   /* ← nav is gone */
}
```

For a 26-section document that leaves a phone reader with no way to jump
anywhere — only scrolling. The six guides showing 11–20 links have the opposite
problem in milder form: the full list is present but pushes the content far down
the page.

**Reference fix** — `syncthing-user-guide.html:243` plus its JS around line 1003:

```html
<button class="toc-toggle" id="tocToggle" type="button"
        aria-expanded="false" aria-controls="toc">☰ Contents</button>
```

```js
const tocToggle = document.getElementById('tocToggle');
tocToggle.addEventListener('click', () => setToc(!sidebar.classList.contains('open')));
// setToc() also updates aria-expanded
```

Points to confirm when porting:

- `aria-expanded` must track the open state, and `aria-controls` must point at
  the nav's `id`.
- The toggle button must itself be hidden above the breakpoint.
- Scrollspy still runs while the nav is collapsed — verify the active link is
  correct when the panel is opened mid-page.
- Tapping a link should close the panel, or the reader lands behind an overlay.

---

## Gap 2 · No quiz reset button

**Nine guides have a quiz; only `syncthing` can reset it.** (`cmux` has no quiz.)

Quiz state persists to `localStorage` under a per-guide key — in the atuin guide
that is `atuin-guide-quiz`. Once answered, there is no in-page way to clear it;
the reader has to open devtools. That makes the quiz single-use, which defeats
the spaced-review purpose it was built for.

**Reference implementation** — `syncthing-user-guide.html`, three pieces:

- `:209` — `.quiz-reset { margin:-6px 0 15px; }`
- `:879` — `<div class="quiz-actions quiz-reset"><button id="quizReset" type="button">Reset score</button></div>`
- `:1187` — the handler:

```js
document.getElementById('quizReset').addEventListener('click', () => {
  quizState = {};
  quizItems.forEach(item => setAnswerOpen(item, false));
  updateQuiz();
});
```

Note it resets the in-memory object and lets the existing save path persist the
empty state, rather than touching `localStorage` directly. Keep that.

**Watch out:** the reset must clear only the quiz key, not the theme key. In the
atuin guide those are `atuin-guide-quiz` and `atuin-guide-theme` respectively —
a blanket `localStorage.clear()` would throw away the reader's theme choice, and
on a `file://` origin it would also clobber storage belonging to every other
guide, since they all share that origin.

---

## Gap 3 · Clipboard copy fails silently

**Ten of eleven guides** call `navigator.clipboard.writeText()` with a `.then()`
and no `.catch()`:

```js
navigator.clipboard.writeText(clone.textContent.trim()).then(() => {
  b.textContent = 'Copied'; setTimeout(() => { b.textContent = 'Copy'; }, 1200);
});
```

`writeText` rejects in several ordinary situations — a non-secure context,
denied clipboard permission, or a browser where the page is not focused. The
promise rejects, the button never changes, and the reader has no idea whether
the copy worked. On `file://` origins this is not hypothetical.

**Reference implementation** — `syncthing-user-guide.html:1020`. Note it also
guards `navigator.clipboard` being undefined outright, which the bare `.then()`
version does not:

```js
const write = navigator.clipboard
  ? navigator.clipboard.writeText(text)
  : Promise.reject(new Error('clipboard unavailable'));
write.then(() => { b.textContent = 'Copied'; })
     .catch(() => { b.textContent = 'Copy failed'; })
     .then(() => { setTimeout(() => { b.textContent = 'Copy'; }, 1200); });
```

The trailing `.then()` restores the label on both paths, so the reader always
sees a definite outcome.

---

## Gap 4 · Two competing fixes for the auto-theme glyph bug

The original bug — recorded in the format-preferences memory and fixed in commit
`18b8a98` — was dark-glyph rules written as:

```css
:root.dark .brand-mark, :root:not(.light) .brand-mark { color: #100616; }
```

`:root:not(.light)` matches in **auto** mode regardless of OS theme, because auto
sets no class at all. On a light-OS machine that painted a near-black glyph on
the light accent background.

**The bug is fixed everywhere — measured, zero unguarded `:root:not(.light)`
selectors remain.** But it was fixed two different ways:

| Approach | Used by | Shape |
|---|---|---|
| Media-query guard | `atuin`, `chezmoi`, `syncthing` | `@media (prefers-color-scheme: dark) { :root:not(.light) .x { … } }` plus a base light color |
| Semantic token | `rsync` | `.brand-mark { color: var(--on-accent); }`, with `--on-accent` defined per theme |

The `--on-accent` token is the better pattern: it collapses three selectors into
one, and it extends to any other element sitting on an accent background. Worth
standardizing on it and updating `create-guide-prompt.md`, which currently
mandates the CSS-custom-properties vocabulary but does not name `--on-accent`.

Measured contrast ratios, light auto mode:

- `chezmoi` 7.3:1, `atuin` 6.8:1, `syncthing` 5.5:1, `rsync` 5.0:1 — all pass
  WCAG AA for normal text.
- **`fzf` 3.7:1** — `rgb(6,21,23)` on `rgb(0,125,112)`. Passes AA only as *large*
  text (3:1). It is a large bold glyph, so this is defensible, but it is the
  weakest in the set and worth nudging.

---

## Gap 5 · Horizontal overflow on mobile

Two guides scroll sideways at 390px, which no page should:

- **`gastown-user-guide.html` — 29px**
- **`fzf-user-guide.html` — 10px**

The cause found in the atuin guide was a CSS grid whose items default to
`min-width: auto`, letting a wide `<pre>` push the column past the viewport
instead of scrolling inside itself. Fixed there in commit `bf6427d`:

```css
.step { display:grid; grid-template-columns:42px minmax(0,1fr); }
.step > * { min-width:0; }
```

Check the same pattern first in those two guides — any `grid-template-columns`
using a bare `1fr` rather than `minmax(0,1fr)`, and any flex child without
`min-width:0`.

To locate the offending element, the diagnostic that found it walks every
element and skips anything inside a horizontal scroll container (so a correctly
scrolling `<pre>` is not a false positive):

```js
const limit = document.documentElement.clientWidth;
const scrolls = el => /auto|scroll|hidden/.test(getComputedStyle(el).overflowX);
[...document.querySelectorAll('body *')].filter(el => {
  let p = el.parentElement;
  while (p && p !== document.body) { if (scrolls(p)) return false; p = p.parentElement; }
  return el.getBoundingClientRect().right > limit + 2;
});
```

---

## Suggested order of work

1. **Gap 1 on the four guides with no mobile nav** — this is the only gap that
   makes a document unusable rather than merely imperfect.
2. **Gap 5** — two guides, likely a one-line fix each, easy to verify.
3. **Gap 3** — mechanical, ten files, same edit.
4. **Gap 2** — nine files, but needs care around which `localStorage` key it
   clears.
5. **Gap 4** — cosmetic consolidation; do it when touching the CSS anyway, and
   update `create-guide-prompt.md` in the same pass so new guides inherit it.

Gaps 2 and 3 are identical edits repeated across many files. Worth doing as one
sweep with a single verified patch rather than per-guide.

---

## Re-runnable audit

Requires `playwright` (`npm install playwright` in a scratch directory).
Prints one JSON row per guide.

```js
// audit.mjs — node audit.mjs
import { chromium } from 'playwright';
import { readdirSync, readFileSync } from 'fs';
const DIR = process.env.GUIDES_DIR || `${process.env.HOME}/guides`;
const files = readdirSync(DIR).filter(f => f.endsWith('.html')).sort();
const b = await chromium.launch();
const rows = [];
for (const f of files) {
  const src = readFileSync(`${DIR}/${f}`, 'utf8');

  // --- mobile ---
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'light' });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto(`file://${DIR}/${f}`, { waitUntil: 'load' });
  const navLinks = await p.locator('.sidebar nav a:visible, nav a:visible').count();
  const toggle   = await p.locator('button:visible', { hasText: /contents|menu|☰/i }).count();
  const overflow = await p.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await ctx.close();

  // --- desktop, light AUTO mode (no .light/.dark class) ---
  const ctx2 = await b.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
  const p2 = await ctx2.newPage();
  await p2.goto(`file://${DIR}/${f}`, { waitUntil: 'load' });
  const glyph = await p2.evaluate(() => {
    const el = document.querySelector('.brand-mark') || document.querySelector('.step-num');
    if (!el) return null;
    const s = getComputedStyle(el);
    const lum = c => { const [r,g,bl] = c.match(/\d+/g).map(Number)
      .map(v => { v/=255; return v<=.03928 ? v/12.92 : ((v+.055)/1.055)**2.4; });
      return .2126*r + .7152*g + .0722*bl; };
    const L1 = lum(s.color), L2 = lum(s.backgroundColor);
    return { color: s.color, bg: s.backgroundColor,
             ratio: Math.round(((Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05))*10)/10 };
  });
  await ctx2.close();

  rows.push({ file: f, navAt390: navLinks, toggle, overflow,
    hasQuiz: /quiz-item/.test(src),
    quizReset: /quiz-reset|resetQuiz/.test(src),
    clipCatch: /\.catch\(/.test(src),
    onAccentToken: /--on-accent/.test(src),
    unguardedNotLight: (src.match(/:root:not\(\.light\)/g) || []).length
      - (src.match(/@media \(prefers-color-scheme: dark\) \{ :root:not\(\.light\)/g) || []).length,
    glyph, errs: errs.length });
}
await b.close();
console.log(JSON.stringify(rows, null, 1));
```

### What this audit does not cover

Deliberate limits, so the table is not mistaken for a full review:

- **Dark mode is only checked for glyph contrast**, not for body text, tables,
  callouts, terminal panels or diagrams.
- **Print stylesheets are not checked at all.** Verify separately with
  `page.emulateMedia({ media: 'print' })`; note that CSS alone cannot open a
  closed `<details>` in Chromium — it needs a `beforeprint` listener, which so
  far only the atuin guide has.
- **Keyboard navigation and focus order are not tested.**
- **Only the 390px and 1440px widths are sampled**, so a defect that appears
  only between breakpoints will be missed.
- **`navAt390` counts visible links, not usability.** A guide showing 20 links
  scores well here while burying its content below a full-screen list.
