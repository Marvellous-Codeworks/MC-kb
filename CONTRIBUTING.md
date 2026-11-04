# Contributing

Thanks for helping with the Marvellous Codeworks documentation. What a change has to
meet is in [`AGENTS.md`](AGENTS.md), for people and coding agents alike. Read it first,
above all [Terminology comes first](AGENTS.md#terminology-comes-first). This file covers
how to get a change in.

A wrong name or behaviour in a product is reported on that product's repository. An
error in the docs is reported here, or fixed with a pull request.

## Setup

Requires Node.js 22, the version used by the deploy workflow.

```bash
npm ci          # install dependencies
npm start       # dev server with live reload on http://localhost:3000
npm run build   # production build in ./build
```

`npm run build` fails on broken links and warns on broken anchors. The dev server may
not report either, so run it before you open a pull request.

## Getting a change in

Every push to `main` goes online right away.

- **Pages under `projects/`, `docs/` and the site code** always go through a pull
  request.
- **Blog posts** go through a pull request too. The lead maintainer may publish a post
  directly on `main`.

1. Branch from `main`: `docs/...`, `blog/...`, `fix/...` or `chore/...`.
2. Edit `projects/<Project>/`, not the versioned folders.
3. Check names and behaviour against the product, then run the build and the terms
   check.
4. Open the pull request. Say what changed, why, which release you checked against, and
   which parts were AI-assisted.

## Checking names against a product

`scripts/check-terms.mjs` reads the bold and quoted text in a project's docs and looks
for it in the product's UI strings. Point it at a checkout of the product, at the tag of
the release you are documenting:

```bash
git -C ../MarvellousSuspender checkout v9.1.0
node scripts/check-terms.mjs TMS --source ../MarvellousSuspender
```

The same check runs on pull requests against the release in `tms_versions.json`, and
shows up as warnings on the changed files. It does not fail the pull request.

For each finding, either correct the name or, if it is not a UI string at all (a browser
label, an example, plain emphasis), add it to `scripts/terms-allowlist.txt`. The allowlist
is reviewed like any other change: it is not a way to silence a name you made up.

Docs for a feature that is not released yet can be flagged because the release checked
doesn't have the string. Run the check against the product's default branch and say so
in the pull request.

Only The Marvellous Suspender is covered so far. For the other products, check names by
hand until they are added to `PRODUCTS` in the script.

## Publishing a release of the docs

After a product release is live, promote Next to stable:

```powershell
.\Publish-ProjectDocs.ps1 -Project TMS -Version 9.1.0
```

Run the same command again to bring later fixes in Next to the stable version. It
replaces the previous stable snapshot.

## Translations

The docs are in English only. Translations of the products go through their own
projects, for The Marvellous Suspender that is [Crowdin](https://crowdin.com/project/tms).
