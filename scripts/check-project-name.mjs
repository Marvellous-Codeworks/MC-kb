// Runs after every build (`postbuild`). The project name is added by theme overrides in
// src/theme/: if a Docusaurus upgrade stops using them, the build still passes and the
// name just disappears, so check the generated pages and fail the build here instead.
import {existsSync, readFileSync} from 'node:fs';

const projects = JSON.parse(readFileSync('src/data/projects.json', 'utf8'));
const markers = ['data-project-sidebar', 'data-project-breadcrumb'];
const errors = [];

for (const {name, label} of projects) {
  for (const page of [`build/docs/${name}/overview/index.html`, `build/docs/${name}/next/overview/index.html`]) {
    if (!existsSync(page)) {
      errors.push(`${page}: page not found`);
      continue;
    }
    const html = readFileSync(page, 'utf8');
    if (!html.match(/<title[^>]*>([^<]*)<\/title>/)?.[1].includes(label)) {
      errors.push(`${page}: "${label}" missing from the page title`);
    }
    for (const marker of markers) {
      const tag = html.match(new RegExp(`<a[^>]*${marker}[^>]*>([^<]*)</a>`));
      if (tag?.[1] !== label) {
        errors.push(`${page}: no "${label}" link with ${marker}`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`Project name check failed, see the theme overrides in src/theme/:\n${errors.join('\n')}`);
  process.exit(1);
}
console.log(`Project name check passed for ${projects.length} projects.`);
