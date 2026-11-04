#!/usr/bin/env node
// Flags names in project docs that do not exist in the product's UI strings.
// Usage: node scripts/check-terms.mjs TMS --source <product checkout>
// Reports findings without failing: `exit 1` means the check itself could not run.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const PRODUCTS = {
  TMS: { docs: 'projects/TMS', locale: 'src/_locales/en/messages.json', htmlDir: 'src' },
};
const ALLOWLIST = 'scripts/terms-allowlist.txt';

const ENTITIES = { '&amp;': '&', '&middot;': '·', '&nbsp;': ' ', '&quot;': '"', '&#39;': "'" };
const decode = (text) => text.replace(/&[a-z0-9#]+;/gi, (e) => ENTITIES[e] ?? e);
const squeeze = (text) => text.replace(/\s+/g, ' ').trim();

// `$count$` placeholders read as N in the docs: "Repair N grouped tab(s)".
export function buildCorpus(messages, htmlFiles) {
  const strings = Object.values(messages).map((m) =>
    squeeze(decode(m.message.split(/<[^>]*>/).join('').replace(/\$\w+\$/g, 'N'))));
  for (const html of htmlFiles) {
    for (const [, text] of html.matchAll(/>([^<>{}]+)</g)) strings.push(squeeze(decode(text)));
  }
  return strings.join('\n');
}

// Bold and quoted text outside frontmatter, code fences and images.
export function extractTerms(markdown) {
  const body = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---/, (m) => m.replace(/[^\n]/g, ''));
  const terms = [];
  let inFence = false;
  body.split('\n').forEach((line, index) => {
    if (line.trimStart().startsWith('```')) inFence = !inFence;
    if (inFence || line.trimStart().startsWith('![')) return;
    const text = line.replace(/`[^`]*`/g, '\u0000');
    const found = [
      ...[...text.matchAll(/\*\*([^*]+)\*\*/g)].map((m) => m[1]),
      ...[...text.matchAll(/"([^"]{3,80})"/g)].map((m) => m[1]),
    ];
    for (const raw of found) {
      const label = raw.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
      if (label.includes('\u0000')) continue;
      for (const part of label.split('→')) {
        const term = part.trim().replace(/^"|"$/g, '').replace(/[.:,]+$/, '');
        if (term.length > 2) terms.push({ term, line: index + 1 });
      }
    }
  });
  return terms;
}

function markdownFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => path.join(entry.parentPath, entry.name));
}

function main() {
  const [name, flag, source] = process.argv.slice(2);
  const product = PRODUCTS[name];
  if (!product || flag !== '--source' || !source) {
    console.error(`Usage: check-terms.mjs <${Object.keys(PRODUCTS).join('|')}> --source <product checkout>`);
    process.exit(1);
  }

  const messages = JSON.parse(fs.readFileSync(path.join(source, product.locale), 'utf8').replace(/^﻿/, ''));
  const htmlDir = path.join(source, product.htmlDir);
  const htmlFiles = fs.readdirSync(htmlDir).filter((f) => f.endsWith('.html'))
    .map((f) => fs.readFileSync(path.join(htmlDir, f), 'utf8'));
  const corpus = buildCorpus(messages, htmlFiles);
  const allowed = new Set(fs.readFileSync(ALLOWLIST, 'utf8').split(/\r?\n/)
    .map((l) => l.trim()).filter((l) => l && !l.startsWith('#')));

  let findings = 0;
  for (const file of markdownFiles(product.docs)) {
    const relative = file.split(path.sep).join('/');
    for (const { term, line } of extractTerms(fs.readFileSync(file, 'utf8'))) {
      if (corpus.includes(term) || allowed.has(term)) continue;
      findings += 1;
      const message = `"${term}" is not a UI string. Copy the real label, or add it to ${ALLOWLIST} if it is not one.`;
      console.log(process.env.GITHUB_ACTIONS
        ? `::warning file=${relative},line=${line},title=Unknown UI term::${message}`
        : `${relative}:${line}: ${message}`);
    }
  }
  console.log(`${findings} term(s) to review.`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
