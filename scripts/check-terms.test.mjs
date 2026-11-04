import assert from 'node:assert/strict';
import test from 'node:test';
import { buildCorpus, extractTerms } from './check-terms.mjs';

test('corpus holds messages and HTML text, with placeholders as N', () => {
  const corpus = buildCorpus(
    { a: { message: 'Repair $count$ grouped tab(s)' }, b: { message: 'Save <b>now</b>' } },
    ['<p>Warnings &amp; errors only</p>'],
  );
  assert.ok(corpus.includes('Repair N grouped tab(s)'));
  assert.ok(corpus.includes('Save now'));
  assert.ok(corpus.includes('Warnings & errors only'));
});

test('terms come from bold and quotes, not from fences, images or frontmatter', () => {
  const markdown = [
    '---',
    'title: "Ignored"',
    '---',
    'Click **Scan Tabs** and "Copy Results".',
    '![Alt "Ignored"](./a.webp)',
    '```',
    '**Ignored**',
    '```',
    '**[Linked](./x.md)** and **Backup → Export settings**',
    '**`code`** is skipped.',
  ].join('\n');
  assert.deepEqual(extractTerms(markdown), [
    { term: 'Scan Tabs', line: 4 },
    { term: 'Copy Results', line: 4 },
    { term: 'Linked', line: 9 },
    { term: 'Backup', line: 9 },
    { term: 'Export settings', line: 9 },
  ]);
});
