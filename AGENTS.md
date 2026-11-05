# AGENTS.md

Policy for anyone, human or coding agent, changing this repository. It says what
is mandatory, what is out of bounds, and what "done" means. `CONTRIBUTING.md`
covers the process around it and how to set up.

This is the public documentation of the Marvellous Codeworks products, published at
[kb.marvellouscode.works](https://kb.marvellouscode.works). People read it to find an
option or to understand what a product does, and they trust it. A page that names an
option that does not exist is worse than no page.

## Terminology comes first

**Never invent a name.** Every name a reader can see in a product is copied from that
product's source, letter by letter, case and punctuation included. That covers
options, buttons, menu items, statuses, pages, sidebar entries, sections, keyboard
commands and messages. A close paraphrase is a mistake, even when it reads better.

- The source of truth is the product's code at the release the docs describe:

  | Product | Repository | UI strings |
  | --- | --- | --- |
  | The Marvellous Suspender | [`gioxx/MarvellousSuspender`](https://github.com/gioxx/MarvellousSuspender) | `src/_locales/en/messages.json`, `src/*.html`, `src/js/` |
  | The Great-er Tab Discarder | [`rkodey/the-great-er-discarder-er`](https://github.com/rkodey/the-great-er-discarder-er) | The repository's UI files |
  | logdrop | [`Marvellous-Codeworks/logdrop`](https://github.com/Marvellous-Codeworks/logdrop) | The repository's UI files |
  | OAuth Proxy for Google | [`Marvellous-Codeworks/tms-oauth-proxy`](https://github.com/Marvellous-Codeworks/tms-oauth-proxy) | No UI: `worker/index.js`, `wrangler.toml` |

- Docs are written in English, so they quote the English UI.
- Open the source and copy the string. Do not rely on memory, on an older page, on a
  blog post or on a screenshot: all of them can be out of date.
- Page and section titles use the name the product uses: the page the extension calls
  "Backup & Restore" is not "Backup & Sync" here.
- If the product's wording looks wrong, the docs still quote it. Report the problem
  against the product; do not fix it silently in the docs.
- Words that are not UI names (emphasis, examples, general concepts) stay out of the way
  of real labels: do not write a general concept in bold or in quotes as if it were one.

## Claims about behaviour

**Every statement about what a product does is checked in its code.** Defaults, ranges,
limits, what a button does, what is stored and when, where a page can be opened from,
which browsers are affected. If the code can't confirm it, test it in the product or
leave it out. Say so in the pull request when something could not be verified.

## Definition of done

A change is done only when all of these are true and the PR says so:

- [ ] `npm run build` passes with no broken link or anchor warning.
- [ ] Every UI name added or changed was copied from the source, and the PR names the
      release checked.
- [ ] `scripts/check-terms.mjs` reports nothing new. Its result on the PR is a warning,
      not a block, but every warning gets an answer: fix the name, or add it to
      `scripts/terms-allowlist.txt` if it really is not a UI string.
- [ ] Every behaviour claim added or changed was checked in the code.
- [ ] The page was read as a whole: the script sees bold and quoted text, not plain
      sentences.
- [ ] The PR body states what changed, why, and how it was verified.

## Mandatory

- **Next is where docs are written.** Edit `projects/<Project>/`. The stable version
  in `<project>_versioned_docs/` and `<project>_versioned_sidebars/` is generated; never
  edit it by hand. After a release, or to bring a fix to stable, run
  `Publish-ProjectDocs.ps1`.
- **Only the stable version and Next exist.** Older versions are not kept, so never
  promise that one stays available.
- **The docs describe the latest version.** No "since 9.0.3" or "new in…" notes:
  version history belongs in changelogs, releases and the blog.
- **Renaming a heading changes its anchor.** Update every link to it, in `projects/`
  and in `blog/`, including the links from the products themselves.
- **No real personal or company data.** Examples use `contoso.com`, `example.com`,
  `alice@contoso.com` and GUIDs of zeros. This covers logs, screenshots and tab titles.
  Public GitHub handles are fine when crediting someone.
- **Nothing about an undisclosed vulnerability** before the advisory is public, not
  even that it exists.
- **Screenshots** are taken in English from a clean profile, unless the page says
  otherwise, and show no real tabs, accounts or addresses. `CONTRIBUTING.md` says how.
- **Admonitions with a title use the bracket form:** `:::tip[Title]`.
- **Commits:** `type(scope): imperative subject` or `type: imperative subject`, subject
  at most 72 characters, English. Types in use: `feat`, `fix`, `docs`, `blog`, `style`,
  `chore`. No `Co-Authored-By` trailer.
- **Language:** everything that lands in the repo is English.

## Theme overrides

- Project display names live in `src/data/projects.json`. Add a new project there.
- The project name in the sidebar and breadcrumbs comes from wrappers in `src/theme/`,
  which are kept in the repository and survive Docusaurus upgrades. They depend on
  internal theme components, though, so a release can stop using them without errors.
  `npm run build` runs `scripts/check-project-name.mjs` and fails if that happens: fix
  the wrappers, do not remove the check.

## Working with AI tools

AI assistance is welcome under one condition: the person opening the PR has read every
line and can answer for it. Models fill gaps with plausible names, which is exactly what
this repository can't accept: an agent must look a name up, never produce one. The PR
says which parts were AI-assisted.

## Blog

- **Published posts are a record of their date.** Do not rewrite them to match today's
  UI. Fix broken links, and correct real errors of fact.
- Current facts in a new post follow the rules above, as a page would.
- Unreleased work and anything under embargo stays in a draft (`draft: true`) or out of
  the repository.

## Not yours to edit

- `build/`, `.docusaurus/`, `node_modules/`: generated.
- `<project>_versioned_docs/`, `<project>_versioned_sidebars/`, `<project>_versions.json`:
  generated by `Publish-ProjectDocs.ps1`.
- Merges to `main` and releases of the docs: maintainers only.
