#!/usr/bin/env node
// Regenerates the guide cards inside index.html from guides.json.
//
// Usage:  node scripts/build-index.mjs [--check]
//
//   --check  exit 1 if index.html would change (for CI / pre-commit), write nothing
//
// guides.json is the source of truth for metadata (subject, verified-against,
// accent). The <title> of each guide is read from the guide file itself so the
// hub never drifts from what the guide actually calls itself.
//
// TODO(s3-migration): once the site is hosted exclusively on S3, drop this
// build step — upload guides.json alongside index.html and have the page
// fetch() it at runtime. (Not done now because fetch() of a sibling file is
// blocked under file:// and these pages must keep working locally.)

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");

const escapeHtml = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const { guides } = JSON.parse(readFileSync(join(root, "guides.json"), "utf8"));

// --- validate: every guide file on disk has an entry, every entry has a file
const onDisk = readdirSync(root).filter(
  (f) => /-guide\.html$/.test(f) && f !== "index.html"
);
const listed = new Set(guides.map((g) => g.file));
let warned = false;
for (const f of onDisk) {
  if (!listed.has(f)) {
    console.warn(`WARN: ${f} exists but has no entry in guides.json`);
    warned = true;
  }
}

// --- build cards
const cards = guides
  .map((g) => {
    let title = "";
    try {
      const head = readFileSync(join(root, g.file), "utf8").slice(0, 8192);
      title = (head.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
    } catch {
      console.warn(`WARN: guides.json lists ${g.file} but the file is missing`);
      warned = true;
    }
    const badge = g.verified
      ? `<span class="badge ok">✓ ${escapeHtml(g.verified)}</span>`
      : `<span class="badge soft">○ checked when written</span>`;
    return [
      `<li class="card accent-${g.accent}">`,
      `<a class="card-link" href="${escapeHtml(g.file)}">`,
      `<span class="card-cmd" aria-hidden="true">$ open ./${escapeHtml(g.file)}</span>`,
      `<h3 class="card-name">${escapeHtml(g.name)}</h3>`,
      title ? `<p class="card-title">${escapeHtml(title)}</p>` : "",
      `<p class="card-subject">${escapeHtml(g.subject)}</p>`,
      `<p class="card-meta">${badge}</p>`,
      `</a>`,
      `</li>`,
    ]
      .filter(Boolean)
      .join("\n    ");
  })
  .join("\n    ");

// --- inject between markers
const indexPath = join(root, "index.html");
const html = readFileSync(indexPath, "utf8");

const inject = (src, tag, replacement) => {
  const re = new RegExp(`(<!-- ${tag}:BEGIN -->)[\\s\\S]*?(<!-- ${tag}:END -->)`);
  if (!re.test(src)) throw new Error(`marker pair ${tag}:BEGIN/END not found in index.html`);
  return src.replace(re, `$1${replacement}$2`);
};

let out = inject(html, "GUIDES", `\n    ${cards}\n    `);
out = inject(out, "COUNT", String(guides.length));

if (out === html) {
  console.log(`index.html up to date (${guides.length} guides)`);
} else if (check) {
  console.error("index.html is stale — run: node scripts/build-index.mjs");
  process.exit(1);
} else {
  writeFileSync(indexPath, out);
  console.log(`index.html rebuilt (${guides.length} guides)`);
}
if (warned) process.exitCode = check ? 1 : 0;
